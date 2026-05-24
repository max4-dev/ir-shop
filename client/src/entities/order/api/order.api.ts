export const orderApi = {
  root: "orders",
  byId: (id: string) => `orders/${id}`,
  cancel: (id: string) => `orders/${id}/cancel`,
};
