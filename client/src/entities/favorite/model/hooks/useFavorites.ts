import { useQuery } from "@tanstack/react-query";

import { favoriteQuery } from "../../api";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;

export const useFavorites = () =>
  useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => favoriteQuery.get(),
  });
