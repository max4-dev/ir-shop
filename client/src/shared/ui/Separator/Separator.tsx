import cn from "classnames";
import { Separator as RadixSeparator } from "radix-ui";

import styles from "./Separator.module.css";
import { SeparatorProps } from "./Separator.props";

export const Separator = ({ className, indents = "none", ...props }: SeparatorProps) => {
  return (
    <RadixSeparator.Root className={cn(className, styles.separator, styles[indents])} {...props} />
  );
};
