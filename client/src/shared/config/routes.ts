export const ROUTES = {
  PROFILE: "/profile",
  FAVORITES: "/favorites",
  CART: "/cart",
  CHECKOUT: "/checkout",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    REGISTER_SUCCESS: "/register/success",
    VERIFY_EMAIL: "/verify-email",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  PRODUCTS: {
    ALL: "/products",
    BY_CATEGORY: (slug: string) => `/products/category/${slug}`,
    DETAIL: (slug: string) => `/products/${slug}`,
  },
  SEARCH: {
    ROOT: "/search",
    withQuery: (q: string) => `/search?q=${encodeURIComponent(q)}`,
  },
  ORDERS: {
    ROOT: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
  },
  ORDER: {
    SUCCESS: (orderId: string) => `/order/success?orderId=${encodeURIComponent(orderId)}`,
  },
} as const;
