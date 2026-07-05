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
        <LevelPicker themeId={theme.id} slug={slug} />
      </div>
    </div>
  );
}
