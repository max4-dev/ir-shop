export const ORDER_CUSTOMER = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 120,
  EMAIL_MAX_LENGTH: 255,
  ADDRESS_MIN_LENGTH: 5,
  ADDRESS_MAX_LENGTH: 500,
} as const;

export const ORDER_PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const ORDER_PHONE_REGEX = /^\+?[0-9 ()-]{7,20}$/;

export const ORDER_PAYMENT_DESCRIPTION = (orderId: string): string =>
  `Оплата заказа #${orderId}`;
