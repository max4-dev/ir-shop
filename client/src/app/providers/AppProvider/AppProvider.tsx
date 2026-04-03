import { QueryProvider } from "../QueryProvider/QueryProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};
