import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id } });
  }

  async findActiveByUserId(userId: string): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(data: { userId?: string; expiresAt: Date }): Promise<Session> {
    return this.prisma.session.create({
      data: {
        userId: data.userId,
        expiresAt: data.expiresAt,
        cart: { create: {} },
      },
    });
  }

  async extendTtl(id: string, expiresAt: Date): Promise<Session | null> {
    try {
      return await this.prisma.session.update({
        where: { id },
        data: { expiresAt },
      });
    } catch (error) {
      if (this.isRecordNotFound(error)) {
        return null;
      }
      throw error;
    }
  }

  async linkUser(id: string, userId: string): Promise<Session | null> {
    try {
      return await this.prisma.session.update({
        where: { id },
        data: { userId },
      });
    } catch (error) {
      if (this.isRecordNotFound(error)) {
        return null;
      }
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.prisma.session.delete({ where: { id } });
    } catch (error) {
      if (this.isRecordNotFound(error)) {
        return;
      }
      throw error;
    }
  }

  private isRecordNotFound(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    );
  }
}
