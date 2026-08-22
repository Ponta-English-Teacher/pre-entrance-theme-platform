'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MASTER_READINGS } from '@/data/reading/masterReadings';
import { THEMES } from '@/data/themes';
import { getReadingProgress } from '@/lib/store';
import LevelBadge from '@/components/LevelBadge';
import SelectableContent from '@/components/selection-assistant/SelectableContent';

interface WritingEntry {
  lessonId: string;
  themeId: string;
  themeSlug: string;
  themeTitle: string;
  level: 'foundation' | 'advanced';
  prompt: string;
  text: string;
  status: 'completed' | 'draft';
  completedAt: string | null;
}

/** Only reads existing per-lesson data (etp-reading-progress) — no new
 *  storage, no writing history/versioning beyond the single current draft
 *  that has always been the only copy kept. */
function buildWritingEntries(): WritingEntry[] {
  const entries: WritingEntry[] = [];
  for (const lesson of MASTER_READINGS) {
    const progress = getReadingProgress(lesson.id);
    const hasText = progress.writingDraft.trim().length > 0;
    if (!progress.writingCompleted && !hasText) continue;
    const theme = THEMES.find(t => t.id === lesson.themeId);
    if (!theme) continue;
    entries.push({
      lessonId: lesson.id,
      themeId: theme.id,
      themeSlug: theme.slug,
      themeTitle: theme.title,
      level: lesson.level,
      prompt: lesson.writing.prompt,
      text: progress.writingDraft,
      status: progress.writingCompleted ? 'completed' : 'draft',
      completedAt: progress.writingCompletedAt,
    });
  }
  const completed = entries
    .filter(e => e.status === 'completed')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
  const drafts = entries.filter(e => e.status === 'draft');
  return [...completed, ...drafts];
}

const LIMIT = 4;

export default function PortfolioWriting() {
  const [showAll, setShowAll] = useState(false);
  // Empty until mount, then populated — see PortfolioProgress.tsx for why.
  const [entries, setEntries] = useState<WritingEntry[]>([]);
  useEffect(() => setEntries(buildWritingEntries()), []);

  const visible = showAll ? entries : entries.slice(0, LIMIT);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">✏️</span>
        <div>
          <h2 className="font-bold text-slate-900">My Writing</h2>
          <p className="text-xs text-slate-400">作文</p>
        </div>
        {entries.length > 0 && (
          <span className="ml-auto text-xs font-semibold text-slate-500">
            {entries.length} {entries.length === 1 ? 'piece' : 'pieces'}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
          <p className="text-sm text-slate-400">
            You haven&rsquo;t written anything yet. Your writing will appear here once you start a Writing activity.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-100">
            {visible.map(entry => (
              <div key={entry.lessonId} className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-sm font-semibold text-slate-700">{entry.themeTitle}</span>
                  <LevelBadge level={entry.level} />
                  {entry.status === 'completed' ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Draft — not yet submitted
                    </span>
                  )}
                  {entry.completedAt && (
                    <time className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </time>
                  )}
                </div>

                <p className="text-xs font-medium text-slate-400 mb-1.5 line-clamp-2">{entry.prompt}</p>

                <SelectableContent activityType="writing" themeId={entry.themeId} level={entry.level} label="My Writing">
                  <p className="text-base text-slate-800 leading-relaxed line-clamp-3">{entry.text}</p>
                </SelectableContent>

                <Link
                  href={`/themes/${entry.themeSlug}/${entry.level}/writing`}
                  className="inline-block mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Open →
                </Link>
              </div>
            ))}
          </div>
          {entries.length > LIMIT && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAll(v => !v)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAll ? 'Show fewer ▴' : `Show all ${entries.length} ▾`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
