import type { Product } from "@/src/entities/product/api";

export interface FavoriteItem {
  productId: string;
  product: Product;
}

export interface Favorite {
  id: string;
  sessionId: string;
  items: FavoriteItem[];
  totalCount: number;
}

export interface AddFavoriteItemBody {
  productId: string;
}
