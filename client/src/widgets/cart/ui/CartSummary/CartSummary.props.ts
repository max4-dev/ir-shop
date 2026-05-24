import { Cart } from "@/src/entities/cart/api";

export interface CartSummaryProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  cart: Cart;
}
