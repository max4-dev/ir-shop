import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/src/shared/config";
import { formatPrice } from "@/src/shared/lib";
import { Badge, Title } from "@/src/shared/ui";

import styles from "./ProductCard.module.css";
import { ProductCardProps } from "./ProductCard.props";

export const ProductCard = ({
  className,
  product,
  rightButtonSlot,
  ...props
}: ProductCardProps) => {
  return (
    <article className={cn(className, styles.card)} {...props}>
      <div className={styles.slots}>
        <div className={styles.rightSlot}>{rightButtonSlot}</div>
      </div>
      <Image
        className={styles.image}
        src={product.image}
        alt={product.name}
        width={295}
        height={298}
      />
      <main className={styles.content}>
        <Title className={styles.title} size="md" tag="h4">
          <Link href={ROUTES.PRODUCTS.DETAIL(product.slug)}>{product.name}</Link>
        </Title>
        <div className={styles.categories}>
          {product.categories.map((category) => (
            <Link href={ROUTES.PRODUCTS.BY_CATEGORY(category.slug)} key={category.id}>
              <Badge>{category.name}</Badge>
            </Link>
          ))}
        </div>
        <div className={styles.priceBox}>
          {product.salePercent > 0 ? (
            <>
              <span className={styles.price}>{formatPrice(product.priceWithSale)}</span>
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
              <Badge appearance="danger">{`-${product.salePercent}%`}</Badge>
            </>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
        </div>
      </main>
    </article>
  );
};
