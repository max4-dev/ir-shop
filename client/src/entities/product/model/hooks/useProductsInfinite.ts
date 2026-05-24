import { useInfiniteQuery } from "@tanstack/react-query";

import { pageToOffset } from "@/src/shared/lib";

import { PRODUCT_PAGINATION } from "../../config";
import { productQuery } from "../../api";
import { ProductsQueryParams } from "../../api/types/product.types";
import { getProductsNextOffset } from "../lib/infinite-products.helpers";

export const useProductsInfinite = (params?: ProductsQueryParams, page = 1) => {
  const limit = params?.limit ?? PRODUCT_PAGINATION.DEFAULT_LIMIT;
  const { offset: _offset, ...rest } = params ?? {};
  const initialOffset = pageToOffset(page, limit);

  return useInfiniteQuery({
    queryKey: ["products", "infinite", rest, limit, page],
    queryFn: ({ pageParam }) =>
      productQuery.getAll({
        ...rest,
        limit,
        offset: pageParam,
      }),
    initialPageParam: initialOffset,
    getNextPageParam: getProductsNextOffset,
  });
};
