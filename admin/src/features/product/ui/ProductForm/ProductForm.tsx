import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, InputNumber, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useCategories } from "@src/entities/category";
import { getErrorMessage } from "@src/shared/lib";

import {
  createEmptyProductImages,
  imagesValueToDto,
  type ProductImagesValue,
} from "../../lib/product-images.helpers";
import { productSchema, type ProductFormData } from "../../model/schema/product.schema";
import { ProductImagesField } from "../ProductImagesField/ProductImagesField";

import type { ProductFormProps } from "./ProductForm.props";

const defaultFormValues: ProductFormData = {
  name: "",
  price: 0,
  description: "",
  isAvailable: true,
  availableCount: 0,
  salePercent: 0,
  categoryIds: [],
};

export const ProductForm = ({
  defaultValues,
  defaultImages,
  isLoading,
  submitText,
  onSubmit,
}: ProductFormProps) => {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const [images, setImages] = useState<ProductImagesValue>(
    defaultImages ?? createEmptyProductImages()
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  useEffect(() => {
    reset({ ...defaultFormValues, ...defaultValues });
    setImages(defaultImages ?? createEmptyProductImages());
  }, [defaultImages, defaultValues, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      imagesValueToDto(images);
    } catch (error) {
      message.error(getErrorMessage(error));
      return;
    }

    await onSubmit(data, images);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Название"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <Input {...field} placeholder="Название товара" />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Описание"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <Input.TextArea {...field} placeholder="Описание товара" rows={4} value={field.value ?? ""} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="price"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Цена, ₽"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <InputNumber {...field} className="full-width" min={0} style={{ width: "100%" }} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="salePercent"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Скидка, %"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <InputNumber {...field} max={100} min={0} style={{ width: "100%" }} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="availableCount"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Количество на складе"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <InputNumber {...field} min={0} style={{ width: "100%" }} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="isAvailable"
        render={({ field }) => (
          <Form.Item label="Доступен для заказа">
            <Switch checked={field.value} onChange={field.onChange} />
          </Form.Item>
        )}
      />

      <Controller
        control={control}
        name="categoryIds"
        render={({ field, fieldState }) => (
          <Form.Item
            label="Категории"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <Select
              {...field}
              loading={isCategoriesLoading}
              mode="multiple"
              optionFilterProp="label"
              options={categories?.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              placeholder="Выберите категории"
            />
          </Form.Item>
        )}
      />

      <Form.Item label="Изображения" required>
        <ProductImagesField value={images} onChange={setImages} />
      </Form.Item>

      <Button htmlType="submit" loading={isLoading ?? isSubmitting} type="primary">
        {submitText}
      </Button>
    </Form>
  );
};
