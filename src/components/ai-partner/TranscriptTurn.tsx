import { useState } from 'react';

export interface TranscriptTurnData {
  id: string;
  role: 'student' | 'partner';
  text: string;
}

export type SpeechStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * The occasional natural-phrasing suggestion the partner embeds inline,
 * per src/lib/ai/aiPartner/prompt.ts rule 6 — always the same shape:
 * reaction, then "💬 You could also say:" / "💬 Another natural way to
 * say it is:" followed by a quoted sentence, then the conversation
 * continues in the same reply. The backend returns this as one plain-
 * text string (no structured field, and none is being added — this is a
 * frontend-only visual-hierarchy change), so this pulls the suggestion
 * back out for secondary display, leaving the rest as one continuous
 * conversational reply.
 */
const SUGGESTION_PATTERN = /💬\s*(?:You could also say|Another natural way to say it is):\s*\n*\s*[""]([^""]+)[""]/;

function extractSuggestion(text: string): { mainText: string; suggestion: string | null } {
  const match = SUGGESTION_PATTERN.exec(text);
  if (!match || match.index === undefined) return { mainText: text, suggestion: null };

  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  const mainText = (before + after).replace(/\n{3,}/g, '\n\n').trim();

  return { mainText, suggestion: match[1].trim() };
}

/**
 * One turn in the transcript — a plain speaker label and serif text with a
 * hairline rule between turns, matching Reading's textbook visual language.
 * No chat bubbles, no avatars. Only partner turns get a Play control —
 * students don't need their own typed text read back.
 *
 * The conversational reply stays a single "PARTNER" block, question
 * included — AI Talk is a conversation activity, not a correction
 * activity, so the partner's next question is never separated out or
 * demoted. The occasional embedded natural-phrasing suggestion, if
 * present, is pulled into its own clearly secondary "💡 Better English
 * (Optional)" block below it: smaller sans-serif text, muted color, with
 * its own click-to-insert action — reusing the same insert mechanism as
 * the "Help me say it" panel — so a student can use it whenever they
 * like without ever being asked to rewrite what they already sent.
 *
 * Deliberately does NOT use the shared Selection Assistant (SelectableContent)
 * — AI Talk has its own, separate floating selection toolbar (Translate / How
 * to Read / What does it mean?), scoped only to partner turns via
 * `data-turn-role`. See AITalkSelectionToolbar.tsx in AIPartnerConversation.
 */
export default function TranscriptTurn({
  turn,
  speechStatus,
  isPlaying,
  onPlay,
  onPause,
  onInsert,
}: {
  turn: TranscriptTurnData;
  speechStatus?: SpeechStatus;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  /** Inserts the Better English suggestion into the student's own reply box. Undefined for student turns (no suggestion to insert). */
  onInsert?: (text: string) => void;
}) {
  const isPartner = turn.role === 'partner';
  const [inserted, setInserted] = useState(false);

  const { mainText, suggestion } = isPartner ? extractSuggestion(turn.text) : { mainText: turn.text, suggestion: null };

  function handleInsertClick() {
    if (!suggestion || !onInsert) return;
    onInsert(suggestion);
    setInserted(true);
    window.setTimeout(() => setInserted(false), 1400);
  }

  return (
    <div className="py-3 sm:py-4 border-b border-slate-100 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        {isPartner ? 'Partner' : 'You'}
      </p>
      <div className="flex items-start gap-3">
        <p
          data-turn-role={turn.role}
          className="flex-1 font-serif text-base sm:text-[1.05rem] leading-relaxed sm:leading-[1.8] text-slate-900 whitespace-pre-line"
        >
          {mainText}
        </p>

        {isPartner && onPlay && (
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            <button
              type="button"
              onClick={isPlaying ? onPause : onPlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={speechStatus === 'loading'}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-500 text-xs hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40"
            >
              {speechStatus === 'loading' ? '…' : isPlaying ? '⏸' : '▶'}
            </button>
            {speechStatus === 'error' && (
              <span className="text-[11px] text-slate-400 italic">audio unavailable</span>
            )}
          </div>
        )}
      </div>

      {/* Better English — deliberately secondary: small sans-serif text,
          muted color, indented under a thin rule, never competing with the
          conversational reply above for attention. Optional, not a task —
          the student is never expected to act on it before continuing. */}
      {suggestion && (
        <div className="mt-3 pl-3 border-l-2 border-indigo-100">
          <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-400 mb-1">
            💡 Better English <span className="normal-case font-medium text-slate-400">(optional)</span>
          </p>
          <button
            type="button"
            onClick={handleInsertClick}
            className="text-left text-sm text-slate-600 hover:text-indigo-700 transition-colors"
          >
            {inserted ? (
              <span className="font-bold text-emerald-600">✓ Inserted!</span>
            ) : (
              <>
                &ldquo;{suggestion}&rdquo;
                <span className="text-indigo-500 ml-1.5 font-medium">+ Insert</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
