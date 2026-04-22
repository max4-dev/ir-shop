import { Header } from "@/src/widgets/header/ui";

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="main">{children}</main>
    </>
  );
};
