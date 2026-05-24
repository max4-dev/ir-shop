"use client";

import cn from "classnames";
import { useCallback } from "react";

import { useCategories } from "@/src/entities/category/model";
import { useProductFilters } from "@/src/features/product-filter/model";
import {
  ClearProductFiltersButton,
  ProductCategoryFilter,
  ProductOnSaleFilter,
  ProductPriceFilter,
  ProductSortFilter,
} from "@/src/features/product-filter/ui";
import { Card, Separator, Title } from "@/src/shared/ui";

import styles from "./ProductFilters.module.css";
import { ProductFiltersProps } from "./ProductFilters.props";

export const ProductFilters = ({
  className,
  activeCategorySlug,
  showCategories = true,
  searchQuery,
}: ProductFiltersProps) => {
  const { data: categoriesData } = useCategories();
  const { filters, isActive, setFilters, resetFilters } = useProductFilters({
    preserveParams: searchQuery ? { q: searchQuery } : undefined,
  });

  const handlePriceChange = useCallback(
    (range: { minPrice?: number; maxPrice?: number }) => {
      setFilters(range);
    },
    [setFilters]
  );

  return (
    <Card className={cn(className, styles.filters)}>
      <Title className={styles.title} tag="h2" size="lg">
        Фильтры
      </Title>

      {showCategories && categoriesData && categoriesData.length > 0 && (
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Категория</span>
          <ProductCategoryFilter categories={categoriesData} activeSlug={activeCategorySlug} />
          <Separator indents="none" />
        </section>
      )}

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Сортировка</span>
        <ProductSortFilter value={filters.sort} onChange={(sort) => setFilters({ sort })} />
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Цена</span>
        <ProductPriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={handlePriceChange}
        />
      </section>

      <section className={styles.section}>
        <ProductOnSaleFilter
          checked={filters.onSale}
          onChange={(onSale) => setFilters({ onSale })}
        />
      </section>

      {isActive && (
        <div className={styles.actions}>
          <ClearProductFiltersButton onClick={resetFilters} />
        </div>
      )}
    </Card>
  );
};
