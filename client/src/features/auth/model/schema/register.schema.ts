import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Введите корректный email"),
  name: z.string().min(3, "Имя должно содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
