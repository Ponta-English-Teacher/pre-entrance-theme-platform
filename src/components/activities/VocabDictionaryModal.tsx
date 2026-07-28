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

function speak(word: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(word);
  utt.lang = 'en-US';
  window.speechSynthesis.speak(utt);
}

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
        {/* Header — word + POS + TTS + Japanese (prominent) */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-2xl font-bold text-slate-900">{entry.word}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[entry.pos]}`}>
                {entry.pos}
              </span>
              <button
                onClick={() => speak(entry.word)}
                className="text-slate-400 hover:text-indigo-600 transition-colors text-lg leading-none"
                aria-label="Hear pronunciation"
                title="Hear pronunciation"
              >
                🔊
              </button>
            </div>
            <p className="text-xl font-bold text-indigo-700">{entry.japanese}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors ml-4 text-xl leading-none flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Meaning — English + Japanese translation */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meaning</h3>
            <p className="text-slate-700 text-sm leading-relaxed">{entry.coreMeaning}</p>
            {entry.coreMeaningJa && (
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{entry.coreMeaningJa}</p>
            )}
          </div>

          {/* Examples — each with Japanese translation when available */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Examples</h3>
            <ul className="space-y-3">
              {entry.examples.map((ex, i) => (
                <li key={i} className="pl-3 border-l-2 border-indigo-200">
                  <p className="text-sm text-slate-700 leading-relaxed">{ex}</p>
                  {entry.exampleTranslations?.[i] && (
                    <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                      {entry.exampleTranslations[i]}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* How to use it (detailed) — or Common phrases chips (fallback) */}
          {entry.collocationsDetailed ? (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">How to use it</h3>
              <ul className="space-y-3">
                {entry.collocationsDetailed.map((c, i) => (
                  <li key={i} className="pl-3 border-l-2 border-slate-200">
                    <p className="text-sm">
                      <span className="font-bold text-slate-800">{c.phrase}</span>
                      <span className="text-slate-500 ml-2">{c.glossJa}</span>
                    </p>
                    <p className="text-sm text-indigo-700 mt-0.5">→ {c.example}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : entry.collocations.length > 0 ? (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common phrases</h3>
              <div className="flex flex-wrap gap-2">
                {entry.collocations.map(c => (
                  <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Why it matters — Japanese first, English second, shorter */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Why it matters</h3>
            {entry.themeNoteJa && (
              <p className="text-sm text-amber-800 font-medium mb-1 leading-relaxed">{entry.themeNoteJa}</p>
            )}
            <p className="text-sm text-amber-900 leading-relaxed">{entry.themeNote}</p>
          </div>

          {/* Other meanings — bilingual (detailed) or English-only (fallback) */}
          {entry.otherMeaningsBilingual ? (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Other meanings</h3>
              <ul className="space-y-3">
                {entry.otherMeaningsBilingual.map((m, i) => (
                  <li key={i} className="pl-3 border-l-2 border-slate-200">
                    <p className="text-sm">
                      <span className="font-semibold text-slate-700">{m.ja}</span>
                      <span className="text-slate-400 ml-2 text-xs">({m.en})</span>
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">{m.example}</p>
                    <p className="text-sm text-slate-500">{m.exampleJa}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : entry.otherMeanings && entry.otherMeanings.length > 0 ? (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Other meanings</h3>
              <ul className="space-y-1.5">
                {entry.otherMeanings.map((m, i) => (
                  <li key={i} className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Related words */}
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
