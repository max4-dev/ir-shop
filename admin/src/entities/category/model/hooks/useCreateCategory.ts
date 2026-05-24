import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryQuery, type CategoryDTO } from "../../api";
import { categoryQueryKeys } from "../constants/category.query-keys";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryDTO) => categoryQuery.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
  });
};
