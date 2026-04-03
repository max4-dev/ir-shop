import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/common/database/prisma.service';
import { TokenService } from 'src/common/redis/token.service';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async getAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return users;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateProfile(id: number, dto: UserProfileDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existUser && id !== existUser.id) {
      throw new BadRequestException('Этот email уже используется');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return updatedUser;
    } catch {
      throw new InternalServerErrorException('Ошибка при обновлении профиля');
    }
  }

  async updatePassword(id: number, dto: UserPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new BadRequestException('Неверный пароль');
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          password: await hash(dto.newPassword),
          tokenVersion: { increment: 1 },
        },
      });

      await this.tokenService.removeAllUserTokens(id);

      return { message: 'Пароль успешно обновлён' };
    } catch {
      throw new InternalServerErrorException('Ошибка при обновлении пароля');
    }
  }

  async checkRole(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return { role: user.role };
  }
}
