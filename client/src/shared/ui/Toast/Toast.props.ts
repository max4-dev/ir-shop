import { Toast as RadixToast } from "radix-ui";

export interface ToastProps extends React.ComponentProps<typeof RadixToast.Root> {
  appearance?: "default" | "success" | "danger";
  title?: string;
  description?: string;
}
