"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { authService } from "@/src/features/auth/model/service/auth.service";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Card, Container, Link, Title, Toast } from "@/src/shared/ui";

import styles from "./VerifyEmailPage.module.css";

export const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;
  const { showToast, toastProps } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Подтверждаем email...");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("Ссылка недействительна");
      return;
    }

    startedRef.current = true;

    const verify = async () => {
      try {
        const result = await authService.verifyEmail({ token });
        setStatus("success");
        setMessage(result.message);
        showToast(result.message, { appearance: "success" });
        router.replace(ROUTES.AUTH.LOGIN);
      } catch (error) {
        setStatus("error");
        setMessage(getErrorMessage(error));
        showToast(getErrorMessage(error), { appearance: "danger" });
      }
    };

    void verify();
  }, [token, router, showToast]);

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.inner}>
          <Card>
            <Title tag="h1" size="lg">
              Подтверждение email
            </Title>
            <p className={styles.state}>{message}</p>
            {status !== "loading" && (
              <p>
                <Link href={ROUTES.AUTH.LOGIN}>Перейти ко входу</Link>
              </p>
            )}
          </Card>
        </div>
      </Container>
      <Toast {...toastProps} />
    </div>
  );
};
