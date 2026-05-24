import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/common/database/prisma.service';
import { MailService } from 'src/common/integrations/mail/mail.service';
import { EMAIL_TOKEN_PURPOSE } from 'src/common/redis/email-token.constants';
import { EmailTokenService } from 'src/common/redis/email-token.service';
import { TokenService } from 'src/common/redis/token.service';
import { CartService } from '../cart/cart.service';
import { FavoriteService } from '../favorite/favorite.service';
import { SessionService } from '../session/session.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { IJWTPayload } from './interface/jwt.interface';
import { TokenCookieService } from './services/token-cookie.service';

const GENERIC_EMAIL_MESSAGE =
  'Если аккаунт с таким email существует, письмо отправлено';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private tokenService: TokenService,
    private cookieService: TokenCookieService,
    private sessionService: SessionService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private mailService: MailService,
    private emailTokenService: EmailTokenService,
  ) {}

  async register(dto: RegisterDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email: dto.email,
        name: dto.name,
        role: Role.USER,
        password: await hash(dto.password),
        emailVerifiedAt: null,
      },
    });

    await this.sendVerificationEmail(user);

    return {
      message: 'Письмо с подтверждением отправлено на ваш email',
    };
  }

  async login(dto: LoginDto, req: Request, res: Response) {
    const user = await this.validateUser(dto);
    this.assertEmailVerified(user);

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    await this.tokenService.saveRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      role: user.role,
    });

    this.cookieService.setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    });

    await this.mergeAnonymousCart(req, res, user.id);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const payload = await this.emailTokenService.consume(
      EMAIL_TOKEN_PURPOSE.VERIFY,
      dto.token,
    );

    if (!payload) {
      throw new BadRequestException('Ссылка недействительна или устарела');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (payload.email && user.pendingEmail === payload.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (emailTaken && emailTaken.id !== user.id) {
        throw new BadRequestException('Этот email уже используется');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: payload.email,
          pendingEmail: null,
          emailVerifiedAt: new Date(),
        },
      });
    } else if (!user.emailVerifiedAt) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      });
    }

    return { message: 'Email успешно подтверждён' };
  }

  async resendVerification(dto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user && (!user.emailVerifiedAt || user.pendingEmail)) {
      await this.sendVerificationEmail(user);
    }

    return { message: GENERIC_EMAIL_MESSAGE };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user?.emailVerifiedAt) {
      const token = await this.emailTokenService.create({
        userId: user.id,
        purpose: EMAIL_TOKEN_PURPOSE.RESET_PASSWORD,
      });

      this.mailService.sendResetPasswordEmail({
        to: user.email,
        name: user.name,
        token,
      });
    }

    return { message: GENERIC_EMAIL_MESSAGE };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const payload = await this.emailTokenService.consume(
      EMAIL_TOKEN_PURPOSE.RESET_PASSWORD,
      dto.token,
    );

    if (!payload) {
      throw new BadRequestException('Ссылка недействительна или устарела');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hash(dto.newPassword),
        tokenVersion: { increment: 1 },
      },
    });

    await this.tokenService.removeAllUserTokens(user.id);

    this.mailService.sendPasswordChangedEmail({
      to: user.email,
      name: user.name,
    });

    return { message: 'Пароль успешно изменён' };
  }

  async validatePassword(dto: LoginDto) {
    const user = await this.validateUser(dto);
    this.assertEmailVerified(user);
    return { status: true };
  }

  async getNewTokens(req: Request, res: Response) {
    const refreshToken = this.cookieService.getRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh токен не предоставлен');
    }

    let payload: IJWTPayload;

    try {
      payload = await this.jwt.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Неверный refresh токен');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException(
        'Токен устарел. Пожалуйста, войдите снова',
      );
    }

    const isValidToken = await this.tokenService.validateRefreshToken(
      user.id,
      refreshToken,
    );

    if (!isValidToken) {
      throw new UnauthorizedException('Токен недействителен или истёк');
    }

    await this.tokenService.removeRefreshToken(user.id);

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    await this.tokenService.saveRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      role: user.role,
    });

    this.cookieService.setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    });

    await this.mergeAnonymousCart(req, res, user.id);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async adminLogin(dto: LoginDto, req: Request, res: Response) {
    const user = await this.validateUser(dto);
    this.assertEmailVerified(user);

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Доступ запрещён');
    }

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    await this.tokenService.saveRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      role: user.role,
    });

    this.cookieService.setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    });

    await this.mergeAnonymousCart(req, res, user.id);

    return { accessToken: tokens.accessToken };
  }

  async getAdminNewTokens(req: Request, res: Response) {
    const refreshToken = this.cookieService.getRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh токен не предоставлен');
    }

    let payload: IJWTPayload;

    try {
      payload = await this.jwt.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Неверный refresh токен');
    }

    if (payload.role !== Role.ADMIN) {
      throw new UnauthorizedException('Доступ запрещён');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) throw new UnauthorizedException('Пользователь не найден');

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException(
        'Токен устарел. Пожалуйста, войдите снова',
      );
    }

    const isValidToken = await this.tokenService.validateRefreshToken(
      user.id,
      refreshToken,
    );

    if (!isValidToken)
      throw new UnauthorizedException('Токен недействителен или истёк');

    await this.tokenService.removeRefreshToken(user.id);

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    await this.tokenService.saveRefreshToken({
      userId: user.id,
      refreshToken: tokens.refreshToken,
      role: user.role,
    });

    this.cookieService.setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    });

    await this.mergeAnonymousCart(req, res, user.id);

    return { accessToken: tokens.accessToken };
  }

  async logout(userId: string, res: Response) {
    await this.tokenService.removeRefreshToken(userId);
    this.cookieService.clearAuthCookie(res);
    return { message: 'Успешный выход' };
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const isEmailChange = Boolean(user.pendingEmail);
    const targetEmail = user.pendingEmail ?? user.email;

    const token = await this.emailTokenService.create({
      userId: user.id,
      purpose: EMAIL_TOKEN_PURPOSE.VERIFY,
      ...(isEmailChange && { email: targetEmail }),
    });

    this.mailService.sendVerifyEmail({
      to: targetEmail,
      name: user.name,
      token,
      isEmailChange,
    });
  }

  private assertEmailVerified(user: User): void {
    if (!user.emailVerifiedAt) {
      throw new ForbiddenException(
        'Подтвердите email. Проверьте почту или запросите письмо повторно',
      );
    }
  }

  private async validateUser({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Неверные данные');
    }

    const isValid = await verify(user.password, password);

    if (!isValid) {
      throw new BadRequestException('Неверные данные');
    }

    return user;
  }

  private async issueTokens(userId: string, role: Role, tokenVersion: number) {
    const data: IJWTPayload = { id: userId, role, tokenVersion };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '7h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async mergeAnonymousCart(
    req: Request,
    res: Response,
    userId: string,
  ): Promise<void> {
    const anonymousSessionId = req.sessionId;
    if (!anonymousSessionId) {
      return;
    }
    await Promise.all([
      this.cartService.mergeAnonymousCart(anonymousSessionId, userId, res),
      this.favoriteService.mergeAnonymousFavorites(
        anonymousSessionId,
        userId,
        res,
      ),
    ]);
  }
}
