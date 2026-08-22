'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { markActivityComplete, markPracticeSetComplete } from '@/lib/store';
import type { Level } from '@/types';

export default function EndScreen({
  wordCount,
  gameScore,
  fillScore,
  themeId,
  level,
  setNumber,
}: {
  wordCount: number;
  gameScore: number;
  fillScore: number;
  themeId:   string;
  level:     string;
  setNumber: number;
}) {
  const router = useRouter();

  useEffect(() => {
    markPracticeSetComplete(themeId, level, setNumber);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDone() {
    markActivityComplete(themeId, level as Level, 'vocabulary');
    router.push(`/themes/${themeId}/${level}`);
  }

  const perfect = (n: number) => n === wordCount;

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Complete!</h2>
      <p className="text-slate-500 text-sm mb-8">Here is how you did this session.</p>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 mb-8 text-left">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📖</span>
            <span className="font-medium text-slate-700">Flash Cards</span>
          </div>
          <span className="text-sm text-slate-500">{wordCount} reviewed</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <span className="font-medium text-slate-700">Matching Game</span>
          </div>
          <span className={`text-sm font-semibold ${perfect(gameScore) ? 'text-emerald-600' : 'text-slate-500'}`}>
            {gameScore} / {wordCount} correct
          </span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">✏️</span>
            <span className="font-medium text-slate-700">Fill in the Blank</span>
          </div>
          <span className={`text-sm font-semibold ${perfect(fillScore) ? 'text-emerald-600' : 'text-slate-500'}`}>
            {fillScore} / {wordCount} correct
          </span>
        </div>
      </div>

      <button
        onClick={handleDone}
        className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
      >
        Done — Back to Activities
      </button>
    </div>
  );
}
