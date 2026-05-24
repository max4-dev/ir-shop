"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";

import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Toast } from "@/src/shared/ui";

import { authService } from "../../model/service/auth.service";
import { ForgotPasswordFormData, forgotPasswordSchema } from "../../model";

import styles from "./ForgotPasswordForm.module.css";
import { ForgotPasswordFormProps } from "./ForgotPasswordForm.props";

export const ForgotPasswordForm = ({ className }: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { showToast, toastProps } = useToast();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      const result = await authService.forgotPassword(data);
      showToast(result.message, { appearance: "success" });
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <form className={cn(className, styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        type="email"
        autoComplete="email"
        label="Email"
        placeholder="Введите email"
        errorMessage={errors.email?.message}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправляем..." : "Отправить ссылку"}
      </Button>
      <Toast {...toastProps} />
    </form>
  );
};
