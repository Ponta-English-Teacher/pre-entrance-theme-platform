'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLevelSummary, getThemeWriting, type LevelSummary, type ThemeWritingEntry } from '@/lib/portfolio';
import ThemeWritingSection from '@/components/portfolio/ThemeWritingSection';
import ThemeVocabularySection from '@/components/portfolio/ThemeVocabularySection';
import ThemeNotebookSection from '@/components/portfolio/ThemeNotebookSection';
import ThemeRecentSection from '@/components/portfolio/ThemeRecentSection';
import type { Level, Theme } from '@/types';

/** Same small per-theme accent-color table as ThemeCard.tsx (the /themes
 *  list page's own card) — kept local rather than shared, matching that
 *  component's own precedent. */
const ACCENT: Record<string, string> = {
  violet: 'bg-violet-400', emerald: 'bg-emerald-400', amber: 'bg-amber-400', teal: 'bg-teal-400',
  rose: 'bg-rose-400', sky: 'bg-sky-400', indigo: 'bg-indigo-400', orange: 'bg-orange-400',
  fuchsia: 'bg-fuchsia-400', cyan: 'bg-cyan-400',
};

const LEVEL_META: Record<Level, { label: string; tone: string }> = {
  foundation: { label: 'Foundation', tone: 'bg-emerald-100 text-emerald-700' },
  advanced: { label: 'Advanced', tone: 'bg-blue-100 text-blue-700' },
};

const EMPTY_SUMMARY = (level: Level): LevelSummary => ({ level, totalActivities: 0, completedActivities: 0, status: 'not-started' });

export default function PortfolioThemeCard({
  theme,
  isOpen,
  onToggle,
}: {
  theme: Theme;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // Empty-safe defaults until mount — localStorage isn't available during
  // server rendering, so this keeps the server- and first-client-render
  // markup identical and avoids a hydration mismatch (same pattern used
  // throughout Portfolio).
  const [levels, setLevels] = useState<[LevelSummary, LevelSummary]>([EMPTY_SUMMARY('foundation'), EMPTY_SUMMARY('advanced')]);
  useEffect(() => {
    setLevels([getLevelSummary(theme.id, 'foundation'), getLevelSummary(theme.id, 'advanced')]);
  }, [theme.id]);

  // Writing needs to be loaded here (not inside ThemeWritingSection) because
  // its per-card expand state also lives here — Vocabulary/Notebook/Recent
  // each own their own data lifecycle instead, since nothing above them
  // needs to know their contents.
  const [writingEntries, setWritingEntries] = useState<ThemeWritingEntry[]>([]);
  const [expandedWritingIds, setExpandedWritingIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (isOpen) setWritingEntries(getThemeWriting(theme.id));
  }, [isOpen, theme.id]);

  function toggleWritingExpand(id: string) {
    setExpandedWritingIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 mb-2.5">
          <span className={`w-1.5 h-9 rounded-full shrink-0 ${ACCENT[theme.color] ?? 'bg-slate-300'}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-base font-bold text-slate-900 truncate">{theme.title}</p>
            <p className="text-xs text-slate-400 truncate">{theme.titleJapanese}</p>
          </div>
        </div>

        <div className="pl-[22px] space-y-1.5">
          {levels.map(summary => (
            <LevelRow key={summary.level} themeSlug={theme.slug} summary={summary} />
          ))}
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="mt-2.5 ml-[22px] flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          {isOpen ? 'Hide my learning' : 'View my learning'}
          <span className={`inline-block transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
        </button>
      </div>

      {isOpen && (
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/40 space-y-5">
          <ThemeWritingSection
            themeId={theme.id}
            themeSlug={theme.slug}
            entries={writingEntries}
            expandedIds={expandedWritingIds}
            onToggle={toggleWritingExpand}
          />
          <div className="border-t border-slate-100 pt-4">
            <ThemeVocabularySection themeId={theme.id} />
          </div>
          <div className="border-t border-slate-100 pt-4">
            <ThemeNotebookSection themeId={theme.id} />
          </div>
          <div className="border-t border-slate-100 pt-4">
            <ThemeRecentSection themeId={theme.id} />
          </div>
        </div>
      )}
    </div>
  );
}

function LevelRow({ themeSlug, summary }: { themeSlug: string; summary: LevelSummary }) {
  const meta = LEVEL_META[summary.level];
  const pct = summary.totalActivities > 0 ? Math.round((summary.completedActivities / summary.totalActivities) * 100) : 0;
  return (
    <Link
      href={`/themes/${themeSlug}/${summary.level}`}
      className="flex items-center gap-2 py-1 -mx-2 px-2 rounded-lg hover:bg-slate-50 transition-colors"
    >
      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${meta.tone}`}>
        {meta.label}
      </span>
      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
        {summary.completedActivities}/{summary.totalActivities} done
      </span>
      <span className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-[6rem]" aria-hidden="true">
        <span
          className={`block h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-400'}`}
          style={{ width: `${pct}%` }}
        />
      </span>
    </Link>
  );
}
