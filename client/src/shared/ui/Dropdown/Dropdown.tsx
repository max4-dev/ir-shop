import cn from "classnames";
import { DropdownMenu } from "radix-ui";

import styles from "./Dropdown.module.css";
import {
  DropdownContentProps,
  DropdownItemProps,
  DropdownProps,
  DropdownSeparatorProps,
  DropdownSubContentProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownTriggerProps,
} from "./Dropdown.props";

export const Dropdown = ({ children, ...props }: DropdownProps) => {
  return <DropdownMenu.Root {...props}>{children}</DropdownMenu.Root>;
};

const Trigger = ({ className, children, ...props }: DropdownTriggerProps) => {
  return (
    <DropdownMenu.Trigger className={cn(className, styles.trigger)} {...props}>
      {children}
    </DropdownMenu.Trigger>
  );
};

const Content = ({ children, className, ...props }: DropdownContentProps) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content className={cn(className, styles.content)} {...props}>
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};

const Item = ({ children, className, ...props }: DropdownItemProps) => {
  return (
    <DropdownMenu.Item className={cn(className, styles.item)} {...props}>
      {children}
    </DropdownMenu.Item>
  );
};

const Sub = ({ children, ...props }: DropdownSubProps) => {
  return <DropdownMenu.Sub {...props}>{children}</DropdownMenu.Sub>;
};

const SubTrigger = ({ children, className, ...props }: DropdownSubTriggerProps) => {
  return (
    <DropdownMenu.SubTrigger className={cn(className, styles.subTrigger)} {...props}>
      {children}
    </DropdownMenu.SubTrigger>
  );
};

const SubContent = ({ children, className, ...props }: DropdownSubContentProps) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.SubContent className={cn(className, styles.subContent)} {...props}>
        {children}
      </DropdownMenu.SubContent>
    </DropdownMenu.Portal>
  );
};

const Separator = ({ children, className, ...props }: DropdownSeparatorProps) => {
  return (
    <DropdownMenu.Separator className={cn(className, styles.separator)} {...props}>
      {children}
    </DropdownMenu.Separator>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Item = Item;
Dropdown.Sub = Sub;
Dropdown.SubTrigger = SubTrigger;
Dropdown.SubContent = SubContent;
Dropdown.Separator = Separator;
