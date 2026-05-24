import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQuery } from "../../api";
import { userQueryKeys } from "../constants/user.query-keys";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userQuery.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  });
};
