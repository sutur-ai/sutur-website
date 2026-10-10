import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sutur.ai'),
  title: {
    default: 'SUTUR',
    template: '%s | SUTUR',
  },
  description:
    'Practical AI agents that connect to any ERP, plus custom development, for clearer operations.',
  icons: {
    icon: '/brand/design-system/sutur-agent-favicon.png',
    apple: '/brand/design-system/sutur-agent-favicon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Sutur',
    title: 'SUTUR',
    description:
      'Practical AI agents that connect to any ERP, plus custom development, for clearer operations.',
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
