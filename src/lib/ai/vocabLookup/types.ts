/**
 * Types for on-demand vocabulary card generation — used when a student
 * clicks a derivative (or any word) that isn't already in
 * MASTER_VOCABULARY. Generates a lightweight card in the same Foundation
 * structure as hand-authored entries, so every word stays explorable.
 */

export interface VocabLookupRequest {
  /** The word to generate a card for, e.g. "development". */
  word: string;
  /** The word the student was viewing when they clicked this one, e.g. "develop" — gives the model word-family context. */
  baseWord: string;
  themeId: string;
}

export interface GeneratedVocabEntry {
  word: string;
  japanese: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  coreMeaning: string;
  examples: [string, string];
  collocations: string[];
  derivatives: string[];
}

export type VocabLookupResponse =
  | { ok: true; entry: GeneratedVocabEntry }
  | { ok: false; error: string };
