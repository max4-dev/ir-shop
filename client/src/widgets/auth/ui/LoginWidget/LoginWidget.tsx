import cn from "classnames";

import { LoginForm } from "@/src/features/auth/ui";
import { Card, Link } from "@/src/shared/ui";

import styles from "./LoginWidget.module.css";
import { LoginWidgetProps } from "./LoginWidget.props";

export const LoginWidget = ({ className, ...props }: LoginWidgetProps) => {
  return (
    <Card className={cn(className, styles.login)} {...props}>
      <div className={styles.subtitle}>
        С возвращением! <p>Пожалуйста, войдите в свой аккаунт.</p>
      </div>
      <LoginForm />
      <p className={styles.agreement}>
        Нажимая на кнопку, я соглашаюсь с{" "}
        <Link href="/privacypolicy">Политикой конфиденциальности</Link>
      </p>
      <p className={styles.register}>
        У вас нет аккаунта? <Link href="/register">Регистрация</Link>
      </p>
    </Card>
  );
};
