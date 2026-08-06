'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import type { Level } from '@/types';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import { SELECTION_ASSISTANT_MAX_TEXT_LENGTH, SELECTION_TEXT_TOO_LONG_MESSAGE } from '@/lib/ai/selectionAssistant/types';

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
  themeId,
  level,
}: {
  words: VocabEntry[];
  backHref: string;
  onComplete?: () => void;
  themeId: string;
  level?: Level;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [speechState, setSpeechState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [speechErrorMessage, setSpeechErrorMessage] = useState<string | null>(null);

  const current = words[index];
  const isFirst  = index === 0;
  const isLast   = index === words.length - 1;

  function handlePrev() {
    setRevealed(false);
    setSpeechState('idle');
    setSpeechErrorMessage(null);
    setIndex(i => i - 1);
  }

  function handleNext() {
    setRevealed(false);
    setSpeechState('idle');
    setSpeechErrorMessage(null);
    setIndex(i => i + 1);
  }

  // Tap anywhere on the card to flip — but never while the student has an
  // active text selection, so selecting learning content to ask the
  // Selection Assistant about it never accidentally flips the card.
  function handleCardClick() {
    if (typeof window !== 'undefined' && window.getSelection()?.toString()) return;
    setRevealed(r => !r);
  }

  async function handleSpeak(e: React.MouseEvent) {
    e.stopPropagation();
    if (speechState === 'loading') return;

    // Caught here, before any network call — see SELECTION_ASSISTANT_MAX_TEXT_LENGTH.
    // Not reachable in practice (a single word is always far under the
    // limit), kept for consistency with every other caller of this endpoint.
    if (current.word.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
      setSpeechErrorMessage(SELECTION_TEXT_TOO_LONG_MESSAGE);
      setSpeechState('error');
      return;
    }

    setSpeechErrorMessage(null);
    setSpeechState('loading');
    try {
      const res = await fetch('/api/selection-assistant/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: current.word }),
      });
      if (!res.ok) {
        setSpeechState('error');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      setSpeechState('idle');
    } catch {
      setSpeechState('error');
    }
  }

  const collocationChips = current.collocationsDetailed
    ? current.collocationsDetailed.map(c => c.phrase)
    : current.collocations;

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
        className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-64 flex flex-col cursor-pointer hover:shadow-md transition-shadow ${
          revealed ? 'items-stretch text-left' : 'items-center justify-center text-center select-none'
        }`}
        onClick={handleCardClick}
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
            {/* Word + POS + pronunciation */}
            <SelectableContent activityType="flashcards" themeId={themeId} level={level} label={`Flash Card — ${current.word}`}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{current.word}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[current.pos]}`}>
                  {current.pos}
                </span>
                <button
                  type="button"
                  onClick={handleSpeak}
                  disabled={speechState === 'loading'}
                  className={`transition-colors text-lg leading-none ${
                    speechState === 'error' ? 'text-rose-500' : 'text-slate-400 hover:text-indigo-600'
                  } ${speechState === 'loading' ? 'opacity-50' : ''}`}
                  aria-label="Hear pronunciation"
                  title={speechState === 'error' ? (speechErrorMessage ?? "Couldn't play audio — try again") : 'Hear pronunciation'}
                >
                  🔊
                </button>
              </div>
            </SelectableContent>

            <p className="text-base font-semibold text-indigo-600 mb-4">{current.japanese}</p>

            {/* Simple English */}
            <SelectableContent activityType="flashcards" themeId={themeId} level={level} label={`Flash Card — ${current.word} (meaning)`}>
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Simple English</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{current.coreMeaning}</p>
              </div>
            </SelectableContent>

            {/* Examples */}
            <SelectableContent activityType="flashcards" themeId={themeId} level={level} label={`Flash Card — ${current.word} (examples)`}>
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Examples</h3>
                <ul className="space-y-2">
                  {current.examples.map((ex, i) => (
                    <li key={i} className="pl-3 border-l-2 border-indigo-200 text-sm text-slate-700 leading-relaxed">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </SelectableContent>

            {/* Common Collocations */}
            {collocationChips.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common Collocations</h3>
                <SelectableContent activityType="flashcards" themeId={themeId} level={level} label={`Flash Card — ${current.word} (collocations)`}>
                  <div className="flex flex-wrap gap-2">
                    {collocationChips.map(c => (
                      <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </SelectableContent>
              </div>
            )}

            {/* Derivatives（派生語） */}
            {current.derivatives && current.derivatives.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Derivatives（派生語）</h3>
                <SelectableContent activityType="flashcards" themeId={themeId} level={level} label={`Flash Card — ${current.word} (derivatives)`}>
                  <div className="flex flex-wrap gap-2">
                    {current.derivatives.map(w => (
                      <span key={w} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {w}
                      </span>
                    ))}
                  </div>
                </SelectableContent>
              </div>
            )}

            <p className="text-xs text-slate-400 mt-2 text-center">Tap to flip back</p>
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
