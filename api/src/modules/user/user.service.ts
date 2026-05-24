import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/common/database/prisma.service';
import { MailService } from 'src/common/integrations/mail/mail.service';
import { EMAIL_TOKEN_PURPOSE } from 'src/common/redis/email-token.constants';
import { EmailTokenService } from 'src/common/redis/email-token.service';
import { TokenService } from 'src/common/redis/token.service';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';

const userSelect = {
  id: true,
  email: true,
  pendingEmail: true,
  emailVerifiedAt: true,
  name: true,
  role: true,
} as const;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private mailService: MailService,
    private emailTokenService: EmailTokenService,
  ) {}

  async getAll() {
    return this.prisma.user.findMany({
      select: userSelect,
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateProfile(id: string, dto: UserProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const emailChanged = dto.email !== user.email;

    if (emailChanged) {
      const existUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existUser && existUser.id !== id) {
        throw new BadRequestException('Этот email уже используется');
      }
    }

    try {
      if (emailChanged) {
        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: {
            name: dto.name,
            pendingEmail: dto.email,
          },
          select: userSelect,
        });

        const token = await this.emailTokenService.create({
          userId: user.id,
          purpose: EMAIL_TOKEN_PURPOSE.VERIFY,
          email: dto.email,
        });

        this.mailService.sendVerifyEmail({
          to: dto.email,
          name: dto.name,
          token,
          isEmailChange: true,
        });

        return updatedUser;
      }

      return this.prisma.user.update({
        where: { id },
        data: { name: dto.name },
        select: userSelect,
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при обновлении профиля');
    }
  }

  async updatePassword(id: string, dto: UserPasswordDto) {
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

      this.mailService.sendPasswordChangedEmail({
        to: user.email,
        name: user.name,
      });

      return { message: 'Пароль успешно обновлён' };
    } catch {
      throw new InternalServerErrorException('Ошибка при обновлении пароля');
    }
  }

  async checkRole(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return { role: user.role };
  }

  async delete(id: string) {
    await this.getUserById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Пользователь удалён' };
  }
}
