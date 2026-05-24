import { client } from "@/src/shared/api";

import { promoCodeApi } from "./promo-code.api";

import type {
  PromoCodeListResponse,
  ValidatePromoCodeBody,
  ValidatePromoCodeResult,
} from "./types/promo-code.types";

export const promoCodeQuery = {
  getMy: () => client.get<PromoCodeListResponse>(promoCodeApi.my).json(),
  validate: (body: ValidatePromoCodeBody) =>
    client.post<ValidatePromoCodeResult>(promoCodeApi.validate, { json: body }).json(),
};
