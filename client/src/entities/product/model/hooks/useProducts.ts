import { useQuery } from "@tanstack/react-query";

import { productQuery } from "../../api";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: () => productQuery.getAll(),
  });
