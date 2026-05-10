import cn from "classnames";

import { Icon } from "@/src/shared/assets";

import styles from "./CartButton.module.css";
import { CartButtonProps } from "./CartButton.props";

export const CartButton = ({ className, ...props }: CartButtonProps) => {
  return (
    <button className={cn(className, styles.button)} {...props}>
      <Icon.Cart className={styles.icon} />
    </button>
  );
};
