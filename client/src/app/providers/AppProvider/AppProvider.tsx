import { AuthProvider } from "../AuthProvider/AuthProvider";
import { LayoutProvider } from "../LayoutProvider/LayoutProvider";
import { QueryProvider } from "../QueryProvider/QueryProvider";
import { ToastProvider } from "../ToastProvider/ToastProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
};
