import "../../public/assets/app.css";
import "../../public/assets/utils.css";
import { CookiesConsent } from "@/components/CookiesConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TransitionWrapper } from "@/components/TransitionWrapper";
import { Toaster } from "sonner";
import { CustomScripts } from "@/components/CustomScripts";
import "plyr/dist/plyr.css";

export const metadata = {
  title: "Eijent",
};

// filepath: g:\Osyed\eijent\src\app\layout.jsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,  // Add this line to prevent browser zoom
  userScalable: false,  // Add this to disable user zooming
}

export default function RootLayout({ children }) {
  return (
    <>
      <CustomScripts />
      <html lang="en" data-scroll-direction="initial" data-load="first-loading" className="loader-logo-transition overflow-hidden"
        data-pg="pg-home">
        <body>
          <Header />
          <TransitionWrapper>
            <main>
              {children}
              <Footer />
            </main>
          </TransitionWrapper>
          <CookiesConsent />
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </>
  );
}
