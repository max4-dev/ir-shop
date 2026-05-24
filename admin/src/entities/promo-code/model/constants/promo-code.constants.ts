export const PROMO_CODE = {
  DEFAULT_DISCOUNT_PERCENT: 5,
  MIN_DISCOUNT_PERCENT: 1,
  MAX_DISCOUNT_PERCENT: 100,
} as const;

export const PROMO_CODE_SOURCE_LABELS = {
  LOYALTY: "Бонус за покупки",
  ADMIN: "Промокод магазина",
} as const;

export const PROMO_CODE_SOURCE_TAG_COLORS = {
  LOYALTY: "processing",
  ADMIN: "blue",
} as const;
