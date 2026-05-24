import { useQuery } from "@tanstack/react-query";

import { productQuery } from "../../api";
import { ProductsQueryParams } from "../../api/types/product.types";

export const useProductsByCategory = (slug: string, params?: ProductsQueryParams) =>
  useQuery({
    queryKey: ["products", "category", slug, params],
    queryFn: () => productQuery.getByCategory(slug, params),
  });
