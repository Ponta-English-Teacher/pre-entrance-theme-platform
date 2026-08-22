'use client';

import { useEffect, useState } from 'react';
import { getWordStatuses, setWordReviewStatus } from '@/lib/store';
import { getSavedVocabulary, type SavedVocabEntry } from '@/lib/portfolio';
import { speakText } from '@/lib/speech';
import { getVocabById, findVocabEntryByWord, type VocabEntry } from '@/data/vocabulary/masterVocabulary';
import { THEMES } from '@/data/themes';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import LevelBadge from '@/components/LevelBadge';
import VocabDictionaryModal, { type VocabAnchorRect } from '@/components/activities/VocabDictionaryModal';
import type { Level, WordReviewStatus } from '@/types';

/**
 * "My Vocabulary" — a real review area, not a record of clicks. Reuses
 * existing infrastructure end to end rather than building anything
 * parallel: the same pronunciation endpoint VocabDictionaryModal already
 * calls (src/lib/speech.ts), and VocabDictionaryModal itself for the "full
 * word card" escalation (which already carries the Selection Assistant's
 * Translate/How to Read/Easy English support on any selected text inside
 * it — real AI help, with zero new backend work).
 */

interface ReviewEntry {
  id: string;
  entry: VocabEntry;
  status: WordReviewStatus;
}

function themeTitle(themeId: string): string {
  return THEMES.find(t => t.id === themeId)?.title ?? themeId;
}

const SAVED_LIMIT = 5;
const REVIEW_LIMIT = 8;

export default function PortfolioVocabulary() {
  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllReview, setShowAllReview] = useState(false);
  const [showKnown, setShowKnown] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [fullCard, setFullCard] = useState<{ entry: VocabEntry; themeId: string; level?: Level; anchorRect: VocabAnchorRect | null } | null>(null);

  // Empty until mount, then populated — localStorage isn't available during
  // server rendering (see PortfolioProgress.tsx for the same pattern).
  const [saved, setSaved] = useState<SavedVocabEntry[]>([]);
  const [toReview, setToReview] = useState<ReviewEntry[]>([]);
  const [known, setKnown] = useState<ReviewEntry[]>([]);

  function loadData() {
    const savedList = getSavedVocabulary();
    setSaved(savedList);

    // Words already Saved carry a stronger, deliberate signal than merely
    // having been opened — excluded here so the same word never appears
    // under two different confidence levels at once.
    const savedWordsLower = new Set(savedList.map(s => s.word.toLowerCase()));
    const resolved: ReviewEntry[] = Object.entries(getWordStatuses())
      .map(([id, status]) => ({ id, entry: getVocabById(id), status }))
      .filter((x): x is ReviewEntry => !!x.entry)
      .filter(x => !savedWordsLower.has(x.entry.word.toLowerCase()));

    setToReview(resolved.filter(x => x.status !== 'known'));
    setKnown(resolved.filter(x => x.status === 'known'));
  }
  useEffect(loadData, []);

  function toggleExpand(key: string, e: React.MouseEvent) {
    // A drag-select or a multi-click (used to select a word) ending on this
    // row shouldn't also toggle it — same guard already used for Mission
    // Check's answer options and the Writing Toolbox's items.
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

  function openFullCardFromEntry(entry: VocabEntry, themeId: string, level: Level | undefined, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFullCard({ entry, themeId, level, anchorRect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right } });
  }

  const visibleSaved = showAllSaved ? saved : saved.slice(0, SAVED_LIMIT);
  const visibleReview = showAllReview ? toReview : toReview.slice(0, REVIEW_LIMIT);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">📖</span>
        <div>
          <h2 className="font-bold text-slate-900">My Vocabulary</h2>
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
            <div className="grid gap-2 sm:grid-cols-2">
              {visibleSaved.map((s, i) => {
                const key = `saved-${s.word}-${s.themeId}-${i}`;
                const resolvedEntry = findVocabEntryByWord(s.word);
                return (
                  <VocabRow
                    key={key}
                    word={s.word}
                    japanese={s.japanese}
                    level={s.level}
                    themeId={s.themeId}
                    metaLabel={`${themeTitle(s.themeId)} · saved ${new Date(s.savedDate).toLocaleDateString()}`}
                    definition={s.definition}
                    example={s.example}
                    expanded={expanded.has(key)}
                    onToggle={e => toggleExpand(key, e)}
                    onSpeak={() => handleSpeak(s.word, key)}
                    speaking={speaking === key}
                    onOpenFullCard={
                      resolvedEntry
                        ? e => openFullCardFromEntry(resolvedEntry, s.themeId, s.level, e)
                        : undefined
                    }
                  />
                );
              })}
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

      {/* To Review — words opened but not explicitly saved. A real review
          queue: "I know this" moves a word into the collapsed Known list;
          "Still learning" keeps it here, both fully reversible. */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">To Review</h3>
          {toReview.length > 0 && <span className="text-xs font-semibold text-slate-400">{toReview.length}</span>}
        </div>
        <p className="text-xs text-slate-400 mb-3">Words you&rsquo;ve opened — not necessarily learned yet.</p>

        {toReview.length === 0 && known.length === 0 ? (
          <p className="text-sm text-slate-400">No words to review yet — open a word in the Vocabulary activity to add it here.</p>
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
                      themeId={entry.themes[0]}
                      metaLabel={entry.themes[0] ? themeTitle(entry.themes[0]) : undefined}
                      definition={entry.coreMeaning}
                      example={entry.examples[0]}
                      expanded={expanded.has(key)}
                      onToggle={e => toggleExpand(key, e)}
                      onSpeak={() => handleSpeak(entry.word, key)}
                      speaking={speaking === key}
                      onOpenFullCard={e => openFullCardFromEntry(entry, entry.themes[0] ?? '', entry.introductionLevel, e)}
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
                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAllReview ? 'Show fewer ▴' : `Show all ${toReview.length} ▾`}
              </button>
            )}

            {known.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKnown(v => !v)}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  {showKnown ? 'Hide ▴' : `✓ ${known.length} word${known.length === 1 ? '' : 's'} you know — Show ▾`}
                </button>
                {showKnown && (
                  <div className="space-y-2 mt-3">
                    {known.map(({ id, entry }) => {
                      const key = `known-${id}`;
                      return (
                        <VocabRow
                          key={key}
                          word={entry.word}
                          japanese={entry.japanese}
                          level={entry.introductionLevel}
                          themeId={entry.themes[0]}
                          metaLabel={entry.themes[0] ? themeTitle(entry.themes[0]) : undefined}
                          definition={entry.coreMeaning}
                          example={entry.examples[0]}
                          expanded={expanded.has(key)}
                          onToggle={e => toggleExpand(key, e)}
                          onSpeak={() => handleSpeak(entry.word, key)}
                          speaking={speaking === key}
                          onOpenFullCard={e => openFullCardFromEntry(entry, entry.themes[0] ?? '', entry.introductionLevel, e)}
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

/** One compact row for every list in this section (Saved / To Review /
 *  Known) — word and Japanese always visible and prominent; everything
 *  else (definition, example, review actions, the full-card escalation)
 *  only renders once expanded, so the default view stays scannable even
 *  with many words. */
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
