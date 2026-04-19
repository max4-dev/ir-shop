"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { getErrorMessage, useToast } from "@/src/shared/lib";
import { Button, Input, Toast } from "@/src/shared/ui";

import { authQuery } from "../../api";
import { LoginDTO, loginSchema } from "../../model";

import styles from "./LoginForm.module.css";
import { LoginFormProps } from "./LoginForm.props";

export const LoginForm = ({ className }: LoginFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
  });
  const { showToast, toastProps } = useToast();

  const onSubmitHandler: SubmitHandler<LoginDTO> = async (data) => {
    try {
      await authQuery.login(data);
      router.push("/");
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
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

      <Button type="submit" disabled={isSubmitting}>
        Вход
      </Button>

      <Toast {...toastProps} />
    </form>
  );
};
