'use client';

import { useState, useEffect } from 'react';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import { addGlossaryItem, isWordInGlossary } from '@/lib/store';

const POS_STYLE: Record<string, string> = {
  noun:      'bg-blue-100 text-blue-700',
  verb:      'bg-emerald-100 text-emerald-700',
  adjective: 'bg-amber-100 text-amber-700',
  adverb:    'bg-purple-100 text-purple-700',
  phrase:    'bg-rose-100 text-rose-700',
};

export default function VocabDictionaryModal({
  entry,
  themeId,
  onClose,
}: {
  entry: VocabEntry;
  themeId: string;
  onClose: () => void;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isWordInGlossary(entry.word));
  }, [entry.word]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleSave() {
    addGlossaryItem({
      word: entry.word,
      japanese: entry.japanese,
      definition: entry.coreMeaning,
      example: entry.examples[0],
      themeId,
      savedDate: new Date().toISOString(),
    });
    setSaved(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">{entry.word}</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[entry.pos]}`}>
              {entry.pos}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors ml-4 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-base font-semibold text-indigo-600">{entry.japanese}</p>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meaning</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{entry.coreMeaning}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Examples</h3>
            <ul className="space-y-2">
              {entry.examples.map((ex, i) => (
                <li key={i} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-indigo-200">
                  {ex}
                </li>
              ))}
            </ul>
          </div>

          {entry.relatedWords.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Related words</h3>
              <div className="flex flex-wrap gap-2">
                {entry.relatedWords.map(w => (
                  <span key={w} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              saved
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saved ? '✓ Saved to Glossary' : 'Save to Glossary'}
          </button>
        </div>
      </div>
    </div>
  );
}
