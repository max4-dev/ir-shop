import { client } from "@/src/shared/api";

import { userApi } from "./user.api";

import type {
  UpdatePasswordBody,
  UpdatePasswordResult,
  UpdateProfileBody,
  User,
} from "./types/user.types";

export const userQuery = {
  getProfile: () => client.get<User>(userApi.profile).json(),
  updateProfile: (body: UpdateProfileBody) =>
    client.put<User>(userApi.profile, { json: body }).json(),
  updatePassword: (body: UpdatePasswordBody) =>
    client.put<UpdatePasswordResult>(userApi.password, { json: body }).json(),
};
