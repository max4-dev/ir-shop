import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQuery, type AddCartItemBody, type UpdateCartItemBody } from "../../api";

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddCartItemBody) => cartQuery.addItem(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, body }: { productId: string; body: UpdateCartItemBody }) =>
      cartQuery.updateItem(productId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartQuery.removeItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartQuery.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};
