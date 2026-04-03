import cn from "classnames";

import { RegisterForm } from "@/src/features/auth/ui";
import { Card, Link } from "@/src/shared/ui";

import styles from "./RegisterWidget.module.css";
import { RegisterWidgetProps } from "./RegisterWidget.props";

export const RegisterWidget = ({ className, ...props }: RegisterWidgetProps) => {
  return (
    <Card className={cn(className, styles.register)} {...props}>
      <div className={styles.subtitle}>
        Добро пожаловать! <p>Пожалуйста, зарегистрируйтесь.</p>
      </div>
      <RegisterForm />
      <p className={styles.agreement}>
        Нажимая на кнопку, я соглашаюсь с{" "}
        <Link href="/privacypolicy">Политикой конфиденциальности</Link>
      </p>
      <p className={styles.login}>
        У вас есть аккаунт? <Link href="/login">Вход</Link>
      </p>
    </Card>
  );
};
