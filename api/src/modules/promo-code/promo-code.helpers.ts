export const applyDiscountPercent = (
  subtotal: number,
  discountPercent: number,
): number =>
  Math.max(0, Math.round((subtotal * (100 - discountPercent)) / 100));
