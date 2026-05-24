import { client, serverClient } from "@/src/shared/api";

import { productApi } from "./product.api";
import {
  Product,
  ProductsByCategoryResponse,
  ProductsQueryParams,
  ProductsResponse,
} from "./types/product.types";

export const productQuery = {
  getAll: (params?: ProductsQueryParams) =>
    client.get<ProductsResponse>(productApi.all, { searchParams: params }).json(),
  getById: (id: number) => client.get<Product>(productApi.byId(id)).json(),
  getBySlug: (slug: string) => client.get<Product>(productApi.bySlug(slug)).json(),
  getByCategory: (slug: string, params?: ProductsQueryParams) =>
    client
      .get<ProductsByCategoryResponse>(productApi.byCategory(slug), { searchParams: params })
      .json(),
};

export const serverProductQuery = {
  getAll: (params?: ProductsQueryParams) =>
    serverClient
      .get<ProductsResponse>(productApi.all, {
        searchParams: params,
        next: { revalidate: 60 },
      })
      .json(),
  getBySlug: (slug: string) =>
    serverClient.get<Product>(productApi.bySlug(slug), { next: { revalidate: 60 } }).json(),
  getByCategory: (slug: string, params?: ProductsQueryParams) =>
    serverClient
      .get<ProductsByCategoryResponse>(productApi.byCategory(slug), {
        searchParams: params,
        next: { revalidate: 60 },
      })
      .json(),
};
