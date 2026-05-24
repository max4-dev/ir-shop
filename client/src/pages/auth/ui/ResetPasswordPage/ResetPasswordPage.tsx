"use client";

import { useSearchParams } from "next/navigation";

import { ROUTES } from "@/src/shared/config";
import { Card, Container, Link, Title } from "@/src/shared/ui";
import { ResetPasswordWidget } from "@/src/widgets/auth/ui";

import styles from "./ResetPasswordPage.module.css";

export const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.inner}>
          <Card>
            <Title tag="h1" size="lg">
              Новый пароль
            </Title>
            {token ? (
              <ResetPasswordWidget token={token} />
            ) : (
              <p>
                Ссылка недействительна.{" "}
                <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>Запросить снова</Link>
              </p>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
};
