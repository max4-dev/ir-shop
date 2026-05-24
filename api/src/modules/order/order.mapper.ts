import { OrderStatus, Prisma } from '@prisma/client';
import { formatPayment, PaymentResponse } from '../payment/payment.mapper';

export const orderInclude = {
  items: true,
  payments: true,
} satisfies Prisma.OrderInclude;

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

export interface OrderItemResponse {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  price: number;
  priceWithSale: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  sessionId: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  subtotalPrice: number;
  discountPercent: number;
  appliedPromoCode: string | null;
  totalPrice: number;
  items: OrderItemResponse[];
  payments: PaymentResponse[];
  createdAt: Date;
  updatedAt: Date;
}

const formatItem = (
  item: OrderWithRelations['items'][number],
): OrderItemResponse => ({
  id: item.id,
  productId: item.productId,
  productSlug: item.productSlug,
  productName: item.productName,
  productImage: item.productImage,
  price: item.price,
  priceWithSale: item.priceWithSale,
  quantity: item.quantity,
  subtotal: item.priceWithSale * item.quantity,
});

export const formatOrder = (order: OrderWithRelations): OrderResponse => ({
  id: order.id,
  sessionId: order.sessionId,
  userId: order.userId,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  deliveryAddress: order.deliveryAddress,
  status: order.status,
  subtotalPrice: order.subtotalPrice,
  discountPercent: order.discountPercent,
  appliedPromoCode: order.appliedPromoCode,
  totalPrice: order.totalPrice,
  items: order.items.map(formatItem),
  payments: order.payments.map(formatPayment),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});
