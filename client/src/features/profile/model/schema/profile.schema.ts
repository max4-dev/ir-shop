import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Минимум 2 символа")
    .max(120, "Слишком длинное имя"),
  email: z.string().trim().email("Некорректный email").max(255, "Слишком длинный email"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(6, "Минимум 6 символов").max(72, "Слишком длинный пароль"),
    newPassword: z.string().min(6, "Минимум 6 символов").max(72, "Слишком длинный пароль"),
    confirmPassword: z.string().min(6, "Минимум 6 символов"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
