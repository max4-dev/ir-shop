import { useInfiniteQuery } from "@tanstack/react-query";

import { pageToOffset } from "@/src/shared/lib";

import { PRODUCT_PAGINATION, PRODUCT_SEARCH } from "../../config";
import { productQuery } from "../../api";
import { ProductsQueryParams } from "../../api/types/product.types";
import { getProductsNextOffset } from "../lib/infinite-products.helpers";

type UseProductSearchInfiniteOptions = {
  enabled?: boolean;
};

export const useProductSearchInfinite = (
  search: string,
  params?: ProductsQueryParams,
  page = 1,
  options?: UseProductSearchInfiniteOptions,
) => {
  const trimmed = search.trim();
  const limit = params?.limit ?? PRODUCT_PAGINATION.DEFAULT_LIMIT;
  const { offset: _offset, search: _search, ...rest } = params ?? {};
  const initialOffset = pageToOffset(page, limit);

  return useInfiniteQuery({
    queryKey: ["products", "infinite", "search", trimmed, rest, limit, page],
    queryFn: ({ pageParam }) =>
      productQuery.getAll({
        ...rest,
        limit,
        offset: pageParam,
        search: trimmed,
      }),
    initialPageParam: initialOffset,
    getNextPageParam: getProductsNextOffset,
    enabled: (options?.enabled ?? true) && trimmed.length >= PRODUCT_SEARCH.MIN_LENGTH,
  });
};
