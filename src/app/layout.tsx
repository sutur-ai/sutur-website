import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-montserrat', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });
const description = "One assistant for your whole team. It works in your email, your business apps and on your computer, keeps going while you're away, and asks before anything is sent or deleted.";
const title = 'Rafic by Sutur';
const images = [{ url: '/brand/design-system/sutur-icon-deep.png', alt: 'Sutur' }];
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
