import { Footer } from "@/src/widgets/footer/ui";
import { Header } from "@/src/widgets/header/ui";
import { PromoCodeBanner } from "@/src/widgets/promo-code/ui";

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <PromoCodeBanner />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
};
