import { QueryProvider } from "../QueryProvider/QueryProvider";
import { ToastProvider } from "../ToastProvider/ToastProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  );
};
