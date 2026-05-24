import { useQuery } from "@tanstack/react-query";

import { productQuery } from "../../api";
import { ProductsQueryParams } from "../../api/types/product.types";

export const useProducts = (params?: ProductsQueryParams) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => productQuery.getAll(params),
  });
