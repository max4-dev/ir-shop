export type PromoCodeSource = "LOYALTY" | "ADMIN";

export interface PromoCode {
  id: string;
  code: string;
  userId: string;
  discountPercent: number;
  source: PromoCodeSource;
  createdAt: string;
}

export interface ValidatePromoCodeBody {
  code: string;
}

export interface ValidatePromoCodeResult {
  valid: boolean;
  code: string;
  discountPercent: number;
}

export interface PromoCodeListResponse {
  items: PromoCode[];
  total: number;
}
