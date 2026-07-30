import type { Level } from '@/types';

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
  standard: 8,
  challenge: 10,
};

/** Hard maximum student turns at every level — a technical stop, not a suggestion (§6). */
export const AI_PARTNER_HARD_MAX_STUDENT_TURNS = 15;

/** Per-session cap on new speech generations — a cost safeguard distinct from the turn cap (§4a). */
export const AI_PARTNER_MAX_SPEECH_GENERATIONS = 15;

/** Defensive upper bound on text length sent to the speech endpoint (replies are 1–3 sentences). */
export const AI_PARTNER_MAX_SPEECH_TEXT_LENGTH = 500;
