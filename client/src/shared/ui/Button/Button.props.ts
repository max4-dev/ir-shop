import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface ButtonProps extends Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "ref"
> {
  size?: "sm" | "md" | "lg";
  appearance?: "primary" | "ghost" | "disabled";
}
