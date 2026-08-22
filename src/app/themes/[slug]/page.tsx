import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getThemeBySlug } from '@/data/themes';
import LevelPicker from '@/components/LevelPicker';

const BANNER: Record<string, { bg: string; tag: string }> = {
  violet:  { bg: 'bg-violet-600',  tag: 'bg-violet-200 text-violet-900' },
  emerald: { bg: 'bg-emerald-600', tag: 'bg-emerald-200 text-emerald-900' },
  amber:   { bg: 'bg-amber-600',   tag: 'bg-amber-200 text-amber-900' },
  teal:    { bg: 'bg-teal-600',    tag: 'bg-teal-200 text-teal-900' },
  rose:    { bg: 'bg-rose-600',    tag: 'bg-rose-200 text-rose-900' },
  sky:     { bg: 'bg-sky-600',     tag: 'bg-sky-200 text-sky-900' },
  indigo:  { bg: 'bg-indigo-600',  tag: 'bg-indigo-200 text-indigo-900' },
  orange:  { bg: 'bg-orange-600',  tag: 'bg-orange-200 text-orange-900' },
  fuchsia: { bg: 'bg-fuchsia-600', tag: 'bg-fuchsia-200 text-fuchsia-900' },
  cyan:    { bg: 'bg-cyan-600',    tag: 'bg-cyan-200 text-cyan-900' },
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
      {/* Banner — a thin theme-color accent bar plus a light background,
          not a saturated full-bleed color block. Matches ThemeCard's own
          thin `h-2` color-bar treatment, so theme identity stays
          recognizable via color used selectively (bar + badge) rather than
          a large colored area consuming vertical space, especially on
          mobile. */}
      <div className={`h-1.5 ${c.bg}`} />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-10">
          <Link href="/themes" className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm mb-2 sm:mb-5 inline-block transition-colors">
            ← All Themes
          </Link>
          <span className={`block w-fit px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${c.tag}`}>
            {theme.titleJapanese}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1.5 sm:mb-3">{theme.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">{theme.description}</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 sm:mt-2 max-w-xl">{theme.descriptionJapanese}</p>
        </div>
      </div>

      {/* Level picker */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <LevelPicker themeId={theme.id} slug={slug} />
      </div>
    </div>
  );
}
