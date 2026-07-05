'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';

const POS_STYLE: Record<string, string> = {
  noun:      'bg-blue-100 text-blue-700',
  verb:      'bg-emerald-100 text-emerald-700',
  adjective: 'bg-amber-100 text-amber-700',
  adverb:    'bg-purple-100 text-purple-700',
  phrase:    'bg-rose-100 text-rose-700',
};

export default function FlashCards({
  words,
  backHref,
  onComplete,
}: {
  words: VocabEntry[];
  backHref: string;
  onComplete?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = words[index];
  const isFirst  = index === 0;
  const isLast   = index === words.length - 1;

  function handlePrev() {
    setRevealed(false);
    setIndex(i => i - 1);
  }

  function handleNext() {
    setRevealed(false);
    setIndex(i => i + 1);
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          Card {index + 1} of {words.length}
        </span>
        <Link
          href={backHref}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✕ Exit
        </Link>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-8">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((index + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-64 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow select-none"
        onClick={() => setRevealed(r => !r)}
      >
        {!revealed ? (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
              What does this word mean?
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">{current.word}</h2>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${POS_STYLE[current.pos]}`}>
              {current.pos}
            </span>
            <p className="text-xs text-slate-400 mt-8">Tap to reveal</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{current.word}</h2>
            <p className="text-base font-semibold text-indigo-600 mb-4">{current.japanese}</p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">{current.coreMeaning}</p>
            <p className="text-xs text-slate-400 italic mt-4 max-w-sm">
              &ldquo;{current.examples[0]}&rdquo;
            </p>
            <p className="text-xs text-slate-400 mt-6">Tap to flip back</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <span className="text-xs text-slate-400">
          {words.length} {words.length === 1 ? 'word' : 'words'}
        </span>

        {isLast ? (
          onComplete ? (
            <button
              onClick={onComplete}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Next →
            </button>
          ) : (
            <Link
              href={backHref}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Finish
            </Link>
          )
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
