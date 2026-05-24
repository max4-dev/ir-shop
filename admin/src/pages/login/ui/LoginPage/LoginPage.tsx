import { Card } from "antd";

import { LoginForm } from "@src/features/auth";

import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <LoginForm />
      </Card>
    </div>
  );
};
