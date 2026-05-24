import { authQuery } from "../../api";
import type { LoginDTO } from "../../api";
import { UserRole } from "../../api/types/role.types";

export const authService = {
  async initialize() {
    const response = await authQuery.me();

    if (response.user.role !== UserRole.ADMIN) {
      throw new Error("Доступ запрещён");
    }

    return true;
  },

  async login(data: LoginDTO) {
    await authQuery.login(data);
    return true;
  },

  async logout() {
    await authQuery.logout();
    return true;
  },
};
