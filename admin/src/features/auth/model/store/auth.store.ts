import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { LoginDTO } from "../../api";
import { authService } from "../service/auth.service";

export interface AuthStore {
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUnauthenticated: () => void;
  initialize: () => Promise<void>;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      isInitialized: false,

      setUnauthenticated: () => set({ isAuthenticated: false }, false, "auth/setUnauthenticated"),

      initialize: async () => {
        try {
          await authService.initialize();
          set(
            { isAuthenticated: true, isInitialized: true },
            false,
            "auth/initialize/authenticated"
          );
        } catch {
          set(
            { isAuthenticated: false, isInitialized: true },
            false,
            "auth/initialize/unauthenticated"
          );
        }
      },

      login: async (data: LoginDTO) => {
        await authService.login(data);
        set({ isAuthenticated: true }, false, "auth/login");
      },

      logout: async () => {
        await authService.logout();
        set({ isAuthenticated: false }, false, "auth/logout");
      },
    }),
    { name: "AuthStore" }
  )
);
