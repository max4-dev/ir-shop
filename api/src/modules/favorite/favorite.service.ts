import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/common/database/prisma.service';
import { isPrismaRecordNotFound } from 'src/common/utils';
import { SessionService } from '../session/session.service';
import {
  favoriteInclude,
  FavoriteResponse,
  FavoriteWithItems,
  formatFavorite,
} from './favorite.mapper';
import { FavoriteMergeResult } from './favorite.types';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
  ) {}

  async getFavorites(sessionId: string): Promise<FavoriteResponse> {
    const favorite = await this.getOrCreateBySessionId(sessionId);
    return formatFavorite(favorite);
  }

  async addItem(
    sessionId: string,
    productId: string,
  ): Promise<FavoriteResponse> {
    const favorite = await this.prisma.$transaction(async (tx) => {
      await this.findProduct(tx, productId);
      const favoriteId = await this.ensureFavoriteId(tx, sessionId);

      await tx.favoriteItem.upsert({
        where: {
          favoriteId_productId: { favoriteId, productId },
        },
        update: {},
        create: { favoriteId, productId },
      });

      return this.loadFavorite(tx, favoriteId);
    });

    return formatFavorite(favorite);
  }

  async removeItem(
    sessionId: string,
    productId: string,
  ): Promise<FavoriteResponse> {
    const favorite = await this.prisma.$transaction(async (tx) => {
      const favoriteId = await this.ensureFavoriteId(tx, sessionId);
      try {
        await tx.favoriteItem.delete({
          where: { favoriteId_productId: { favoriteId, productId } },
        });
      } catch (error) {
        if (isPrismaRecordNotFound(error)) {
          throw new NotFoundException(
            `Товар ${productId} не найден в избранном`,
          );
        }
        throw error;
      }
      return this.loadFavorite(tx, favoriteId);
    });

    return formatFavorite(favorite);
  }

  async clear(sessionId: string): Promise<FavoriteResponse> {
    const favorite = await this.prisma.$transaction(async (tx) => {
      const favoriteId = await this.ensureFavoriteId(tx, sessionId);
      await tx.favoriteItem.deleteMany({ where: { favoriteId } });
      return this.loadFavorite(tx, favoriteId);
    });

    return formatFavorite(favorite);
  }

  async mergeAnonymousFavorites(
    anonymousSessionId: string,
    userId: string,
    res: Response,
  ): Promise<FavoriteMergeResult> {
    const userSession = await this.sessionService.findActiveByUserId(userId);

    if (!userSession) {
      await this.sessionService.attachToUser(anonymousSessionId, userId);
      this.sessionService.setSessionCookie(res, anonymousSessionId);
      return { effectiveSessionId: anonymousSessionId };
    }

    if (userSession.id === anonymousSessionId) {
      this.sessionService.setSessionCookie(res, userSession.id);
      return { effectiveSessionId: userSession.id };
    }

    await this.mergeFavorites(anonymousSessionId, userSession.id);
    this.sessionService.setSessionCookie(res, userSession.id);
    return { effectiveSessionId: userSession.id };
  }

  private async mergeFavorites(
    fromSessionId: string,
    toSessionId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const targetFavoriteId = await this.ensureFavoriteId(tx, toSessionId);

      const source = await tx.favorite.findUnique({
        where: { sessionId: fromSessionId },
        include: { items: { orderBy: { createdAt: 'asc' } } },
      });
      if (!source) {
        return;
      }

      for (const item of source.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true },
        });
        if (!product) {
          continue;
        }

        await tx.favoriteItem.upsert({
          where: {
            favoriteId_productId: {
              favoriteId: targetFavoriteId,
              productId: item.productId,
            },
          },
          update: {},
          create: {
            favoriteId: targetFavoriteId,
            productId: item.productId,
          },
        });
      }

      if (fromSessionId !== toSessionId) {
        await this.deleteSessionIfNoOrders(tx, fromSessionId);
      }
    });
  }

  private async getOrCreateBySessionId(
    sessionId: string,
  ): Promise<FavoriteWithItems> {
    const existing = await this.prisma.favorite.findUnique({
      where: { sessionId },
      include: favoriteInclude,
    });
    if (existing) {
      return existing;
    }

    return this.prisma.favorite.create({
      data: { sessionId },
      include: favoriteInclude,
    });
  }

  private async ensureFavoriteId(
    tx: Prisma.TransactionClient,
    sessionId: string,
  ): Promise<string> {
    const existing = await tx.favorite.findUnique({
      where: { sessionId },
      select: { id: true },
    });
    if (existing) {
      return existing.id;
    }
    const created = await tx.favorite.create({
      data: { sessionId },
      select: { id: true },
    });
    return created.id;
  }

  private async loadFavorite(
    tx: Prisma.TransactionClient,
    favoriteId: string,
  ): Promise<FavoriteWithItems> {
    return tx.favorite.findUniqueOrThrow({
      where: { id: favoriteId },
      include: favoriteInclude,
    });
  }

  private async findProduct(
    tx: Prisma.TransactionClient,
    productId: string,
  ): Promise<void> {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      throw new BadRequestException(`Товар ${productId} не найден`);
    }
  }

  private async deleteSessionIfNoOrders(
    tx: Prisma.TransactionClient,
    sessionId: string,
  ): Promise<void> {
    const ordersCount = await tx.order.count({ where: { sessionId } });
    if (ordersCount > 0) {
      return;
    }

    try {
      await tx.session.delete({ where: { id: sessionId } });
    } catch (error) {
      if (!isPrismaRecordNotFound(error)) {
        throw error;
      }
    }
  }
}
