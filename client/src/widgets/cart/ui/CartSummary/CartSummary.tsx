"use client";

import cn from "classnames";

import { ClearCartButton } from "@/src/features/cart/ui";
import { useCartTotalWithPromo } from "@/src/features/promo-code/model";
import { CartPromoCode } from "@/src/features/promo-code/ui";
import { ROUTES } from "@/src/shared/config";
import { formatPrice } from "@/src/shared/lib";
import { Card, Link, Title } from "@/src/shared/ui";

import styles from "./CartSummary.module.css";
import { CartSummaryProps } from "./CartSummary.props";

export const CartSummary = ({ className, cart }: CartSummaryProps) => {
  const pricing = useCartTotalWithPromo(cart.totalPrice);
  const hasProductDiscount = cart.totalPriceWithoutSale > cart.totalPrice;

  return (
    <Card className={cn(className, styles.summary)}>
      <Title className={styles.title} tag="h2" size="lg">
        Итого
      </Title>

      <CartPromoCode subtotal={cart.totalPrice} />

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

      <div className={styles.actions}>
        <Link href={ROUTES.CHECKOUT} appearance="primary" className={styles.checkout}>
          Оформить заказ
        </Link>
        <Link href={ROUTES.PRODUCTS.ALL} appearance="ghost" className={styles.continue}>
          Продолжить покупки
        </Link>
        <ClearCartButton />
      </div>
    </Card>
  );
};
