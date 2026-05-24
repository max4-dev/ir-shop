import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введите название категории")
    .max(100, "Максимум 100 символов"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
