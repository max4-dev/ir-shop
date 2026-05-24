import { Prisma } from '@prisma/client';

export const productInclude = {
  categories: { include: { category: true } },
} satisfies Prisma.ProductInclude;

export type ProductWithCategories = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export interface ProductResponse extends Omit<
  ProductWithCategories,
  'categories'
> {
  categories: ProductWithCategories['categories'][number]['category'][];
}

export const formatProduct = (
  product: ProductWithCategories,
): ProductResponse => ({
  ...product,
  categories: product.categories.map((cp) => cp.category),
});
