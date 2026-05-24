import { OrderStatus } from "../api/types/order.types";

export const ORDER_STATUS_BADGE: Record<
  OrderStatus,
  "default" | "success" | "danger"
> = {
  [OrderStatus.PENDING_PAYMENT]: "default",
  [OrderStatus.PAID]: "success",
  [OrderStatus.COMPLETED]: "success",
  [OrderStatus.CANCELLED]: "danger",
  [OrderStatus.REFUNDED]: "danger",
};
