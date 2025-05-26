import { CookiesConsent } from "@/components/CookiesConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { CustomScripts } from "@/components/CustomScripts";
import "plyr/dist/plyr.css";
import { fetchHeaderData, fetchLayoutData } from "@/services";

export const metadata = {
  title: "Eijent",
  robots: "noindex,nofollow",
  description: "",
  creator: "Blueprint Studios",
  authors: [{ name: "Eijent" }],
  openGraph: {
    title: "Eijent",
    description: "",
    url: "index.html",
    siteName: "Eijent",
    images: [
      {
        url: "images/capa-face.png",
        width: 800,
        height: 800,
        type: "image/jpeg",
      },
    ],
    type: "website",
    locale: "en",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
}

export default async function RootLayout({ children }) {
  const data = await fetchLayoutData();
  const { headerData, footerData } = data;

  return (
    <>
      <CustomScripts />
      <html lang="en">
        <body data-scroll-direction="initial" data-load="first-loading" className="loader-logo-transition overflow-hidden">
          <link rel="stylesheet" href="/assets/utils.css" />
          <link rel="stylesheet" href="/assets/app.css" />
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
          <CookiesConsent />
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </>
  );
}
