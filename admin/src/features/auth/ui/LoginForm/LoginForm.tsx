import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Typography, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { ROUTES } from "@src/shared/config";
import { getErrorMessage } from "@src/shared/lib";

import type { LoginDTO } from "../../api";
import { authSelectors, loginSchema, useAuthStore } from "../../model";
import type { LoginFormData } from "../../model";

import styles from "./LoginForm.module.css";

export const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore(authSelectors.login);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginDTO) => {
    try {
      await login(data);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.form}>
      <Typography.Title level={3} className={styles.title}>
        Вход в админ-панель
      </Typography.Title>
      <Typography.Paragraph type="secondary" className={styles.subtitle}>
        Доступ только для администраторов
      </Typography.Paragraph>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Email"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input {...field} autoComplete="email" placeholder="admin@example.com" />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Пароль"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
            >
              <Input.Password
                {...field}
                autoComplete="current-password"
                placeholder="Введите пароль"
              />
            </Form.Item>
          )}
        />

        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
          Войти
        </Button>
      </Form>
    </div>
  );
};
