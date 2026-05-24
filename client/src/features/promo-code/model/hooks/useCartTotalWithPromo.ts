import { useMemo } from "react";
import { useShallow } from "zustand/shallow";

import { applyDiscountPercent } from "@/src/entities/promo-code/lib/apply-discount-percent";

import { usePromoCodeStore } from "../store/promo-code.store";

export const useCartTotalWithPromo = (subtotal: number) => {
  const applied = usePromoCodeStore(useShallow((state) => state.applied));

  return useMemo(() => {
    if (!applied) {
      return {
        subtotal,
        discountPercent: 0,
        promoDiscount: 0,
        total: subtotal,
        hasPromo: false,
      };
    }

    const total = applyDiscountPercent(subtotal, applied.discountPercent);

    return {
      subtotal,
      discountPercent: applied.discountPercent,
      promoDiscount: subtotal - total,
      total,
      hasPromo: true,
    };
  }, [applied, subtotal]);
};
