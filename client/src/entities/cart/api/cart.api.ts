export const cartApi = {
  root: "cart",
  items: "cart/items",
  itemByProductId: (productId: string) => `cart/items/${productId}`,
};
