import { client } from "@src/shared/api";

import { productApi } from "./product.api";
import type {
  DeleteProductResponse,
  Product,
  ProductDTO,
  ProductsQueryParams,
  ProductsResponse,
} from "./types/product.types";

export const productQuery = {
  getAll: (params?: ProductsQueryParams) =>
    client.get<ProductsResponse>(productApi.all, { searchParams: params }).json(),
  getById: (id: string) => client.get<Product>(productApi.byId(id)).json(),
  create: (data: ProductDTO) => client.post<Product>(productApi.all, { json: data }).json(),
  update: (id: string, data: Partial<ProductDTO>) =>
    client.put<Product>(productApi.byId(id), { json: data }).json(),
  delete: (id: string) => client.delete<DeleteProductResponse>(productApi.byId(id)).json(),
};
