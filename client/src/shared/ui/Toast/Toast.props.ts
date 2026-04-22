import { Toast as RadixToast } from "radix-ui";
import { ComponentPropsWithoutRef } from "react";

export interface ToastProps extends ComponentPropsWithoutRef<typeof RadixToast.Root> {
  appearance?: "default" | "success" | "danger";
  title?: string;
  description?: string;
}
