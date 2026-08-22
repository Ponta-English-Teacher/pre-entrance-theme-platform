'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ACTIVITY_DEFS } from '@/data/themes';
import { getReadingsByTheme } from '@/data/reading/masterReadings';
import { getLevelProgress } from '@/lib/store';
import type { Level, ActivityType } from '@/types';

export default function ActivityGrid({
  themeId,
  slug,
  level,
}: {
  themeId: string;
  slug: string;
  level: Level;
}) {
  const [completed, setCompleted] = useState<ActivityType[]>([]);

  useEffect(() => {
    setCompleted(getLevelProgress(themeId, level).completedActivities);
  }, [themeId, level]);

  // Writing is content-gated rather than statically hidden: only visible for
  // a theme/level whose reading lesson has experienceVersion === 2 (Theme 1
  // Foundation, during this prototype stage). Every other theme/level has no
  // such lesson and continues to see the same 3 activities as before.
  const hasStandaloneWriting = getReadingsByTheme(themeId, level).some(l => l.experienceVersion === 2);
  const visibleActivities = ACTIVITY_DEFS.filter(activity => {
    if (activity.hidden) return false;
    if (activity.type === 'writing') return hasStandaloneWriting;
    return true;
  });

  function renderActivityCard(activity: (typeof visibleActivities)[number]) {
    const done = completed.includes(activity.type);
    return (
      <Link
        key={activity.type}
        href={`/themes/${slug}/${level}/${activity.type}`}
        className={`group block bg-white rounded-2xl border p-5 hover:shadow-md transition-all ${
          done
            ? 'border-emerald-200 hover:border-emerald-300'
            : 'border-slate-200 hover:border-indigo-200'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{activity.icon}</span>
          {done && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              ✓ Done
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{activity.label}</h3>
        <p className="text-xs text-slate-400 mb-4">{activity.labelJapanese}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{activity.estimatedMinutes} min</span>
          <span className={`text-xs font-semibold transition-colors ${
            done
              ? 'text-emerald-500 group-hover:text-emerald-700'
              : 'text-indigo-400 group-hover:text-indigo-700'
          }`}>
            {done ? 'Review →' : 'Start →'}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleActivities.map(renderActivityCard)}
    </div>
  );
}
