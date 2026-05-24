import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productQuery } from "../../api";
import type { ProductDTO } from "../../api";
import { productQueryKeys } from "../constants/product.constants";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductDTO> }) =>
      productQuery.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) });
    },
  });
};
