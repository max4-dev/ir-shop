import { ROUTES } from "@/src/shared/config";
import { Link, Title } from "@/src/shared/ui";

import styles from "./CartEmpty.module.css";

export const CartEmpty = () => {
  return (
    <div className={styles.empty}>
      <Title className={styles.title} tag="h2" size="lg">
        Корзина пуста
      </Title>
      <p className={styles.text}>Добавьте товары из каталога — они появятся здесь</p>
      <Link href={ROUTES.PRODUCTS.ALL} appearance="primary" className={styles.link}>
        Перейти в каталог
      </Link>
    </div>
  );
};
