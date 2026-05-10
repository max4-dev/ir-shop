import cn from "classnames";

import styles from "./Title.module.css";
import { TitleProps } from "./Title.props";

export const Title = ({ className, size, tag: Tag, children, ...props }: TitleProps) => {
  return (
    <Tag className={cn(className, styles[size])} {...props}>
      {children}
    </Tag>
  );
};
