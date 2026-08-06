import type { Level } from '@/types';

/** Actions handled by the text-explanation endpoint (`/api/selection-assistant`).
 *  "How to Read" is a separate, audio-returning action — see
 *  `SELECTION_ASSISTANT_MAX_TEXT_LENGTH` below and `getSpeech.ts` — and is
 *  deliberately NOT part of this type, so it can never be sent here by
 *  mistake. The UI-facing `SelectionActionId` (src/lib/selectionAssistant/types.ts)
 *  widens this with 'howToRead' for the button list only. */
export type ExplanationActionId = 'translate' | 'easy';

export interface SelectionAssistantRequest {
  selectedText: string;
  surroundingSentence: string;
  surroundingParagraph: string;
  activityType: string;
  themeId: string;
  level: Level;
  action: ExplanationActionId;
}

export interface SelectionAssistantResponse {
  ok: boolean;
  explanation?: string;
  error?: string;
}

/** Single shared cap on selected-text length for every Selection Assistant
 *  action — Translate, Easy English, and How to Read all enforce this same
 *  number, deliberately: a student should never find that one action works
 *  on a passage and another silently doesn't. Must comfortably fit a full
 *  paragraph at every reading level, not just Foundation's shorter passages
 *  — the longest paragraph across all current lessons is Theme 1 Advanced's
 *  ~1,136 characters (see docs/THEME_01_ADVANCED_READING_PASSAGE.md); this
 *  leaves real headroom for longer paragraphs in future Advanced content.
 *  Enforced in every layer that must agree: this constant, both API routes
 *  (src/app/api/selection-assistant/route.ts and .../speech/route.ts), and
 *  every client that calls either route (SelectionAssistantProvider,
 *  AIPartnerConversation, VocabDictionaryModal, FlashCards) so an over-limit
 *  selection is rejected before a network call is even made, not just by
 *  the server. */
export const SELECTION_ASSISTANT_MAX_TEXT_LENGTH = 2000;

/** Shown whenever a selection exceeds SELECTION_ASSISTANT_MAX_TEXT_LENGTH,
 *  for any of the three actions — same string used by client-side
 *  pre-flight checks and both API routes' own rejection, so the message is
 *  identical no matter which action or which layer catches it. Bilingual by
 *  design: never a silent or English-only failure. */
export const SELECTION_TEXT_TOO_LONG_MESSAGE =
  'The selected text is too long. Please select a shorter section.\n' +
  '選択した文章が長すぎます。もう少し短い範囲を選択してください。';
