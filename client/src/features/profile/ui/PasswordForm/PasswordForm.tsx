"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { useUpdatePassword } from "@/src/entities/user/model";
import { useAuthStore } from "@/src/features/auth/model";
import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Toast } from "@/src/shared/ui";

import { PasswordFormData, passwordSchema } from "../../model";

import styles from "./PasswordForm.module.css";
import { PasswordFormProps } from "./PasswordForm.props";

export const PasswordForm = ({ className }: PasswordFormProps) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useUpdatePassword();
  const logout = useAuthStore((state) => state.logout);
  const { showToast, toastProps } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      await mutateAsync({
        password: data.password,
        newPassword: data.newPassword,
      });
      reset();
      await logout();
      showToast("Пароль изменён. Войдите с новым паролем", { appearance: "success" });
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <form className={cn(className, styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <p className={styles.hint}>После смены пароля потребуется повторный вход.</p>

      <Input.Password
        {...register("password")}
        label="Текущий пароль"
        autoComplete="current-password"
        placeholder="Текущий пароль"
        errorMessage={errors.password?.message}
      />
      <Input.Password
        {...register("newPassword")}
        label="Новый пароль"
        autoComplete="new-password"
        placeholder="Новый пароль"
        errorMessage={errors.newPassword?.message}
      />
      <Input.Password
        {...register("confirmPassword")}
        label="Повторите новый пароль"
        autoComplete="new-password"
        placeholder="Повторите пароль"
        errorMessage={errors.confirmPassword?.message}
      />

      <Button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Сохраняем..." : "Сменить пароль"}
      </Button>
      <Toast {...toastProps} />
    </form>
  );
};
