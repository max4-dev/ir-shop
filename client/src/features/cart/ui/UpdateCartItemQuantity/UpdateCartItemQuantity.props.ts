export interface UpdateCartItemQuantityProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  productId: string;
  quantity: number;
  availableCount: number;
}
