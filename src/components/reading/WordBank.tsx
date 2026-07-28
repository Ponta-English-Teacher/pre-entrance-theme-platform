'use client';

import { useState } from 'react';
import type { WordBankEntry, UsefulExpression } from '@/data/reading/masterReadings';
import { getVocabById } from '@/data/vocabulary/masterVocabulary';

export default function WordBank({
  wordBank,
  extraVocabIds,
  usefulExpressions,
  onInsert,
}: {
  wordBank: WordBankEntry[];
  extraVocabIds: string[];
  usefulExpressions: UsefulExpression[];
  onInsert: (text: string) => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Word Bank</p>

      <div className="flex flex-col gap-2 mb-3">
        {wordBank.map(entry => {
          const vocab = getVocabById(entry.vocabId);
          if (!vocab) return null;
          return (
            <button
              key={entry.vocabId}
              type="button"
              onClick={() => onInsert(entry.examplePhrase)}
              className="text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-colors"
            >
              <span className="font-semibold text-slate-900">{vocab.word}</span>{' '}
              <span className="text-xs text-indigo-600">{vocab.japanese}</span>
              <span className="block text-xs text-slate-400 mt-0.5">{entry.examplePhrase}</span>
            </button>
          );
        })}
      </div>

      {extraVocabIds.length > 0 && (
        <>
          {showMore && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {extraVocabIds.map(id => {
                const vocab = getVocabById(id);
                if (!vocab) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onInsert(vocab.word)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 hover:border-indigo-300 transition-colors"
                  >
                    {vocab.word} <span className="text-slate-400">({vocab.japanese})</span>
                  </button>
                );
              })}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowMore(v => !v)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mb-3"
          >
            {showMore ? 'Show fewer words ▴' : 'Show more words ▾'}
          </button>
        </>
      )}

      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Useful Expressions</p>
      <div className="flex flex-wrap gap-1.5">
        {usefulExpressions.map(expr => (
          <button
            key={expr.phrase}
            type="button"
            onClick={() => onInsert(expr.phrase + ' ')}
            title={expr.japanese}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 hover:border-indigo-300 transition-colors"
          >
            {expr.phrase}
          </button>
        ))}
      </div>
    </div>
  );
}
