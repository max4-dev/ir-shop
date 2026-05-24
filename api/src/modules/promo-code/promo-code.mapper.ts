import { PromoCode } from '@prisma/client';

export interface PromoCodeResponse {
  id: string;
  code: string;
  userId: string;
  discountPercent: number;
  source: PromoCode['source'];
  createdAt: Date;
}

export const formatPromoCode = (promoCode: PromoCode): PromoCodeResponse => ({
  id: promoCode.id,
  code: promoCode.code,
  userId: promoCode.userId,
  discountPercent: promoCode.discountPercent,
  source: promoCode.source,
  createdAt: promoCode.createdAt,
});
