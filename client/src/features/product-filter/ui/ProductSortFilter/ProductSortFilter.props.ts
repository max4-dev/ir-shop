import { ProductSort } from "@/src/entities/product/api/types/product.types";

export interface ProductSortFilterProps {
  value?: ProductSort;
  onChange: (sort: ProductSort | undefined) => void;
  className?: string;
}
