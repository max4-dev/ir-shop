import { RegisterWidget } from "@/src/widgets/auth/ui";

import styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
  return (
    <div className={styles.registerPage}>
      <div className="container">
        <div className={styles.inner}>
          <RegisterWidget />
        </div>
      </div>
    </div>
  );
};
