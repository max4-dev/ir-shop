import { useQuery } from "@tanstack/react-query";

import { productQuery } from "../../api";
import { ProductsQueryParams } from "../../api/types/product.types";
import { PRODUCT_PAGINATION, PRODUCT_SEARCH } from "../../config";

type UseProductSearchOptions = {
  enabled?: boolean;
};

export const useProductSearch = (
  search: string,
  params?: ProductsQueryParams,
  options?: UseProductSearchOptions
) => {
  const trimmed = search.trim();

  const queryParams: ProductsQueryParams = {
    limit: params?.limit ?? PRODUCT_PAGINATION.DEFAULT_LIMIT,
    offset: params?.offset ?? 0,
    sort: params?.sort,
    minPrice: params?.minPrice,
    maxPrice: params?.maxPrice,
    onSale: params?.onSale,
    search: trimmed,
  };

  return useQuery({
    queryKey: ["products", "search", queryParams],
    queryFn: () => productQuery.getAll(queryParams),
    enabled: (options?.enabled ?? true) && trimmed.length >= PRODUCT_SEARCH.MIN_LENGTH,
  });
};
