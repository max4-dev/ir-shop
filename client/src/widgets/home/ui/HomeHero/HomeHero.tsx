import { HOME_PRODUCT_LIST_ROUTES } from "@/src/entities/product/config";
import { Link, Title } from "@/src/shared/ui";

import styles from "./HomeHero.module.css";

export const HomeHero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.label}>Интернет-магазин</p>
        <Title className={styles.title} tag="h1" size="xl">
          Стиль и комфорт каждый день
        </Title>
        <p className={styles.description}>
          Подборка популярных товаров, новинок и коллекций по категориям — всё в одном месте.
        </p>
        <Link href={HOME_PRODUCT_LIST_ROUTES.all} appearance="primary" size="small" className={styles.cta}>
          Перейти в каталог
        </Link>
      </div>
    </section>
  );
};
