import { CookiesConsent } from "@/components/CookiesConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { CustomScripts } from "@/components/CustomScripts";
import "plyr/dist/plyr.css";
import { fetchLayoutData } from "@/services";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: "Eijent",
  robots: process.env.ENVIRONMENT !== "PRODUCTION" ? "noindex,nofollow" : null,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
}

export default async function RootLayout({ children }) {
  const data = await fetchLayoutData();
  const { homePageData, headerData, footerData } = data;

  return (
    <>
      <CustomScripts />
      <html lang="en">
        <body data-scroll-direction="initial" data-load="first-loading" className="loader-logo-transition overflow-hidden">
          <link rel="stylesheet" href="/assets/utils.css" />
          <link rel="stylesheet" href="/assets/app.css" />
          <link rel="stylesheet" href="/assets/custom.css" />
          <div id="customEventHandler"></div>
          <Header data={headerData} />
          <div id="main-transition">
            <div className="wrapper" data-scroll-container>
              <main>
                {children}
              </main>
              <Footer data={footerData} />
            </div>
          </div>
          <CookiesConsent data={homePageData} />
          <Toaster position="bottom-right" richColors />
          <SpeedInsights />
        </body>
      </html>
    </>
  );
}

const time = +process.env.REVALIDATE_TIME || 86400;
export const revalidate = time;