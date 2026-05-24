"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useUpdateProfile } from "@/src/entities/user/model";
import { getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Toast } from "@/src/shared/ui";

import { ProfileFormData, profileSchema } from "../../model";

import styles from "./ProfileForm.module.css";
import { ProfileFormProps } from "./ProfileForm.props";

export const ProfileForm = ({ className, profile }: ProfileFormProps) => {
  const { mutateAsync, isPending } = useUpdateProfile();
  const { showToast, toastProps } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
    },
  });

  useEffect(() => {
    reset({ name: profile.name, email: profile.email });
  }, [profile.email, profile.name, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      await mutateAsync(data);
      showToast("Данные профиля сохранены", { appearance: "success" });
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <form className={cn(className, styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name")}
        label="Имя"
        autoComplete="name"
        placeholder="Иван Иванов"
        errorMessage={errors.name?.message}
      />
      <Input
        {...register("email")}
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="user@example.com"
        errorMessage={errors.email?.message}
      />
      <Button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Сохраняем..." : "Сохранить"}
      </Button>
      <Toast {...toastProps} />
    </form>
  );
};
