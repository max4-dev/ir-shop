export const categoryApi = {
  all: "categories",
  byId: (id: string) => `categories/${id}`,
} as const;
