export type PaginationItem = number | "ellipsis";

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

export const getCurrentPage = (limit: number, page?: number, offset?: number): number => {
  if (page !== undefined) return Math.max(1, page);
  if (offset !== undefined) return Math.floor(offset / limit) + 1;
  return 1;
};

export const getTotalPages = (total: number, limit: number): number =>
  Math.max(1, Math.ceil(total / limit));

export const shouldShowPagination = (total: number, limit: number): boolean => total > limit;

export const pageToOffset = (page: number, limit: number): number =>
  (Math.max(1, page) - 1) * limit;

export const hasMoreProducts = (loadedCount: number, total: number): boolean =>
  loadedCount < total;

export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] => {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(1, leftCount), "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblingCount;
    return [1, "ellipsis", ...range(totalPages - rightCount + 1, totalPages)];
  }

  return [1, "ellipsis", ...range(leftSibling, rightSibling), "ellipsis", totalPages];
};
