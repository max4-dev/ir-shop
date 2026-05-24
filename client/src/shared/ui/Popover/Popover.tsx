import cn from "classnames";
import { Popover as PopoverPrimitive } from "radix-ui";

import styles from "./Popover.module.css";
import { PopoverAnchorProps, PopoverContentProps, PopoverProps } from "./Popover.props";

export const Popover = ({ children, ...props }: PopoverProps) => {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
};

const Anchor = ({ className, ...props }: PopoverAnchorProps) => {
  return <PopoverPrimitive.Anchor className={cn(className)} {...props} />;
};

const Content = ({ children, className, ...props }: PopoverContentProps) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content className={cn(className, styles.content)} {...props}>
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
};

Popover.Anchor = Anchor;
Popover.Content = Content;
