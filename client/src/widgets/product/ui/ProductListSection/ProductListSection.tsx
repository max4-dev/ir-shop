"use client";

import cn from "classnames";

import { LoadMoreProductsButton } from "@/src/features/product-catalog/ui";
import { hasMoreProducts } from "@/src/shared/lib";
import { Pagination } from "@/src/shared/ui";

import { ProductList } from "../ProductList/ProductList";
import styles from "./ProductListSection.module.css";
import { ProductListSectionProps } from "./ProductListSection.props";

export const ProductListSection = ({
  className,
  products,
  total,
  limit,
  offset,
  hasMore,
  onLoadMore,
  onPageChange,
  isLoadingMore,
  emptyMessage = "Товары не найдены",
}: ProductListSectionProps) => {
  if (products.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  const showLoadMore = hasMore && hasMoreProducts(products.length, total);

  return (
    <div className={cn(className, styles.section)}>
      <ProductList products={products} />
      {showLoadMore && (
        <div className={styles.loadMore}>
          <LoadMoreProductsButton onClick={onLoadMore} isLoading={isLoadingMore} />
        </div>
      )}
      <Pagination
        className={styles.pagination}
        total={total}
        limit={limit}
        offset={offset}
        onPageChange={onPageChange}
      />
    </div>
  );
};
