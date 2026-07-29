'use client';

import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/types';
import { AI_PARTNER_HARD_MAX_STUDENT_TURNS, AI_PARTNER_LEVEL_TURN_TARGETS } from '@/lib/ai/aiPartner/types';
import type { AIPartnerTurnRequest, AIPartnerTurnResponse, TargetVocabItem } from '@/lib/ai/aiPartner/types';
import TranscriptTurn, { type SpeechStatus, type TranscriptTurnData } from './TranscriptTurn';
import ConversationInput from './ConversationInput';

/**
 * Standalone AI Partner conversation UI. Self-contained, like WritingTutor:
 * owns its own transcript/input/speech state, driven entirely by props
 * describing the theme/level context. Not yet wired into the activity grid
 * or given a real activity route — see src/app/dev/ai-partner/page.tsx for
 * the Milestone 2 test harness.
 *
 * Speech is a strictly separate, on-request concern from the text
 * conversation (AI_PARTNER_ACTIVITY_DESIGN.md §4a): the reply is generated
 * and shown first, and pressing Play is the only thing that ever triggers a
 * speech request. Generated audio is cached only in this component's own
 * memory (an object URL per turn id) for the lifetime of this mounted
 * instance — never written to disk, never sent anywhere else.
 */

export interface AIPartnerConversationProps {
  themeId: string;
  level: Level;
  themeDescription: string;
  themeDescriptionJapanese: string;
  mission: string;
  readingPassage: string[];
  targetVocab: TargetVocabItem[];
  opener: string;
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
}: AIPartnerConversationProps) {
  const [turns, setTurns] = useState<TranscriptTurnData[]>(() => [
    { id: 'opener', role: 'partner', text: opener },
  ]);
  const [draftInput, setDraftInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [speechStatus, setSpeechStatus] = useState<Record<string, SpeechStatus>>({});
  const [playingTurnId, setPlayingTurnId] = useState<string | null>(null);

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

      <div className="border border-slate-300 rounded-lg bg-white px-5 py-6 sm:px-8 sm:py-8 mb-4">
        {turns.map(turn => (
          <TranscriptTurn
            key={turn.id}
            turn={turn}
            speechStatus={speechStatus[turn.id] ?? 'idle'}
            isPlaying={playingTurnId === turn.id}
            onPlay={turn.role === 'partner' ? () => handlePlay(turn) : undefined}
            onPause={turn.role === 'partner' ? handlePause : undefined}
          />
        ))}

        {isSubmitting && (
          <div className="pt-4">
            <p className="text-sm text-slate-400 italic">Your partner is thinking...</p>
          </div>
        )}
      </div>

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
