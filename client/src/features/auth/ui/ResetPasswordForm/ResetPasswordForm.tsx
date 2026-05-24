"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { ROUTES } from "@/src/shared/config";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Toast } from "@/src/shared/ui";

import { authService } from "../../model/service/auth.service";
import { ResetPasswordFormData, resetPasswordSchema } from "../../model";

import styles from "./ResetPasswordForm.module.css";
import { ResetPasswordFormProps } from "./ResetPasswordForm.props";

export const ResetPasswordForm = ({ className, token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const { showToast, toastProps } = useToast();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      const result = await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      });
      showToast(result.message, { appearance: "success" });
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <form className={cn(className, styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <Input.Password
        {...register("newPassword")}
        label="Новый пароль"
        autoComplete="new-password"
        placeholder="Новый пароль"
        errorMessage={errors.newPassword?.message}
      />
      <Input.Password
        {...register("confirmPassword")}
        label="Повторите пароль"
        autoComplete="new-password"
        placeholder="Повторите пароль"
        errorMessage={errors.confirmPassword?.message}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Сохраняем..." : "Сменить пароль"}
      </Button>
      <Toast {...toastProps} />
    </form>
  );
};
