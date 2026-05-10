export const productApi = {
  all: "products",
  byId: (id: number) => `products/${id}`,
  bySlug: (slug: string) => `products/slug/${slug}`,
  byCategory: (slug: string) => `products/category/${slug}`,
};
