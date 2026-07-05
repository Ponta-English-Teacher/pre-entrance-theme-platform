import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getThemeBySlug, LEVEL_INFO } from '@/data/themes';
import LevelBadge from '@/components/LevelBadge';

const BANNER: Record<string, { bg: string; tag: string }> = {
  violet:  { bg: 'bg-violet-600',  tag: 'bg-violet-200 text-violet-900' },
  emerald: { bg: 'bg-emerald-600', tag: 'bg-emerald-200 text-emerald-900' },
  amber:   { bg: 'bg-amber-600',   tag: 'bg-amber-200 text-amber-900' },
  teal:    { bg: 'bg-teal-600',    tag: 'bg-teal-200 text-teal-900' },
  rose:    { bg: 'bg-rose-600',    tag: 'bg-rose-200 text-rose-900' },
};

const LEVEL_BORDER: Record<string, string> = {
  foundation: 'border-emerald-200 hover:border-emerald-400',
  standard:   'border-blue-200   hover:border-blue-400',
  challenge:  'border-violet-200 hover:border-violet-400',
};

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) notFound();

  const c = BANNER[theme.color];

  return (
    <div>
      {/* Banner */}
      <div className={`${c.bg} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/themes" className="text-white/70 hover:text-white text-sm mb-5 inline-block transition-colors">
            ← All Themes
          </Link>
          <span className={`block w-fit px-3 py-1 rounded-full text-sm font-semibold mb-3 ${c.tag}`}>
            {theme.titleJapanese}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{theme.title}</h1>
          <p className="text-white/80 text-base leading-relaxed max-w-xl">{theme.description}</p>
          <p className="text-white/60 text-sm mt-2 max-w-xl">{theme.descriptionJapanese}</p>
        </div>
      </div>

      {/* Level picker */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Choose Your Level</h2>
        <p className="text-slate-500 text-sm mb-6">
          You can choose a different level for each theme. Pick what feels right for you today.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LEVEL_INFO.map(info => (
            <Link
              key={info.level}
              href={`/themes/${slug}/${info.level}`}
              className={`group block bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-md ${LEVEL_BORDER[info.level]}`}
            >
              <div className="mb-3">
                <LevelBadge level={info.level} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{info.label}</h3>
              <p className="text-xs font-semibold text-slate-500 mb-2">{info.labelJapanese}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{info.descriptionJapanese}</p>
              <div className="mt-5 text-sm font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                Start {info.label} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
