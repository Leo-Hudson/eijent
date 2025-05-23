// import "@/assets/app.css";
// import "@/assets/utils.css";
import { CookiesConsent } from "@/components/CookiesConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TransitionWrapper } from "@/components/TransitionWrapper";
import { Toaster } from "sonner";
import { CustomScripts } from "@/components/CustomScripts";
import "plyr/dist/plyr.css";
import { fetchHeaderData } from "@/services";

export const metadata = {
  title: "Eijent",
  robots: "noindex,nofollow"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
}

export default async function RootLayout({ children }) {

  const headerData = await fetchHeaderData();

  return (
    <>
      <CustomScripts />
      <html lang="en" data-scroll-direction="initial" data-load="first-loading" className="loader-logo-transition overflow-hidden"
        data-pg="pg-home">
        <body data-scroll-direction="initial" data-load="first-loading" className="loader-logo-transition overflow-hidden"
          data-pg="pg-home">
          <link rel="stylesheet" href="/assets/utils.css" />
          <link rel="stylesheet" href="/assets/app.css" />
          <div id="customEventHandler"></div>
          <Header data={headerData} />
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
