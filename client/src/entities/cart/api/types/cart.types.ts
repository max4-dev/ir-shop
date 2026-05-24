import type { Product } from "@/src/entities/product/api";

export interface CartItem {
  productId: string;
  quantity: number;
  subtotal: number;
  product: Product;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  totalPriceWithoutSale: number;
}

export interface AddCartItemBody {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemBody {
  quantity: number;
}
