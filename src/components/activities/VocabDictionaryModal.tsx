'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { VocabEntry } from '@/data/vocabulary/masterVocabulary';
import { findVocabEntryByWord } from '@/data/vocabulary/masterVocabulary';
import { addGlossaryItem, isWordInGlossary } from '@/lib/store';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import type { VocabLookupResponse } from '@/lib/ai/vocabLookup/types';

const POS_STYLE: Record<string, string> = {
  noun:      'bg-blue-100 text-blue-700',
  verb:      'bg-emerald-100 text-emerald-700',
  adjective: 'bg-amber-100 text-amber-700',
  adverb:    'bg-purple-100 text-purple-700',
  phrase:    'bg-rose-100 text-rose-700',
};

const GAP = 12;
const DESKTOP_BREAKPOINT = 640;

export interface VocabAnchorRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

type DisplayState =
  | { status: 'ready'; entry: VocabEntry }
  | { status: 'loading'; word: string }
  | { status: 'error'; word: string; baseWord: string; error: string };

/**
 * Foundation-level vocabulary card: "What do I need to know to use this
 * word today?" — not a general dictionary. Reading teaches the word in
 * context, Writing teaches production, AI Talk teaches natural use; this
 * card only prepares students for those, so it stays deliberately short.
 * Anchored next to the word that opened it (desktop) or a bottom sheet
 * (mobile), rather than a centered dialog, so it reads as attached to the
 * word rather than a detached popup.
 *
 * Every word shown here should be explorable: clicking a Derivatives chip
 * drills into that word's own card in place (same component, same
 * position — no re-anchoring), using MASTER_VOCABULARY when the word is
 * already hand-authored and an on-demand AI-generated card otherwise.
 */
export default function VocabDictionaryModal({
  entry,
  themeId,
  anchorRect,
  onClose,
}: {
  entry: VocabEntry;
  themeId: string;
  anchorRect: VocabAnchorRect | null;
  onClose: () => void;
}) {
  const [display, setDisplay] = useState<DisplayState>({ status: 'ready', entry });
  const [saved, setSaved] = useState(false);
  const [speechState, setSpeechState] = useState<'idle' | 'loading' | 'error'>('idle');
  const panelRef = useRef<HTMLDivElement>(null);
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; top: number; left: number } | null>(null);
  const latestRequestRef = useRef(0);

  // A brand-new word was opened from the list — reset any drill-down.
  useEffect(() => {
    setDisplay({ status: 'ready', entry });
  }, [entry]);

  useEffect(() => {
    if (display.status === 'ready') setSaved(isWordInGlossary(display.entry.word));
  }, [display]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useLayoutEffect(() => {
    if (!anchorRect || !panelRef.current || window.innerWidth < DESKTOP_BREAKPOINT) {
      setDesktopPosition(null);
      return;
    }
    const { width, height } = panelRef.current.getBoundingClientRect();

    let top = anchorRect.bottom + GAP;
    if (top + height > window.innerHeight - GAP) {
      top = Math.max(GAP, anchorRect.top - height - GAP);
    }
    const left = Math.max(GAP, Math.min(anchorRect.left, window.innerWidth - width - GAP));

    setDesktopPosition({ top, left });
  }, [anchorRect]);

  // Dragging (header only, desktop only) — the mobile bottom sheet stays fixed.
  useEffect(() => {
    if (!dragging) return;

    function handleMouseMove(e: MouseEvent) {
      const start = dragStartRef.current;
      if (!start || !panelRef.current) return;
      const { width, height } = panelRef.current.getBoundingClientRect();
      const nextTop = start.top + (e.clientY - start.pointerY);
      const nextLeft = start.left + (e.clientX - start.pointerX);
      setDesktopPosition({
        top: Math.max(GAP, Math.min(nextTop, window.innerHeight - height - GAP)),
        left: Math.max(GAP, Math.min(nextLeft, window.innerWidth - width - GAP)),
      });
    }
    function handleMouseUp() {
      setDragging(false);
      dragStartRef.current = null;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  function handleHeaderMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return; // mobile bottom sheet doesn't drag
    if ((e.target as HTMLElement).closest('button')) return; // let header buttons handle their own clicks
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragStartRef.current = { pointerX: e.clientX, pointerY: e.clientY, top: rect.top, left: rect.left };
    setDesktopPosition({ top: rect.top, left: rect.left });
    setDragging(true);
    e.preventDefault();
  }

  async function openWord(word: string, baseWord: string) {
    const existing = findVocabEntryByWord(word);
    if (existing) {
      latestRequestRef.current += 1; // invalidate any in-flight lookup
      setDisplay({ status: 'ready', entry: existing });
      return;
    }

    const requestId = ++latestRequestRef.current;
    setDisplay({ status: 'loading', word });
    try {
      const res = await fetch('/api/vocabulary-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, baseWord, themeId }),
      });
      const data: VocabLookupResponse = await res.json();
      if (latestRequestRef.current !== requestId) return; // superseded by a newer click

      if (!data.ok) {
        setDisplay({ status: 'error', word, baseWord, error: data.error });
        return;
      }

      const g = data.entry;
      const synthesized: VocabEntry = {
        id: `generated-${g.word.toLowerCase().replace(/\s+/g, '-')}`,
        word: g.word,
        japanese: g.japanese,
        pos: g.pos,
        introductionLevel: 'foundation',
        themes: [themeId],
        coreMeaning: g.coreMeaning,
        examples: g.examples,
        relatedWords: [],
        tags: ['generated'],
        themeNote: '',
        collocations: g.collocations,
        derivatives: g.derivatives,
      };
      setDisplay({ status: 'ready', entry: synthesized });
    } catch {
      if (latestRequestRef.current !== requestId) return;
      setDisplay({
        status: 'error',
        word,
        baseWord,
        error: "Couldn't reach the vocabulary lookup service. Please check your connection.",
      });
    }
  }

  function handleSave() {
    if (display.status !== 'ready') return;
    const current = display.entry;
    addGlossaryItem({
      word: current.word,
      japanese: current.japanese,
      definition: current.coreMeaning,
      example: current.examples[0],
      themeId,
      savedDate: new Date().toISOString(),
    });
    setSaved(true);
  }

  async function handleSpeak() {
    if (display.status !== 'ready' || speechState === 'loading') return;
    const word = display.entry.word;
    setSpeechState('loading');
    try {
      const res = await fetch('/api/selection-assistant/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word }),
      });
      if (!res.ok) {
        setSpeechState('error');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      setSpeechState('idle');
    } catch {
      setSpeechState('error');
    }
  }

  const headerWord = display.status === 'ready' ? display.entry.word : display.word;

  return (
    <>
      {/* Transparent click-catcher, not a heavy dimmed backdrop — the card
          should feel attached to the word, not like a detached dialog. */}
      <div className="fixed inset-0 z-40 bg-slate-900/10" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-label={`${headerWord} vocabulary card`}
        onClick={e => e.stopPropagation()}
        className="fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:w-[26rem] sm:max-w-[calc(100vw-2rem)] rounded-t-3xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[80vh] sm:max-h-[min(38rem,calc(100vh-2rem))] overflow-y-auto"
        style={desktopPosition ? { top: desktopPosition.top, left: desktopPosition.left } : undefined}
      >
        {/* Header — word + POS + pronunciation. Drag handle on desktop. */}
        <div
          onMouseDown={handleHeaderMouseDown}
          className={`sticky top-0 bg-white/95 backdrop-blur-sm flex items-start justify-between p-5 pb-3 border-b border-slate-100 sm:select-none ${
            dragging ? 'sm:cursor-grabbing' : 'sm:cursor-grab'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">{headerWord}</h2>
            {display.status === 'ready' && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[display.entry.pos]}`}>
                {display.entry.pos}
              </span>
            )}
            <button
              onClick={handleSpeak}
              disabled={display.status !== 'ready' || speechState === 'loading'}
              className={`transition-colors text-lg leading-none ${
                speechState === 'error' ? 'text-rose-500' : 'text-slate-400 hover:text-indigo-600'
              } ${display.status !== 'ready' || speechState === 'loading' ? 'opacity-50' : ''}`}
              aria-label="Hear pronunciation"
              title={speechState === 'error' ? "Couldn't play audio — try again" : 'Hear pronunciation'}
            >
              🔊
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors ml-4 text-xl leading-none flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {display.status === 'loading' && (
          <div className="p-5 flex items-center gap-2 text-slate-400 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-300 animate-pulse" aria-hidden="true" />
            Generating a vocabulary card for &ldquo;{display.word}&rdquo;...
          </div>
        )}

        {display.status === 'error' && (
          <div className="p-5 space-y-3">
            <p className="text-sm text-rose-600 leading-relaxed">{display.error}</p>
            <button
              onClick={() => openWord(display.word, display.baseWord)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Try again
            </button>
          </div>
        )}

        {display.status === 'ready' && (
          <>
            {/* Body */}
            <div className="p-5 space-y-5">

              {/* 1. Simple English */}
              <SelectableContent activityType="vocabulary" themeId={themeId} label={`Vocabulary — ${display.entry.word} (meaning)`}>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Simple English</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{display.entry.coreMeaning}</p>
                </div>
              </SelectableContent>

              {/* 2. 日本語 */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">日本語</h3>
                <p className="text-base font-semibold text-indigo-700">{display.entry.japanese}</p>
              </div>

              {/* 3. Examples */}
              <SelectableContent activityType="vocabulary" themeId={themeId} label={`Vocabulary — ${display.entry.word} (examples)`}>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Examples</h3>
                  <ul className="space-y-3">
                    {display.entry.examples.map((ex, i) => (
                      <li key={i} className="pl-3 border-l-2 border-indigo-200">
                        <p className="text-sm text-slate-700 leading-relaxed">{ex}</p>
                        {display.entry.exampleTranslations?.[i] && (
                          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                            {display.entry.exampleTranslations[i]}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </SelectableContent>

              {/* 4. Common Collocations */}
              {display.entry.collocationsDetailed ? (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common Collocations</h3>
                  <ul className="space-y-3">
                    {display.entry.collocationsDetailed.map((c, i) => (
                      <li key={i} className="pl-3 border-l-2 border-slate-200">
                        <p className="text-sm">
                          <span className="font-bold text-slate-800">{c.phrase}</span>
                          <span className="text-slate-500 ml-2">{c.glossJa}</span>
                        </p>
                        <p className="text-sm text-indigo-700 mt-0.5">→ {c.example}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : display.entry.collocations.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Common Collocations</h3>
                  <div className="flex flex-wrap gap-2">
                    {display.entry.collocations.map(c => (
                      <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 5. Derivatives（派生語） — every word here is itself explorable. */}
              {display.entry.derivatives && display.entry.derivatives.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Derivatives（派生語）</h3>
                  <div className="flex flex-wrap gap-2">
                    {display.entry.derivatives.map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => openWord(w, display.entry.word)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Save to Glossary */}
            <div className="px-5 pb-5">
              <button
                onClick={handleSave}
                disabled={saved}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  saved
                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {saved ? '✓ Saved to Glossary' : 'Save to Glossary'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
