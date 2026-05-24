export const userApi = {
  all: "users",
  byId: (id: string) => `users/${id}`,
} as const;
