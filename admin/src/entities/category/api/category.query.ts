import { client } from "@src/shared/api";

import { categoryApi } from "./category.api";
import type { Category, CategoryDTO, DeleteCategoryResponse } from "./types/category.types";

export const categoryQuery = {
  getAll: () => client.get<Category[]>(categoryApi.all).json(),
  getById: (id: string) => client.get<Category>(categoryApi.byId(id)).json(),
  create: (data: CategoryDTO) => client.post<Category>(categoryApi.all, { json: data }).json(),
  update: (id: string, data: CategoryDTO) =>
    client.put<Category>(categoryApi.byId(id), { json: data }).json(),
  delete: (id: string) =>
    client.delete<DeleteCategoryResponse>(categoryApi.byId(id)).json(),
};
