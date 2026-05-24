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
  cartInclude,
  CartResponse,
  CartWithItems,
  formatCart,
} from './cart.mapper';
import { CartMergeResult } from './cart.types';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
  ) {}

  async getCart(sessionId: string): Promise<CartResponse> {
    const cart = await this.getOrCreateBySessionId(sessionId);
    return formatCart(cart);
  }

  async addItem(
    sessionId: string,
    productId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const cart = await this.prisma.$transaction(async (tx) => {
      const product = await this.findAvailableProduct(tx, productId);
      const cartId = await this.ensureCartId(tx, sessionId);

      const current = await tx.cartItem.findUnique({
        where: { cartId_productId: { cartId, productId } },
      });

      const desired = (current?.quantity ?? 0) + quantity;
      this.assertStockSufficient(productId, desired, product.availableCount);

      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId, productId } },
        update: { quantity: desired },
        create: { cartId, productId, quantity: desired },
      });

      return this.loadCart(tx, cartId);
    });

    return formatCart(cart);
  }

  async setItemQuantity(
    sessionId: string,
    productId: string,
    quantity: number,
  ): Promise<CartResponse> {
    const cart = await this.prisma.$transaction(async (tx) => {
      const product = await this.findAvailableProduct(tx, productId);
      const cartId = await this.ensureCartId(tx, sessionId);

      const current = await tx.cartItem.findUnique({
        where: { cartId_productId: { cartId, productId } },
      });
      if (!current) {
        throw new NotFoundException(
          `Позиция корзины с товаром ${productId} не найдена`,
        );
      }

      this.assertStockSufficient(productId, quantity, product.availableCount);

      await tx.cartItem.update({
        where: { cartId_productId: { cartId, productId } },
        data: { quantity },
      });

      return this.loadCart(tx, cartId);
    });

    return formatCart(cart);
  }

  async removeItem(
    sessionId: string,
    productId: string,
  ): Promise<CartResponse> {
    const cart = await this.prisma.$transaction(async (tx) => {
      const cartId = await this.ensureCartId(tx, sessionId);
      try {
        await tx.cartItem.delete({
          where: { cartId_productId: { cartId, productId } },
        });
      } catch (error) {
        if (isPrismaRecordNotFound(error)) {
          throw new NotFoundException(
            `Позиция корзины с товаром ${productId} не найдена`,
          );
        }
        throw error;
      }
      return this.loadCart(tx, cartId);
    });

    return formatCart(cart);
  }

  async clear(sessionId: string): Promise<CartResponse> {
    const cart = await this.prisma.$transaction(async (tx) => {
      const cartId = await this.ensureCartId(tx, sessionId);
      await tx.cartItem.deleteMany({ where: { cartId } });
      return this.loadCart(tx, cartId);
    });

    return formatCart(cart);
  }

  async mergeAnonymousCart(
    anonymousSessionId: string,
    userId: string,
    res: Response,
  ): Promise<CartMergeResult> {
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

    await this.mergeCarts(anonymousSessionId, userSession.id);
    this.sessionService.setSessionCookie(res, userSession.id);
    return { effectiveSessionId: userSession.id };
  }

  private async mergeCarts(
    fromSessionId: string,
    toSessionId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const targetCartId = await this.ensureCartId(tx, toSessionId);

      const source = await tx.cart.findUnique({
        where: { sessionId: fromSessionId },
        include: { items: { orderBy: { createdAt: 'asc' } } },
      });
      if (!source) {
        return;
      }

      for (const item of source.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { availableCount: true, isAvailable: true },
        });
        if (!product || !product.isAvailable) {
          continue;
        }

        const existing = await tx.cartItem.findUnique({
          where: {
            cartId_productId: {
              cartId: targetCartId,
              productId: item.productId,
            },
          },
        });
        const desired = Math.min(
          (existing?.quantity ?? 0) + item.quantity,
          product.availableCount,
        );
        if (desired <= 0) {
          continue;
        }

        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: targetCartId,
              productId: item.productId,
            },
          },
          update: { quantity: desired },
          create: {
            cartId: targetCartId,
            productId: item.productId,
            quantity: desired,
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
  ): Promise<CartWithItems> {
    const existing = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: cartInclude,
    });
    if (existing) {
      return existing;
    }

    return this.prisma.cart.create({
      data: { sessionId },
      include: cartInclude,
    });
  }

  private async ensureCartId(
    tx: Prisma.TransactionClient,
    sessionId: string,
  ): Promise<string> {
    const existing = await tx.cart.findUnique({
      where: { sessionId },
      select: { id: true },
    });
    if (existing) {
      return existing.id;
    }
    const created = await tx.cart.create({
      data: { sessionId },
      select: { id: true },
    });
    return created.id;
  }

  private async loadCart(
    tx: Prisma.TransactionClient,
    cartId: string,
  ): Promise<CartWithItems> {
    return tx.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: cartInclude,
    });
  }

  private async findAvailableProduct(
    tx: Prisma.TransactionClient,
    productId: string,
  ) {
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true, isAvailable: true, availableCount: true },
    });
    if (!product || !product.isAvailable) {
      throw new BadRequestException(
        `Товар ${productId} недоступен для покупки`,
      );
    }
    return product;
  }

  private assertStockSufficient(
    productId: string,
    desired: number,
    available: number,
  ): void {
    if (desired > available) {
      throw new BadRequestException(
        `Недостаточно товара ${productId}: запрошено ${desired}, доступно ${available}`,
      );
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
