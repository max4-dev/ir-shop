import { z } from "zod";

import { PRODUCT_LIMITS } from "@src/entities/product";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введите название товара")
    .max(PRODUCT_LIMITS.MAX_NAME_LENGTH, `Максимум ${PRODUCT_LIMITS.MAX_NAME_LENGTH} символов`),
  price: z.number().int("Цена должна быть целым числом").min(0, "Минимум 0"),
  description: z.string().nullable().optional(),
  isAvailable: z.boolean(),
  availableCount: z.number().int().min(0, "Минимум 0"),
  salePercent: z
    .number()
    .int()
    .min(0)
    .max(PRODUCT_LIMITS.MAX_SALE_PERCENT)
    .optional(),
  categoryIds: z.array(z.string().uuid("Некорректная категория")).min(1, "Выберите категорию"),
});

export type ProductFormData = z.infer<typeof productSchema>;
