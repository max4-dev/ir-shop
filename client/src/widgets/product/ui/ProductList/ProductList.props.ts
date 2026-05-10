import { Product } from "@/src/entities/product/api";

export interface ProductListProps extends React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  products: Product[];
}