import { CartItem } from "@/src/entities/cart/api";

export interface CartItemListProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  items: CartItem[];
}
