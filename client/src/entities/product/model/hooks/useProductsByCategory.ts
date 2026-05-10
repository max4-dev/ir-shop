import { useQuery } from "@tanstack/react-query";

import { productQuery } from "../../api";

export const useProductsByCategory = (category: string) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: () => productQuery.getByCategory(category),
  });
