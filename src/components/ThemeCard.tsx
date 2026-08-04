import Link from 'next/link';
import type { Theme } from '@/types';
import ThemeProgressBadge from '@/components/ThemeProgressBadge';

const COLOR: Record<string, { bar: string; tag: string; arrow: string }> = {
  violet:  { bar: 'bg-violet-500',  tag: 'bg-violet-100 text-violet-700',   arrow: 'text-violet-600' },
  emerald: { bar: 'bg-emerald-500', tag: 'bg-emerald-100 text-emerald-700', arrow: 'text-emerald-600' },
  amber:   { bar: 'bg-amber-500',   tag: 'bg-amber-100 text-amber-700',     arrow: 'text-amber-600' },
  teal:    { bar: 'bg-teal-500',    tag: 'bg-teal-100 text-teal-700',       arrow: 'text-teal-600' },
  rose:    { bar: 'bg-rose-500',    tag: 'bg-rose-100 text-rose-700',       arrow: 'text-rose-600' },
  sky:     { bar: 'bg-sky-500',     tag: 'bg-sky-100 text-sky-700',         arrow: 'text-sky-600' },
  indigo:  { bar: 'bg-indigo-500',  tag: 'bg-indigo-100 text-indigo-700',   arrow: 'text-indigo-600' },
  orange:  { bar: 'bg-orange-500',  tag: 'bg-orange-100 text-orange-700',   arrow: 'text-orange-600' },
  fuchsia: { bar: 'bg-fuchsia-500', tag: 'bg-fuchsia-100 text-fuchsia-700', arrow: 'text-fuchsia-600' },
  cyan:    { bar: 'bg-cyan-500',    tag: 'bg-cyan-100 text-cyan-700',       arrow: 'text-cyan-600' },
};

export default function ThemeCard({ theme }: { theme: Theme }) {
  const c = COLOR[theme.color];
  return (
    <Link
      href={`/themes/${theme.slug}`}
      className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className={`h-2 ${c.bar}`} />
      <div className="p-6">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${c.tag}`}>
          {theme.titleJapanese}
        </span>
        <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
          {theme.title}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-3">{theme.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${c.arrow}`}>
            Choose level →
          </span>
          <ThemeProgressBadge themeId={theme.id} />
        </div>
      </div>
    </Link>
  );
}
