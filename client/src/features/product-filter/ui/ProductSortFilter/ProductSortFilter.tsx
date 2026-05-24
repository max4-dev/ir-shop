"use client";

import cn from "classnames";

import {
  PRODUCT_SORT_LABELS,
  PRODUCT_SORT_OPTIONS,
} from "@/src/entities/product/config";
import { ProductSort } from "@/src/entities/product/api/types/product.types";
import { Icon } from "@/src/shared/assets";
import { Dropdown } from "@/src/shared/ui";

import styles from "./ProductSortFilter.module.css";
import { ProductSortFilterProps } from "./ProductSortFilter.props";

export const ProductSortFilter = ({ className, value, onChange }: ProductSortFilterProps) => {
  const label = value ? PRODUCT_SORT_LABELS[value] : "По умолчанию";

  return (
    <Dropdown>
      <Dropdown.Trigger className={cn(className, styles.trigger)}>
        {label}
        <Icon.ChevronRight className={styles.chevron} aria-hidden />
      </Dropdown.Trigger>
      <Dropdown.Content align="start">
        <Dropdown.Item onSelect={() => onChange(undefined)}>По умолчанию</Dropdown.Item>
        {PRODUCT_SORT_OPTIONS.map((sort) => (
          <Dropdown.Item key={sort} onSelect={() => onChange(sort as ProductSort)}>
            {PRODUCT_SORT_LABELS[sort]}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  );
};
