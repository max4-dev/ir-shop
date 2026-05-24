import { client } from "@src/shared/api";

import { authApi } from "./auth.api";
import type { LoginDTO, LoginResponse } from "./types/login.dto";
import type { MeResponse } from "./types/me.dto";

export const authQuery = {
  login: (data: LoginDTO) => client.post<LoginResponse>(authApi.login, { json: data }).json(),
  me: () => client.get<MeResponse>(authApi.me).json(),
  logout: () => client.post(authApi.logout),
};
