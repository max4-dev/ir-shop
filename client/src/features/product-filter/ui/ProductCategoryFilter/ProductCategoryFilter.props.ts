import { Category } from "@/src/entities/category/api/types/category.types";

export interface ProductCategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
  className?: string;
}
