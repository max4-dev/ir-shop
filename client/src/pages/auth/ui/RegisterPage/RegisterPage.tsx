import { Container } from "@/src/shared/ui";
import { RegisterWidget } from "@/src/widgets/auth/ui";

import styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
  return (
    <div className={styles.registerPage}>
      <Container>
        <div className={styles.inner}>
          <RegisterWidget />
        </div>
      </Container>
    </div>
  );
};
