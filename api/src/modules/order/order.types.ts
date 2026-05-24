import { PaymentResponse } from '../payment/payment.mapper';
import { OrderResponse } from './order.mapper';

export interface PaginatedOrders {
  items: OrderResponse[];
  total: number;
}

export interface CreateOrderResult {
  order: OrderResponse;
  payment: PaymentResponse;
  confirmationUrl: string | null;
}
