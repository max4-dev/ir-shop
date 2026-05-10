import { client, serverClient } from "@/src/shared/api";

import { Category } from "../../category/@x/product";

import { productApi } from "./product.api";
import { Product } from "./types/product.types";

export const productQuery = {
  getAll: () => client.get<Product[]>(productApi.all).json(),
  getById: (id: number) => client.get<Product>(productApi.byId(id)).json(),
  getBySlug: (slug: string) => client.get<Product>(productApi.bySlug(slug)).json(),
  getByCategory: (slug: string) =>
    client.get<{ category: Category; items: Product[] }>(productApi.byCategory(slug)).json(),
};

export const serverProductQuery = {
  getAll: () => serverClient.get<Product[]>(productApi.all, { next: { revalidate: 60 } }).json(),
  getBySlug: (slug: string) =>
    serverClient.get<Product>(productApi.bySlug(slug), { next: { revalidate: 60 } }).json(),
};
