"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { useAuthStore } from "@/src/features/auth/model";
import { SessionEvent, sessionEventBus } from "@/src/shared/lib";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { initialize, setUnauthenticated } = useAuthStore(
    useShallow((state) => ({
      initialize: state.initialize,
      setUnauthenticated: state.setUnauthenticated,
    }))
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    sessionEventBus.on(SessionEvent.SessionExpired, setUnauthenticated);
    return () => sessionEventBus.off(SessionEvent.SessionExpired, setUnauthenticated);
  }, [setUnauthenticated]);

  return <>{children}</>;
};
