import { client } from "@src/shared/api";

import { promoCodeApi } from "./promo-code.api";
import type { CreatePromoCodeDTO, PromoCode } from "./types/promo-code.types";

export const promoCodeQuery = {
  create: (data: CreatePromoCodeDTO) =>
    client.post<PromoCode>(promoCodeApi.create, { json: data }).json(),
};
