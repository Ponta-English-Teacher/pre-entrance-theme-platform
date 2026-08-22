'use client';

import { useEffect, useState } from 'react';
import { getStudiedWordIds } from '@/lib/store';
import { getSavedVocabulary, type SavedVocabEntry } from '@/lib/portfolio';
import { getVocabById, type VocabEntry } from '@/data/vocabulary/masterVocabulary';
import { THEMES } from '@/data/themes';
import SelectableContent from '@/components/selection-assistant/SelectableContent';

function buildSeenWords(savedWordsLower: Set<string>): VocabEntry[] {
  return getStudiedWordIds()
    .map(id => getVocabById(id))
    .filter((v): v is VocabEntry => !!v)
    .filter(v => !savedWordsLower.has(v.word.toLowerCase()));
}

function themeTitle(themeId: string): string {
  return THEMES.find(t => t.id === themeId)?.title ?? themeId;
}

const SAVED_LIMIT = 6;
const SEEN_LIMIT = 24;

export default function PortfolioVocabulary() {
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllSeen, setShowAllSeen] = useState(false);

  // Empty until mount, then populated — see PortfolioProgress.tsx for why.
  const [saved, setSaved] = useState<SavedVocabEntry[]>([]);
  const [seen, setSeen] = useState<VocabEntry[]>([]);
  useEffect(() => {
    const savedList = getSavedVocabulary();
    setSaved(savedList);
    // "Seen" = words the student opened in the Vocabulary word list — a much
    // weaker signal than an explicit Save, and deliberately never described
    // as learned/mastered. Words already in the Saved list are excluded so
    // the same word isn't shown twice under two different meanings.
    setSeen(buildSeenWords(new Set(savedList.map(s => s.word.toLowerCase()))));
  }, []);

  const visibleSaved = showAllSaved ? saved : saved.slice(0, SAVED_LIMIT);
  const visibleSeen = showAllSeen ? seen : seen.slice(0, SEEN_LIMIT);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">📖</span>
        <div>
          <h2 className="font-bold text-slate-900">Vocabulary</h2>
          <p className="text-xs text-slate-400">語彙</p>
        </div>
      </div>

      {/* Saved */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved</h3>
          {saved.length > 0 && <span className="text-xs font-semibold text-slate-400">{saved.length}</span>}
        </div>

        {saved.length === 0 ? (
          <p className="text-sm text-slate-400">Words you save during Vocabulary activities will appear here.</p>
        ) : (
          <>
            <div className="space-y-4">
              {visibleSaved.map((entry, i) => (
                <div key={`${entry.word}-${entry.themeId}-${i}`} className="flex items-start gap-3">
                  <SelectableContent activityType="vocabulary" themeId={entry.themeId} label={`Saved — ${entry.word}`} className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-slate-900">{entry.word}</span>
                      {entry.japanese && <span className="text-sm font-medium text-indigo-600">{entry.japanese}</span>}
                      <span className="text-xs text-slate-400">{themeTitle(entry.themeId)}</span>
                    </div>
                    {entry.definition && <p className="text-sm text-slate-600 leading-relaxed">{entry.definition}</p>}
                  </SelectableContent>
                  <time className="text-xs text-slate-400 whitespace-nowrap mt-0.5">
                    {new Date(entry.savedDate).toLocaleDateString()}
                  </time>
                </div>
              ))}
            </div>
            {saved.length > SAVED_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllSaved(v => !v)}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAllSaved ? 'Show fewer ▴' : `Show all ${saved.length} ▾`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Seen — deliberately lightweight: no explanation shown, no claim of mastery. */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Words You&rsquo;ve Opened</h3>
          {seen.length > 0 && <span className="text-xs font-semibold text-slate-400">{seen.length}</span>}
        </div>
        <p className="text-xs text-slate-400 mb-3">Words you&rsquo;ve looked up — not necessarily learned yet.</p>

        {seen.length === 0 ? (
          <p className="text-sm text-slate-400">No words opened yet.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {visibleSeen.map(v => (
                <span key={v.id} className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {v.word} <span className="text-slate-400">{v.japanese}</span>
                </span>
              ))}
            </div>
            {seen.length > SEEN_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllSeen(v => !v)}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAllSeen ? 'Show fewer ▴' : `Show all ${seen.length} ▾`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
