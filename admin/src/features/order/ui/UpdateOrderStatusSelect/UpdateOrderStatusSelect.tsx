import { Select, message } from "antd";

import {
  ORDER_STATUS_LABELS,
  OrderStatus,
  useUpdateOrderStatus,
  type OrderStatus as OrderStatusType,
} from "@src/entities/order";
import { getErrorMessage } from "@src/shared/lib";

type UpdateOrderStatusSelectProps = {
  orderId: string;
  value: OrderStatusType;
};

const statusOptions = Object.values(OrderStatus).map((status) => ({
  label: ORDER_STATUS_LABELS[status],
  value: status,
}));

export const UpdateOrderStatusSelect = ({ orderId, value }: UpdateOrderStatusSelectProps) => {
  const { mutateAsync, isPending } = useUpdateOrderStatus();

  const handleChange = async (status: OrderStatusType) => {
    if (status === value) return;

    try {
      await mutateAsync({ id: orderId, data: { status } });
      message.success("Статус заказа обновлён");
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Select
      loading={isPending}
      options={statusOptions}
      style={{ minWidth: 200 }}
      value={value}
      onChange={handleChange}
    />
  );
};
