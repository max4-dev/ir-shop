import { client } from "@/src/shared/api";

import { favoriteApi } from "./favorite.api";

import type { AddFavoriteItemBody, Favorite } from "./types/favorite.types";

export const favoriteQuery = {
  get: () => client.get<Favorite>(favoriteApi.root).json(),
  addItem: (body: AddFavoriteItemBody) =>
    client.post<Favorite>(favoriteApi.items, { json: body }).json(),
  removeItem: (productId: string) =>
    client.delete<Favorite>(favoriteApi.itemByProductId(productId)).json(),
  clear: () => client.delete<Favorite>(favoriteApi.root).json(),
};
