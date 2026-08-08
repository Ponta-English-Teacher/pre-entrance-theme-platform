'use client';

import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/types';
import { AI_PARTNER_HARD_MAX_STUDENT_TURNS, AI_PARTNER_LEVEL_TURN_TARGETS } from '@/lib/ai/aiPartner/types';
import type { AIPartnerTurnRequest, AIPartnerTurnResponse, TargetVocabItem } from '@/lib/ai/aiPartner/types';
import { extractSelectionContext } from '@/lib/selectionAssistant/extractContext';
import { SELECTION_ASSISTANT_MAX_TEXT_LENGTH, SELECTION_TEXT_TOO_LONG_MESSAGE } from '@/lib/ai/selectionAssistant/types';
import TranscriptTurn, { type SpeechStatus, type TranscriptTurnData } from './TranscriptTurn';
import ConversationInput from './ConversationInput';
import ConversationSupportPanel from './ConversationSupportPanel';
import AITalkSelectionToolbar, {
  type AITalkActiveSelection,
  type AITalkSelectionAction,
} from './AITalkSelectionToolbar';
import AITalkExplanationPanel, { type AITalkSelectionPanelState } from './AITalkExplanationPanel';

/**
 * Standalone AI Partner conversation UI. Self-contained, like WritingTutor:
 * owns its own transcript/input/speech state, driven entirely by props
 * describing the theme/level context.
 *
 * Speech is a strictly separate, on-request concern from the text
 * conversation (AI_TALK_ACTIVITY_DESIGN.md §4a): the reply is generated
 * and shown first, and pressing Play is the only thing that ever triggers a
 * speech request. Generated audio is cached only in this component's own
 * memory (an object URL per turn id) for the lifetime of this mounted
 * instance — never written to disk, never sent anywhere else.
 *
 * Two kinds of conversation support, deliberately separated:
 * - Understanding the AI (received language): select any text inside a
 *   partner turn to get Translate / How to Read / What does it mean? via
 *   AITalkSelectionToolbar + AITalkExplanationPanel — AI Talk's own,
 *   separate selection system, modeled on Reading's Selection Assistant but
 *   not sharing its code, so that shared component never has to change to
 *   accommodate AI-Talk-specific behavior (explaining only a selection,
 *   never the whole message).
 * - Expressing yourself (produced language): "💡 Help me say it",
 *   input-based, beside the reply box, via ConversationSupportPanel.
 */

const NO_SELECTION_PANEL: AITalkSelectionPanelState = {
  open: false,
  loading: false,
  action: null,
  text: null,
  error: null,
  selection: null,
};

export interface AIPartnerConversationProps {
  themeId: string;
  level: Level;
  themeDescription: string;
  themeDescriptionJapanese: string;
  mission: string;
  readingPassage: string[];
  targetVocab: TargetVocabItem[];
  opener: string;
  /** Reports the current student-turn count after every change, so a host page can drive its own completion/finish logic without this component knowing about activities or progress tracking. */
  onStudentTurnCountChange?: (count: number) => void;
}

export default function AIPartnerConversation({
  themeId,
  level,
  themeDescription,
  themeDescriptionJapanese,
  mission,
  readingPassage,
  targetVocab,
  opener,
  onStudentTurnCountChange,
}: AIPartnerConversationProps) {
  const [turns, setTurns] = useState<TranscriptTurnData[]>(() => [
    { id: 'opener', role: 'partner', text: opener },
  ]);
  const [draftInput, setDraftInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [speechStatus, setSpeechStatus] = useState<Record<string, SpeechStatus>>({});
  const [playingTurnId, setPlayingTurnId] = useState<string | null>(null);
  const [showExpressPanel, setShowExpressPanel] = useState(false);

  // AI-Talk-only selection tools (Translate / How to Read / What does it mean?)
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [activeSelection, setActiveSelection] = useState<AITalkActiveSelection | null>(null);
  const [selectionPanel, setSelectionPanel] = useState<AITalkSelectionPanelState>(NO_SELECTION_PANEL);

  const nextTurnIdRef = useRef(1);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const speechGenerationCountRef = useRef(0);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const studentTurnCount = turns.filter(t => t.role === 'student').length;
  const atHardCap = studentTurnCount >= AI_PARTNER_HARD_MAX_STUDENT_TURNS;
  const turnTarget = AI_PARTNER_LEVEL_TURN_TARGETS[level];

  // Session-only cache: revoke every object URL when this conversation instance unmounts.
  useEffect(() => {
    const cache = audioCacheRef.current;
    return () => {
      cache.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    onStudentTurnCountChange?.(studentTurnCount);
  }, [studentTurnCount, onStudentTurnCountChange]);

  // Track text selection, scoped to partner turns inside the transcript only
  // (never the student's own turns, never the draft textarea).
  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();
      const anchorNode = selection?.anchorNode;
      if (!selection || !anchorNode || !transcriptRef.current || !transcriptRef.current.contains(anchorNode)) {
        setActiveSelection(null);
        return;
      }

      const el = anchorNode.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode.parentElement;
      const partnerTurnEl = el?.closest('[data-turn-role="partner"]');
      if (!partnerTurnEl) {
        setActiveSelection(null);
        return;
      }

      const extracted = extractSelectionContext(selection);
      if (!extracted) {
        setActiveSelection(null);
        return;
      }

      setActiveSelection({
        text: extracted.text,
        fullTurnText: extracted.surroundingParagraph,
        rect: {
          top: extracted.rect.top,
          bottom: extracted.rect.bottom,
          left: extracted.rect.left,
          right: extracted.rect.right,
        },
      });
    }

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  async function sendMessage(history: TranscriptTurnData[]) {
    setIsSubmitting(true);
    setSubmitError(null);

    const request: AIPartnerTurnRequest = {
      themeId,
      level,
      themeDescription,
      themeDescriptionJapanese,
      mission,
      readingPassage,
      targetVocab,
      history: history.map(t => ({ role: t.role, text: t.text })),
    };

    try {
      const res = await fetch('/api/ai-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const result = (await res.json()) as AIPartnerTurnResponse;

      if (result.ok) {
        const partnerId = `t${nextTurnIdRef.current++}`;
        setTurns(prev => [...prev, { id: partnerId, role: 'partner', text: result.reply }]);
      } else {
        setSubmitError(result.error);
      }
    } catch {
      setSubmitError("Couldn't reach your AI partner. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit() {
    const text = draftInput.trim();
    if (!text || isSubmitting || atHardCap) return;

    const studentId = `t${nextTurnIdRef.current++}`;
    // Disabling the input happens synchronously here, in the same update that
    // appends the 15th student turn — not after the reply comes back.
    const nextTurns = [...turns, { id: studentId, role: 'student' as const, text }];
    setTurns(nextTurns);
    setDraftInput('');
    sendMessage(nextTurns);
  }

  function handleRetry() {
    sendMessage(turns);
  }

  async function handlePlay(turn: TranscriptTurnData) {
    const audioEl = audioElRef.current;
    if (!audioEl) return;

    try {
      let url = audioCacheRef.current.get(turn.id);

      if (!url) {
        setSpeechStatus(prev => ({ ...prev, [turn.id]: 'loading' }));
        const res = await fetch('/api/ai-partner/speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: turn.text, speechGenerationCountSoFar: speechGenerationCountRef.current }),
        });
        if (!res.ok) throw new Error('speech request failed');

        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        audioCacheRef.current.set(turn.id, url);
        speechGenerationCountRef.current += 1;
      }

      if (audioEl.dataset.turnId !== turn.id) {
        audioEl.src = url;
        audioEl.currentTime = 0;
        audioEl.dataset.turnId = turn.id;
      }

      await audioEl.play();
      setSpeechStatus(prev => ({ ...prev, [turn.id]: 'ready' }));
      setPlayingTurnId(turn.id);
    } catch {
      // Text-only fallback: never browser TTS. The Play button simply resets.
      setSpeechStatus(prev => ({ ...prev, [turn.id]: 'error' }));
      setPlayingTurnId(null);
    }
  }

  function handlePause() {
    audioElRef.current?.pause();
    setPlayingTurnId(null);
  }

  function handleInsertSuggestion(text: string) {
    setDraftInput(prev => (prev.trim() ? `${prev} ${text}` : text));
  }

  function closeSelectionPanel() {
    setSelectionPanel(NO_SELECTION_PANEL);
    setActiveSelection(null);
  }

  async function handleSelectionAction(action: AITalkSelectionAction) {
    if (!activeSelection) return;
    const snapshot = activeSelection;
    setSelectionPanel({ open: true, loading: true, action, text: null, error: null, selection: snapshot });

    // "How to Read" — server-side TTS only, exactly like Reading's Selection
    // Assistant. Plays directly; the panel is only used to show an error.
    // Never falls back to browser SpeechSynthesis.
    if (action === 'howToRead') {
      // Caught here, before any network call — see SELECTION_ASSISTANT_MAX_TEXT_LENGTH.
      if (snapshot.text.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
        setSelectionPanel({ open: true, loading: false, action, text: null, error: SELECTION_TEXT_TOO_LONG_MESSAGE, selection: snapshot });
        return;
      }
      try {
        const res = await fetch('/api/selection-assistant/speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: snapshot.text }),
        });
        if (!res.ok) {
          const data: { error?: string } = await res.json().catch(() => ({}));
          setSelectionPanel(prev =>
            prev.selection !== snapshot
              ? prev
              : { ...prev, loading: false, error: data.error ?? "Couldn't generate audio for this text." }
          );
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        setSelectionPanel(prev => (prev.selection !== snapshot ? prev : NO_SELECTION_PANEL));
      } catch {
        setSelectionPanel(prev =>
          prev.selection !== snapshot
            ? prev
            : { ...prev, loading: false, error: "Couldn't reach the audio service. Please check your connection." }
        );
      }
      return;
    }

    // "Translate" — reuses the existing, unmodified Selection Assistant
    // translate endpoint (Reading's own code is untouched); translates only
    // the selected text, using the full turn as surrounding context.
    if (action === 'translate') {
      // Same pre-flight check as How to Read — one shared limit for every
      // Selection Assistant action. See SELECTION_ASSISTANT_MAX_TEXT_LENGTH.
      if (snapshot.text.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
        setSelectionPanel({ open: true, loading: false, action, text: null, error: SELECTION_TEXT_TOO_LONG_MESSAGE, selection: snapshot });
        return;
      }
      try {
        const res = await fetch('/api/selection-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedText: snapshot.text,
            surroundingSentence: snapshot.fullTurnText,
            surroundingParagraph: snapshot.fullTurnText,
            activityType: 'ai-talk',
            themeId,
            level,
            action: 'translate',
          }),
        });
        const data: { ok: boolean; explanation?: string; error?: string } = await res.json();
        setSelectionPanel(prev =>
          prev.selection !== snapshot
            ? prev
            : data.ok
              ? { ...prev, loading: false, text: data.explanation ?? '' }
              : { ...prev, loading: false, error: data.error ?? 'Something went wrong.' }
        );
      } catch {
        setSelectionPanel(prev =>
          prev.selection !== snapshot
            ? prev
            : { ...prev, loading: false, error: "Couldn't reach the AI assistant. Please check your connection." }
        );
      }
      return;
    }

    // "What does it mean?" — AI Talk's own explain endpoint. Explains only
    // the selected snippet, using the full turn (and recent history) as
    // context — never a paraphrase of the whole message.
    try {
      const res = await fetch('/api/ai-partner/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain',
          level,
          selectedText: snapshot.text,
          fullTurnText: snapshot.fullTurnText,
          recentHistory: turns.slice(-4).map(t => ({ role: t.role, text: t.text })),
        }),
      });
      const data: { ok: boolean; explanation?: string; error?: string } = await res.json();
      setSelectionPanel(prev =>
        prev.selection !== snapshot
          ? prev
          : data.ok
            ? { ...prev, loading: false, text: data.explanation ?? '' }
            : { ...prev, loading: false, error: data.error ?? 'Something went wrong.' }
      );
    } catch {
      setSelectionPanel(prev =>
        prev.selection !== snapshot
          ? prev
          : { ...prev, loading: false, error: "Couldn't reach your AI partner. Please check your connection." }
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioElRef}
        onEnded={() => setPlayingTurnId(null)}
        onError={() => {
          if (playingTurnId) {
            setSpeechStatus(prev => ({ ...prev, [playingTurnId]: 'error' }));
          }
          setPlayingTurnId(null);
        }}
      />

      <div ref={transcriptRef} className="border border-slate-300 rounded-lg bg-white px-5 py-6 sm:px-8 sm:py-8 mb-4">
        {turns.map(turn => (
          <TranscriptTurn
            key={turn.id}
            turn={turn}
            speechStatus={speechStatus[turn.id] ?? 'idle'}
            isPlaying={playingTurnId === turn.id}
            onPlay={turn.role === 'partner' ? () => handlePlay(turn) : undefined}
            onPause={turn.role === 'partner' ? handlePause : undefined}
            onInsert={turn.role === 'partner' ? handleInsertSuggestion : undefined}
          />
        ))}

        {isSubmitting && (
          <div className="pt-4">
            <p className="text-sm text-slate-400 italic">Your partner is thinking...</p>
          </div>
        )}
      </div>

      <AITalkSelectionToolbar selection={activeSelection} onAction={handleSelectionAction} />
      <AITalkExplanationPanel panel={selectionPanel} onClose={closeSelectionPanel} />

      {submitError && (
        <div className="border-l-4 border-rose-400 pl-4 py-2 mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-rose-800">{submitError}</p>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isSubmitting}
            className="text-sm font-semibold text-rose-700 hover:text-rose-900 whitespace-nowrap disabled:opacity-40"
          >
            Try again
          </button>
        </div>
      )}

      {/* Expression support — repairs "I don't know how to say it" without
          ending the conversation. Belongs only to AI Talk. */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setShowExpressPanel(v => !v)}
          className={`px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors ${
            showExpressPanel
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          💡 Help me say it
        </button>
      </div>

      {showExpressPanel && (
        <ConversationSupportPanel
          level={level}
          themeDescription={themeDescription}
          recentHistory={turns.slice(-4).map(t => ({ role: t.role, text: t.text }))}
          onClose={() => setShowExpressPanel(false)}
          onInsertSuggestion={handleInsertSuggestion}
        />
      )}

      <ConversationInput
        value={draftInput}
        onChange={setDraftInput}
        onSubmit={handleSubmit}
        disabled={atHardCap || isSubmitting}
        isSubmitting={isSubmitting}
        studentTurnCount={studentTurnCount}
        turnTarget={turnTarget}
        hardMax={AI_PARTNER_HARD_MAX_STUDENT_TURNS}
      />
    </div>
  );
}
