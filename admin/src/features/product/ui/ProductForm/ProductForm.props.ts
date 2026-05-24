import type { ProductFormData } from "../../model/schema/product.schema";
import type { ProductImagesValue } from "../../lib/product-images.helpers";

export type ProductFormProps = {
  defaultValues?: Partial<ProductFormData>;
  defaultImages?: ProductImagesValue;
  isLoading?: boolean;
  submitText: string;
  onSubmit: (data: ProductFormData, images: ProductImagesValue) => Promise<void>;
};
