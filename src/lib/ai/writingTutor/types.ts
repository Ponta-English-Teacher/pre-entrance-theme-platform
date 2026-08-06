import type { Level } from '@/types';
import type { ExpressChatTurn } from '@/lib/ai/expressCoach/types';

/**
 * Types for the Writing Tutor AI backend.
 * See WRITING_TUTOR_SPECIFICATION.md (§6 Prompt architecture, §7 Data structure)
 * and WRITING_TUTOR_EMOTIONAL_DESIGN_ADDENDUM.md for the design this implements.
 */

export interface TargetVocabItem {
  word: string;
  japanese: string;
  coreMeaning: string;
}

export interface FlaggedIssue {
  wrong: string;
  correct: string;
}

export interface WritingTutorRequest {
  themeId: string;
  level: Level;
  lessonId: string;
  mission: string;
  readingPassage: string[];
  targetVocab: TargetVocabItem[];
  writingPrompt: string;
  writingPromptJapanese: string;
  minSentences: number;
  draftText: string;
  /** 1 for a student's first submission on this lesson. */
  revisionNumber: number;
  /** Corrections from the previous feedback pass, so the tutor can notice what got fixed. */
  previouslyFlaggedIssues?: FlaggedIssue[];
}

export interface CorrectionItem extends FlaggedIssue {
  whyJa: string;
}

export interface NaturalAlternative {
  phrase: string;
  whyJa: string;
}

export interface WritingFeedbackResult {
  overallFeedbackJa: string;
  taskAchievementJa: string;
  /** 0–3 genuine corrections. An empty array is a good and common outcome. */
  corrections: CorrectionItem[];
  /** 0–2 alternative natural phrasings — options, never corrections. */
  naturalAlternatives: NaturalAlternative[];
  /** Empty string when no improved version is offered. */
  improvedVersion: string;
  /** Empty string when improvedVersion is empty. Frames it as one option, not the answer. */
  improvedVersionNoteJa: string;
  /** Target-vocabulary words the student actually used. */
  vocabularyUsedWords: string[];
  /** Empty string when vocabularyUsedWords is empty. */
  vocabularyPraiseJa: string;
  /** 0–2 target words the student hasn't used yet. */
  vocabularySuggestedWords: string[];
  /** Empty string when vocabularySuggestedWords is empty. */
  vocabularySuggestionJa: string;
  todaysTipJa: string;
  /** Empty string on a first submission (revisionNumber === 1). */
  revisionDeltaJa: string;
}

export type WritingTutorResponse =
  | { ok: true; feedback: WritingFeedbackResult }
  | { ok: false; error: string };

/**
 * "💡 Help me say it" — Writing's own expression-support tool. Same
 * interaction model and response contract as AI Talk's version
 * (src/lib/ai/aiPartner/supportPrompt.ts's 'express' action) via the shared
 * src/lib/ai/expressCoach/types.ts, but a separate prompt: this one produces
 * natural WRITTEN English (not conversational/spoken register) and is
 * grounded in the theme, level, writing prompt, and the student's current
 * draft rather than a live conversation transcript. Expression support, not
 * grammar correction — never touches or rewrites what the student has
 * already written.
 */
export interface WritingExpressRequest {
  level: Level;
  themeId: string;
  writingPrompt: string;
  /** The student's newest message in this coaching chat — Japanese, English, or mixed. */
  studentInput: string;
  /** The student's current draft so far, for tone/topic continuity. Optional — a blank draft is common at the start. */
  currentDraft?: string;
  /** This coaching chat's own turns so far, oldest first, NOT including studentInput — lets the coach continue naturally instead of resetting every turn. */
  expressHistory?: ExpressChatTurn[];
}

export type WritingExpressResponse =
  | { ok: true; reply: string; suggestions: string[] }
  | { ok: false; error: string };
