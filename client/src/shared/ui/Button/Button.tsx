import cn from "classnames";

import styles from "./Button.module.css";
import { ButtonProps } from "./Button.props";

export const Button = ({
  className,
  size = "medium",
  appearance = "primary",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(className, styles[size], styles[appearance], styles.button)} {...props}>
      {children}
    </button>
  );
};
