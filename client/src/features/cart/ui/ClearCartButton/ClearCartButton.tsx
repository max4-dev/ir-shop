"use client";

import cn from "classnames";

import { useClearCart } from "@/src/entities/cart/model";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Toast } from "@/src/shared/ui";

import styles from "./ClearCartButton.module.css";
import { ClearCartButtonProps } from "./ClearCartButton.props";

export const ClearCartButton = ({ className, ...props }: ClearCartButtonProps) => {
  const { mutateAsync, isPending } = useClearCart();
  const { showToast, toastProps } = useToast();

  const handleClick = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <>
      <Button
        type="button"
        appearance="ghost"
        className={cn(className, styles.button)}
        disabled={isPending}
        onClick={handleClick}
        {...props}
      >
        Очистить корзину
      </Button>
      <Toast {...toastProps} />
    </>
  );
};
