import type { AuthStore } from "../store/auth.store";

export const authSelectors = {
  isInitialized: (state: AuthStore) => state.isInitialized,
  isAuthenticated: (state: AuthStore) => state.isAuthenticated,
  initialize: (state: AuthStore) => state.initialize,
  login: (state: AuthStore) => state.login,
  logout: (state: AuthStore) => state.logout,
  setUnauthenticated: (state: AuthStore) => state.setUnauthenticated,
};
