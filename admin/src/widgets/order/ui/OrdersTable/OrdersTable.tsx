import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router";

import { ORDER_PAGINATION, useOrders, type Order } from "@src/entities/order";
import { OrderStatusTag, formatOrderId } from "@src/features/order";
import { ROUTES } from "@src/shared/config";
import { formatDateTime, formatPrice } from "@src/shared/lib";

type OrdersTableProps = {
  status?: Order["status"];
};

export const OrdersTable = ({ status }: OrdersTableProps) => {
  const { data, isLoading } = useOrders({
    limit: ORDER_PAGINATION.DEFAULT_LIMIT,
    status,
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
          <span style={{ color: "var(--gray)", fontSize: 12 }}>{order.customerEmail}</span>
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
        <Link to={ROUTES.ORDERS.DETAIL(order.id)}>Подробнее</Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data?.items}
      loading={isLoading}
      pagination={{ total: data?.total }}
      rowKey="id"
    />
  );
};
