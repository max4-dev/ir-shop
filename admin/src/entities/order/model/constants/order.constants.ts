import { OrderStatus } from "../../api";

export const orderQueryKeys = {
  all: (params?: Record<string, unknown>) => ["orders", params ?? {}] as const,
  detail: (id: string) => ["orders", id] as const,
};

export const ORDER_PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: "Ожидает оплаты",
  [OrderStatus.PAID]: "Оплачен",
  [OrderStatus.COMPLETED]: "Выполнен",
  [OrderStatus.CANCELLED]: "Отменён",
  [OrderStatus.REFUNDED]: "Возврат",
};

export const ORDER_STATUS_TAG_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_PAYMENT]: "default",
  [OrderStatus.PAID]: "success",
  [OrderStatus.COMPLETED]: "processing",
  [OrderStatus.CANCELLED]: "error",
  [OrderStatus.REFUNDED]: "warning",
};
