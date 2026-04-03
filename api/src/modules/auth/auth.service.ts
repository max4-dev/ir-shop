import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import { PrismaService } from 'src/common/database/prisma.service';
import { TokenService } from 'src/common/redis/token.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IJWTPayload } from './interface/jwt.interface';
import { TokenCookieService } from './services/token-cookie.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private tokenService: TokenService,
    private cookieService: TokenCookieService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
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
        email: dto.email,
        name: dto.name,
        role: Role.USER,
        password: await hash(dto.password),
      },
    });

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
      user: this.returnUserFields(user),
    });

    return {
      accessToken: tokens.accessToken,
      user: this.returnUserFields(user),
    };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.validateUser(dto);

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
      user: this.returnUserFields(user),
    });

    return {
      accessToken: tokens.accessToken,
      user: this.returnUserFields(user),
    };
  }

  async validatePassword(dto: LoginDto) {
    await this.validateUser(dto);
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
      user: this.returnUserFields(user),
    });

    return {
      accessToken: tokens.accessToken,
      user: this.returnUserFields(user),
    };
  }

  async logout(userId: number, res: Response) {
    await this.tokenService.removeRefreshToken(userId);
    this.cookieService.clearAuthCookie(res);
    return { message: 'Успешный выход' };
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

  private async issueTokens(userId: number, role: Role, tokenVersion: number) {
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
}
