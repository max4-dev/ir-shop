import { Category } from "@/src/entities/category/@x/product";

import type { KySearchParams } from "@/src/shared/api";

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

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductsByCategoryResponse {
  category: Category;
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export enum ProductSort {
  PriceAsc = "price_asc",
  PriceDesc = "price_desc",
  Popularity = "popularity",
  Newest = "newest",
}

export type ProductsQueryParams = KySearchParams & {
  limit?: number;
  offset?: number;
  sort?: ProductSort;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
};

export interface ProductFilters {
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  page?: number;
}
