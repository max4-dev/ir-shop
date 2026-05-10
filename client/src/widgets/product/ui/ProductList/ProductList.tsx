import cn from "classnames";

import { ProductCard } from "@/src/entities/product/ui";
import { CartButton } from "@/src/features/cart/ui";

import styles from "./ProductList.module.css";
import { ProductListProps } from "./ProductList.props";

export const ProductList = ({ className, products, ...props }: ProductListProps) => {
  return (
    <div className={cn(className, styles.wrapper)} {...props}>
      <div className={styles.list}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} rightButtonSlot={<CartButton />}>
            {product.name}
          </ProductCard>
        ))}
      </div>
    </div>
  );
};
