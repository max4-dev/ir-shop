"use client";

import cn from "classnames";

import { Button } from "@/src/shared/ui";

import { ClearProductFiltersButtonProps } from "./ClearProductFiltersButton.props";

export const ClearProductFiltersButton = ({
  className,
  onClick,
  disabled,
}: ClearProductFiltersButtonProps) => {
  return (
    <Button
      type="button"
      appearance="ghost"
      className={cn(className)}
      onClick={onClick}
      disabled={disabled}
    >
      Сбросить
    </Button>
  );
};
