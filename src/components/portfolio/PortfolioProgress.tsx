'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { THEMES, ACTIVITY_DEFS } from '@/data/themes';
import { getReadingsByTheme } from '@/data/reading/masterReadings';
import { getThemeProgress } from '@/lib/store';
import type { ActivityDef, Level, Theme } from '@/types';

/** Same small per-theme accent-color table as ThemeCard.tsx — kept local
 *  rather than shared, matching that component's own precedent, since
 *  Portfolio only needs a single accent bar per row, not the full card. */
const ACCENT: Record<string, string> = {
  violet: 'bg-violet-400', emerald: 'bg-emerald-400', amber: 'bg-amber-400', teal: 'bg-teal-400',
  rose: 'bg-rose-400', sky: 'bg-sky-400', indigo: 'bg-indigo-400', orange: 'bg-orange-400',
  fuchsia: 'bg-fuchsia-400', cyan: 'bg-cyan-400',
};

interface ThemeRow {
  theme: Theme;
  chosenLevel: Level | null;
  visibleActivities: ActivityDef[];
  completedCount: number;
}

/** Mirrors ActivityGrid.tsx's own visible-activity computation exactly, so
 *  "X of Y done" here always matches what the activity list page shows —
 *  no new tracking, just the same existing data read the same way. */
function buildThemeRows(): ThemeRow[] {
  return THEMES.slice()
    .sort((a, b) => a.order - b.order)
    .map(theme => {
      const progress = getThemeProgress(theme.id);
      const level = progress.chosenLevel;
      let visibleActivities: ActivityDef[] = [];
      if (level) {
        const hasStandaloneWriting = getReadingsByTheme(theme.id, level).some(l => l.experienceVersion === 2);
        visibleActivities = ACTIVITY_DEFS.filter(a => {
          if (a.hidden) return false;
          if (a.type === 'writing') return hasStandaloneWriting;
          return true;
        });
      }
      const completedTypes = new Set(progress.completedActivities);
      const completedCount = visibleActivities.filter(a => completedTypes.has(a.type)).length;
      return { theme, chosenLevel: level, visibleActivities, completedCount };
    });
}

export default function PortfolioProgress() {
  // Read after mount only — buildThemeRows() reads localStorage, which
  // isn't available during server rendering, so an initial empty array
  // keeps the server- and first-client-render markup identical and avoids
  // a hydration mismatch (same pattern ActivityGrid.tsx already uses).
  const [rows, setRows] = useState<ThemeRow[]>([]);
  useEffect(() => setRows(buildThemeRows()), []);

  const startedCount = rows.filter(r => r.chosenLevel !== null).length;
  const doneCount = rows.filter(r => r.visibleActivities.length > 0 && r.completedCount === r.visibleActivities.length).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">🗺️</span>
        <div>
          <h2 className="font-bold text-slate-900">Progress</h2>
          <p className="text-xs text-slate-400">進み具合</p>
        </div>
        <span className="ml-auto text-xs font-semibold text-slate-500">
          {doneCount} of 10 themes complete{startedCount > doneCount ? ` · ${startedCount} started` : ''}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map(row => {
          const href = row.chosenLevel ? `/themes/${row.theme.slug}/${row.chosenLevel}` : `/themes/${row.theme.slug}`;
          const pct = row.visibleActivities.length > 0 ? Math.round((row.completedCount / row.visibleActivities.length) * 100) : 0;
          return (
            <Link
              key={row.theme.id}
              href={href}
              className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 px-4 sm:px-6 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className={`w-1.5 h-8 rounded-full shrink-0 ${ACCENT[row.theme.color] ?? 'bg-slate-300'}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-slate-900 truncate">{row.theme.title}</p>
                  <p className="text-xs text-slate-400 truncate">{row.theme.titleJapanese}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pl-[22px] sm:pl-0">
                {row.chosenLevel ? (
                  <>
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {row.completedCount}/{row.visibleActivities.length} done
                    </span>
                    <span className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                      <span
                        className={`block h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Not started</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
