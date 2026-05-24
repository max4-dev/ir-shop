export const PRODUCT_PAGINATION = {
  DEFAULT_LIMIT: 3,
  MAX_LIMIT: 100,
} as const;

export const PRODUCT_SEARCH = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
} as const;

export const PRODUCT_PRICE_FILTER = {
  MIN: 0,
  MAX: 100_000,
  STEP: 100,
} as const;

export const PRODUCT_SEARCH_MIN_LENGTH = PRODUCT_SEARCH.MIN_LENGTH;
