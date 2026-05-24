export const favoriteApi = {
  root: "favorites",
  items: "favorites/items",
  itemByProductId: (productId: string) => `favorites/items/${productId}`,
};
