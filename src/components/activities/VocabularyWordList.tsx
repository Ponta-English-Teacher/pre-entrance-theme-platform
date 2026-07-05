'use client';

import { useState } from 'react';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import type { Level } from '@/types';
import VocabDictionaryModal from '@/components/activities/VocabDictionaryModal';

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
  const [selected, setSelected] = useState<VocabEntry | null>(null);

  return (
    <>
      <div className="space-y-3">
        {words.map(entry => (
          <button
            key={entry.id}
            onClick={() => setSelected(entry)}
            className="w-full text-left bg-white rounded-2xl border border-slate-200 px-6 py-4 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg font-bold text-slate-900">{entry.word}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[entry.pos]}`}>
                {entry.pos}
              </span>
              {level !== 'foundation' && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                  {LEVEL_INTRO_LABEL[entry.introductionLevel]}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-indigo-600 mb-1">{entry.japanese}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{entry.coreMeaning}</p>
          </button>
        ))}
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
