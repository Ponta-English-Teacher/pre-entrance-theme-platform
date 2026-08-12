'use client';

import { useEffect, useRef, useState } from 'react';
import type { ExpressChatResponse, ExpressChatTurn } from '@/lib/ai/expressCoach/types';
import NotebookSaveButton from '@/components/notebook/NotebookSaveButton';

/**
 * Shared "💡 Help me say it" coaching-chat UI — one interaction model reused
 * by both Writing (WritingExpressPanel) and AI Talk (ConversationSupportPanel).
 * Only each caller's `sendMessage` (and therefore its system prompt/grounding
 * context) differs; everything about the conversation itself — history,
 * fixed input, clear-on-send, insert-when-usable — is identical and lives
 * here once.
 *
 * The panel's own state (its turns) is intentionally local and un-persisted:
 * the host activity mounts this component only while the panel is open
 * (`{show && <ExpressCoachPanel ... />}`), so closing it unmounts the
 * component and the next open starts a fresh conversation — no explicit
 * reset logic needed.
 *
 * Visual shell (indigo-50 card, header, input row styling) is unchanged from
 * the original one-shot panel; only the middle content became a scrollable
 * thread instead of a static suggestion list.
 */
export default function ExpressCoachPanel({
  placeholder,
  onClose,
  onInsert,
  onSaveSuggestion,
  sendMessage,
}: {
  /** Localized input placeholder, e.g. "例：自分の性格について考えたことを書きたい". */
  placeholder: string;
  onClose: () => void;
  /** Inserts a suggested expression into whatever the host activity is producing (a draft, a reply box). */
  onInsert: (text: string) => void;
  /** Saves a suggested expression to My English Notebook (category: 'help-me-say-it'). Optional so
   *  a future host can adopt this panel without wiring Notebook support immediately; both current
   *  hosts (Writing, AI Talk) provide it. `context` is the coach's reply the suggestion came from. */
  onSaveSuggestion?: (suggestion: string, context: string) => void;
  /** Sends the student's new message plus this chat's own history so far (not including the new message) and resolves to the coach's reply. */
  sendMessage: (studentInput: string, history: ExpressChatTurn[]) => Promise<ExpressChatResponse>;
}) {
  const [turns, setTurns] = useState<ExpressChatTurn[]>([]);
  const [draftInput, setDraftInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justInserted, setJustInserted] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const threadRef = useRef<HTMLDivElement>(null);
  // Guards Enter-to-send against Japanese/Chinese/Korean IME composition, so
  // the keystroke that confirms an IME conversion doesn't also send the
  // message — the same behavior as ChatGPT/Slack/Gmail. `isComposing` alone
  // isn't quite enough: some browsers (notably Safari) fire `compositionend`
  // just before the confirming Enter's `keydown`, so that keydown already
  // reads `isComposing: false`. This ref stays true across that gap and is
  // cleared on the next tick, so the same physical Enter press that closed
  // the IME is still swallowed, while a genuinely new Enter press right
  // after isn't.
  const isComposingRef = useRef(false);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, loading, error]);

  async function handleSend() {
    const text = draftInput.trim();
    if (!text || loading) return;

    const historyBeforeThisMessage = turns;
    setTurns(prev => [...prev, { role: 'student', text }]);
    setDraftInput('');
    setLoading(true);
    setError(null);

    try {
      const result = await sendMessage(text, historyBeforeThisMessage);
      if (result.ok) {
        setTurns(prev => [...prev, { role: 'coach', text: result.reply, suggestions: result.suggestions }]);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Couldn't reach the coach. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleInsert(key: string, text: string) {
    onInsert(text);
    setJustInserted(key);
    window.setTimeout(() => setJustInserted(prev => (prev === key ? null : prev)), 1400);
  }

  function handleSaveSuggestion(key: string, suggestion: string, context: string) {
    if (savedKeys.has(key)) return;
    onSaveSuggestion?.(suggestion, context);
    setSavedKeys(prev => new Set(prev).add(key));
  }

  const hasTurns = turns.length > 0;

  return (
    <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-indigo-700">💡 Help me say it</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {!hasTurns && !loading && (
        <p className="text-sm text-slate-600 mb-2">What do you want to say? (Japanese is OK)</p>
      )}

      {(hasTurns || loading || error) && (
        <div ref={threadRef} className="flex flex-col gap-2.5 mb-3 max-h-72 overflow-y-auto pr-1">
          {turns.map((turn, i) => (
            <ChatBubble
              key={i}
              turn={turn}
              turnIndex={i}
              justInserted={justInserted}
              onInsert={handleInsert}
              savedKeys={savedKeys}
              onSaveSuggestion={onSaveSuggestion ? handleSaveSuggestion : undefined}
            />
          ))}
          {loading && (
            <div className="self-start rounded-xl rounded-tl-sm border border-indigo-100 bg-white px-3.5 py-2.5">
              <p className="text-sm text-slate-400 italic">Thinking...</p>
            </div>
          )}
          {error && (
            <div className="self-start max-w-[90%] rounded-xl rounded-tl-sm border border-rose-200 bg-rose-50 px-3.5 py-2.5">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draftInput}
          onChange={e => setDraftInput(e.target.value)}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            // Cleared a tick late (see isComposingRef's comment above) so the
            // Enter keydown that fires immediately after this in Safari is
            // still treated as "was composing" and doesn't send.
            window.setTimeout(() => {
              isComposingRef.current = false;
            }, 0);
          }}
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            // e.nativeEvent.isComposing / keyCode 229 cover Chrome, Firefox,
            // Edge; isComposingRef covers Safari's early-compositionend quirk.
            if (e.nativeEvent.isComposing || e.keyCode === 229 || isComposingRef.current) return;
            handleSend();
          }}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 disabled:bg-slate-50 disabled:text-slate-400"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !draftInput.trim()}
          className="px-4 py-2 rounded-md font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '...' : hasTurns ? 'Send' : 'Show me'}
        </button>
      </div>
    </div>
  );
}

function ChatBubble({
  turn,
  turnIndex,
  justInserted,
  onInsert,
  savedKeys,
  onSaveSuggestion,
}: {
  turn: ExpressChatTurn;
  turnIndex: number;
  justInserted: string | null;
  onInsert: (key: string, text: string) => void;
  savedKeys: Set<string>;
  /** Absent entirely when the host didn't provide onSaveSuggestion — the Save button doesn't render at all, rather than rendering disabled. */
  onSaveSuggestion?: (key: string, suggestion: string, context: string) => void;
}) {
  const isStudent = turn.role === 'student';

  if (isStudent) {
    return (
      <div className="self-end max-w-[85%] rounded-xl rounded-tr-sm bg-indigo-600 text-white px-3.5 py-2.5">
        <p className="text-sm leading-relaxed whitespace-pre-line">{turn.text}</p>
      </div>
    );
  }

  return (
    <div className="self-start max-w-[90%] flex flex-col gap-1.5">
      <div className="rounded-xl rounded-tl-sm border border-indigo-100 bg-white px-3.5 py-2.5">
        <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{turn.text}</p>
      </div>
      {turn.suggestions && turn.suggestions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {turn.suggestions.map((s, i) => {
            const key = `${turnIndex}-${i}`;
            const inserted = justInserted === key;
            const saved = savedKeys.has(key);
            return (
              <div key={key} className="flex items-stretch gap-1.5">
                <button
                  type="button"
                  onClick={() => onInsert(key, s)}
                  className="flex-1 text-left px-3 py-2 rounded-lg border border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-sm text-slate-800"
                >
                  {inserted ? (
                    <span className="font-bold text-emerald-600">✓ Inserted!</span>
                  ) : (
                    <>
                      <span className="text-indigo-500 mr-1" aria-hidden="true">+</span>
                      {s}
                    </>
                  )}
                </button>
                {onSaveSuggestion && (
                  <NotebookSaveButton
                    saved={saved}
                    onSave={() => onSaveSuggestion(key, s, turn.text)}
                    label="📓 ノートへ"
                    savedLabel="✓"
                    className="shrink-0 justify-center"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
