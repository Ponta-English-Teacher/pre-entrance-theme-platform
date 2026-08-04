'use client';

import { useState } from 'react';
import type { Level } from '@/types';
import type { ConversationSupportResponse } from '@/lib/ai/aiPartner/types';

/**
 * "🗣 How do you say it?" — AI Talk's expression-support tool. Input-based,
 * not selection-based, and lives beside the reply box (not attached to any
 * particular message) since it's about something the student wants to say,
 * not something the AI already said. "What does it mean?" moved to the
 * selection-based AITalkSelectionToolbar/AITalkExplanationPanel — this panel
 * no longer handles it.
 *
 * Never navigates away and never ends the conversation — closing it (or
 * inserting a suggestion) returns the student straight back to typing.
 */
export default function ConversationSupportPanel({
  level,
  onClose,
  onInsertSuggestion,
}: {
  level: Level;
  onClose: () => void;
  onInsertSuggestion: (text: string) => void;
}) {
  const [studentInput, setStudentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);

  async function handleExpressSubmit() {
    const text = studentInput.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const res = await fetch('/api/ai-partner/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'express', level, studentInput: text }),
      });
      const data: ConversationSupportResponse = await res.json();
      if (data.ok) setSuggestions(data.suggestions ?? []);
      else setError(data.error ?? 'Something went wrong.');
    } catch {
      setError("Couldn't reach your AI partner. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-indigo-700">🗣 How do you say it?</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-2">What do you want to say? (Japanese is OK)</p>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={studentInput}
          onChange={e => setStudentInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleExpressSubmit();
          }}
          placeholder="例：やる気が出ない"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        />
        <button
          type="button"
          onClick={handleExpressSubmit}
          disabled={loading || !studentInput.trim()}
          className="px-4 py-2 rounded-md font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Show me'}
        </button>
      </div>
      {error && <p className="text-sm text-rose-600 mb-2">{error}</p>}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onInsertSuggestion(s);
                onClose();
              }}
              className="text-left px-3.5 py-2.5 rounded-lg border border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-base text-slate-800"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
