import { Product } from "@/src/entities/product/api";

export interface ProductSliderProps {
  products: Product[];
  title?: string;
  moreHref?: string;
  moreLabel?: string;
  className?: string;
}
