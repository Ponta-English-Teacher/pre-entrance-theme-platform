'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getReadingProgress, saveReadingProgress, markReadingComplete, markActivityComplete } from '@/lib/store';
import type { ReadingPassage } from '@/data/reading/masterReadings';
import ProgressBar from '@/components/ProgressBar';

export default function ReadingPassageReader({
  passage,
  themeId,
  backHref,
}: {
  passage: ReadingPassage;
  themeId: string;
  backHref: string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const progress = getReadingProgress(passage.id);
    const start = Math.min(progress.lastParagraphIndex, passage.paragraphs.length - 1);
    setIndex(progress.completed ? 0 : Math.max(0, start));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passage.id]);

  useEffect(() => {
    if (!hydrated) return;
    saveReadingProgress(passage.id, index);
  }, [hydrated, passage.id, index]);

  const current = passage.paragraphs[index];
  const isFirst = index === 0;
  const isLast  = index === passage.paragraphs.length - 1;

  function goTo(i: number) {
    setShowTranslation(false);
    setIndex(i);
  }

  function handleFinish() {
    markReadingComplete(passage.id);
    markActivityComplete(themeId, 'reading');
    router.push(`/themes/${themeId}/${passage.level}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{passage.title}</h1>
          <p className="text-sm font-medium text-indigo-600">{passage.titleJapanese}</p>
        </div>
        <Link href={backHref} className="text-sm text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap mt-1">
          ✕ Exit
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">
          Paragraph {index + 1} of {passage.paragraphs.length}
        </span>
      </div>
      <div className="mb-4">
        <ProgressBar current={index + 1} total={passage.paragraphs.length} />
      </div>

      {/* Paragraph navigator */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {passage.paragraphs.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            aria-label={`Go to paragraph ${i + 1}`}
            aria-current={i === index ? 'step' : undefined}
            className={`w-6 h-6 rounded-full text-xs font-semibold transition-colors ${
              i === index
                ? 'bg-indigo-600 text-white'
                : i < index
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Passage card */}
      <div
        id={current.id}
        data-paragraph-index={index}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-64"
      >
        <p className="text-lg text-slate-900 leading-relaxed">{current.english}</p>

        {showTranslation && (
          <p
            id={`${current.id}-translation`}
            className="text-sm text-slate-500 leading-relaxed mt-5 pt-5 border-t border-slate-100"
          >
            {current.japanese}
          </p>
        )}

        <button
          onClick={() => setShowTranslation(v => !v)}
          aria-expanded={showTranslation}
          aria-controls={`${current.id}-translation`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-6"
        >
          {showTranslation ? '日本語を隠す ▴' : '日本語訳を見る ▾'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => goTo(index - 1)}
          disabled={isFirst}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            onClick={handleFinish}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Finish Reading
          </button>
        ) : (
          <button
            onClick={() => goTo(index + 1)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
