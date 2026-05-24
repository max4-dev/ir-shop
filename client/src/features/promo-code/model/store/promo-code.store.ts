import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface AppliedPromoCode {
  code: string;
  discountPercent: number;
}

export interface PromoCodeStore {
  applied: AppliedPromoCode | null;
  setApplied: (promo: AppliedPromoCode) => void;
  clearApplied: () => void;
}

export const usePromoCodeStore = create<PromoCodeStore>()(
  devtools(
    (set) => ({
      applied: null,
      setApplied: (promo) => set({ applied: promo }, false, "promoCode/setApplied"),
      clearApplied: () => set({ applied: null }, false, "promoCode/clearApplied"),
    }),
    { name: "PromoCodeStore" },
  ),
);
