import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getThemeBySlug, ACTIVITY_DEFS, isValidLevel, isValidActivityType } from '@/data/themes';
import LevelBadge from '@/components/LevelBadge';
import VocabularyActivity from '@/components/activities/VocabularyActivity';
import ReadingActivity from '@/components/activities/ReadingActivity';
import WritingActivity from '@/components/activities/WritingActivity';
import AITalkActivity from '@/components/activities/AITalkActivity';
import type { Level, ActivityType } from '@/types';

export default async function ActivityPlayerPage({
  params,
}: {
  params: Promise<{ slug: string; level: string; type: string }>;
}) {
  const { slug, level: rawLevel, type: rawType } = await params;

  const theme = getThemeBySlug(slug);
  if (!theme) notFound();

  // Pre-migration bookmarks/links from the old three-level (Foundation/
  // Standard/Challenge) architecture — normalize to Advanced rather than
  // 404ing on an old but still-recognizable URL.
  if (rawLevel === 'standard' || rawLevel === 'challenge') {
    redirect(`/themes/${slug}/advanced/${rawType}`);
  }
  if (!isValidLevel(rawLevel)) notFound();
  if (!isValidActivityType(rawType)) notFound();

  const level    = rawLevel as Level;
  const type     = rawType  as ActivityType;
  const activity = ACTIVITY_DEFS.find(a => a.type === type)!;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-3 sm:mb-6 flex-wrap">
        <Link href="/themes" className="hover:text-slate-600 transition-colors">Themes</Link>
        <span>›</span>
        <Link href={`/themes/${slug}`} className="hover:text-slate-600 transition-colors">{theme.title}</Link>
        <span>›</span>
        <Link href={`/themes/${slug}/${level}`} className="hover:text-slate-600 transition-colors capitalize">{level}</Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">{activity.label}</span>
      </nav>

      {/* Activity header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-8">
        <span className="text-2xl sm:text-3xl">{activity.icon}</span>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{activity.label}</h1>
            <LevelBadge level={level} />
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            {theme.title} · {activity.labelJapanese} · {activity.estimatedMinutes} min
          </p>
        </div>
      </div>

      {/* Activity content */}
      {type === 'vocabulary' ? (
        <VocabularyActivity themeId={theme.id} level={level} />
      ) : type === 'reading' ? (
        <ReadingActivity themeId={theme.id} level={level} />
      ) : type === 'writing' ? (
        <WritingActivity themeId={theme.id} level={level} />
      ) : type === 'ai-talk' ? (
        <AITalkActivity themeId={theme.id} level={level} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">{activity.icon}</div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Activity coming soon</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Content for <strong>{theme.title}</strong> — {activity.label} ({level}) will be added here.
          </p>
          <Link
            href={`/themes/${slug}/${level}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            ← Back to Activities
          </Link>
        </div>
      )}
    </div>
  );
}
