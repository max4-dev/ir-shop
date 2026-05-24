import { Button, Card, Descriptions, Image, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate, useParams } from "react-router";

import { useOrder, type OrderItem } from "@src/entities/order";
import { OrderStatusTag, UpdateOrderStatusSelect, formatOrderId } from "@src/features/order";
import { ROUTES } from "@src/shared/config";
import { formatDateTime, formatPrice } from "@src/shared/lib";
import { AdminLayout } from "@src/widgets/layout";

import styles from "./OrderDetailPage.module.css";

const itemColumns: ColumnsType<OrderItem> = [
  {
    title: "Товар",
    key: "product",
    render: (_, item) => (
      <Space>
        <Image alt={item.productName} height={48} src={item.productImage} width={48} />
        <span>{item.productName}</span>
      </Space>
    ),
  },
  {
    title: "Цена",
    key: "price",
    render: (_, item) => formatPrice(item.priceWithSale),
  },
  {
    title: "Кол-во",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Сумма",
    key: "subtotal",
    render: (_, item) => formatPrice(item.subtotal),
  },
];

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id ?? null);

  if (isLoading || !order) {
    return (
      <AdminLayout title="Заказ">
        <Spin />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Заказ #${formatOrderId(order.id)}`}>
      <Space className={styles.actions} direction="horizontal">
        <Button onClick={() => navigate(ROUTES.ORDERS.ROOT)}>Назад к списку</Button>
      </Space>

      <Card className={styles.card} title="Информация о заказе">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="ID">{order.id}</Descriptions.Item>
          <Descriptions.Item label="Дата создания">
            {formatDateTime(order.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Статус">
            <Space wrap>
              <OrderStatusTag status={order.status} />
              <UpdateOrderStatusSelect orderId={order.id} value={order.status} />
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Клиент">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
          <Descriptions.Item label="Телефон">{order.customerPhone}</Descriptions.Item>
          <Descriptions.Item label="Адрес">{order.deliveryAddress}</Descriptions.Item>
          <Descriptions.Item label="User ID">
            {order.userId ?? "Гостевой заказ"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className={styles.card} title="Сумма">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Подытог">{formatPrice(order.subtotalPrice)}</Descriptions.Item>
          <Descriptions.Item label="Скидка">
            {order.discountPercent > 0 ? `${order.discountPercent}%` : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Промокод">
            {order.appliedPromoCode ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Итого">
            <strong>{formatPrice(order.totalPrice)}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className={styles.card} title="Товары">
        <Table columns={itemColumns} dataSource={order.items} pagination={false} rowKey="id" />
      </Card>

      {order.payments.length > 0 && (
        <Card className={styles.card} title="Платежи">
          <Descriptions column={1} size="small">
            {order.payments.map((payment) => (
              <Descriptions.Item key={payment.id} label={payment.provider}>
                <Space direction="vertical" size={0}>
                  <span>{formatPrice(payment.amount)}</span>
                  <Tag>{payment.status}</Tag>
                  {payment.paidAt && (
                    <span style={{ color: "var(--gray)", fontSize: 12 }}>
                      Оплачен: {formatDateTime(payment.paidAt)}
                    </span>
                  )}
                </Space>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}

      <Link to={ROUTES.ORDERS.ROOT}>← Все заказы</Link>
    </AdminLayout>
  );
};
