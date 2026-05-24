"use client";

import cn from "classnames";

import { useUpdateCartItem } from "@/src/entities/cart/model";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Toast } from "@/src/shared/ui";

import styles from "./UpdateCartItemQuantity.module.css";
import { UpdateCartItemQuantityProps } from "./UpdateCartItemQuantity.props";

export const UpdateCartItemQuantity = ({
  className,
  productId,
  quantity,
  availableCount,
}: UpdateCartItemQuantityProps) => {
  const { mutateAsync, isPending } = useUpdateCartItem();
  const { showToast, toastProps } = useToast();

  const min = 1;

  const updateQuantity = async (nextQuantity: number) => {
    try {
      await mutateAsync({ productId, body: { quantity: nextQuantity } });
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <>
      <div className={cn(className, styles.controls)}>
        <button
          type="button"
          className={styles.button}
          disabled={isPending || quantity <= min}
          aria-label="Уменьшить количество"
          onClick={() => updateQuantity(quantity - 1)}
        >
          −
        </button>
        <span className={styles.value}>{quantity}</span>
        <button
          type="button"
          className={styles.button}
          disabled={isPending || quantity >= availableCount}
          aria-label="Увеличить количество"
          onClick={() => updateQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
      <Toast {...toastProps} />
    </>
  );
};
