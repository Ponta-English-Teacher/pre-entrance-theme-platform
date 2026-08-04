'use client';

import { useEffect, useRef, useState } from 'react';
import type { HelpContext, HelpOption } from '@/lib/aiAssistant';
import { requestAIHelp } from '@/lib/aiAssistant';

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
    const result = await requestAIHelp(buildContext(optionId));
    setResponse(result.text);
    setLoading(false);
  }

  function handleToggle() {
    if (isOpen) {
      onToggle(null);
    } else {
      setResponse(null);
      onToggle(helpId);
    }
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
            <div className="text-sm text-slate-700 leading-relaxed bg-indigo-50 rounded-xl p-3 whitespace-pre-line">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
