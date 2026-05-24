"use client";

import { CartButton } from "@/src/features/cart/ui";
import { FavoriteButton } from "@/src/features/favorite/ui";

import styles from "./ProductDetailActions.module.css";
import { ProductDetailActionsProps } from "./ProductDetailActions.props";

export const ProductDetailActions = ({ productId, isAvailable }: ProductDetailActionsProps) => {
  return (
    <div className={styles.actions}>
      <div className={styles.inner}>
        <FavoriteButton productId={productId} />
        <CartButton
          appearance="primary"
          productId={productId}
          disabled={!isAvailable}
          className={styles.cartButton}
        />
      </div>
    </div>
  );
};
