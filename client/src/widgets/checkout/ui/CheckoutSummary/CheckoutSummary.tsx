"use client";

import cn from "classnames";

import { useCartTotalWithPromo } from "@/src/features/promo-code/model";
import { CartPromoCode } from "@/src/features/promo-code/ui";
import { formatPrice } from "@/src/shared/lib";
import { Card, Title } from "@/src/shared/ui";

import styles from "./CheckoutSummary.module.css";
import { CheckoutSummaryProps } from "./CheckoutSummary.props";

export const CheckoutSummary = ({ className, cart, ...props }: CheckoutSummaryProps) => {
  const pricing = useCartTotalWithPromo(cart.totalPrice);
  const hasProductDiscount = cart.totalPriceWithoutSale > cart.totalPrice;

  return (
    <Card className={cn(className, styles.summary)} {...props}>
      <Title className={styles.title} tag="h2" size="lg">
        Ваш заказ
      </Title>

      <CartPromoCode subtotal={cart.totalPrice} />

      <ul className={styles.items}>
        {cart.items.map((item) => (
          <li key={item.productId} className={styles.item}>
            <span className={styles.itemName}>{item.product.name}</span>
            <span className={styles.itemQty}>×{item.quantity}</span>
            <span className={styles.itemPrice}>{formatPrice(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>Товаров</span>
          <span className={styles.value}>{cart.totalQuantity}</span>
        </div>

        {hasProductDiscount && (
          <div className={styles.row}>
            <span className={styles.label}>Без скидки на товары</span>
            <span className={styles.originalTotal}>
              {formatPrice(cart.totalPriceWithoutSale)}
            </span>
          </div>
        )}

        <div className={styles.row}>
          <span className={styles.label}>Сумма товаров</span>
          <span className={styles.value}>{formatPrice(pricing.subtotal)}</span>
        </div>

        {pricing.hasPromo && (
          <div className={styles.row}>
            <span className={styles.label}>Промокод −{pricing.discountPercent}%</span>
            <span className={styles.promoDiscount}>−{formatPrice(pricing.promoDiscount)}</span>
          </div>
        )}

        <div className={styles.row}>
          <span className={styles.label}>К оплате</span>
          <span className={cn(styles.value, styles.total)}>{formatPrice(pricing.total)}</span>
        </div>
      </div>
    </Card>
  );
};
