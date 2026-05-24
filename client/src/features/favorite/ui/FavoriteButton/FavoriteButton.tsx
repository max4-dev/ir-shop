"use client";

import cn from "classnames";

import { useAddFavoriteItem, useFavorites, useRemoveFavoriteItem } from "@/src/entities/favorite/model";
import { Icon } from "@/src/shared/assets";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Toast } from "@/src/shared/ui";

import styles from "./FavoriteButton.module.css";
import { FavoriteButtonProps } from "./FavoriteButton.props";

export const FavoriteButton = ({ className, productId, ...props }: FavoriteButtonProps) => {
  const { data: favorites } = useFavorites();
  const { mutateAsync: addItem, isPending: isAdding } = useAddFavoriteItem();
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveFavoriteItem();
  const { showToast, toastProps } = useToast();

  const isFavorite = favorites?.items.some((item) => item.productId === productId) ?? false;
  const isPending = isAdding || isRemoving;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      if (isFavorite) {
        await removeItem(productId);
        showToast("Товар удалён из избранного", { appearance: "success" });
      } else {
        await addItem({ productId });
        showToast("Товар добавлен в избранное", { appearance: "success" });
      }
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(className, styles.iconButton)}
        disabled={isPending}
        aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        aria-pressed={isFavorite}
        aria-busy={isPending}
        onClick={handleClick}
        {...props}
      >
        <Icon.Favorite
          className={cn(styles.icon, isFavorite && styles.iconActive)}
          aria-hidden
        />
      </button>
      <Toast {...toastProps} />
    </>
  );
};
