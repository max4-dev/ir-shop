"use client";

import cn from "classnames";

import { useRemoveCartItem } from "@/src/entities/cart/model";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Toast } from "@/src/shared/ui";

import styles from "./RemoveCartItemButton.module.css";
import { RemoveCartItemButtonProps } from "./RemoveCartItemButton.props";

export const RemoveCartItemButton = ({
  className,
  productId,
  ...props
}: RemoveCartItemButtonProps) => {
  const { mutateAsync, isPending } = useRemoveCartItem();
  const { showToast, toastProps } = useToast();

  const handleClick = async () => {
    try {
      await mutateAsync(productId);
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(className, styles.button)}
        disabled={isPending}
        aria-label="Удалить из корзины"
        onClick={handleClick}
        {...props}
      >
        Удалить
      </button>
      <Toast {...toastProps} />
    </>
  );
};
