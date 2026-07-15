import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Sutur — One clear operating system', description: 'Tailored Odoo ERP and practical AI agents.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
