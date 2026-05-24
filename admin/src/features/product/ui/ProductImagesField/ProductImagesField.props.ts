import { PRODUCT_LIMITS } from "@src/entities/product";

import type { ProductImagesValue } from "../../lib/product-images.helpers";

export type ProductImagesFieldProps = {
  value: ProductImagesValue;
  onChange: (value: ProductImagesValue) => void;
  maxImages?: number;
};

export const PRODUCT_IMAGES_MAX = PRODUCT_LIMITS.MAX_IMAGES;
