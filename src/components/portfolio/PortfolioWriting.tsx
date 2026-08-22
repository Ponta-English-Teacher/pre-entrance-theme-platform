'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MASTER_READINGS } from '@/data/reading/masterReadings';
import { THEMES } from '@/data/themes';
import { getReadingProgress } from '@/lib/store';
import { getWritingFeedbackFor, type WritingFeedbackItem } from '@/lib/portfolio';
import LevelBadge from '@/components/LevelBadge';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import type { Level } from '@/types';

interface WritingEntry {
  lessonId: string;
  themeId: string;
  themeSlug: string;
  themeTitle: string;
  level: Level;
  prompt: string;
  text: string;
  status: 'completed' | 'draft';
  completedAt: string | null;
}

/** Only reads existing per-lesson data (etp-reading-progress) — no new
 *  storage, no writing history/versioning beyond the single current draft
 *  that has always been the only copy kept. Revising a completed piece
 *  later never touches writingCompleted/writingCompletedAt (WritingActivity
 *  only ever sets them once, the first time a piece is finished), so a
 *  completed date shown here always reflects the original completion —
 *  exactly what "don't destroy the fact it had been completed" requires,
 *  with no change needed to that logic. */
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Empty until mount, then populated — localStorage isn't available during
  // server rendering (see PortfolioProgress.tsx for the same pattern).
  const [entries, setEntries] = useState<WritingEntry[]>([]);
  useEffect(() => setEntries(buildWritingEntries()), []);

  const visible = showAll ? entries : entries.slice(0, LIMIT);

  function toggle(lessonId: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId); else next.add(lessonId);
      return next;
    });
  }

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
              <WritingCard
                key={entry.lessonId}
                entry={entry}
                isExpanded={expanded.has(entry.lessonId)}
                onToggle={() => toggle(entry.lessonId)}
              />
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

function WritingCard({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: WritingEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Only computed once expanded — a plain array read, no extra hydration
  // concern (Notebook is already available by the time a student can click).
  const feedback = isExpanded ? getWritingFeedbackFor(entry.themeId, entry.level) : [];

  return (
    <div className="px-4 sm:px-6 py-4">
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
        <p className={`text-base text-slate-800 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>{entry.text}</p>
      </SelectableContent>

      <div className="flex items-center gap-3 mt-2.5 flex-wrap">
        <Link
          href={`/themes/${entry.themeSlug}/${entry.level}/writing`}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          {entry.status === 'completed' ? 'Review & revise' : 'Continue writing'} →
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          {isExpanded ? 'Show less ▴' : 'Show full writing & saved feedback ▾'}
        </button>
      </div>

      {isExpanded && feedback.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Things I saved ({feedback.length})
          </p>
          <div className="space-y-2.5">
            {feedback.map(item => (
              <FeedbackCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ item }: { item: WritingFeedbackItem }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
      <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
        {item.label && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600 uppercase tracking-wide">
            {item.label}
          </span>
        )}
        <time className="ml-auto text-xs text-slate-400 whitespace-nowrap">
          {new Date(item.savedAt).toLocaleDateString()}
        </time>
      </div>
      <p className="font-serif text-sm text-slate-800 leading-relaxed">{item.content}</p>
      {item.explanation && <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.explanation}</p>}
    </div>
  );
}
