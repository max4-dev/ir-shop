export const ROUTES = {
  ROOT: "/",
  DASHBOARD: "/",
  AUTH: {
    LOGIN: "/login",
  },
  PRODUCTS: {
    ROOT: "/products",
    CREATE: "/products/create",
    DETAIL: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    ROOT: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
  },
  CATEGORIES: {
    ROOT: "/categories",
  },
  USERS: {
    ROOT: "/users",
  },
  PROMO_CODES: {
    ROOT: "/promo-codes",
  },
} as const;
