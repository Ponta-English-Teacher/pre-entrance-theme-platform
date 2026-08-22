'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { THEMES, ACTIVITY_DEFS } from '@/data/themes';
import { getReadingsByTheme } from '@/data/reading/masterReadings';
import { getLevelProgress } from '@/lib/store';
import type { ActivityDef, Level, Theme } from '@/types';

/** Same small per-theme accent-color table as ThemeCard.tsx — kept local
 *  rather than shared, matching that component's own precedent, since
 *  Portfolio only needs a single accent bar per row, not the full card. */
const ACCENT: Record<string, string> = {
  violet: 'bg-violet-400', emerald: 'bg-emerald-400', amber: 'bg-amber-400', teal: 'bg-teal-400',
  rose: 'bg-rose-400', sky: 'bg-sky-400', indigo: 'bg-indigo-400', orange: 'bg-orange-400',
  fuchsia: 'bg-fuchsia-400', cyan: 'bg-cyan-400',
};

const LEVELS: { level: Level; label: string; tone: string }[] = [
  { level: 'foundation', label: 'Foundation', tone: 'bg-emerald-100 text-emerald-700' },
  { level: 'advanced',   label: 'Advanced',   tone: 'bg-blue-100 text-blue-700' },
];

interface LevelRow {
  level: Level;
  visibleActivities: ActivityDef[];
  completedCount: number;
}

interface ThemeRow {
  theme: Theme;
  levelRows: LevelRow[];
}

/** Foundation and Advanced are independent learning tracks — different
 *  vocabulary, Reading, Writing, and AI Talk content — so each theme's
 *  progress is now two separate level rows, never one merged number.
 *  Mirrors ActivityGrid.tsx's own visible-activity computation exactly for
 *  each level, so "X of Y done" here always matches what that level's own
 *  activity list page shows. */
function buildThemeRows(): ThemeRow[] {
  return THEMES.slice()
    .sort((a, b) => a.order - b.order)
    .map(theme => {
      const levelRows: LevelRow[] = LEVELS.map(({ level }) => {
        const hasStandaloneWriting = getReadingsByTheme(theme.id, level).some(l => l.experienceVersion === 2);
        const visibleActivities = ACTIVITY_DEFS.filter(a => {
          if (a.hidden) return false;
          if (a.type === 'writing') return hasStandaloneWriting;
          return true;
        });
        const completedTypes = new Set(getLevelProgress(theme.id, level).completedActivities);
        const completedCount = visibleActivities.filter(a => completedTypes.has(a.type)).length;
        return { level, visibleActivities, completedCount };
      });
      return { theme, levelRows };
    });
}

export default function PortfolioProgress() {
  // Read after mount only — buildThemeRows() reads localStorage, which
  // isn't available during server rendering, so an initial empty array
  // keeps the server- and first-client-render markup identical and avoids
  // a hydration mismatch (same pattern ActivityGrid.tsx already uses).
  const [rows, setRows] = useState<ThemeRow[]>([]);
  useEffect(() => setRows(buildThemeRows()), []);

  const allLevelRows = rows.flatMap(r => r.levelRows);
  const totalTracks = allLevelRows.length; // 10 themes x 2 levels, once loaded
  const doneTracks = allLevelRows.filter(r => r.visibleActivities.length > 0 && r.completedCount === r.visibleActivities.length).length;
  const inProgressTracks = allLevelRows.filter(r => r.completedCount > 0 && r.completedCount < r.visibleActivities.length).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">🗺️</span>
        <div>
          <h2 className="font-bold text-slate-900">Progress</h2>
          <p className="text-xs text-slate-400">進み具合</p>
        </div>
        {totalTracks > 0 && (
          <span className="ml-auto text-xs font-semibold text-slate-500">
            {doneTracks} of {totalTracks} levels complete{inProgressTracks > 0 ? ` · ${inProgressTracks} in progress` : ''}
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map(row => (
          <div key={row.theme.id} className="px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-1.5 h-8 rounded-full shrink-0 ${ACCENT[row.theme.color] ?? 'bg-slate-300'}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 truncate">{row.theme.title}</p>
                <p className="text-xs text-slate-400 truncate">{row.theme.titleJapanese}</p>
              </div>
            </div>

            <div className="pl-[22px] space-y-1.5">
              {row.levelRows.map(lr => {
                const meta = LEVELS.find(l => l.level === lr.level)!;
                const pct = lr.visibleActivities.length > 0 ? Math.round((lr.completedCount / lr.visibleActivities.length) * 100) : 0;
                return (
                  <Link
                    key={lr.level}
                    href={`/themes/${row.theme.slug}/${lr.level}`}
                    className="flex items-center gap-2 py-1 -mx-2 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${meta.tone}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {lr.completedCount}/{lr.visibleActivities.length} done
                    </span>
                    <span className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[6rem]" aria-hidden="true">
                      <span
                        className={`block h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
