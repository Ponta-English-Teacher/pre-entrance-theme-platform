'use client';

import { useEffect, useState } from 'react';
import { THEMES } from '@/data/themes';
import { getMostRecentlyStartedThemeId } from '@/lib/portfolio';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioThemeCard from '@/components/portfolio/PortfolioThemeCard';

/**
 * Portfolio is organized around themes, not global sections — each of the
 * 10 themes is one compact card (Foundation/Advanced progress, always
 * visible) with a single "View my learning" toggle that reveals that
 * theme's own Writing/Vocabulary/Saved Learning/Recent activity. Only one
 * theme opens at a time, so the page never becomes a long scroll of every
 * student's entire history at once.
 */
export default function PortfolioPage() {
  // null until mount (server/first-client render stay consistent, avoiding
  // a hydration mismatch), then set once to whichever theme has the most
  // recent LevelProgress.startedAt — existing data, no new persistence.
  const [openThemeId, setOpenThemeId] = useState<string | null>(null);
  useEffect(() => setOpenThemeId(getMostRecentlyStartedThemeId()), []);

  const sortedThemes = THEMES.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
      <p className="text-slate-500 text-sm mb-4">Your learning, by theme.</p>

      <PortfolioSummary />

      <div className="space-y-3">
        {sortedThemes.map(theme => (
          <PortfolioThemeCard
            key={theme.id}
            theme={theme}
            isOpen={openThemeId === theme.id}
            onToggle={() => setOpenThemeId(prev => (prev === theme.id ? null : theme.id))}
          />
        ))}
      </div>
    </div>
  );
}
