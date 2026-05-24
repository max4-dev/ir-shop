import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma, PromoCodeSource } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/common/database/prisma.service';
import { PROMO_CODE, PROMO_CODE_MESSAGES } from './promo-code.constants';
import { applyDiscountPercent } from './promo-code.helpers';
import { formatPromoCode, PromoCodeResponse } from './promo-code.mapper';
import { PromoCodeListResponse, ValidatePromoCodeResult } from './promo-code.types';

@Injectable()
export class PromoCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async getMy(userId: string): Promise<PromoCodeListResponse> {
    const items = await this.prisma.promoCode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      items: items.map(formatPromoCode),
      total: items.length,
    };
  }

  async validateForUser(
    userId: string,
    code: string,
  ): Promise<ValidatePromoCodeResult> {
    const promoCode = await this.findOwnedByCode(userId, code);
    if (!promoCode) {
      throw new NotFoundException(PROMO_CODE_MESSAGES.NOT_FOUND);
    }

    return {
      valid: true,
      code: promoCode.code,
      discountPercent: promoCode.discountPercent,
    };
  }

  async createByAdmin(
    userId: string,
    discountPercent?: number,
  ): Promise<PromoCodeResponse> {
    const percent = discountPercent ?? PROMO_CODE.DEFAULT_DISCOUNT_PERCENT;
    await this.ensureUserExists(userId);

    const promoCode = await this.prisma.promoCode.create({
      data: {
        code: randomUUID(),
        userId,
        discountPercent: percent,
        source: PromoCodeSource.ADMIN,
      },
    });

    return formatPromoCode(promoCode);
  }

  async consumeForOrder(
    tx: Prisma.TransactionClient,
    userId: string | null,
    code: string | undefined,
    subtotalPrice: number,
  ): Promise<{
    totalPrice: number;
    discountPercent: number;
    appliedPromoCode: string | null;
  }> {
    if (!code) {
      return {
        totalPrice: subtotalPrice,
        discountPercent: 0,
        appliedPromoCode: null,
      };
    }

    if (!userId) {
      throw new BadRequestException(PROMO_CODE_MESSAGES.REQUIRES_AUTH);
    }

    const promoCode = await tx.promoCode.findFirst({
      where: { code, userId },
    });
    if (!promoCode) {
      throw new BadRequestException(PROMO_CODE_MESSAGES.NOT_FOUND);
    }

    const totalPrice = applyDiscountPercent(
      subtotalPrice,
      promoCode.discountPercent,
    );

    await tx.promoCode.delete({ where: { id: promoCode.id } });

    return {
      totalPrice,
      discountPercent: promoCode.discountPercent,
      appliedPromoCode: promoCode.code,
    };
  }

  async rewardAfterPaidOrder(
    tx: Prisma.TransactionClient,
    userId: string | null,
  ): Promise<PromoCodeResponse | null> {
    if (!userId) {
      return null;
    }

    const paidOrdersCount = await tx.order.count({
      where: {
        userId,
        status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] },
      },
    });

    if (
      paidOrdersCount === 0 ||
      paidOrdersCount % PROMO_CODE.LOYALTY_ORDERS_STEP !== 0
    ) {
      return null;
    }

    const promoCode = await tx.promoCode.create({
      data: {
        code: randomUUID(),
        userId,
        discountPercent: PROMO_CODE.DEFAULT_DISCOUNT_PERCENT,
        source: PromoCodeSource.LOYALTY,
      },
    });

    return formatPromoCode(promoCode);
  }

  private async findOwnedByCode(userId: string, code: string) {
    return this.prisma.promoCode.findFirst({
      where: { code, userId },
    });
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException(PROMO_CODE_MESSAGES.USER_NOT_FOUND);
    }
  }
}
