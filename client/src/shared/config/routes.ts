export const ROUTES = {
  PRODUCTS: {
    ALL: "/products",
    BY_CATEGORY: (slug: string) => `/products/category/${slug}`,
    DETAIL: (slug: string) => `/products/${slug}`,
  },
} as const;
