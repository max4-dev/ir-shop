import type { KySearchParams } from "@/src/shared/api";

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  WAITING_FOR_CAPTURE = "WAITING_FOR_CAPTURE",
  SUCCEEDED = "SUCCEEDED",
  CANCELED = "CANCELED",
}

export interface OrderItem {
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

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  confirmationUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  sessionId: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  promoCode?: string;
}

export interface CreateOrderResult {
  order: Order;
  payment: Payment;
  confirmationUrl: string | null;
}

export type OrdersQueryParams = KySearchParams & {
  limit?: number;
  offset?: number;
  status?: OrderStatus;
};

export interface PaginatedOrders {
  items: Order[];
  total: number;
}
