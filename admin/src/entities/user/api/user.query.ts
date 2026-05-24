import { client } from "@src/shared/api";

import { userApi } from "./user.api";
import type { DeleteUserResponse, User } from "./types/user.types";

export const userQuery = {
  getAll: () => client.get<User[]>(userApi.all).json(),
  getById: (id: string) => client.get<User>(userApi.byId(id)).json(),
  delete: (id: string) => client.delete<DeleteUserResponse>(userApi.byId(id)).json(),
};
