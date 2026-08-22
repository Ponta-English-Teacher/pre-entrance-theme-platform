'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LEVEL_INFO } from '@/data/themes';
import { getThemeProgress, setChosenLevel } from '@/lib/store';
import LevelBadge from '@/components/LevelBadge';
import type { Level } from '@/types';

const BORDER: Record<Level, string> = {
  foundation: 'border-emerald-200 hover:border-emerald-400',
  advanced:   'border-blue-200   hover:border-blue-400',
};

const SELECTED: Record<Level, string> = {
  foundation: 'border-emerald-500 ring-2 ring-emerald-200',
  advanced:   'border-blue-500   ring-2 ring-blue-200',
};

export default function LevelPicker({ themeId, slug }: { themeId: string; slug: string }) {
  const router = useRouter();
  const [savedLevel, setSavedLevel] = useState<Level | null>(null);

  useEffect(() => {
    setSavedLevel(getThemeProgress(themeId).chosenLevel);
  }, [themeId]);

  function handleChoose(level: Level) {
    setChosenLevel(themeId, level);
    setSavedLevel(level);
    router.push(`/themes/${slug}/${level}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-slate-900">Choose Your Level</h2>
        {savedLevel && (
          <span className="flex items-center gap-2 text-sm text-slate-500">
            Last studied: <LevelBadge level={savedLevel} />
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm mb-6">
        You can choose a different level for each theme. Pick what feels right for you today.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LEVEL_INFO.map(info => {
          const isSelected = savedLevel === info.level;
          return (
            <button
              key={info.level}
              onClick={() => handleChoose(info.level)}
              className={`group text-left bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all hover:shadow-md w-full ${
                isSelected ? SELECTED[info.level] : BORDER[info.level]
              }`}
            >
              <div className="mb-3">
                <LevelBadge level={info.level} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{info.label}</h3>
              <p className="text-xs font-semibold text-slate-500 mb-2">{info.labelJapanese}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{info.descriptionJapanese}</p>
              <div className={`mt-5 text-sm font-semibold transition-colors ${
                isSelected ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
              }`}>
                {isSelected ? `Studying at ${info.label} ✓` : `Start ${info.label} →`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
