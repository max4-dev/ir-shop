import { ROUTES } from "@/src/shared/config";
import { Container, Link, Title } from "@/src/shared/ui";

import styles from "./NotFoundPage.module.css";

export const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <Container>
        <p className={styles.code} aria-hidden>
          404
        </p>
        <Title className={styles.title} tag="h1" size="xl">
          Страница не найдена
        </Title>
        <p className={styles.text}>
          Возможно, ссылка устарела или страница была удалена. Проверьте адрес или вернитесь на
          главную.
        </p>
        <div className={styles.actions}>
          <Link href="/" appearance="primary" className={styles.link}>
            На главную
          </Link>
          <Link href={ROUTES.PRODUCTS.ALL} appearance="ghost" className={styles.link}>
            В каталог
          </Link>
        </div>
      </Container>
    </div>
  );
};
