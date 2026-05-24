import { ProductSort } from "../api/types/product.types";

export const PRODUCT_SORT_LABELS: Record<ProductSort, string> = {
  [ProductSort.Newest]: "Сначала новые",
  [ProductSort.PriceAsc]: "Цена: по возрастанию",
  [ProductSort.PriceDesc]: "Цена: по убыванию",
  [ProductSort.Popularity]: "Популярные",
};

export const PRODUCT_SORT_OPTIONS = Object.values(ProductSort);
