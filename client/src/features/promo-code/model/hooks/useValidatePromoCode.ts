import { useMutation } from "@tanstack/react-query";

import { promoCodeQuery } from "@/src/entities/promo-code/api";

export const useValidatePromoCode = () =>
  useMutation({
    mutationFn: promoCodeQuery.validate,
  });
