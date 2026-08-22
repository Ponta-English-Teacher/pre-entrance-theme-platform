'use client';

import { useEffect, useState } from 'react';
import { getPortfolioSummary, type PortfolioSummary as Summary } from '@/lib/portfolio';

const EMPTY: Summary = { totalLevels: 20, completeLevels: 0, themesStarted: 0, wordsToReview: 0 };

/** One compact line of global context above the 10 theme cards — never a
 *  large section of its own. Every number is a simple aggregate of the same
 *  per-theme data each theme card already shows. */
export default function PortfolioSummary() {
  const [summary, setSummary] = useState<Summary>(EMPTY);
  useEffect(() => setSummary(getPortfolioSummary()), []);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mb-5 sm:mb-6">
      <span>
        <span className="font-bold text-slate-900">{summary.completeLevels}</span> of {summary.totalLevels} levels complete
      </span>
      <span className="text-slate-300" aria-hidden="true">·</span>
      <span>
        <span className="font-bold text-slate-900">{summary.themesStarted}</span> theme{summary.themesStarted === 1 ? '' : 's'} started
      </span>
      {summary.wordsToReview > 0 && (
        <>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span>
            <span className="font-bold text-slate-900">{summary.wordsToReview}</span> word{summary.wordsToReview === 1 ? '' : 's'} to review
          </span>
        </>
      )}
    </div>
  );
}
