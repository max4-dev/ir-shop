import cn from "classnames";

import { ForgotPasswordForm } from "@/src/features/auth/ui";
import { ROUTES } from "@/src/shared/config";
import { Card, Link, Title } from "@/src/shared/ui";

import styles from "./ForgotPasswordWidget.module.css";
import { ForgotPasswordWidgetProps } from "./ForgotPasswordWidget.props";

export const ForgotPasswordWidget = ({ className, ...props }: ForgotPasswordWidgetProps) => {
  return (
    <Card className={cn(className, styles.widget)} {...props}>
      <Title tag="h1" size="lg">
        Восстановление пароля
      </Title>
      <p className={styles.hint}>Введите email — мы отправим ссылку для сброса пароля.</p>
      <ForgotPasswordForm />
      <p className={styles.back}>
        <Link href={ROUTES.AUTH.LOGIN}>Вернуться ко входу</Link>
      </p>
    </Card>
  );
};
