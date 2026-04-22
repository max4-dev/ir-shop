import { client } from "@/src/shared/api";

import { authApi } from "./auth.api";
import { LoginDTO, LoginResponse } from "./types/login.dto";
import { RegisterDTO, RegisterResponse } from "./types/register.dto";

export const authQuery = {
  login: (data: LoginDTO) => client.post<LoginResponse>(authApi.login, { json: data }).json(),
  register: (data: RegisterDTO) =>
    client.post<RegisterResponse>(authApi.register, { json: data }).json(),
  logout: () => client.post(authApi.logout),
  me: () => client.get(authApi.me).json(),
};
