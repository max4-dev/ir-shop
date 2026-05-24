export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

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
  description: string | null;
  categories: ProductCategory[];
}

export interface ProductDTO {
  name: string;
  price: number;
  description?: string | null;
  image: string;
  images: string[];
  isAvailable: boolean;
  availableCount: number;
  salePercent?: number;
  categoryIds: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface DeleteProductResponse {
  id: string;
}

export type ProductsQueryParams = {
  limit?: number;
  offset?: number;
  search?: string;
};
