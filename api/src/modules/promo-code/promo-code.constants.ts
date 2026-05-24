export const PROMO_CODE = {
  DEFAULT_DISCOUNT_PERCENT: 5,
  MIN_DISCOUNT_PERCENT: 1,
  MAX_DISCOUNT_PERCENT: 100,
  LOYALTY_ORDERS_STEP: 10,
} as const;

export const PROMO_CODE_MESSAGES = {
  REQUIRES_AUTH: 'Промокод доступен только авторизованным пользователям',
  NOT_FOUND: 'Промокод не найден или недоступен',
  USER_NOT_FOUND: 'Пользователь не найден',
} as const;
