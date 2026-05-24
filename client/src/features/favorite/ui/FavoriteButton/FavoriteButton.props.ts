import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface FavoriteButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  productId: string;
}
