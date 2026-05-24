"use client";

import { ProductSort } from "@/src/entities/product/api/types/product.types";
import {
  HOME_PRODUCT_LIST_ROUTES,
  HOME_SLIDER_LIMIT,
} from "@/src/entities/product/config";
import { useProducts } from "@/src/entities/product/model";
import { useHomeCategorySliders } from "@/src/features/home/model";
import { ROUTES } from "@/src/shared/config";
import { Container } from "@/src/shared/ui";
import { HomeHero } from "@/src/widgets/home/ui";
import { ProductSlider } from "@/src/widgets/product/ui";

import styles from "./HomePage.module.css";

export const HomePage = () => {
  const { data: popularData, isLoading: isPopularLoading } = useProducts({
    limit: HOME_SLIDER_LIMIT,
    sort: ProductSort.Popularity,
  });

  const { data: newestData, isLoading: isNewestLoading } = useProducts({
    limit: HOME_SLIDER_LIMIT,
    sort: ProductSort.Newest,
  });

  const { sliders: categorySliders, isProductsLoading: isCategoryProductsLoading } =
    useHomeCategorySliders();

  const isInitialLoading = isPopularLoading || isNewestLoading || isCategoryProductsLoading;

  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <HomeHero />

        {isInitialLoading && <p className={styles.state}>Загрузка...</p>}

        {popularData && popularData.products.length > 0 && (
          <ProductSlider
            className={styles.section}
            title="Популярные товары"
            products={popularData.products}
            moreHref={HOME_PRODUCT_LIST_ROUTES.popular}
            moreLabel="Все популярные"
          />
        )}

        {newestData && newestData.products.length > 0 && (
          <ProductSlider
            className={styles.section}
            title="Новинки"
            products={newestData.products}
            moreHref={HOME_PRODUCT_LIST_ROUTES.newest}
            moreLabel="Все новинки"
          />
        )}

        {categorySliders.map(({ category, products }) => (
          <ProductSlider
            key={category.id}
            className={styles.section}
            title={category.name}
            products={products}
            moreHref={ROUTES.PRODUCTS.BY_CATEGORY(category.slug)}
            moreLabel={`Все в «${category.name}»`}
          />
        ))}
      </Container>
    </div>
  );
};
