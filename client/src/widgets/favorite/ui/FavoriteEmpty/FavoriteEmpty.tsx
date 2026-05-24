import { ROUTES } from "@/src/shared/config";
import { Link, Title } from "@/src/shared/ui";

import styles from "./FavoriteEmpty.module.css";

export const FavoriteEmpty = () => {
  return (
    <div className={styles.empty}>
      <Title className={styles.title} tag="h2" size="lg">
        Избранное пусто
      </Title>
      <p className={styles.text}>Добавляйте товары в избранное — они появятся здесь</p>
      <Link href={ROUTES.PRODUCTS.ALL} appearance="primary" className={styles.link}>
        Перейти в каталог
      </Link>
    </div>
  );
};
