import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productQuery } from "../../api";
import type { ProductDTO } from "../../api";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductDTO) => productQuery.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};
