import { PromoCodeResponse } from './promo-code.mapper';

export interface ValidatePromoCodeResult {
  valid: boolean;
  discountPercent: number;
  code: string;
}

export interface PromoCodeListResponse {
  items: PromoCodeResponse[];
  total: number;
}
