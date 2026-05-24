import { z } from "zod";

import { PROMO_CODE } from "@src/entities/promo-code";

export const createPromoCodeSchema = z.object({
  userId: z.string().uuid("Выберите пользователя"),
  discountPercent: z
    .number()
    .int()
    .min(PROMO_CODE.MIN_DISCOUNT_PERCENT, `Минимум ${PROMO_CODE.MIN_DISCOUNT_PERCENT}%`)
    .max(PROMO_CODE.MAX_DISCOUNT_PERCENT, `Максимум ${PROMO_CODE.MAX_DISCOUNT_PERCENT}%`)
    .optional(),
});

export type CreatePromoCodeFormData = z.infer<typeof createPromoCodeSchema>;
