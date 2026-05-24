import { Prisma } from '@prisma/client';
import {
  formatProduct,
  productInclude,
  ProductResponse,
} from '../product/product.mapper';

export const cartItemInclude = {
  product: { include: productInclude },
} satisfies Prisma.CartItemInclude;

export const cartInclude = {
  items: {
    include: cartItemInclude,
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartInclude;
}>;

export interface CartItemResponse {
  productId: string;
  quantity: number;
  subtotal: number;
  product: ProductResponse;
}

export interface CartResponse {
  id: string;
  sessionId: string;
  items: CartItemResponse[];
  totalQuantity: number;
  totalPrice: number;
  totalPriceWithoutSale: number;
}

const formatCartItem = (
  item: CartWithItems['items'][number],
): CartItemResponse => {
  const product = formatProduct(item.product);
  return {
    productId: item.productId,
    quantity: item.quantity,
    subtotal: product.priceWithSale * item.quantity,
    product,
  };
};

export const formatCart = (cart: CartWithItems): CartResponse => {
  const items = cart.items.map(formatCartItem);
  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.subtotal, 0);
  const totalPriceWithoutSale = items.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0,
  );

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    items,
    totalQuantity,
    totalPrice,
    totalPriceWithoutSale,
  };
};
