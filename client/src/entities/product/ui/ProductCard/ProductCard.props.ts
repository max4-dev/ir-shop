import { DetailedHTMLProps, HTMLAttributes } from "react";

import { Product } from "../../api";

export interface ProductCardProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> {
  product: Product;
  rightButtonSlot?: React.ReactNode;
}
