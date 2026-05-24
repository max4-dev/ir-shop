import { useMutation } from "@tanstack/react-query";

import { promoCodeQuery } from "../../api";
import type { CreatePromoCodeDTO } from "../../api";

export const useCreatePromoCode = () =>
  useMutation({
    mutationFn: (data: CreatePromoCodeDTO) => promoCodeQuery.create(data),
  });
