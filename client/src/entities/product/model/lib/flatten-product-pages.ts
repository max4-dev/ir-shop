import { Product } from "../../api/types/product.types";

type ProductPage = {
  products: Product[];
  total: number;
};

export const flattenProductPages = (pages?: ProductPage[]): Product[] =>
  pages?.flatMap((page) => page.products) ?? [];

export const getProductPagesMeta = (pages?: ProductPage[]) => {
  const lastPage = pages?.at(-1);
  return {
    total: lastPage?.total ?? 0,
    loadedCount: pages?.reduce((sum, page) => sum + page.products.length, 0) ?? 0,
  };
};
