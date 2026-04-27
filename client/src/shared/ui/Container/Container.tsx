import cn from "classnames";

import styles from "./Container.module.css";
import { ContainerProps } from "./Container.props";

export const Container = ({ className, children, ...props }: ContainerProps) => {
  return <div className={cn(className, styles.container)} {...props}>{children}</div>;
};
