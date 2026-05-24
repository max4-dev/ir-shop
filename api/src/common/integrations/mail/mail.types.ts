import { OrderStatus } from '@prisma/client';
import { OrderWithRelations } from 'src/modules/order/order.mapper';

export type MailOrderPayload = OrderWithRelations;

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface OrderStatusMailContext {
  order: MailOrderPayload;
  status: OrderStatus;
  statusLabel: string;
}
