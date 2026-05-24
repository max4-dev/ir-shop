import { Tag } from "antd";

import { ORDER_STATUS_LABELS, ORDER_STATUS_TAG_COLORS, type OrderStatus } from "@src/entities/order";

type OrderStatusTagProps = {
  status: OrderStatus;
};

export const OrderStatusTag = ({ status }: OrderStatusTagProps) => (
  <Tag color={ORDER_STATUS_TAG_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Tag>
);
