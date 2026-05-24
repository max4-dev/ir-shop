import { useQuery } from "@tanstack/react-query";

import { productQuery } from "../../api";
import type { ProductsQueryParams } from "../../api";
import { productQueryKeys } from "../constants/product.constants";

export const useProducts = (params?: ProductsQueryParams) =>
  useQuery({
    queryKey: productQueryKeys.all(params),
    queryFn: () => productQuery.getAll(params),
  });

export const useProduct = (id: string | null) =>
  useQuery({
    queryKey: productQueryKeys.detail(id ?? ""),
    queryFn: () => productQuery.getById(id!),
    enabled: Boolean(id),
  });
