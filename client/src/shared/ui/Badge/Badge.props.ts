import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface BadgeProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> {
  appearance?: "default" | "success" | "danger";
  size?: "sm" | "md" | "lg";
}
