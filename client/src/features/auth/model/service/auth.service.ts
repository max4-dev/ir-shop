import { authQuery, LoginDTO, RegisterDTO } from "../../api";

export const authService = {
  async initialize() {
    await authQuery.me();
    return true;
  },

  async login(data: LoginDTO) {
    await authQuery.login(data);
    return true;
  },

  async register(data: RegisterDTO) {
    await authQuery.register(data);
    return true;
  },

  async logout() {
    await authQuery.logout();
    return true;
  },
};
