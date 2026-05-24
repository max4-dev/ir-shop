import { CartItem as CartItemType } from "@/src/entities/cart/api";

export interface CartItemProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> {
  item: CartItemType;
}
