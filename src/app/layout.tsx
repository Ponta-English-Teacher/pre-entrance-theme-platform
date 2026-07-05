import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import AppShell from '@/components/AppShell';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pre-Entrance English Platform',
  description: 'Theme-based pre-entrance English learning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="h-full font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
