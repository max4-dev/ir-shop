import { PRODUCT_LIMITS } from '../constants/product.constants';

export const calcPriceWithSale = (
  price: number,
  salePercent: number,
): number => {
  const safePercent = Math.max(
    0,
    Math.min(PRODUCT_LIMITS.MAX_SALE_PERCENT, salePercent),
  );
  return Math.max(0, Math.ceil(price - price * (safePercent / 100)));
};
