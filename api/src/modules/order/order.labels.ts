import { OrderStatus } from '@prisma/client';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: 'Ожидает оплаты',
  [OrderStatus.PAID]: 'Оплачен',
  [OrderStatus.COMPLETED]: 'Выполнен',
  [OrderStatus.CANCELLED]: 'Отменён',
  [OrderStatus.REFUNDED]: 'Возврат',
};
