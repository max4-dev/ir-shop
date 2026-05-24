import { Cart } from "@/src/entities/cart/api";

export interface CheckoutSummaryProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  cart: Cart;
}
