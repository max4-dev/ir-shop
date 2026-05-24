import { useMutation, useQueryClient } from "@tanstack/react-query";

import { favoriteQuery, type AddFavoriteItemBody } from "../../api";
import { FAVORITES_QUERY_KEY } from "./useFavorites";

export const useAddFavoriteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddFavoriteItemBody) => favoriteQuery.addItem(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  });
};

export const useRemoveFavoriteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => favoriteQuery.removeItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  });
};

export const useClearFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => favoriteQuery.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  });
};
