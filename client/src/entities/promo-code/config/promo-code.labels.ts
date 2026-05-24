import type { PromoCodeSource } from "../api/types/promo-code.types";

export const PROMO_CODE_SOURCE_LABELS: Record<PromoCodeSource, string> = {
  LOYALTY: "Бонус за покупки",
  ADMIN: "Промокод магазина",
};
