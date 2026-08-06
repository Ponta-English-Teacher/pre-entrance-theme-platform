import type { Level } from '@/types';
import type { ExpressChatTurn } from '@/lib/ai/expressCoach/types';

/**
 * Types for the "Talk with Your AI Partner" backend.
 * See AI_TALK_ACTIVITY_DESIGN.md — this implements the Version 1 scope only
 * (§4a speech architecture, §6 completion/progress).
 */

export interface TargetVocabItem {
  word: string;
  japanese: string;
  coreMeaning: string;
}

export interface ConversationTurn {
  role: 'student' | 'partner';
  text: string;
}

export interface AIPartnerTurnRequest {
  themeId: string;
  level: Level;
  themeDescription: string;
  themeDescriptionJapanese: string;
  mission: string;
  readingPassage: string[];
  targetVocab: TargetVocabItem[];
  /** Full conversation so far, oldest first. Must end with a 'student' turn — that is the message being responded to. */
  history: ConversationTurn[];
}

export type AIPartnerTurnResponse =
  | { ok: true; reply: string; studentTurnCount: number }
  | { ok: false; error: string };

export interface AIPartnerSpeechRequest {
  text: string;
  /** How many speech generations this session has already made, tracked client-side. Used only for the cap safeguard in §4a — not a security boundary. */
  speechGenerationCountSoFar: number;
}

/**
 * The lightweight session summary saved when a student finishes a conversation
 * (§6) — no full transcript persistence. This is a data-shape declaration only;
 * the summarization call itself is a later milestone (tied to "Finish
 * Conversation" UI).
 */
export interface AIPartnerSessionSummary {
  themeId: string;
  level: Level;
  completionDate: string;
  studentTurnCount: number;
  topics: string[];
  usefulLanguage: string[];
  reflection?: string;
}

/** Student-turn target per level before the AI offers a natural wind-down (§2/§6). */
export const AI_PARTNER_LEVEL_TURN_TARGETS: Record<Level, number> = {
  foundation: 6,
  advanced: 8,
};

/** Hard maximum student turns at every level — a technical stop, not a suggestion (§6). */
export const AI_PARTNER_HARD_MAX_STUDENT_TURNS = 15;

/** Per-session cap on new speech generations — a cost safeguard distinct from the turn cap (§4a). */
export const AI_PARTNER_MAX_SPEECH_GENERATIONS = 15;

/** Defensive upper bound on text length sent to the speech endpoint (replies are 1–3 sentences). */
export const AI_PARTNER_MAX_SPEECH_TEXT_LENGTH = 500;

/**
 * Conversation-support tools — "💬 What does it mean?" and "💡 Help me say
 * it" — added so a student never has to leave AI Talk to resolve a
 * communication breakdown. Deliberately separate from Selection Assistant:
 * these operate on live conversation turns, not on selected passage/writing
 * text, and belong only to AI Talk. (The Writing activity has its own,
 * separately implemented "Help me say it" — see
 * src/lib/ai/writingTutor/expressPrompt.ts — sharing the same interaction
 * model and response contract via src/lib/ai/expressCoach/types.ts, but not
 * this module's prompt-building code, since it needs written-register output
 * and Writing-specific context instead.)
 */
export type ConversationSupportAction = 'explain' | 'express';

export interface ConversationSupportRequest {
  action: ConversationSupportAction;
  level: Level;
  /** 'explain' — the specific word/phrase/expression the student selected. Explain ONLY this, never the whole turn. */
  selectedText?: string;
  /** 'explain' — the full partner turn the selection came from, for context (e.g. why "dangerous" was a joke). */
  fullTurnText?: string;
  /** 'explain' — a few preceding turns, for extra context when needed. 'express' — a few recent turns of the MAIN AI Talk conversation, so the coach can ground follow-ups ("which sounds better here?") in what's actually being discussed. */
  recentHistory?: ConversationTurn[];
  /** 'express' — the theme's description, for grounding. */
  themeDescription?: string;
  /** 'express' — the student's newest message in this coaching chat (Japanese or rough English, or a natural follow-up question like "is this too formal?"). */
  studentInput?: string;
  /** 'express' — this coaching chat's own turns so far, oldest first, NOT including studentInput — lets the coach continue naturally instead of resetting every turn. */
  expressHistory?: ExpressChatTurn[];
}

export interface ConversationSupportResponse {
  ok: boolean;
  /** 'explain' result. */
  explanation?: string;
  /** 'express' result — the coach's natural-language reply to display in the chat, answering whatever the student actually asked. */
  reply?: string;
  /** 'express' result — 0 to 3 short, ready-to-say expressions extracted from `reply`, only when the reply genuinely offers a new concrete phrasing. Empty for purely explanatory turns (e.g. "is this too formal?"). */
  suggestions?: string[];
  error?: string;
}
