"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { OrderStatus } from "@/src/entities/order/api";
import { ORDER_STATUS_LABELS } from "@/src/entities/order/config/order.labels";
import { ORDER_STATUS_BADGE } from "@/src/entities/order/config/order.status";
import { useCancelOrder, useOrder } from "@/src/entities/order/model";
import { ROUTES } from "@/src/shared/config";
import { formatDateTime, formatPrice, getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Container,
  Link as UiLink,
  Title,
  Toast,
} from "@/src/shared/ui";

import styles from "./OrderDetailPage.module.css";

export const OrderDetailPage = () => {
  const params = useParams();
  const orderId = typeof params?.id === "string" ? params.id : "";

  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const { mutateAsync: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { showToast, toastProps } = useToast();

  const shortId = orderId.slice(0, 8).toUpperCase();
  const pendingPayment = order?.payments.find((p) => p.confirmationUrl);

  const handleCancel = async () => {
    if (!window.confirm("Отменить заказ?")) return;

    try {
      await cancelOrder(orderId);
      showToast("Заказ отменён", { appearance: "success" });
    } catch (err) {
      showToast(getErrorMessage(err), { appearance: "danger" });
    }
  };

  const handlePay = () => {
    if (pendingPayment?.confirmationUrl) {
      window.location.href = pendingPayment.confirmationUrl;
      return;
    }
    showToast("Ссылка на оплату недоступна", { appearance: "danger" });
  };

  return (
    <div className={styles.page}>
      <Container>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link href="/">Главная</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link href={ROUTES.ORDERS.ROOT}>Мои заказы</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>#{shortId}</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        {isLoading && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {order && (
          <>
            <div className={styles.header}>
              <div>
                <Title className={styles.title} tag="h1" size="xl">
                  Заказ #{shortId}
                </Title>
                <time className={styles.date} dateTime={order.createdAt}>
                  {formatDateTime(order.createdAt)}
                </time>
              </div>
              <Badge appearance={ORDER_STATUS_BADGE[order.status]} size="lg">
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>

            <div className={styles.layout}>
              <Card className={styles.section}>
                <Title className={styles.sectionTitle} tag="h2" size="lg">
                  Состав заказа
                </Title>
                <ul className={styles.items}>
                  {order.items.map((item) => (
                    <li key={item.id} className={styles.item}>
                      <Image
                        className={styles.image}
                        src={item.productImage}
                        alt={item.productName}
                        width={64}
                        height={64}
                      />
                      <div className={styles.itemInfo}>
                        <Link
                          href={ROUTES.PRODUCTS.DETAIL(item.productSlug)}
                          className={styles.itemName}
                        >
                          {item.productName}
                        </Link>
                        <span className={styles.itemMeta}>
                          {formatPrice(item.priceWithSale)} × {item.quantity}
                        </span>
                      </div>
                      <span className={styles.itemPrice}>{formatPrice(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className={styles.section}>
                <Title className={styles.sectionTitle} tag="h2" size="lg">
                  Детали
                </Title>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Получатель</span>
                    <span className={styles.detailValue}>{order.customerName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>{order.customerEmail}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Телефон</span>
                    <span className={styles.detailValue}>{order.customerPhone}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Адрес доставки</span>
                    <span className={styles.detailValue}>{order.deliveryAddress}</span>
                  </div>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Итого</span>
                  <span className={styles.totalValue}>{formatPrice(order.totalPrice)}</span>
                </div>

                <div className={styles.actions}>
                  {order.status === OrderStatus.PENDING_PAYMENT &&
                    pendingPayment?.confirmationUrl && (
                      <Button type="button" className={styles.action} onClick={handlePay}>
                        Оплатить заказ
                      </Button>
                    )}
                  {order.status === OrderStatus.PENDING_PAYMENT && (
                    <Button
                      type="button"
                      appearance="ghost"
                      className={styles.action}
                      disabled={isCancelling}
                      onClick={handleCancel}
                    >
                      Отменить заказ
                    </Button>
                  )}
                  <UiLink href={ROUTES.ORDERS.ROOT} appearance="ghost" className={styles.action}>
                    К списку заказов
                  </UiLink>
                </div>
              </Card>
            </div>
          </>
        )}
      </Container>
      <Toast {...toastProps} />
    </div>
  );
};
