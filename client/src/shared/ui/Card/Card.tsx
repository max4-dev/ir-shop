import cn from "classnames";

import styles from "./Card.module.css";
import { CardProps } from "./Card.props";

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn(className, styles.card)} {...props}>
      {children}
    </div>
  );
};
