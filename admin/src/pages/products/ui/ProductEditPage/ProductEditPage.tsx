import { Card, Spin, message } from "antd";
import { useNavigate, useParams } from "react-router";

import { useProduct, useUpdateProduct } from "@src/entities/product";
import {
  ProductForm,
  imagesValueToDto,
  productToImagesValue,
  type ProductFormData,
  type ProductImagesValue,
} from "@src/features/product";
import { ROUTES } from "@src/shared/config";
import { getErrorMessage } from "@src/shared/lib";
import { AdminLayout } from "@src/widgets/layout";

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id ?? null);
  const { mutateAsync, isPending } = useUpdateProduct();

  const handleSubmit = async (data: ProductFormData, images: ProductImagesValue) => {
    if (!id) return;

    try {
      const imageDto = imagesValueToDto(images);
      await mutateAsync({ id, data: { ...data, ...imageDto } });
      message.success("Товар обновлён");
      navigate(ROUTES.PRODUCTS.ROOT);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  if (isLoading || !product) {
    return (
      <AdminLayout title="Редактирование товара">
        <Spin />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Редактирование товара">
      <Card>
        <ProductForm
          defaultImages={productToImagesValue(product)}
          defaultValues={{
            name: product.name,
            price: product.price,
            description: product.description,
            isAvailable: product.isAvailable,
            availableCount: product.availableCount,
            salePercent: product.salePercent,
            categoryIds: product.categories.map((category) => category.id),
          }}
          isLoading={isPending}
          submitText="Сохранить"
          onSubmit={handleSubmit}
        />
      </Card>
    </AdminLayout>
  );
};
