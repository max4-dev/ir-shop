import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MY_PROMO_CODES_QUERY_KEY } from "@/src/entities/promo-code/model";
import { usePromoCodeStore } from "@/src/features/promo-code/model";

import { orderQuery, type CreateOrderBody } from "../../api";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const clearApplied = usePromoCodeStore((state) => state.clearApplied);

  return useMutation({
    mutationFn: (body: CreateOrderBody) => orderQuery.create(body),
    onSuccess: () => {
      clearApplied();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: MY_PROMO_CODES_QUERY_KEY });
    },
  });
};
