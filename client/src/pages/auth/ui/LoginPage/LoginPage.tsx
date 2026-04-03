import { LoginWidget } from "@/src/widgets/auth/ui";

import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <div className="container">
        <div className={styles.inner}>
          <LoginWidget />
        </div>
      </div>
    </div>
  );
};
