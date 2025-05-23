import { CookiesConsent } from "@/components/CookiesConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TransitionWrapper } from "@/components/TransitionWrapper";
import { Toaster } from "sonner";

export const metadata = {
  title: "Eijent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-direction="initial" data-load="first-loading" className="loader-logo-transition overflow-hidden"
      data-pg="pg-home">
      <body>
        <Header />
        <TransitionWrapper>
          <main className={"min-h-100"}>
            {children}
            <Footer />
          </main>
        </TransitionWrapper>
        <CookiesConsent />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
