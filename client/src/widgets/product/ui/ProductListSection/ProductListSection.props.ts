import { Product } from "@/src/entities/product/api";

export interface ProductListSectionProps {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  onLoadMore: () => void;
  onPageChange: (page: number) => void;
  isLoadingMore?: boolean;
  emptyMessage?: string;
  className?: string;
}
