'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';

type Status = 'idle' | 'correct' | 'wrong' | 'revealed';

function blankSentence(sentence: string, word: string): string {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return sentence.replace(new RegExp(escaped, 'gi'), '_____');
}

export default function FillBlank({
  words,
  backHref,
  onComplete,
}: {
  words: VocabEntry[];
  backHref: string;
  onComplete: () => void;
}) {
  const [index,  setIndex]  = useState(0);
  const [input,  setInput]  = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = words[index];
  const blanked = blankSentence(current.examples[0], current.word);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  useEffect(() => {
    if (status !== 'correct' && status !== 'revealed') return;
    const delay = status === 'correct' ? 800 : 1500;
    const timer = setTimeout(() => {
      if (index < words.length - 1) {
        setIndex(i => i + 1);
        setInput('');
        setStatus('idle');
      } else {
        onComplete();
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [status, index, words.length, onComplete]);

  useEffect(() => {
    if (status !== 'wrong') return;
    const timer = setTimeout(() => {
      setInput('');
      setStatus('idle');
      inputRef.current?.focus();
    }, 1000);
    return () => clearTimeout(timer);
  }, [status]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'idle') return;
    const answer = input.trim().toLowerCase();
    if (answer === current.word.toLowerCase()) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  }

  function handleReveal() {
    if (status === 'correct' || status === 'revealed') return;
    setStatus('revealed');
  }

  const isAnswered = status === 'correct' || status === 'revealed';

  const inputClass = [
    'w-full px-4 py-3 rounded-xl border-2 text-slate-900 font-medium text-base outline-none transition-all placeholder:text-slate-300',
    status === 'correct'  ? 'border-emerald-500 bg-emerald-50' :
    status === 'wrong'    ? 'border-rose-400 bg-rose-50' :
    status === 'revealed' ? 'border-slate-300 bg-slate-50' :
                            'border-slate-200 focus:border-indigo-400',
  ].join(' ');

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          Word {index + 1} of {words.length}
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

      {/* Prompt card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 space-y-3">
        <p className="text-base font-semibold text-indigo-600">{current.japanese}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{current.coreMeaning}</p>
        <p className="text-sm text-slate-700 leading-relaxed italic pl-3 border-l-2 border-indigo-200">
          {blanked}
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => { if (status === 'idle') setInput(e.target.value); }}
          placeholder="Type the English word…"
          disabled={isAnswered}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={inputClass}
        />

        {status === 'correct' && (
          <p className="text-sm font-semibold text-emerald-600">✓ Correct!</p>
        )}
        {status === 'wrong' && (
          <p className="text-sm font-semibold text-rose-500">✗ Try again</p>
        )}
        {status === 'revealed' && (
          <p className="text-sm text-slate-600">
            The answer is:{' '}
            <span className="font-bold text-indigo-700">{current.word}</span>
          </p>
        )}

        {!isAnswered && (
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={input.trim().length === 0}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check
            </button>
            <button
              type="button"
              onClick={handleReveal}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all"
            >
              Reveal
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
