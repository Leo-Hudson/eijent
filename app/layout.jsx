import './globals.css';
import { Manrope, Inter, JetBrains_Mono } from 'next/font/google';
import SiteNav from '@/components/SiteNav';
import Behaviors from '@/components/Behaviors';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const SITE_URL = 'https://eijent.com';
const TITLE = 'Eijent — Run your company as a system';
const DESCRIPTION =
  'Eijent is the AI-first operational platform for modern revenue teams. One system for data, pipelines, workflows, AI, and the real-world signals captured by Pulse. Currently invite-only.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: 'The AI-first operational platform for modern revenue teams. Currently invite-only.',
    images: [{ url: '/assets/mark-static.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: 'The AI-first operational platform for modern revenue teams. Currently invite-only.',
    images: ['/assets/mark-static.png'],
  },
  icons: {
    icon: [
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/mark.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/assets/mark-192.png', sizes: '192x192' }],
    other: [{ rel: 'mask-icon', url: '/assets/mark.svg', color: '#0A0A14' }],
  },
};

export const viewport = {
  themeColor: '#0A0A14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SiteNav />
        <main id="main">{children}</main>
        <Behaviors />
      </body>
    </html>
  );
}
