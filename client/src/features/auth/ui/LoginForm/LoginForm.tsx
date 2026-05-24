"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { isHTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Link, Toast } from "@/src/shared/ui";

import { LoginDTO } from "../../api";
import { authService } from "../../model/service/auth.service";
import { authSelectors, LoginFormData, loginSchema, useAuthStore } from "../../model";

import styles from "./LoginForm.module.css";
import { LoginFormProps } from "./LoginForm.props";

export const LoginForm = ({ className }: LoginFormProps) => {
  const router = useRouter();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { showToast, toastProps } = useToast();
  const login = useAuthStore(authSelectors.login);

  const onSubmitHandler: SubmitHandler<LoginDTO> = async (data) => {
    setUnverifiedEmail(null);

    try {
      await login(data);
      router.push("/");
    } catch (error) {
      if (isHTTPError(error) && error.response.status === 403) {
        setUnverifiedEmail(data.email);
      }
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) {
      return;
    }

    setIsResending(true);
    try {
      const result = await authService.resendVerification({ email: unverifiedEmail });
      showToast(result.message, { appearance: "success" });
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form className={cn(className, styles.loginForm)} onSubmit={handleSubmit(onSubmitHandler)}>
      <Input
        {...register("email")}
        autoComplete="email"
        label="Email"
        errorMessage={errors.email?.message}
        placeholder="Введите email"
      />

      <Input.Password
        {...register("password")}
        autoComplete="current-password"
        errorMessage={errors.password?.message}
        label="Пароль"
        placeholder="Введите пароль"
      />

      <p className={styles.forgot}>
        <Link href={ROUTES.AUTH.FORGOT_PASSWORD}>Забыли пароль?</Link>
      </p>

      {unverifiedEmail && (
        <div className={styles.unverified}>
          <p>Подтвердите email. Письмо могло попасть в спам.</p>
          <Button
            type="button"
            appearance="ghost"
            disabled={isResending}
            onClick={handleResendVerification}
          >
            {isResending ? "Отправляем..." : "Отправить письмо снова"}
          </Button>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        Вход
      </Button>

      <Toast {...toastProps} />
    </form>
  );
};
