import { Container } from "@/src/shared/ui";
import { LoginWidget } from "@/src/widgets/auth/ui";

import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <Container>
        <div className={styles.inner}>
          <LoginWidget />
        </div>
      </Container>
    </div>
  );
};
