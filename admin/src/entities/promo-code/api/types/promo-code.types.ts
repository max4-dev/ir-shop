export const PromoCodeSource = {
  LOYALTY: "LOYALTY",
  ADMIN: "ADMIN",
} as const;

export type PromoCodeSource = (typeof PromoCodeSource)[keyof typeof PromoCodeSource];

export interface PromoCode {
  id: string;
  code: string;
  userId: string;
  discountPercent: number;
  source: PromoCodeSource;
  createdAt: string;
}

export interface CreatePromoCodeDTO {
  userId: string;
  discountPercent?: number;
}
