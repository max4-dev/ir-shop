import { authSelectors } from "../selectors/auth.selectors";
import { useAuthStore } from "../store/auth.store";

export const useAuth = () => useAuthStore(authSelectors.isAuthenticated);
