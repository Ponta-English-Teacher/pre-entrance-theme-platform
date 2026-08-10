'use client';

import { useEffect, useRef, useState } from 'react';
import type { HelpContext, HelpOption } from '@/lib/aiAssistant';
import { requestAIHelp } from '@/lib/aiAssistant';
import { addNotebookItem, isInNotebook } from '@/lib/store';
import NotebookSaveButton from '@/components/notebook/NotebookSaveButton';

/** The single excerpt worth keeping alongside an AI Help answer, whichever
 *  location produced it — the paragraph being read, the mission check
 *  question, or the writing prompt. Absent/undefined falls through to no
 *  context, which NotebookItem already treats as optional. */
function contextExcerpt(ctx: HelpContext): string | undefined {
  return ctx.paragraph?.english ?? ctx.missionCheckQuestion ?? ctx.writingPrompt;
}

export default function ContextualHelpButton({
  helpId,
  activeId,
  onToggle,
  options,
  buildContext,
  label = 'AIに質問する',
}: {
  helpId: string;
  activeId: string | null;
  onToggle: (id: string | null) => void;
  options: HelpOption[];
  buildContext: (helpType: string) => HelpContext;
  label?: string;
}) {
  const isOpen = activeId === helpId;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  // Captured alongside `response` at the moment it arrives, so Save has
  // everything it needs (themeId/level come from the same HelpContext the
  // request itself used) without ContextualHelpButton needing its own
  // themeId/level props — every call site already builds a full HelpContext.
  const [responseMeta, setResponseMeta] = useState<{ themeId: string; level: HelpContext['level']; optionLabel: string; excerpt: string | undefined; helpType: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normal popover behavior: dismiss on an outside click. Opening a different
  // AI Help button already closes this one, since activeId is shared state
  // (only one helpId can match at a time) — no extra handling needed for that.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(null);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, onToggle]);

  async function handleSelect(optionId: string) {
    setLoading(true);
    setResponse(null);
    setSaved(false);
    const ctx = buildContext(optionId);
    const result = await requestAIHelp(ctx);
    setResponse(result.text);
    const opt = options.find(o => o.id === optionId);
    setResponseMeta({
      themeId: ctx.themeId,
      level: ctx.level,
      optionLabel: opt?.label ?? label,
      excerpt: contextExcerpt(ctx),
      helpType: optionId,
    });
    setLoading(false);
  }

  function handleToggle() {
    if (isOpen) {
      onToggle(null);
    } else {
      setResponse(null);
      setResponseMeta(null);
      setSaved(false);
      onToggle(helpId);
    }
  }

  function handleSave() {
    if (!response || !responseMeta || saved) return;
    if (!isInNotebook('ai-help', response, responseMeta.themeId)) {
      addNotebookItem({
        category: 'ai-help',
        themeId: responseMeta.themeId,
        level: responseMeta.level,
        favorite: false,
        label: responseMeta.optionLabel,
        content: response,
        context: responseMeta.excerpt,
        metadata: { helpType: responseMeta.helpType },
      });
    }
    setSaved(true);
  }

  return (
    <div ref={containerRef} className="inline-block">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap shadow-sm transition-colors ${
          isOpen
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200'
        }`}
      >
        💡 {label}
      </button>

      {isOpen && (
        // Not absolutely positioned — it opens inline, pushing the content that
        // follows (e.g. the question below it) down instead of covering it.
        <div className="mt-2 w-72 max-w-[85vw] bg-white rounded-2xl border border-indigo-100 shadow-lg p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">何を知りたいですか？</p>
          <div className="flex flex-col gap-1 mb-3">
            {options.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className="text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loading && <p className="text-xs text-slate-400 italic">考え中...</p>}

          {response && !loading && (
            <>
              <div className="text-sm text-slate-700 leading-relaxed bg-indigo-50 rounded-xl p-3 whitespace-pre-line">
                {response}
              </div>
              <div className="mt-2 flex justify-end">
                <NotebookSaveButton
                  saved={saved}
                  onSave={handleSave}
                  label="📓 保存"
                  savedLabel="✓ 保存済み"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
