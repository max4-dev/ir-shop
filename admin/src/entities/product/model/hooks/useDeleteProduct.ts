import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productQuery } from "../../api";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productQuery.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};
