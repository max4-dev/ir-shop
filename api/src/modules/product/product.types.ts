import { Category } from '@prisma/client';
import { ProductResponse } from './product.mapper';

export interface PaginatedProducts {
  products: ProductResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProductsByCategory {
  category: Category;
  products: ProductResponse[];
  total: number;
  limit: number;
  offset: number;
}
