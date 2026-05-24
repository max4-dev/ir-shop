"use client";

import Link from "next/link";

import {
  flattenProductPages,
  getProductPagesMeta,
  useProductsByCategoryInfinite,
} from "@/src/entities/product/model";
import { useProductFilters } from "@/src/features/product-filter/model";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Title } from "@/src/shared/ui";
import { ProductFilters, ProductListSection } from "@/src/widgets/product/ui";

import styles from "./ProductsByCategoryPage.module.css";

export const ProductsByCategoryPage = ({ category }: { category: string }) => {
  const { queryParams, page, limit, setPage } = useProductFilters();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsByCategoryInfinite(category, queryParams, page);

  const products = flattenProductPages(data?.pages);
  const { total } = getProductPagesMeta(data?.pages);

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
              <Breadcrumb.Link asChild>
                <Link href={ROUTES.PRODUCTS.ALL}>Все продукты</Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>{data?.pages[0]?.category.name ?? category}</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <Title className={styles.title} tag="h1" size="xl">
          {data?.pages[0]?.category.name ?? "Категория"}
        </Title>

        {isLoading && !data && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {data && (
          <div className={styles.layout}>
            <aside className={styles.filters}>
              <ProductFilters activeCategorySlug={category} />
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
            />
          </div>
        )}
      </Container>
    </div>
  );
};
