import cn from "classnames";
import Link from "next/link";

import { ORDER_STATUS_BADGE } from "@/src/entities/order/config/order.status";
import { ORDER_STATUS_LABELS } from "@/src/entities/order/config/order.labels";
import { ROUTES } from "@/src/shared/config";
import { formatDateTime, formatPrice } from "@/src/shared/lib";
import { Badge, Card } from "@/src/shared/ui";

import styles from "./OrderCard.module.css";
import { OrderCardProps } from "./OrderCard.props";

export const OrderCard = ({ className, order, ...props }: OrderCardProps) => {
  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <Link
      href={ROUTES.ORDERS.DETAIL(order.id)}
      className={cn(className, styles.card)}
      {...props}
    >
      <Card>
        <div className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.id}>Заказ #{shortId}</span>
            <time className={styles.date} dateTime={order.createdAt}>
              {formatDateTime(order.createdAt)}
            </time>
          </div>
          <Badge appearance={ORDER_STATUS_BADGE[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <div className={styles.footer}>
          <span className={styles.itemsCount}>
            {order.items.length} {order.items.length === 1 ? "товар" : "товаров"}
          </span>
          <span className={styles.total}>{formatPrice(order.totalPrice)}</span>
        </div>
      </Card>
    </Link>
  );
};
