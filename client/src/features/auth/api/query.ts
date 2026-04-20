import { client } from "@/src/shared/api";

import { LoginDTO, LoginResponse, RegisterDTO, RegisterResponse } from "../model";

import { authApi } from "./api";

export const authQuery = {
  login: (data: LoginDTO) => client.post<LoginResponse>(authApi.login, { json: data }).json(),
  register: (data: RegisterDTO) =>
    client.post<RegisterResponse>(authApi.register, { json: data }).json(),
};
