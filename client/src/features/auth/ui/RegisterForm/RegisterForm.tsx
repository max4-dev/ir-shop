"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { getErrorMessage, useToast } from "@/src/shared/lib";
import { Button, Input, Toast } from "@/src/shared/ui";

import { RegisterDTO } from "../../api";
import { authSelectors, RegisterFormData, registerSchema, useAuthStore } from "../../model";

import styles from "./RegisterForm.module.css";
import { RegisterFormProps } from "./RegisterForm.props";

export const RegisterForm = ({ className }: RegisterFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const { showToast, toastProps } = useToast();
  const handleRegister = useAuthStore(authSelectors.register);

  const onSubmitHandler: SubmitHandler<RegisterDTO> = async (data) => {
    try {
      await handleRegister(data);
      router.push("/");
    } catch (error) {
      showToast(getErrorMessage(error), {
        appearance: "danger",
      });
    }
  };

  return (
    <form className={cn(className, styles.registerForm)} onSubmit={handleSubmit(onSubmitHandler)}>
      <Input
        {...register("email")}
        autoComplete="email"
        label="Email"
        errorMessage={errors.email?.message}
        placeholder="Введите email"
      />

      <Input
        {...register("name")}
        autoComplete="name"
        label="Имя"
        errorMessage={errors.name?.message}
        placeholder="Введите имя"
      />

      <Input.Password
        {...register("password")}
        autoComplete="current-password"
        errorMessage={errors.password?.message}
        label="Пароль"
        placeholder="Введите пароль"
      />

      <Button type="submit" disabled={isSubmitting}>
        Регистрация
      </Button>

      <Toast {...toastProps} />
    </form>
  );
};
