import { Separator as RadixSeparator } from "radix-ui";
import { ComponentPropsWithoutRef } from "react";

export interface SeparatorProps extends ComponentPropsWithoutRef<typeof RadixSeparator.Root> {
  indents: "none" | "sm" | "md" | "lg";
}
