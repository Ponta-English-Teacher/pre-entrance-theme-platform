'use client';

import { useState } from 'react';
import type { WordBankEntry, UsefulExpression } from '@/data/reading/masterReadings';
import { getVocabById } from '@/data/vocabulary/masterVocabulary';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import type { Level } from '@/types';

/**
 * The Writing Toolbox — Theme 1's standalone Writing activity only. Neutral
 * white/gray cards, indigo as the only accent, consistent with the rest of
 * the application rather than a separate orange identity for this page.
 *
 * Every item supports two coexisting interactions: click → insert into the
 * draft, and select text → the app-wide Selection Assistant (Translate/How
 * to Read/Easy English). Items are `role="button"` divs rather than real
 * `<button>` elements because the Selection Assistant's `extractContext`
 * deliberately ignores selections inside `<button>`/`<a>`/form controls —
 * the same click-vs-select disambiguation pattern already used for Mission
 * Check's answer options in ReadingLessonViewV2.
 */

/** Bolds the target word wherever it appears inside an example phrase, so the
 *  phrase reads naturally while still showing which word it demonstrates —
 *  the word supports the sentence, not the other way around. */
function highlightWord(text: string, word: string): React.ReactNode[] {
  const cleanWord = word.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === cleanWord.toLowerCase()
      ? <strong key={i} className="text-indigo-700 font-bold">{part}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function WritingToolbox({
  themeId,
  level,
  sentenceStarters,
  wordBank,
  extraVocabIds,
  usefulExpressions,
  onInsert,
}: {
  themeId: string;
  level: Level;
  sentenceStarters?: string[];
  wordBank: WordBankEntry[];
  extraVocabIds: string[];
  usefulExpressions: UsefulExpression[];
  onInsert: (text: string) => void;
}) {
  const [showMore, setShowMore] = useState(false);
  // Brief "Inserted!" confirmation on whichever item was just clicked — keyed
  // by a unique string per item so only that one item shows the feedback.
  const [justInserted, setJustInserted] = useState<string | null>(null);

  function handleInsert(key: string, text: string) {
    onInsert(text);
    setJustInserted(key);
    window.setTimeout(() => setJustInserted(prev => (prev === key ? null : prev)), 1400);
  }

  // A drag-select (or a multi-click used to select a word/line) ends with
  // mouseup over this item and would otherwise also fire its click handler —
  // treat that as "select", not "click to insert". Same guard used by Mission
  // Check's answer options in ReadingLessonViewV2.
  function handleItemClick(e: React.MouseEvent, key: string, text: string) {
    if (e.detail > 1 || window.getSelection()?.toString()) return;
    handleInsert(key, text);
  }

  function handleItemKeyDown(e: React.KeyboardEvent, key: string, text: string) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    handleInsert(key, text);
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg sm:text-xl" aria-hidden="true">
          🧰
        </span>
        <h2 className="text-xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">Writing Toolbox</h2>
      </div>
      <p className="text-base leading-[1.5] text-slate-400 mb-5 sm:mb-6 ml-[48px] sm:ml-[52px]">Everything you need to write your answer</p>

      {/* Discoverability hint */}
      <div className="mb-6 sm:mb-9 flex items-start gap-2.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3.5">
        <span aria-hidden="true">💡</span>
        <p className="text-base leading-[1.5]">
          <span className="text-slate-700">Click any word or phrase below to insert it into your writing.</span>
          <br />
          <span className="text-slate-400">クリックすると文章に自動で挿入されます。</span>
        </p>
      </div>

      {/* Sentence Starters — writing blocks, not chips: students read these
          carefully while writing, so they need real reading weight. */}
      {sentenceStarters && sentenceStarters.length > 0 && (
        <div className="mb-6 sm:mb-9">
          <p className="text-base font-bold text-slate-600 uppercase tracking-widest mb-3">Sentence Starters</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {sentenceStarters.map(starter => {
              const key = `starter-${starter}`;
              const inserted = justInserted === key;
              return (
                <div
                  key={starter}
                  role="button"
                  tabIndex={0}
                  onClick={e => handleItemClick(e, key, starter)}
                  onKeyDown={e => handleItemKeyDown(e, key, starter)}
                  className="text-left px-4 py-4 rounded-xl border border-slate-200 bg-white cursor-pointer transition-all hover:border-indigo-300 hover:bg-indigo-50/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                >
                  {inserted ? (
                    <span className="text-base leading-[1.5] font-bold text-emerald-600">✓ Inserted!</span>
                  ) : (
                    <SelectableContent activityType="writing-toolbox" themeId={themeId} level={level} label="Sentence Starter">
                      <span className="text-base leading-[1.5] text-slate-700">{starter}</span>
                    </SelectableContent>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Word Bank — example phrase first, word/gloss as supporting detail.
          Word/gloss deliberately stay at 14px (not the 16px "learning content"
          floor) — they remain secondary to the example sentence, per explicit
          design intent, while still being comfortably readable. */}
      <div className="mb-6 sm:mb-9">
        <p className="text-base font-bold text-slate-600 uppercase tracking-widest mb-3">Word Bank</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {wordBank.map(entry => {
            const vocab = getVocabById(entry.vocabId);
            if (!vocab) return null;
            const key = `wb-${entry.vocabId}`;
            const inserted = justInserted === key;
            return (
              <div
                key={entry.vocabId}
                role="button"
                tabIndex={0}
                onClick={e => handleItemClick(e, key, entry.examplePhrase)}
                onKeyDown={e => handleItemKeyDown(e, key, entry.examplePhrase)}
                className="text-left rounded-2xl border border-slate-200 bg-white px-5 py-4 cursor-pointer transition-all hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:transition-none"
              >
                <SelectableContent activityType="writing-toolbox" themeId={themeId} level={level} label="Word Bank">
                  <p className="font-serif text-base sm:text-lg leading-[1.5] text-slate-900 mb-3">
                    {highlightWord(entry.examplePhrase, vocab.word)}
                  </p>
                </SelectableContent>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[15px] font-semibold bg-slate-100 text-slate-600">
                    {vocab.word}
                  </span>
                  <span className="text-[15px] text-slate-600">{vocab.japanese}</span>
                  <span
                    className={`ml-auto flex items-center gap-1 text-sm font-bold text-emerald-600 transition-opacity ${
                      inserted ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-live="polite"
                  >
                    ✓ Inserted!
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {extraVocabIds.length > 0 && (
          <>
            {showMore && (
              <div className="flex flex-wrap gap-2 mt-3">
                {extraVocabIds.map(id => {
                  const vocab = getVocabById(id);
                  if (!vocab) return null;
                  const key = `extra-${id}`;
                  const inserted = justInserted === key;
                  return (
                    <div
                      key={id}
                      role="button"
                      tabIndex={0}
                      onClick={e => handleItemClick(e, key, vocab.word)}
                      onKeyDown={e => handleItemKeyDown(e, key, vocab.word)}
                      className="px-3.5 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 cursor-pointer transition-all hover:border-indigo-300 hover:bg-indigo-50/40 active:scale-95"
                    >
                      {inserted ? (
                        <span className="text-emerald-600 font-bold">✓ Inserted!</span>
                      ) : (
                        <>
                          <SelectableContent activityType="writing-toolbox" themeId={themeId} level={level} label="Word Bank — Extra Word" className="inline">
                            {vocab.word}
                          </SelectableContent>{' '}
                          <span className="text-slate-500">({vocab.japanese})</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowMore(v => !v)}
              className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {showMore ? 'Show fewer words ▴' : 'Show more words ▾'}
            </button>
          </>
        )}
      </div>

      {/* Useful Expressions — readable writing resources, not decorative pills */}
      <div>
        <p className="text-base font-bold text-slate-600 uppercase tracking-widest mb-3">Useful Expressions</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {usefulExpressions.map(expr => {
            const key = `expr-${expr.phrase}`;
            const inserted = justInserted === key;
            return (
              <div
                key={expr.phrase}
                role="button"
                tabIndex={0}
                onClick={e => handleItemClick(e, key, expr.phrase)}
                onKeyDown={e => handleItemKeyDown(e, key, expr.phrase)}
                className="text-left px-4 py-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer transition-all hover:border-indigo-300 hover:bg-indigo-50/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              >
                {inserted ? (
                  <span className="text-base leading-[1.5] font-bold text-emerald-600">✓ Inserted!</span>
                ) : (
                  <>
                    <SelectableContent activityType="writing-toolbox" themeId={themeId} level={level} label="Useful Expression">
                      <p className="text-base leading-[1.5] font-medium text-slate-800">{expr.phrase}</p>
                    </SelectableContent>
                    <p className="text-base leading-[1.5] text-slate-600 mt-0.5">{expr.japanese}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
