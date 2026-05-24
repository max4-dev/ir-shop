"use client";

import cn from "classnames";

import { Button } from "@/src/shared/ui";

import styles from "./LoadMoreProductsButton.module.css";
import { LoadMoreProductsButtonProps } from "./LoadMoreProductsButton.props";

export const LoadMoreProductsButton = ({
  className,
  onClick,
  isLoading,
  disabled,
}: LoadMoreProductsButtonProps) => {
  return (
    <Button
      type="button"
      appearance="ghost"
      className={cn(className, styles.button)}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? "Загрузка..." : "Загрузить ещё"}
    </Button>
  );
};
