export const orderApi = {
  admin: "orders/admin",
  byId: (id: string) => `orders/${id}`,
  updateStatus: (id: string) => `orders/admin/${id}/status`,
} as const;
