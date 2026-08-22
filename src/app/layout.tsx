import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import AppShell from '@/components/AppShell';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pre-Entrance English Platform',
  description: 'Theme-based pre-entrance English learning',
};

// Explicit rather than relying on Next.js's implicit default — made explicit
// while debugging mobile rendering differences between headless testing and
// real devices; works together with globals.css's text-size-adjust rule.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
