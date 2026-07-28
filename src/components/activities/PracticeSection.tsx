'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompletedPracticeSets } from '@/lib/store';

export default function PracticeSection({
  themeId,
  level,
  setCounts,
}: {
  themeId:   string;
  level:     string;
  setCounts: number[];
}) {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    setCompleted(getCompletedPracticeSets(themeId, level));
  }, [themeId, level]);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Practice</h2>
      <p className="text-sm text-slate-500 mb-4">
        Study these words through flash cards, a matching game, and fill-in-the-blank.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {setCounts.map((count, i) => {
          const setNumber  = i + 1;
          const isComplete = completed.includes(setNumber);
          return (
            <Link
              key={setNumber}
              href={`/vocab-shooter?theme=${themeId}&level=${level}&set=${setNumber}`}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-4 py-5 hover:shadow-sm transition-all text-center ${
                isComplete
                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isComplete ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {isComplete ? '✓ ' : ''}Set {setNumber}
              </span>
              <span className={`text-2xl font-bold ${isComplete ? 'text-emerald-700' : 'text-slate-900'}`}>
                {count}
              </span>
              <span className="text-xs text-slate-400">{count === 1 ? 'word' : 'words'}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
