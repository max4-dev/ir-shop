import cn from "classnames";

import { ProductCard } from "@/src/entities/product/ui";
import { CartButton } from "@/src/features/cart/ui";
import { FavoriteButton } from "@/src/features/favorite/ui";

import styles from "./ProductList.module.css";
import { ProductListProps } from "./ProductList.props";

export const ProductList = ({ className, products, ...props }: ProductListProps) => {
  return (
    <div className={cn(className, styles.wrapper)} {...props}>
      <div className={styles.list}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            leftButtonSlot={<FavoriteButton productId={product.id} />}
            rightButtonSlot={
              <CartButton productId={product.id} disabled={!product.isAvailable} />
            }
          />
        ))}
      </div>
    </div>
  );
};
