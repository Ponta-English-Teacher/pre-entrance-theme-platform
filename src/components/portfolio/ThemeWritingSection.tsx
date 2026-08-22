'use client';

import Link from 'next/link';
import LevelBadge from '@/components/LevelBadge';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import type { ThemeWritingEntry, WritingFeedbackItem } from '@/lib/portfolio';

/** One theme's writing — Foundation's piece first, then Advanced's, never
 *  merged. Reused verbatim in structure from the earlier global My Writing
 *  section, just scoped to entries the parent theme card already filtered. */
export default function ThemeWritingSection({
  themeId,
  themeSlug,
  entries,
  expandedIds,
  onToggle,
}: {
  themeId: string;
  themeSlug: string;
  entries: ThemeWritingEntry[];
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  if (entries.length === 0) {
    return (
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">✏️ Writing</p>
        <p className="text-sm text-slate-400">No writing yet for this theme.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">✏️ Writing</p>
      <div className="space-y-3">
        {entries.map(entry => (
          <WritingCard
            key={entry.lessonId}
            themeId={themeId}
            themeSlug={themeSlug}
            entry={entry}
            isExpanded={expandedIds.has(entry.lessonId)}
            onToggle={() => onToggle(entry.lessonId)}
          />
        ))}
      </div>
    </div>
  );
}

function WritingCard({
  themeId,
  themeSlug,
  entry,
  isExpanded,
  onToggle,
}: {
  themeId: string;
  themeSlug: string;
  entry: ThemeWritingEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-2.5">
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <LevelBadge level={entry.level} />
        {entry.status === 'completed' ? (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Completed</span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Draft</span>
        )}
        {entry.completedAt && (
          <time className="ml-auto text-xs text-slate-400 whitespace-nowrap">
            {new Date(entry.completedAt).toLocaleDateString()}
          </time>
        )}
      </div>

      <p className="text-xs font-medium text-slate-400 mb-1.5 line-clamp-2">{entry.prompt}</p>

      <SelectableContent activityType="writing" themeId={themeId} level={entry.level} label="My Writing">
        <p className={`text-sm text-slate-800 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>{entry.text}</p>
      </SelectableContent>

      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <Link
          href={`/themes/${themeSlug}/${entry.level}/writing`}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          {entry.status === 'completed' ? 'Review & revise' : 'Continue writing'} →
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          {isExpanded ? 'Show less ▴' : 'Show full writing & saved feedback ▾'}
        </button>
      </div>

      {isExpanded && entry.feedback.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Things I saved ({entry.feedback.length})
          </p>
          <div className="space-y-2">
            {entry.feedback.map(item => (
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
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2">
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
