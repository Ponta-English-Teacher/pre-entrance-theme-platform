'use client';

import { useState, useEffect } from 'react';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import type { Level } from '@/types';
import VocabDictionaryModal, { type VocabAnchorRect } from '@/components/activities/VocabDictionaryModal';
import { markWordStudied, getStudiedWordIds } from '@/lib/store';

/**
 * The standalone Vocabulary Preview activity's word list — deliberately
 * compact and dense, for quick learning/review before Reading. One framed
 * list with hairline dividers between words, not a stack of separate cards.
 * This is a different purpose from the Writing Toolbox's Word Bank (which
 * stays example-sentence-first, unchanged) — that one supports production
 * while writing; this one supports fast recall/review.
 */

const LEVEL_INTRO_LABEL: Record<string, string> = {
  foundation: 'Foundation',
  advanced:   'Advanced',
};

export default function VocabularyWordList({
  words,
  themeId,
  level,
}: {
  words: VocabEntry[];
  themeId: string;
  level: Level;
}) {
  const [selected,   setSelected]   = useState<VocabEntry | null>(null);
  const [anchorRect, setAnchorRect] = useState<VocabAnchorRect | null>(null);
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setStudiedIds(new Set(getStudiedWordIds()));
  }, []);

  function handleSelectWord(entry: VocabEntry, e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right });
    markWordStudied(entry.id);
    setStudiedIds(prev => new Set([...prev, entry.id]));
    setSelected(entry);
  }

  function renderColumn(list: VocabEntry[]) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
        {list.map(entry => {
          const isStudied = studiedIds.has(entry.id);
          return (
            <button
              key={entry.id}
              onClick={e => handleSelectWord(entry, e)}
              className={`w-full flex items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                isStudied ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-base font-bold ${isStudied ? 'text-emerald-800' : 'text-slate-900'}`}>
                    {entry.word}
                  </span>
                  <span className="text-xs text-slate-400">{entry.pos}</span>
                  {level !== 'foundation' && (
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500">
                      {LEVEL_INTRO_LABEL[entry.introductionLevel]}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-indigo-600">{entry.japanese}</p>
              </div>
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isStudied
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-300'
              }`}>
                {isStudied && (
                  <span className="text-white text-xs font-bold leading-none">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const half = Math.ceil(words.length / 2);
  const leftColumn = words.slice(0, half);
  const rightColumn = words.slice(half);

  return (
    <>
      <div className="sm:hidden">{renderColumn(words)}</div>
      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4">
        {renderColumn(leftColumn)}
        {renderColumn(rightColumn)}
      </div>

      {selected && (
        <VocabDictionaryModal
          entry={selected}
          themeId={themeId}
          anchorRect={anchorRect}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
