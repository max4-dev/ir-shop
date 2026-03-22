import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/common/database/prisma.service';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
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
        phone: true,
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
      where: { phone: dto.phone },
    });

    if (existUser && id !== existUser.id) {
      throw new BadRequestException('Этот номер телефона уже используется');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          phone: dto.phone,
        },
        select: {
          id: true,
          phone: true,
          name: true,
          role: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Пользователь не найден');
      }
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
      // Увеличиваем tokenVersion для инвалидации всех старых токенов
      await this.prisma.user.update({
        where: { id },
        data: {
          password: await hash(dto.newPassword),
          tokenVersion: { increment: 1 },
        },
      });

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
