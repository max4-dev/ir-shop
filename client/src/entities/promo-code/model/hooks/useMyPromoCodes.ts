import { useQuery } from "@tanstack/react-query";

import { promoCodeQuery } from "../../api";

export const MY_PROMO_CODES_QUERY_KEY = ["promo-codes", "my"] as const;

export const useMyPromoCodes = (enabled = true) =>
  useQuery({
    queryKey: MY_PROMO_CODES_QUERY_KEY,
    queryFn: () => promoCodeQuery.getMy(),
    enabled,
  });
