import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { categorySchema, type CategoryFormData } from "../../model";

import type { CategoryFormProps } from "./CategoryForm.props";

export const CategoryForm = ({
  defaultValues,
  isLoading,
  submitText,
  onSubmit,
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: "" },
  });

  useEffect(() => {
    reset(defaultValues ?? { name: "" });
  }, [defaultValues, reset]);

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Название"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <Input {...field} placeholder="Например, Одежда" />
          </Form.Item>
        )}
      />

      <Button htmlType="submit" loading={isLoading ?? isSubmitting} type="primary">
        {submitText}
      </Button>
    </Form>
  );
};
