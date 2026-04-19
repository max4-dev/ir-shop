import cn from "classnames";
import { Toast as RadixToast } from "radix-ui";

import styles from "./Toast.module.css";
import { ToastProps } from "./Toast.props";

export const Toast = ({
  className,
  appearance = "default",
  title,
  description,
  ...props
}: ToastProps) => {
  return (
    <RadixToast.Root className={cn(className, styles.toast, styles[appearance])} {...props}>
      {title && <RadixToast.Title>{title}</RadixToast.Title>}
      {description && (
        <RadixToast.Description className={styles.description}>
          {description}
        </RadixToast.Description>
      )}
      <div className={styles.underline} />
    </RadixToast.Root>
  );
};
