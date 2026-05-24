import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, InputNumber, Select, message } from "antd";
import { Controller, useForm } from "react-hook-form";

import { PROMO_CODE, useCreatePromoCode } from "@src/entities/promo-code";
import type { PromoCode } from "@src/entities/promo-code";
import { useUsers } from "@src/entities/user";
import { getErrorMessage } from "@src/shared/lib";

import { createPromoCodeSchema, type CreatePromoCodeFormData } from "../../model";

type CreatePromoCodeFormProps = {
  onCreated: (promoCode: PromoCode) => void;
};

export const CreatePromoCodeForm = ({ onCreated }: CreatePromoCodeFormProps) => {
  const { data: users, isLoading: isUsersLoading } = useUsers();
  const { mutateAsync, isPending } = useCreatePromoCode();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePromoCodeFormData>({
    resolver: zodResolver(createPromoCodeSchema),
    defaultValues: {
      userId: "",
      discountPercent: PROMO_CODE.DEFAULT_DISCOUNT_PERCENT,
    },
  });

  const onSubmit = async (data: CreatePromoCodeFormData) => {
    try {
      const promoCode = await mutateAsync(data);
      message.success("Промокод создан");
      onCreated(promoCode);
      reset({
        userId: "",
        discountPercent: PROMO_CODE.DEFAULT_DISCOUNT_PERCENT,
      });
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="userId"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Пользователь"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <Select
              {...field}
              loading={isUsersLoading}
              optionFilterProp="label"
              options={users?.map((user) => ({
                label: `${user.name} (${user.email})`,
                value: user.id,
              }))}
              placeholder="Выберите пользователя"
              showSearch
            />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="discountPercent"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Скидка, %"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <InputNumber
              {...field}
              max={PROMO_CODE.MAX_DISCOUNT_PERCENT}
              min={PROMO_CODE.MIN_DISCOUNT_PERCENT}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
      />

      <Button htmlType="submit" loading={isPending || isSubmitting} type="primary">
        Выдать промокод
      </Button>
    </Form>
  );
};
