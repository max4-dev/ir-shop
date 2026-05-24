"use client";

import cn from "classnames";
import { useSearchParams } from "next/navigation";

import { OrderStatus } from "@/src/entities/order/api";
import { useOrder } from "@/src/entities/order/model";
import { ROUTES } from "@/src/shared/config";
import { formatPrice, getErrorMessage } from "@/src/shared/lib";
import { Card, Container, Link, Title } from "@/src/shared/ui";

import styles from "./OrderSuccessPage.module.css";

const STATUS_CONTENT: Record<
  OrderStatus,
  { title: string; description: string; className?: string }
> = {
  [OrderStatus.PENDING_PAYMENT]: {
    title: "Ожидаем оплату",
    description:
      "Платёж ещё не подтверждён. Если вы уже оплатили заказ, статус обновится автоматически.",
    className: styles.statusPending,
  },
  [OrderStatus.PAID]: {
    title: "Заказ оплачен",
    description: "Спасибо за покупку! Мы свяжемся с вами для уточнения доставки.",
    className: styles.statusPaid,
  },
  [OrderStatus.COMPLETED]: {
    title: "Заказ выполнен",
    description: "Ваш заказ успешно доставлен.",
    className: styles.statusPaid,
  },
  [OrderStatus.CANCELLED]: {
    title: "Заказ отменён",
    description: "Заказ был отменён. Товары возвращены на склад.",
    className: styles.statusCancelled,
  },
  [OrderStatus.REFUNDED]: {
    title: "Возврат оформлен",
    description: "Средства по заказу возвращены.",
    className: styles.statusCancelled,
  },
};

export const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") ?? "";

  const { data: order, isLoading, isError, error } = useOrder(orderId);

  if (!orderId) {
    return (
      <div className={styles.page}>
        <Container>
          <p className={styles.state}>Заказ не найден</p>
        </Container>
      </div>
    );
  }

  const statusContent = order ? STATUS_CONTENT[order.status] : null;

  return (
    <div className={styles.page}>
      <Container>
        {isLoading && <p className={styles.state}>Проверяем статус заказа...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {order && statusContent && (
          <Card className={styles.card}>
            <Title className={cn(styles.title, statusContent.className)} tag="h1" size="xl">
              {statusContent.title}
            </Title>
            <p className={styles.text}>{statusContent.description}</p>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Номер заказа</span>
                <span className={styles.detailValue}>{order.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Сумма</span>
                <span className={styles.detailValue}>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{order.customerEmail}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href={ROUTES.ORDERS.DETAIL(order.id)} appearance="primary" className={styles.link}>
                Подробнее о заказе
              </Link>
              <Link href={ROUTES.ORDERS.ROOT} appearance="ghost" className={styles.link}>
                Мои заказы
              </Link>
              <Link href={ROUTES.PRODUCTS.ALL} appearance="ghost" className={styles.link}>
                Продолжить покупки
              </Link>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
};
