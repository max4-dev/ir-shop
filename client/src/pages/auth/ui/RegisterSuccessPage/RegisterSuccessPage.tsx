import { ROUTES } from "@/src/shared/config";
import { Card, Container, Link, Title } from "@/src/shared/ui";

import styles from "./RegisterSuccessPage.module.css";

export const RegisterSuccessPage = () => {
  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.inner}>
          <Card>
            <Title tag="h1" size="lg">
              Проверьте почту
            </Title>
            <p className={styles.text}>
              Мы отправили письмо с ссылкой для подтверждения аккаунта. После подтверждения вы
              сможете войти в магазин.
            </p>
            <p className={styles.text}>
              <Link href={ROUTES.AUTH.LOGIN}>Перейти ко входу</Link>
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
};
