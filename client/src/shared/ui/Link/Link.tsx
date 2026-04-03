import cn from "classnames";
import NextLink from "next/link";

import styles from "./Link.module.css";
import { LinkProps } from "./Link.props";

export const Link = ({
  className,
  size = "medium",
  appearance = "text",
  children,
  ...props
}: LinkProps) => {
  return (
    <NextLink className={cn(className, styles[size], styles[appearance], styles.link)} {...props}>
      {children}
    </NextLink>
  );
};
