import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryQuery } from "../../api";
import { categoryQueryKeys } from "../constants/category.query-keys";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryQuery.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  });
};
