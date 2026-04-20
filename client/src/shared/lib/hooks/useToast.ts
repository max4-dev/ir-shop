import { useCallback, useMemo, useState } from "react";

import type { ToastProps } from "@/src/shared/ui";

type ShowToastOptions = Pick<ToastProps, "appearance">;
type ToastState = Required<Pick<ToastProps, "title" | "appearance">> & { open: boolean };

export const useToast = (defaults?: ShowToastOptions) => {
  const [state, setState] = useState<ToastState>({
    title: "",
    open: false,
    appearance: defaults?.appearance ?? "default",
  });

  const showToast = useCallback((title: string, options?: ShowToastOptions) => {
    setState((prev) => ({ ...prev, title, open: true, ...options }));
  }, []);

  const toastProps = useMemo(
    () => ({
      title: state.title,
      open: state.open,
      appearance: state.appearance,
      onOpenChange: (open: boolean) => setState((prev) => ({ ...prev, open })),
    }),
    [state]
  );

  return { showToast, toastProps };
};
