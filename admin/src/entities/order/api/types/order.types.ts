export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  WAITING_FOR_CAPTURE: "WAITING_FOR_CAPTURE",
  SUCCEEDED: "SUCCEEDED",
  CANCELED: "CANCELED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

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
  subtotalPrice: number;
  discountPercent: number;
  appliedPromoCode: string | null;
  totalPrice: number;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type OrdersQueryParams = {
  limit?: number;
  offset?: number;
  status?: OrderStatus;
};

export interface PaginatedOrders {
  items: Order[];
  total: number;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}
