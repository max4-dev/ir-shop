export const categoryApi = {
  all: "categories",
  byId: (id: number) => `categories/${id}`,
  bySlug: (slug: string) => `categories/slug/${slug}`,
}