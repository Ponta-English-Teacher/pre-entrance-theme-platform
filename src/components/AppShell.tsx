'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SelectionAssistantProvider from '@/components/selection-assistant/SelectionAssistantProvider';

const NAV = [
  { href: '/themes',    label: 'Themes',     labelJapanese: 'テーマ' },
  { href: '/portfolio', label: 'Portfolio',  labelJapanese: 'ポートフォリオ' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SelectionAssistantProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-2">
            {/* whitespace-nowrap + truncate: this brand name must never wrap —
                a wrapped/oversized brand was squeezing the nav pills into
                mid-word line breaks on narrow phones. min-w-0 lets the flex
                item actually shrink/truncate instead of forcing overflow. */}
            <Link href="/themes" className="font-bold text-sm sm:text-base text-slate-900 tracking-tight whitespace-nowrap truncate min-w-0">
              Pre-Entrance English
            </Link>
            <nav className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {NAV.map(({ href, label, labelJapanese }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
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
    </SelectionAssistantProvider>
  );
}
