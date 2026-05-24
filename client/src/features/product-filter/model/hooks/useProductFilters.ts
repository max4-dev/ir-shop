"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { PRODUCT_PAGINATION } from "@/src/entities/product/config";
import {
  ProductFilters,
  ProductsQueryParams,
} from "@/src/entities/product/api/types/product.types";
import {
  buildProductFiltersSearchParams,
  hasActiveProductFilters,
  mergeProductFilters,
  parseProductFilters,
  productFiltersToQueryParams,
} from "@/src/entities/product/model";

type UseProductFiltersOptions = {
  preserveParams?: Record<string, string | undefined>;
  limit?: number;
  search?: string;
};

export const useProductFilters = (options?: UseProductFiltersOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const limit = options?.limit ?? PRODUCT_PAGINATION.DEFAULT_LIMIT;

  const filters = useMemo(
    () => parseProductFilters(searchParams ?? new URLSearchParams()),
    [searchParams],
  );

  const queryParams = useMemo(
    () =>
      productFiltersToQueryParams(filters, {
        search: options?.search,
        limit,
      }),
    [filters, limit, options?.search],
  );

  const isActive = hasActiveProductFilters(filters);
  const page = filters.page ?? 1;

  const updateUrl = useCallback(
    (nextFilters: ProductFilters) => {
      if (!pathname) return;

      const params = buildProductFiltersSearchParams(nextFilters, options?.preserveParams);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [options?.preserveParams, pathname, router],
  );

  const setFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      const next = mergeProductFilters(filters, patch);

      if (!("page" in patch)) {
        delete next.page;
      }

      updateUrl(next);
    },
    [filters, updateUrl],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      updateUrl(mergeProductFilters(filters, { page: nextPage }));
    },
    [filters, updateUrl],
  );

  const resetFilters = useCallback(() => {
    updateUrl({});
  }, [updateUrl]);

  return {
    filters,
    queryParams,
    page,
    limit,
    isActive,
    setFilters,
    setPage,
    resetFilters,
  };
};
