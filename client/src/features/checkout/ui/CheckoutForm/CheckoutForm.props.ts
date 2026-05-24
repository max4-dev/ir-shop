import { Cart } from "@/src/entities/cart/api";

export interface CheckoutFormProps extends React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> {
  cart: Cart;
}
