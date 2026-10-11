import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const montserrat = localFont({
  src: './fonts/montserrat-latin.woff2',
  weight: '100 900',
  variable: '--font-montserrat',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Montserrat Arial Fallback'],
});
const inter = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
const description = "One assistant for your whole team. It works in your email, your business apps and on your computer, keeps going while you're away, and asks before anything is sent or deleted.";
const title = 'Rafic by Sutur';
const images = [{ url: '/og.jpg', type: 'image/jpeg', width: 1200, height: 630, alt: 'Rafic by Sutur: Rafic does the work. You approve what matters.' }];
export const metadata: Metadata = {
  metadataBase: new URL('https://sutur.ai'),
  title: { default: title, template: '%s | Rafic by Sutur' },
  description,
  icons: { icon: '/brand/design-system/sutur-agent-favicon.png', apple: '/brand/design-system/sutur-agent-favicon.png' },
  openGraph: { type: 'website', siteName: 'Sutur', title, description, url: '/', images },
  twitter: { card: 'summary_large_image', title, description, images },
};
export const viewport: Viewport = { themeColor: '#3b1447', colorScheme: 'light' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${montserrat.variable} ${inter.variable}`}><body>{children}</body></html>;
}
