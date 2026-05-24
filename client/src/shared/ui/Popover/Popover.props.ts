import { Popover as PopoverPrimitive } from "radix-ui";
import { ComponentPropsWithoutRef } from "react";

export interface PopoverProps extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {}

export interface PopoverAnchorProps extends ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Anchor
> {}

export interface PopoverContentProps extends ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> {}
