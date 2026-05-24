"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { PRODUCT_SEARCH_MIN_LENGTH } from "@/src/entities/product/api";
import {
  flattenProductPages,
  getProductPagesMeta,
  useProductSearchInfinite,
} from "@/src/entities/product/model";
import { useProductFilters } from "@/src/features/product-filter/model";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Title } from "@/src/shared/ui";
import { ProductFilters, ProductListSection } from "@/src/widgets/product/ui";

import styles from "./SearchResultsPage.module.css";

export const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q")?.trim() ?? "";

  const { queryParams, page, limit, setPage } = useProductFilters({
    preserveParams: { q: q || undefined },
    search: q,
  });

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductSearchInfinite(q, queryParams, page);

  const products = flattenProductPages(data?.pages);
  const { total } = getProductPagesMeta(data?.pages);

  const isQueryTooShort = q.length > 0 && q.length < PRODUCT_SEARCH_MIN_LENGTH;
  const canShowCatalog = q.length >= PRODUCT_SEARCH_MIN_LENGTH && !isLoading && !isError;

  return (
    <div className={styles.page}>
      <Container>
        <Breadcrumb>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link asChild>
                <Link href="/">Главная</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Поиск</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Title className={styles.title} tag="h1" size="xl">
          {q ? `Результаты поиска: «${q}»` : "Поиск"}
        </Title>

        {isQueryTooShort && (
          <p className={styles.state}>Введите минимум {PRODUCT_SEARCH_MIN_LENGTH} символа</p>
        )}

        {!q && <p className={styles.state}>Введите запрос в строку поиска</p>}

        {isLoading && !data && q.length >= PRODUCT_SEARCH_MIN_LENGTH && (
          <p className={styles.state}>Загрузка...</p>
        )}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {canShowCatalog && data && (
          <div className={styles.layout}>
            <aside className={styles.filters}>
              <ProductFilters searchQuery={q} />
            </aside>
            <ProductListSection
              products={products}
              total={total}
              limit={limit}
              offset={queryParams.offset ?? 0}
              hasMore={hasNextPage}
              onLoadMore={() => fetchNextPage()}
              onPageChange={setPage}
              isLoadingMore={isFetchingNextPage}
              emptyMessage={`По запросу «${q}» ничего не найдено`}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
