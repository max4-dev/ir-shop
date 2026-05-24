import { Spin } from "antd";
import { Navigate } from "react-router";

import { authSelectors, useAuthStore } from "@src/features/auth";
import { ROUTES } from "@src/shared/config";

type GuestRouteProps = {
  children: React.ReactNode;
};

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const isInitialized = useAuthStore(authSelectors.isInitialized);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);

  if (!isInitialized) {
    return <Spin fullscreen />;
  }

  if (isAuthenticated) {
    return <Navigate replace to={ROUTES.DASHBOARD} />;
  }

  return children;
};
