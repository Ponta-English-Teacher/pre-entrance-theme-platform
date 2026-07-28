import type { Level } from '@/types';

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
