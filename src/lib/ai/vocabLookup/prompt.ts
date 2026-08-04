import type { VocabLookupRequest } from './types';

/**
 * Prompt for generating a lightweight Foundation vocabulary card for a
 * word that isn't hand-authored in MASTER_VOCABULARY yet — currently only
 * reached by clicking a derivative chip. Mirrors the same card structure
 * and level as the hand-authored entries: a single Longman/Oxford-Learner-
 * style definition, a short Japanese gloss, two natural example sentences,
 * common collocations, and same-word-family derivatives only (never
 * semantically related words).
 */
export const VOCAB_LOOKUP_SYSTEM_INSTRUCTIONS = `You write Foundation-level ("what do I need to know to use this word today") vocabulary cards for Japanese high school students preparing for university (roughly A2–B1 level). You are not writing a full dictionary entry — keep everything short and immediately useful.

Rules:

1. coreMeaning: ONE concise, learner-friendly English definition, in the style of the Longman or Oxford Learner's Dictionary (simple defining vocabulary, one sentence, no jargon).

2. japanese: a short, concise Japanese gloss (a word or short phrase) — never a long explanation.

3. examples: exactly two short, natural example sentences using the word. Keep them at the same simple A2–B1 level as the rest of the card.

4. collocations: 3–5 common, genuinely useful word combinations (e.g. "strong personality", "develop your personality") — not isolated or rare phrases.

5. derivatives: words from the SAME word family only (e.g. for "develop": develop, development, developed, developing) — never semantically related but separate words. Include the base word given to you if it belongs to the family. 2–5 items is typical; return an empty array if the word genuinely has no other family members worth showing.

6. pos: the part of speech of THIS word specifically (not the base word).

Output only the structured fields — no extra commentary.`;

function buildTaskInput(request: VocabLookupRequest): string {
  return [
    `Word to define: "${request.word}"`,
    `Related base word the student was just looking at: "${request.baseWord}"`,
    `Theme context: ${request.themeId}`,
  ].join('\n');
}

export const vocabLookupResponseSchema = {
  type: 'object',
  properties: {
    word: { type: 'string', description: 'The word itself, exactly as given.' },
    japanese: { type: 'string', description: 'Short, concise Japanese gloss — not a long explanation.' },
    pos: {
      type: 'string',
      enum: ['noun', 'verb', 'adjective', 'adverb', 'phrase'],
      description: 'Part of speech of this specific word.',
    },
    coreMeaning: {
      type: 'string',
      description: 'One concise, Longman/Oxford-Learner-style English definition.',
    },
    examples: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
      description: 'Exactly two short, natural example sentences at A2–B1 level.',
    },
    collocations: {
      type: 'array',
      items: { type: 'string' },
      description: '3–5 common, useful word combinations.',
    },
    derivatives: {
      type: 'array',
      items: { type: 'string' },
      description: 'Same-word-family members only. Empty array if none.',
    },
  },
  required: ['word', 'japanese', 'pos', 'coreMeaning', 'examples', 'collocations', 'derivatives'],
  additionalProperties: false,
} as const;

export function buildVocabLookupPrompt(request: VocabLookupRequest) {
  return {
    systemInstructions: VOCAB_LOOKUP_SYSTEM_INSTRUCTIONS,
    input: buildTaskInput(request),
    schema: vocabLookupResponseSchema,
  };
}
