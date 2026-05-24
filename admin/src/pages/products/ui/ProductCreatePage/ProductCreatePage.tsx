import { Card, message } from "antd";
import { useNavigate } from "react-router";

import { useCreateProduct } from "@src/entities/product";
import {
  ProductForm,
  createEmptyProductImages,
  imagesValueToDto,
  type ProductFormData,
  type ProductImagesValue,
} from "@src/features/product";
import { ROUTES } from "@src/shared/config";
import { getErrorMessage } from "@src/shared/lib";
import { AdminLayout } from "@src/widgets/layout";

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateProduct();

  const handleSubmit = async (data: ProductFormData, images: ProductImagesValue) => {
    try {
      const imageDto = imagesValueToDto(images);
      await mutateAsync({ ...data, ...imageDto });
      message.success("Товар создан");
      navigate(ROUTES.PRODUCTS.ROOT);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <AdminLayout title="Создание товара">
      <Card>
        <ProductForm
          defaultImages={createEmptyProductImages()}
          isLoading={isPending}
          submitText="Создать"
          onSubmit={handleSubmit}
        />
      </Card>
    </AdminLayout>
  );
};
