import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface ButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  size?: "sm" | "md" | "lg";
  appearance?: "primary" | "ghost" | "disabled";
}
