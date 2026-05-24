import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orderQuery } from "../../api";
import type { UpdateOrderStatusDTO } from "../../api";
import { orderQueryKeys } from "../constants/order.constants";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDTO }) =>
      orderQuery.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(id) });
    },
  });
};
