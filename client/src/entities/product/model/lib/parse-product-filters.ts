import {
  PRODUCT_PAGINATION,
  PRODUCT_PRICE_FILTER,
  PRODUCT_SEARCH,
} from "../../config";
import {
  ProductFilters,
  ProductSort,
  ProductsQueryParams,
} from "../../api/types/product.types";
import { pageToOffset } from "@/src/shared/lib";

const SORT_VALUES = new Set<string>(Object.values(ProductSort));

const parseNumber = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.trunc(parsed);
};

const parseBoolean = (value: string | null): boolean | undefined => {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
};

export const parseProductFilters = (searchParams: URLSearchParams): ProductFilters => {
  const sortRaw = searchParams.get("sort");
  const sort = sortRaw && SORT_VALUES.has(sortRaw) ? (sortRaw as ProductSort) : undefined;

  const minPrice = parseNumber(searchParams.get("minPrice"));
  const maxPrice = parseNumber(searchParams.get("maxPrice"));
  const onSale = parseBoolean(searchParams.get("onSale"));
  const pageRaw = parseNumber(searchParams.get("page"));
  const page = pageRaw !== undefined && pageRaw >= 1 ? pageRaw : undefined;

  return {
    sort,
    minPrice:
      minPrice !== undefined
        ? Math.min(Math.max(minPrice, PRODUCT_PRICE_FILTER.MIN), PRODUCT_PRICE_FILTER.MAX)
        : undefined,
    maxPrice:
      maxPrice !== undefined
        ? Math.min(Math.max(maxPrice, PRODUCT_PRICE_FILTER.MIN), PRODUCT_PRICE_FILTER.MAX)
        : undefined,
    onSale,
    page,
  };
};

export const productFiltersToQueryParams = (
  filters: ProductFilters,
  options?: { search?: string; limit?: number },
): ProductsQueryParams => {
  const limit = options?.limit ?? PRODUCT_PAGINATION.DEFAULT_LIMIT;
  const page = filters.page ?? 1;

  const params: ProductsQueryParams = {
    limit,
    offset: pageToOffset(page, limit),
  };

  if (filters.sort) params.sort = filters.sort;
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
  if (filters.onSale !== undefined) params.onSale = filters.onSale;

  const search = options?.search?.trim();
  if (search && search.length >= PRODUCT_SEARCH.MIN_LENGTH) {
    params.search = search;
  }

  return params;
};

export const buildProductFiltersSearchParams = (
  filters: ProductFilters,
  preserve?: Record<string, string | undefined>,
): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(preserve ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (filters.sort) params.set("sort", filters.sort);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.onSale !== undefined) params.set("onSale", String(filters.onSale));
  if (filters.page !== undefined && filters.page > 1) params.set("page", String(filters.page));

  return params;
};

export const mergeProductFilters = (
  current: ProductFilters,
  patch: Partial<ProductFilters>,
): ProductFilters => {
  const next: ProductFilters = { ...current };

  if ("sort" in patch) {
    if (patch.sort === undefined) delete next.sort;
    else next.sort = patch.sort;
  }

  if ("minPrice" in patch) {
    if (patch.minPrice === undefined) delete next.minPrice;
    else next.minPrice = patch.minPrice;
  }

  if ("maxPrice" in patch) {
    if (patch.maxPrice === undefined) delete next.maxPrice;
    else next.maxPrice = patch.maxPrice;
  }

  if ("onSale" in patch) {
    if (patch.onSale === undefined) delete next.onSale;
    else next.onSale = patch.onSale;
  }

  if ("page" in patch) {
    if (patch.page === undefined) delete next.page;
    else next.page = patch.page;
  }

  return next;
};

export const hasActiveProductFilters = (filters: ProductFilters): boolean =>
  filters.sort !== undefined ||
  filters.minPrice !== undefined ||
  filters.maxPrice !== undefined ||
  filters.onSale !== undefined;
