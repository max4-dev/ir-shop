import { ProductSort } from "../api/types/product.types";

export const HOME_SLIDER_LIMIT = 12;

export const HOME_PRODUCT_LIST_ROUTES = {
  popular: `/products?sort=${ProductSort.Popularity}`,
  newest: `/products?sort=${ProductSort.Newest}`,
  all: "/products",
} as const;
