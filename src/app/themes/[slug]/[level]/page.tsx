import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getThemeBySlug, isValidLevel } from '@/data/themes';
import LevelBadge from '@/components/LevelBadge';
import ActivityGrid from '@/components/ActivityGrid';
import type { Level } from '@/types';

export default async function ActivityListPage({
  params,
}: {
  params: Promise<{ slug: string; level: string }>;
}) {
  const { slug, level: rawLevel } = await params;

  const theme = getThemeBySlug(slug);
  if (!theme) notFound();
  if (!isValidLevel(rawLevel)) notFound();

  const level = rawLevel as Level;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/themes" className="hover:text-slate-600 transition-colors">Themes</Link>
        <span>›</span>
        <Link href={`/themes/${slug}`} className="hover:text-slate-600 transition-colors">{theme.title}</Link>
        <span>›</span>
        <span className="text-slate-700 font-medium capitalize">{level}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900">{theme.title}</h1>
        <LevelBadge level={level} />
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Complete each activity in any order. Your progress is saved automatically.
      </p>

      {/* Activity grid */}
      <ActivityGrid themeId={theme.id} slug={slug} level={level} />
    </div>
  );
}
