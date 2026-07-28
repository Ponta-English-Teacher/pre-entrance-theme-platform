'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getReadingProgress } from '@/lib/store';
import type { ReadingProgress } from '@/lib/store';
import type { ReadingPassage } from '@/data/reading/masterReadings';
import type { Level } from '@/types';

export default function ReadingPassageList({
  passages,
  themeId,
  level,
}: {
  passages: ReadingPassage[];
  themeId: string;
  level: Level;
}) {
  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgress>>({});

  useEffect(() => {
    const map: Record<string, ReadingProgress> = {};
    passages.forEach(p => { map[p.id] = getReadingProgress(p.id); });
    setProgressMap(map);
  }, [passages]);

  return (
    <div className="space-y-4">
      {passages.map(passage => {
        const progress = progressMap[passage.id];
        return (
          <Link
            key={passage.id}
            href={`/reading?theme=${themeId}&level=${level}&passage=${passage.id}`}
            className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{passage.title}</h3>
                <p className="text-sm font-medium text-indigo-600 mb-2">{passage.titleJapanese}</p>
                <p className="text-xs text-slate-400">
                  {passage.paragraphs.length} paragraphs · {passage.estimatedMinutes} min
                </p>
              </div>
              {progress?.completed ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 whitespace-nowrap">
                  ✓ Done
                </span>
              ) : progress && progress.lastParagraphIndex > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 whitespace-nowrap">
                  In progress
                </span>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
