import cn from "classnames";

import styles from "./Badge.module.css";
import { BadgeProps } from "./Badge.props";

export const Badge = ({ className, appearance = "default", size = "md", children, ...props }: BadgeProps) => {
  return <span className={cn(className, styles.badge, styles[appearance], styles[size])} {...props}>
    {children}
  </span>;
};
