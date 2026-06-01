export const PRODUCT_LIMITS = {
  MAX_PRICE: 1_000_000_000,
  MAX_AVAILABLE_COUNT: 1_000_000,
  MAX_IMAGES: 20,
  MAX_CATEGORIES: 20,
  MAX_NAME_LENGTH: 255,
  MAX_SALE_PERCENT: 100,
} as const;

export const PRODUCT_PAGINATION = {
  DEFAULT_LIMIT: 6,
  MAX_LIMIT: 100,
} as const;

export const PRODUCT_DEFAULTS = {
  SALE_PERCENT: 0,
} as const;

export const PRODUCT_SLUG = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 255,
} as const;

export const PRODUCT_SEARCH = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
} as const;
