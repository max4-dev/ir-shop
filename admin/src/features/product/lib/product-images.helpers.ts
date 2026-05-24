import type { Product } from "@src/entities/product";

export type ProductImagesValue = {
  mainImage: string;
  gallery: string[];
};

export const createEmptyProductImages = (): ProductImagesValue => ({
  mainImage: "",
  gallery: [],
});

export const productToImagesValue = (product: Product): ProductImagesValue => {
  const gallery = Array.from(new Set([product.image, ...product.images].filter(Boolean)));

  return {
    mainImage: product.image,
    gallery,
  };
};

export const imagesValueToDto = ({ mainImage, gallery }: ProductImagesValue) => {
  if (!mainImage) {
    throw new Error("Выберите главное изображение");
  }

  return {
    image: mainImage,
    images: gallery.length > 0 ? gallery : [mainImage],
  };
};
