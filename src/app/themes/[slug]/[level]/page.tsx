import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getThemeBySlug, ACTIVITY_DEFS, isValidLevel } from '@/data/themes';
import LevelBadge from '@/components/LevelBadge';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIVITY_DEFS.map(activity => (
          <Link
            key={activity.type}
            href={`/themes/${slug}/${level}/${activity.type}`}
            className="group block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all"
          >
            <div className="text-2xl mb-3">{activity.icon}</div>
            <h3 className="font-bold text-slate-900 mb-1">{activity.label}</h3>
            <p className="text-xs text-slate-400 mb-4">{activity.labelJapanese}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{activity.estimatedMinutes} min</span>
              <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-700 transition-colors">
                Start →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
