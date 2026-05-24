"use client";

import Link from "next/link";

import { useFavorites } from "@/src/entities/favorite/model";
import { ClearFavoritesButton } from "@/src/features/favorite/ui";
import { getErrorMessage } from "@/src/shared/lib";
import { Breadcrumb, Container, Title } from "@/src/shared/ui";
import { FavoriteEmpty } from "@/src/widgets/favorite/ui";
import { ProductList } from "@/src/widgets/product/ui";

import styles from "./FavoritesPage.module.css";

export const FavoritesPage = () => {
  const { data: favorites, isLoading, isError, error } = useFavorites();

  const products = favorites?.items.map((item) => item.product) ?? [];
  const isEmpty = !isLoading && products.length === 0;

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
              <Breadcrumb.Page>Избранное</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>

        <div className={styles.titleRow}>
          <Title className={styles.title} tag="h1" size="xl">
            Избранное
          </Title>
          {products.length > 0 && <ClearFavoritesButton />}
        </div>

        {isLoading && <p className={styles.state}>Загрузка...</p>}

        {isError && <p className={styles.state}>{getErrorMessage(error)}</p>}

        {isEmpty && <FavoriteEmpty />}

        {products.length > 0 && <ProductList products={products} />}
      </Container>
    </div>
  );
};
