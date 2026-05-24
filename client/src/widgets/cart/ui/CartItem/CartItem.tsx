import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

import { RemoveCartItemButton, UpdateCartItemQuantity } from "@/src/features/cart/ui";
import { ROUTES } from "@/src/shared/config";
import { formatPrice } from "@/src/shared/lib";

import styles from "./CartItem.module.css";
import { CartItemProps } from "./CartItem.props";

export const CartItem = ({ className, item, ...props }: CartItemProps) => {
  const { product, quantity, subtotal } = item;
  const hasDiscount = product.salePercent > 0;
  const originalSubtotal = product.price * quantity;

  return (
    <li className={cn(className, styles.item)} {...props}>
      <Link href={ROUTES.PRODUCTS.DETAIL(product.slug)} className={styles.imageLink}>
        <Image
          className={styles.image}
          src={product.image}
          alt={product.name}
          width={120}
          height={120}
        />
      </Link>

      <div className={styles.info}>
        <Link href={ROUTES.PRODUCTS.DETAIL(product.slug)} className={styles.name}>
          {product.name}
        </Link>

        {!product.isAvailable && <span className={styles.unavailable}>Нет в наличии</span>}

        <div className={styles.prices}>
          <span className={styles.unitPrice}>
            {formatPrice(product.priceWithSale)} / шт.
          </span>
          <span className={styles.subtotal}>{formatPrice(subtotal)}</span>
          {hasDiscount && (
            <span className={styles.originalSubtotal}>{formatPrice(originalSubtotal)}</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <UpdateCartItemQuantity
          productId={product.id}
          quantity={quantity}
          availableCount={product.availableCount}
        />
        <RemoveCartItemButton productId={product.id} />
      </div>
    </li>
  );
};
