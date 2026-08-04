import type { Level } from '@/types';
import type { ExplanationActionId } from '@/lib/ai/selectionAssistant/types';

/** UI-facing action id — widens the backend's explanation-only id with
 *  'howToRead', which is intercepted client-side and never sent to the
 *  text-explanation endpoint (it calls the speech endpoint instead). */
export type SelectionActionId = ExplanationActionId | 'howToRead';

export interface SelectionAction {
  id: SelectionActionId;
  icon: string;
  label: string;
  labelJapanese: string;
}

/** The toolbar's action list — add an entry here (and a matching case in
 *  the backend prompt, or a client-side branch for a non-text action like
 *  "How to Read") to add a new tool without touching any UI layout. */
export const SELECTION_ACTIONS: SelectionAction[] = [
  { id: 'translate', icon: '🇯🇵', label: 'Translate', labelJapanese: '日本語訳' },
  { id: 'howToRead', icon: '🔊', label: 'How to Read', labelJapanese: '読み方' },
  { id: 'easy', icon: '💬', label: 'Easy English', labelJapanese: 'やさしい英語' },
];

/** Metadata a `SelectableContent` region provides about what kind of
 *  learning material it wraps, so the assistant can give the AI real
 *  context (and so future analytics/logging has it too). */
export interface SelectionScopeMeta {
  /** Free-form activity identifier — 'reading', 'vocabulary', 'ai-talk',
   *  'mission-check', 'writing-prompt', 'grammar', 'review', etc. */
  activityType: string;
  themeId?: string;
  level?: Level;
  /** Optional human-readable sub-label shown in the panel, e.g. "Reading Passage". */
  label?: string;
}

export interface ActiveSelection {
  text: string;
  surroundingSentence: string;
  surroundingParagraph: string;
  scope: SelectionScopeMeta;
  /** Bounding rect of the selection, in viewport coordinates, for positioning. */
  rect: { top: number; bottom: number; left: number; right: number };
}
