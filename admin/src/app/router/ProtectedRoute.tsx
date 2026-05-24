import { Spin } from "antd";
import { Navigate, useLocation } from "react-router";

import { authSelectors, useAuthStore } from "@src/features/auth";
import { ROUTES } from "@src/shared/config";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isInitialized = useAuthStore(authSelectors.isInitialized);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);

  if (!isInitialized) {
    return <Spin fullscreen />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={ROUTES.AUTH.LOGIN} />;
  }

  return children;
};
