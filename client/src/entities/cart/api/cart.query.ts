import { client } from "@/src/shared/api";

import { cartApi } from "./cart.api";

import type {
  AddCartItemBody,
  Cart,
  UpdateCartItemBody,
} from "./types/cart.types";

export const cartQuery = {
  get: () => client.get<Cart>(cartApi.root).json(),
  addItem: (body: AddCartItemBody) =>
    client.post<Cart>(cartApi.items, { json: body }).json(),
  updateItem: (productId: string, body: UpdateCartItemBody) =>
    client.patch<Cart>(cartApi.itemByProductId(productId), { json: body }).json(),
  removeItem: (productId: string) =>
    client.delete<Cart>(cartApi.itemByProductId(productId)).json(),
  clear: () => client.delete<Cart>(cartApi.root).json(),
};
