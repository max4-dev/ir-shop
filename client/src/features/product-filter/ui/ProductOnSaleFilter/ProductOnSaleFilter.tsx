"use client";

import cn from "classnames";

import styles from "./ProductOnSaleFilter.module.css";
import { ProductOnSaleFilterProps } from "./ProductOnSaleFilter.props";

export const ProductOnSaleFilter = ({ className, checked, onChange }: ProductOnSaleFilterProps) => {
  return (
    <label className={cn(className, styles.label)}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked ?? false}
        onChange={(e) => onChange(e.target.checked ? true : undefined)}
      />
      Только со скидкой
    </label>
  );
};
