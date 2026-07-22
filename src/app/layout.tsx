import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'sutur — One clear operating system',
  description: 'Tailored Odoo ERP and practical AI agents.',
  icons: { icon: '/brand/design-system/sutur-icon-deep.png' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
