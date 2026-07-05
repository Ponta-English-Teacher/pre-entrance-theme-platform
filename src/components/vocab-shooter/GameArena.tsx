'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';

interface Choice {
  id: string;
  japanese: string;
  isCorrect: boolean;
}

function buildChoices(current: VocabEntry, pool: VocabEntry[]): Choice[] {
  const distractors = pool
    .filter(w => w.id !== current.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [...distractors, current]
    .sort(() => Math.random() - 0.5)
    .map(w => ({ id: w.id, japanese: w.japanese, isCorrect: w.id === current.id }));
}

export default function GameArena({
  words,
  allWords,
  backHref,
  onComplete,
}: {
  words: VocabEntry[];
  allWords: VocabEntry[];
  backHref: string;
  onComplete: () => void;
}) {
  const [index, setIndex]       = useState(0);
  const [selectedId, setSelected] = useState<string | null>(null);
  const [score, setScore]       = useState(0);
  const [choices, setChoices]   = useState<Choice[]>(() =>
    buildChoices(words[0], allWords)
  );

  const current = words[index];

  useEffect(() => {
    setChoices(buildChoices(words[index], allWords));
    setSelected(null);
  }, [index, words, allWords]);

  function handleSelect(choice: Choice) {
    if (selectedId !== null) return;
    setSelected(choice.id);
    if (choice.isCorrect) setScore(s => s + 1);

    const delay = choice.isCorrect ? 700 : 1300;
    setTimeout(() => {
      if (index < words.length - 1) {
        setIndex(i => i + 1);
      } else {
        onComplete();
      }
    }, delay);
  }

  function choiceStyle(choice: Choice): string {
    const base = 'w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all';
    if (selectedId === null) {
      return `${base} border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer`;
    }
    if (choice.isCorrect) {
      return `${base} border-emerald-500 bg-emerald-50 text-emerald-800 cursor-default`;
    }
    if (choice.id === selectedId) {
      return `${base} border-rose-400 bg-rose-50 text-rose-700 cursor-default`;
    }
    return `${base} border-slate-100 text-slate-300 cursor-default`;
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          Question {index + 1} of {words.length}
        </span>
        <Link href={backHref} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
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

      {/* Word prompt */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center mb-6 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Choose the correct meaning
        </p>
        <h2 className="text-4xl font-bold text-slate-900">{current.word}</h2>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {choices.map(choice => (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice)}
            disabled={selectedId !== null}
            className={choiceStyle(choice)}
          >
            {choice.japanese}
          </button>
        ))}
      </div>

      {/* Score (visible after first answer) */}
      {score > 0 && (
        <p className="text-center text-xs text-slate-400 mt-6">
          {score} correct so far
        </p>
      )}
    </div>
  );
}
