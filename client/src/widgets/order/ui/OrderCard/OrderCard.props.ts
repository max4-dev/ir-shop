import { Order } from "@/src/entities/order/api";

export interface OrderCardProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> {
  order: Order;
}
