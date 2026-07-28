'use client';

import { useState, useEffect } from 'react';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import type { Level } from '@/types';
import VocabDictionaryModal from '@/components/activities/VocabDictionaryModal';
import { markWordStudied, getStudiedWordIds } from '@/lib/store';

const POS_STYLE: Record<string, string> = {
  noun:      'bg-blue-100 text-blue-700',
  verb:      'bg-emerald-100 text-emerald-700',
  adjective: 'bg-amber-100 text-amber-700',
  adverb:    'bg-purple-100 text-purple-700',
  phrase:    'bg-rose-100 text-rose-700',
};

const LEVEL_INTRO_LABEL: Record<string, string> = {
  foundation: 'Foundation',
  standard:   'Standard',
  challenge:  'Challenge',
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
  const [studiedIds, setStudiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setStudiedIds(new Set(getStudiedWordIds()));
  }, []);

  function handleSelectWord(entry: VocabEntry) {
    markWordStudied(entry.id);
    setStudiedIds(prev => new Set([...prev, entry.id]));
    setSelected(entry);
  }

  return (
    <>
      <div className="space-y-3">
        {words.map(entry => {
          const isStudied = studiedIds.has(entry.id);
          return (
            <button
              key={entry.id}
              onClick={() => handleSelectWord(entry)}
              className={`w-full text-left rounded-2xl border px-6 py-4 hover:border-indigo-300 hover:shadow-sm transition-all ${
                isStudied
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-lg font-bold ${isStudied ? 'text-emerald-800' : 'text-slate-900'}`}>
                    {entry.word}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[entry.pos]}`}>
                    {entry.pos}
                  </span>
                  {level !== 'foundation' && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                      {LEVEL_INTRO_LABEL[entry.introductionLevel]}
                    </span>
                  )}
                </div>
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  isStudied
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {isStudied && (
                    <span className="text-white text-xs font-bold leading-none">✓</span>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-indigo-600 mt-1">{entry.japanese}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <VocabDictionaryModal
          entry={selected}
          themeId={themeId}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
