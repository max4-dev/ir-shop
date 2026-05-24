import { Select } from "antd";
import { useState } from "react";

import { ORDER_STATUS_LABELS, OrderStatus } from "@src/entities/order";
import { AdminLayout } from "@src/widgets/layout";
import { OrdersTable } from "@src/widgets/order";

import styles from "./OrdersPage.module.css";

const statusFilterOptions = [
  { label: "Все статусы", value: "" },
  ...Object.values(OrderStatus).map((status) => ({
    label: ORDER_STATUS_LABELS[status],
    value: status,
  })),
];

export const OrdersPage = () => {
  const [status, setStatus] = useState<OrderStatus | "">("");

  return (
    <AdminLayout title="Заказы">
      <div className={styles.toolbar}>
        <Select
          options={statusFilterOptions}
          style={{ minWidth: 220 }}
          value={status}
          onChange={setStatus}
        />
      </div>
      <OrdersTable status={status || undefined} />
    </AdminLayout>
  );
};
