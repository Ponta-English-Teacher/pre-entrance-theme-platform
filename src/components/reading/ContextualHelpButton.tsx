'use client';

import { useState } from 'react';
import type { HelpContext, HelpOption } from '@/lib/aiAssistant';
import { requestAIHelp } from '@/lib/aiAssistant';

export default function ContextualHelpButton({
  helpId,
  activeId,
  onToggle,
  options,
  buildContext,
  label = 'AI Help',
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

  async function handleSelect(optionId: string) {
    setLoading(true);
    setResponse(null);
    const result = await requestAIHelp(buildContext(optionId));
    setResponse(result.text);
    setLoading(false);
    if (result.speak && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(result.speak);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
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
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors ${
          isOpen
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'bg-white border-slate-200 text-indigo-600 hover:border-indigo-300'
        }`}
      >
        💡 {label}
      </button>

      {isOpen && (
        <div className="absolute z-20 left-0 mt-2 w-72 max-w-[85vw] bg-white rounded-2xl border border-slate-200 shadow-lg p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">How can I help?</p>
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

          {loading && <p className="text-xs text-slate-400 italic">Thinking...</p>}

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
