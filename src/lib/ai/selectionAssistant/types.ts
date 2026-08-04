import type { Level } from '@/types';

/** Actions handled by the text-explanation endpoint (`/api/selection-assistant`).
 *  "How to Read" is a separate, audio-returning action — see
 *  `SELECTION_SPEECH_MAX_TEXT_LENGTH` below and `getSpeech.ts` — and is
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

/** Cap on how much selected text "How to Read" will send to server-side TTS. */
export const SELECTION_SPEECH_MAX_TEXT_LENGTH = 500;
