import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/common/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IJWTPayload } from './interface/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async register({ phone, password, name }: RegisterDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existUser) {
      throw new BadRequestException(
        'Пользователь с таким телефоном уже существует',
      );
    }

    const user = await this.prisma.user.create({
      data: {
        phone,
        name,
        role: Role.USER,
        password: await hash(password),
      },
    });

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validatePassword(dto: LoginDto) {
    await this.validateUser(dto);

    return { status: true };
  }

  private async validateUser({ phone, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
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

    const accessToken = await this.jwt.signAsync(data, {
      expiresIn: '7h',
    });

    const refreshToken = await this.jwt.signAsync(data, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    let payload: IJWTPayload;

    try {
      payload = await this.jwt.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Проверяем, не была ли увеличена версия токена (смена пароля)
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException(
        'Токен устарел. Пожалуйста, войдите снова',
      );
    }

    const tokens = await this.issueTokens(
      user.id,
      user.role,
      user.tokenVersion,
    );

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
  }
}
