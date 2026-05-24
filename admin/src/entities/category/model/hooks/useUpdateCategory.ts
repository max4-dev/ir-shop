import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryQuery, type CategoryDTO } from "../../api";
import { categoryQueryKeys } from "../constants/category.query-keys";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryDTO }) =>
      categoryQuery.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  });
};
