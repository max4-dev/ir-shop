import { DropdownMenu } from "radix-ui";
import { ComponentPropsWithoutRef } from "react";

export interface DropdownProps extends ComponentPropsWithoutRef<typeof DropdownMenu.Root> {}

export interface DropdownTriggerProps extends ComponentPropsWithoutRef<
  typeof DropdownMenu.Trigger
> {}

export interface DropdownContentProps extends ComponentPropsWithoutRef<
  typeof DropdownMenu.Content
> {}

export interface DropdownItemProps extends ComponentPropsWithoutRef<typeof DropdownMenu.Item> {}

export interface DropdownSubProps extends ComponentPropsWithoutRef<typeof DropdownMenu.Sub> {}

export interface DropdownSubTriggerProps extends ComponentPropsWithoutRef<
  typeof DropdownMenu.SubTrigger
> {}

export interface DropdownSubContentProps extends ComponentPropsWithoutRef<
  typeof DropdownMenu.SubContent
> {}

export interface DropdownSeparatorProps extends ComponentPropsWithoutRef<
  typeof DropdownMenu.Separator
> {}
