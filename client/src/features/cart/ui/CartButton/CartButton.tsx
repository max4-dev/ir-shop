"use client";

import cn from "classnames";

import { useAddCartItem } from "@/src/entities/cart/model";
import { Icon } from "@/src/shared/assets";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Toast } from "@/src/shared/ui";

import styles from "./CartButton.module.css";
import { CartButtonProps } from "./CartButton.props";

export const CartButton = ({
  className,
  productId,
  appearance = "icon",
  disabled,
  ...props
}: CartButtonProps) => {
  const { mutateAsync, isPending } = useAddCartItem();
  const { showToast, toastProps } = useToast();

  const isDisabled = disabled || isPending;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      await mutateAsync({ productId, quantity: 1 });
      showToast("Товар добавлен в корзину", { appearance: "success" });
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  if (appearance === "primary") {
    return (
      <>
        <Button
          type="button"
          appearance="primary"
          className={cn(className, styles.primaryButton)}
          disabled={isDisabled}
          aria-busy={isPending}
          onClick={handleClick}
          {...props}
        >
          {disabled ? "Нет в наличии" : "Добавить в корзину"}
        </Button>
        <Toast {...toastProps} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className={cn(className, styles.iconButton)}
        disabled={isDisabled}
        aria-label="Добавить в корзину"
        aria-busy={isPending}
        onClick={handleClick}
        {...props}
      >
        <Icon.Cart className={styles.icon} />
      </button>
      <Toast {...toastProps} />
    </>
  );
};
