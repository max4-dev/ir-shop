"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";

import { useCreateOrder } from "@/src/entities/order/model";
import { useCartTotalWithPromo, usePromoCodeStore } from "@/src/features/promo-code/model";
import { ROUTES } from "@/src/shared/config";
import { formatPrice, getErrorMessage } from "@/src/shared/lib";
import { useToast } from "@/src/shared/lib/hooks";
import { Button, Input, Toast } from "@/src/shared/ui";

import { CheckoutFormData, checkoutSchema } from "../../model";

import styles from "./CheckoutForm.module.css";
import { CheckoutFormProps } from "./CheckoutForm.props";

export const CheckoutForm = ({ className, cart, ...props }: CheckoutFormProps) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateOrder();
  const { showToast, toastProps } = useToast();
  const appliedPromo = usePromoCodeStore(useShallow((state) => state.applied));
  const pricing = useCartTotalWithPromo(cart.totalPrice);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    try {
      const result = await mutateAsync({
        ...data,
        ...(appliedPromo && { promoCode: appliedPromo.code }),
      });

      if (result.confirmationUrl) {
        window.location.href = result.confirmationUrl;
        return;
      }

      router.push(ROUTES.ORDER.SUCCESS(result.order.id));
    } catch (error) {
      showToast(getErrorMessage(error), { appearance: "danger" });
    }
  };

  return (
    <form
      className={cn(className, styles.form)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Input
        {...register("customerName")}
        label="Имя и фамилия"
        placeholder="Иван Иванов"
        autoComplete="name"
        errorMessage={errors.customerName?.message}
      />

      <Input
        {...register("customerEmail")}
        type="email"
        label="Email"
        placeholder="user@example.com"
        autoComplete="email"
        errorMessage={errors.customerEmail?.message}
      />

      <Input
        {...register("customerPhone")}
        type="tel"
        label="Телефон"
        placeholder="+7 999 123-45-67"
        autoComplete="tel"
        errorMessage={errors.customerPhone?.message}
      />

      <div className={styles.textareaBox}>
        <label className={styles.label} htmlFor="deliveryAddress">
          Адрес доставки
        </label>
        <textarea
          id="deliveryAddress"
          className={cn(styles.textarea, errors.deliveryAddress && styles.textareaError)}
          placeholder="Город, улица, дом, квартира"
          {...register("deliveryAddress")}
        />
        {errors.deliveryAddress?.message && (
          <span className={styles.error}>{errors.deliveryAddress.message}</span>
        )}
      </div>

      <Button type="submit" className={styles.submit} disabled={isPending}>
        {isPending
          ? "Оформляем..."
          : `Оплатить ${formatPrice(pricing.total)}`}
      </Button>

      <Toast {...toastProps} />
    </form>
  );
};
