'use client';

import { useEffect, useState } from 'react';
import { MASTER_READINGS } from '@/data/reading/masterReadings';
import { THEMES } from '@/data/themes';
import { getReadingProgress } from '@/lib/store';
import { getSavedVocabulary, getReviewableNotebookItems } from '@/lib/portfolio';
import { getNotebookSectionConfig } from '@/data/notebook/sections';

interface RecentEvent {
  date: string;
  icon: string;
  text: string;
}

function themeTitle(themeId: string): string {
  return THEMES.find(t => t.id === themeId)?.title ?? themeId;
}

/** Only events that already carry a real timestamp in existing storage.
 *  Vocabulary practice-set completion and AI Talk completion are
 *  deliberately excluded — neither records a date anywhere today, and this
 *  never manufactures one just to make an event appear here. */
function buildRecentEvents(): RecentEvent[] {
  const events: RecentEvent[] = [];

  for (const lesson of MASTER_READINGS) {
    const progress = getReadingProgress(lesson.id);
    if (progress.completed && progress.completedAt) {
      events.push({ date: progress.completedAt, icon: '📰', text: `Completed Reading — ${themeTitle(lesson.themeId)}` });
    }
    if (progress.writingCompleted && progress.writingCompletedAt) {
      events.push({ date: progress.writingCompletedAt, icon: '🖊️', text: `Completed Writing — ${themeTitle(lesson.themeId)}` });
    }
  }

  for (const entry of getSavedVocabulary()) {
    events.push({ date: entry.savedDate, icon: '📖', text: `Saved word: ${entry.word}` });
  }

  for (const item of getReviewableNotebookItems()) {
    const section = getNotebookSectionConfig(item.category);
    events.push({ date: item.savedAt, icon: section?.icon ?? '📓', text: `Saved ${section?.label ?? 'note'} — ${themeTitle(item.themeId)}` });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

const LIMIT = 8;

export default function PortfolioRecent() {
  // Empty until mount, then populated — see PortfolioProgress.tsx for why.
  const [events, setEvents] = useState<RecentEvent[]>([]);
  useEffect(() => setEvents(buildRecentEvents().slice(0, LIMIT)), []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">🕒</span>
        <div>
          <h2 className="font-bold text-slate-900">Recent Learning</h2>
          <p className="text-xs text-slate-400">最近の学習</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
          <p className="text-sm text-slate-400">Nothing yet — start a lesson to see your recent learning here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {events.map((event, i) => (
            <li key={i} className="px-4 sm:px-6 py-3 flex items-center gap-3">
              <span className="text-base shrink-0" aria-hidden="true">{event.icon}</span>
              <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">{event.text}</span>
              <time className="text-xs text-slate-400 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
