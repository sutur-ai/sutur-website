import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sutur.ai'),
  title: {
    default: 'Sutur — One clear operating system',
    template: '%s — Sutur',
  },
  description:
    'Tailored Odoo ERP, custom development, and practical AI agents for clearer operations.',
  icons: {
    icon: '/brand/design-system/sutur-icon-deep.png',
    apple: '/brand/design-system/sutur-icon-deep.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Sutur',
    title: 'Sutur — One clear operating system',
    description:
      'Tailored Odoo ERP, custom development, and practical AI agents for clearer operations.',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b1447',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
