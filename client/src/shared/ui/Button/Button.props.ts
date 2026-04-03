import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface ButtonProps extends Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "ref"
> {
  size?: "small" | "medium" | "big";
  appearance?: "primary" | "ghost" | "disabled";
}
