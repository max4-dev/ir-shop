import { Container } from "@/src/shared/ui";
import { ForgotPasswordWidget } from "@/src/widgets/auth/ui";

import styles from "./ForgotPasswordPage.module.css";

export const ForgotPasswordPage = () => {
  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.inner}>
          <ForgotPasswordWidget />
        </div>
      </Container>
    </div>
  );
};
