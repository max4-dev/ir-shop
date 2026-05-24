import { Button, Card, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router";

import { OrderStatus, useOrders, type Order } from "@src/entities/order";
import { OrderStatusTag, formatOrderId } from "@src/features/order";
import { ROUTES } from "@src/shared/config";
import { formatDateTime, formatPrice } from "@src/shared/lib";

import styles from "./PendingOrdersTable.module.css";

const PENDING_ORDERS_LIMIT = 5;

export const PendingOrdersTable = () => {
  const { data, isLoading } = useOrders({
    limit: PENDING_ORDERS_LIMIT,
    status: OrderStatus.PAID,
  });

  const columns: ColumnsType<Order> = [
    {
      title: "№",
      key: "id",
      render: (_, order) => `#${formatOrderId(order.id)}`,
    },
    {
      title: "Дата",
      key: "createdAt",
      render: (_, order) => formatDateTime(order.createdAt),
    },
    {
      title: "Клиент",
      key: "customer",
      render: (_, order) => (
        <Space direction="vertical" size={0}>
          <span>{order.customerName}</span>
          <span className={styles.secondary}>{order.customerEmail}</span>
        </Space>
      ),
    },
    {
      title: "Сумма",
      key: "totalPrice",
      render: (_, order) => formatPrice(order.totalPrice),
    },
    {
      title: "Статус",
      key: "status",
      render: (_, order) => <OrderStatusTag status={order.status} />,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, order) => (
        <Link to={ROUTES.ORDERS.DETAIL(order.id)}>Обработать</Link>
      ),
    },
  ];

  return (
    <Card
      className={styles.card}
      extra={
        <Link to={ROUTES.ORDERS.ROOT}>
          <Button type="link">Все заказы</Button>
        </Link>
      }
      title="Заказы, ожидающие обработки"
    >
      <Table
        columns={columns}
        dataSource={data?.items}
        loading={isLoading}
        locale={{ emptyText: "Нет необработанных заказов" }}
        pagination={false}
        rowKey="id"
        size="middle"
      />
    </Card>
  );
};
