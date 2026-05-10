import { Category } from "@/src/entities/category/@x/product";

export interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  images: string[];
  price: number;
  salePercent: number;
  priceWithSale: number;
  isAvailable: boolean;
  availableCount: number;
  description: string;
  categories: Category[];
}