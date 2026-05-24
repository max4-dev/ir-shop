import { z } from "zod";

import { ORDER_CUSTOMER, ORDER_PHONE_REGEX } from "@/src/entities/order/config/order.config";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(ORDER_CUSTOMER.NAME_MIN_LENGTH, "Минимум 2 символа")
    .max(ORDER_CUSTOMER.NAME_MAX_LENGTH, "Слишком длинное имя"),
  customerEmail: z
    .string()
    .trim()
    .email("Некорректный email")
    .max(ORDER_CUSTOMER.EMAIL_MAX_LENGTH),
  customerPhone: z
    .string()
    .trim()
    .regex(ORDER_PHONE_REGEX, "Некорректный формат телефона"),
  deliveryAddress: z
    .string()
    .trim()
    .min(ORDER_CUSTOMER.ADDRESS_MIN_LENGTH, "Минимум 5 символов")
    .max(ORDER_CUSTOMER.ADDRESS_MAX_LENGTH, "Слишком длинный адрес"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
