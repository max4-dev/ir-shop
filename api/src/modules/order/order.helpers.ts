import { Order } from '@prisma/client';

interface PricedItem {
  priceWithSale: number;
  quantity: number;
}

export const calcTotalPrice = (items: PricedItem[]): number =>
  items.reduce((acc, item) => acc + item.priceWithSale * item.quantity, 0);

export const isOrderOwner = (
  order: Pick<Order, 'sessionId' | 'userId'>,
  sessionId: string,
  userId: string | null,
): boolean =>
  order.sessionId === sessionId || (userId !== null && order.userId === userId);
