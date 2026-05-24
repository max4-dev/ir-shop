"use client";

import cn from "classnames";

import { useClearFavorites } from "@/src/entities/favorite/model";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Toast } from "@/src/shared/ui";

import styles from "./ClearFavoritesButton.module.css";
import { ClearFavoritesButtonProps } from "./ClearFavoritesButton.props";

export const ClearFavoritesButton = ({ className, ...props }: ClearFavoritesButtonProps) => {
  const { mutateAsync, isPending } = useClearFavorites();
  const { showToast, toastProps } = useToast();

  const handleClick = async () => {
    try {
      await mutateAsync();
      showToast("Избранное очищено", { appearance: "success" });
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
        onClick={handleClick}
        {...props}
      >
        Очистить избранное
      </button>
      <Toast {...toastProps} />
    </>
  );
};
