'use client';

import { useEffect, useState } from 'react';
import { getThemeRecentEvents, type RecentEvent } from '@/lib/portfolio';
import LevelBadge from '@/components/LevelBadge';

const LIMIT = 5;

/** "What have I recently done in this theme?" — small and concise by
 *  design; the full detail behind each event lives in the section above it
 *  (Writing, Vocabulary, Saved Learning), this is just a quick timeline. */
export default function ThemeRecentSection({ themeId }: { themeId: string }) {
  const [events, setEvents] = useState<RecentEvent[]>([]);
  useEffect(() => setEvents(getThemeRecentEvents(themeId).slice(0, LIMIT)), [themeId]);

  if (events.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">🕒 Recent in This Theme</p>
      <ul className="space-y-1.5">
        {events.map((event, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="shrink-0" aria-hidden="true">{event.icon}</span>
            <span className="text-slate-600 flex-1 min-w-0 truncate">{event.text}</span>
            {event.level && <span className="shrink-0"><LevelBadge level={event.level} /></span>}
            <time className="shrink-0 text-xs text-slate-400 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
