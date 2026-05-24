export const productQueryKeys = {
  all: (params?: Record<string, unknown>) => ["products", params ?? {}] as const,
  detail: (id: string) => ["products", id] as const,
};

export const PRODUCT_LIMITS = {
  MAX_IMAGES: 20,
  MAX_NAME_LENGTH: 255,
  MAX_SALE_PERCENT: 100,
} as const;

export const PRODUCT_PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
