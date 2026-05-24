export const getProductsNextOffset = (lastPage: {
  offset: number;
  products: unknown[];
  total: number;
}) => {
  const nextOffset = lastPage.offset + lastPage.products.length;
  return nextOffset < lastPage.total ? nextOffset : undefined;
};
