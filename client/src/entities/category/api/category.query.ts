import { client } from "@/src/shared/api";

import { categoryApi } from "./category.api";
import { Category } from "./types/category.types";

export const categoryQuery = {
  getAll: () => client.get<Category[]>(categoryApi.all).json(),
  getById: (id: number) => client.get<Category>(categoryApi.byId(id)).json(),
  getBySlug: (slug: string) => client.get<Category>(categoryApi.bySlug(slug)).json(),
};
