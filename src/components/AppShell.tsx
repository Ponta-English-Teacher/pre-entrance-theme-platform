'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/themes',    label: 'Themes',     labelJapanese: 'テーマ' },
  { href: '/portfolio', label: 'Portfolio',  labelJapanese: 'ポートフォリオ' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/themes" className="font-bold text-slate-900 tracking-tight">
            Pre-Entrance English
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map(({ href, label, labelJapanese }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{labelJapanese}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
