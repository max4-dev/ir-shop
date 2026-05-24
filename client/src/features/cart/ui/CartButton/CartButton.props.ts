import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type CartButtonAppearance = "icon" | "primary";

export interface CartButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  productId: string;
  appearance?: CartButtonAppearance;
  disabled?: boolean;
}
