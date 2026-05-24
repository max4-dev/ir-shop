"use client";

import cn from "classnames";

import { Icon } from "@/src/shared/assets";
import {
  getCurrentPage,
  getPaginationRange,
  getTotalPages,
  shouldShowPagination,
} from "@/src/shared/lib";

import styles from "./Pagination.module.css";
import { PaginationProps } from "./Pagination.props";

export const Pagination = ({
  className,
  total,
  limit,
  page,
  offset,
  onPageChange,
  siblingCount = 1,
  ...props
}: PaginationProps) => {
  const totalPages = getTotalPages(total, limit);
  const currentPage = Math.min(getCurrentPage(limit, page, offset), totalPages);
  const items = getPaginationRange(currentPage, totalPages, siblingCount);

  if (!shouldShowPagination(total, limit)) return null;

  const handlePrev = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);

  return (
    <nav className={cn(className, styles.pagination)} aria-label="Пагинация" {...props}>
      <button
        type="button"
        className={styles.button}
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Предыдущая страница"
      >
        <Icon.ChevronRight className={cn(styles.icon, styles.iconPrev)} aria-hidden />
      </button>

      <div className={styles.pages}>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cn(styles.button, item === currentPage && styles.active)}
              onClick={() => onPageChange(item)}
              aria-label={`Страница ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Следующая страница"
      >
        <Icon.ChevronRight className={styles.icon} aria-hidden />
      </button>
    </nav>
  );
};
