'use client';

import { useEffect, useState } from 'react';
import { setWordReviewStatus } from '@/lib/store';
import { getThemeVocabulary, type SavedVocabEntry, type ReviewEntry } from '@/lib/portfolio';
import { speakText } from '@/lib/speech';
import { findVocabEntryByWord, type VocabEntry } from '@/data/vocabulary/masterVocabulary';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import LevelBadge from '@/components/LevelBadge';
import VocabDictionaryModal, { type VocabAnchorRect } from '@/components/activities/VocabDictionaryModal';
import type { Level, WordReviewStatus } from '@/types';

/** One theme's vocabulary — Saved and To Review, scoped entirely to this
 *  theme (a word belonging to multiple themes appears under each one it's
 *  actually associated with). Reuses the exact same VocabRow presentation
 *  and TTS/full-card-escalation infrastructure as the earlier global My
 *  Vocabulary section — only the data source is now theme-scoped. */
export default function ThemeVocabularySection({ themeId }: { themeId: string }) {
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllReview, setShowAllReview] = useState(false);
  const [showKnown, setShowKnown] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [fullCard, setFullCard] = useState<{ entry: VocabEntry; themeId: string; level?: Level; anchorRect: VocabAnchorRect | null } | null>(null);

  const [saved, setSaved] = useState<SavedVocabEntry[]>([]);
  const [toReview, setToReview] = useState<ReviewEntry[]>([]);
  const [known, setKnown] = useState<ReviewEntry[]>([]);

  function loadData() {
    const data = getThemeVocabulary(themeId);
    setSaved(data.saved);
    setToReview(data.toReview);
    setKnown(data.known);
  }
  useEffect(loadData, [themeId]);

  function toggleExpand(key: string, e: React.MouseEvent) {
    if (e.detail > 1 || window.getSelection()?.toString()) return;
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  async function handleSpeak(word: string, key: string) {
    if (speaking) return;
    setSpeaking(key);
    await speakText(word);
    setSpeaking(null);
  }

  function handleSetStatus(id: string, status: WordReviewStatus) {
    setWordReviewStatus(id, status);
    loadData();
  }

  function openFullCardFromEntry(entry: VocabEntry, forThemeId: string, level: Level | undefined, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFullCard({ entry, themeId: forThemeId, level, anchorRect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right } });
  }

  const SAVED_LIMIT = 5;
  const REVIEW_LIMIT = 8;
  const visibleSaved = showAllSaved ? saved : saved.slice(0, SAVED_LIMIT);
  const visibleReview = showAllReview ? toReview : toReview.slice(0, REVIEW_LIMIT);

  return (
    <div className="space-y-4">
      {/* Saved */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">📖 Vocabulary — Saved</p>
          {saved.length > 0 && <span className="text-xs font-semibold text-slate-400">{saved.length}</span>}
        </div>

        {saved.length === 0 ? (
          <p className="text-sm text-slate-400">Words you save from this theme&rsquo;s Vocabulary activity will appear here.</p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              {visibleSaved.map((s, i) => {
                const key = `saved-${s.word}-${i}`;
                const resolvedEntry = findVocabEntryByWord(s.word);
                return (
                  <VocabRow
                    key={key}
                    word={s.word}
                    japanese={s.japanese}
                    level={s.level}
                    themeId={s.themeId}
                    metaLabel={`saved ${new Date(s.savedDate).toLocaleDateString()}`}
                    definition={s.definition}
                    example={s.example}
                    expanded={expanded.has(key)}
                    onToggle={e => toggleExpand(key, e)}
                    onSpeak={() => handleSpeak(s.word, key)}
                    speaking={speaking === key}
                    onOpenFullCard={
                      resolvedEntry ? e => openFullCardFromEntry(resolvedEntry, s.themeId, s.level, e) : undefined
                    }
                  />
                );
              })}
            </div>
            {saved.length > SAVED_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllSaved(v => !v)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAllSaved ? 'Show fewer ▴' : `Show all ${saved.length} ▾`}
              </button>
            )}
          </>
        )}
      </div>

      {/* To Review */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">To Review</p>
          {toReview.length > 0 && <span className="text-xs font-semibold text-slate-400">{toReview.length}</span>}
        </div>

        {toReview.length === 0 && known.length === 0 ? (
          <p className="text-sm text-slate-400">No words to review yet — open a word in this theme&rsquo;s Vocabulary activity to add it here.</p>
        ) : (
          <>
            {toReview.length === 0 ? (
              <p className="text-sm text-slate-400">Nothing left to review right now. 🎉</p>
            ) : (
              <div className="space-y-2">
                {visibleReview.map(({ id, entry, status }) => {
                  const key = `review-${id}`;
                  return (
                    <VocabRow
                      key={key}
                      word={entry.word}
                      japanese={entry.japanese}
                      level={entry.introductionLevel}
                      themeId={themeId}
                      definition={entry.coreMeaning}
                      example={entry.examples[0]}
                      expanded={expanded.has(key)}
                      onToggle={e => toggleExpand(key, e)}
                      onSpeak={() => handleSpeak(entry.word, key)}
                      speaking={speaking === key}
                      onOpenFullCard={e => openFullCardFromEntry(entry, themeId, entry.introductionLevel, e)}
                      reviewActions={
                        <>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(id, 'known')}
                            className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            ✓ I know this
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(id, 'learning')}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                              status === 'learning' ? 'bg-amber-100 text-amber-800' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            🔄 Still learning
                          </button>
                        </>
                      }
                    />
                  );
                })}
              </div>
            )}
            {toReview.length > REVIEW_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllReview(v => !v)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAllReview ? 'Show fewer ▴' : `Show all ${toReview.length} ▾`}
              </button>
            )}

            {known.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKnown(v => !v)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  {showKnown ? 'Hide ▴' : `✓ ${known.length} word${known.length === 1 ? '' : 's'} you know — Show ▾`}
                </button>
                {showKnown && (
                  <div className="space-y-2 mt-2">
                    {known.map(({ id, entry }) => {
                      const key = `known-${id}`;
                      return (
                        <VocabRow
                          key={key}
                          word={entry.word}
                          japanese={entry.japanese}
                          level={entry.introductionLevel}
                          themeId={themeId}
                          expanded={expanded.has(key)}
                          onToggle={e => toggleExpand(key, e)}
                          onSpeak={() => handleSpeak(entry.word, key)}
                          speaking={speaking === key}
                          onOpenFullCard={e => openFullCardFromEntry(entry, themeId, entry.introductionLevel, e)}
                          tone="known"
                          reviewActions={
                            <button
                              type="button"
                              onClick={() => handleSetStatus(id, 'learning')}
                              className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            >
                              🔄 Still learning
                            </button>
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {fullCard && (
        <VocabDictionaryModal
          entry={fullCard.entry}
          themeId={fullCard.themeId}
          level={fullCard.level}
          anchorRect={fullCard.anchorRect}
          onClose={() => setFullCard(null)}
        />
      )}
    </div>
  );
}

/** One compact row for every list here (Saved / To Review / Known) — word
 *  and Japanese always visible; everything else only renders once
 *  expanded, so the list stays scannable even with many words. */
function VocabRow({
  word,
  japanese,
  level,
  themeId,
  metaLabel,
  definition,
  example,
  expanded,
  onToggle,
  onSpeak,
  speaking,
  onOpenFullCard,
  reviewActions,
  tone = 'default',
}: {
  word: string;
  japanese: string;
  level?: Level;
  themeId?: string;
  metaLabel?: string;
  definition?: string;
  example?: string;
  expanded: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onSpeak: () => void;
  speaking: boolean;
  onOpenFullCard?: (e: React.MouseEvent) => void;
  reviewActions?: React.ReactNode;
  tone?: 'default' | 'known';
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${tone === 'known' ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200'}`}>
      <div className="w-full flex items-center gap-1 pl-3 pr-1.5 py-2">
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(e as unknown as React.MouseEvent); } }}
          className="min-w-0 flex-1 flex items-center gap-2 cursor-pointer text-left"
          aria-expanded={expanded}
          aria-label={`${word} — ${expanded ? 'collapse' : 'expand'} details`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-slate-900">{word}</span>
              {japanese && <span className="text-sm font-medium text-indigo-600">{japanese}</span>}
            </div>
            {metaLabel && <p className="text-xs text-slate-400 mt-0.5 truncate">{metaLabel}</p>}
          </div>
          {level && <span className="shrink-0"><LevelBadge level={level} /></span>}
        </div>
        <button
          type="button"
          onClick={onSpeak}
          disabled={speaking}
          aria-label={`Hear pronunciation of ${word}`}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-base hover:bg-indigo-50 transition-colors disabled:opacity-40"
        >
          🔊
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          className="shrink-0 w-9 h-9 flex items-center justify-center text-slate-300"
        >
          <span className={`inline-block transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">⌄</span>
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100">
          <SelectableContent activityType="vocabulary" themeId={themeId} level={level} label={`My Vocabulary — ${word}`}>
            {definition && <p className="text-sm text-slate-600 leading-relaxed mb-2">{definition}</p>}
            {example && <p className="text-sm text-slate-500 italic leading-relaxed mb-3">&ldquo;{example}&rdquo;</p>}
          </SelectableContent>
          {(reviewActions || onOpenFullCard) && (
            <div className="flex flex-wrap items-center gap-2">
              {reviewActions}
              {onOpenFullCard && (
                <button
                  type="button"
                  onClick={onOpenFullCard}
                  className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  🔍 Full word card →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
