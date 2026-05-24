"use client";

import cn from "classnames";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ROUTES } from "@/src/shared/config";

import styles from "./ProductCategoryFilter.module.css";
import { ProductCategoryFilterProps } from "./ProductCategoryFilter.props";

const buildHref = (path: string, searchParams: URLSearchParams | null) => {
  const query = searchParams?.toString();
  return query ? `${path}?${query}` : path;
};

export const ProductCategoryFilter = ({
  className,
  categories,
  activeSlug,
}: ProductCategoryFilterProps) => {
  const searchParams = useSearchParams();
  const isAllActive = !activeSlug;

  return (
    <nav className={cn(className, styles.list)} aria-label="Категории">
      <Link
        href={buildHref(ROUTES.PRODUCTS.ALL, searchParams)}
        className={cn(styles.link, styles.all, isAllActive && styles.linkActive)}
      >
        Все категории
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildHref(ROUTES.PRODUCTS.BY_CATEGORY(category.slug), searchParams)}
          className={cn(styles.link, activeSlug === category.slug && styles.linkActive)}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
};
