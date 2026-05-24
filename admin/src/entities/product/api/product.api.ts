export const productApi = {
  all: "products",
  byId: (id: string) => `products/${id}`,
} as const;
