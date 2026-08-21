import type { Level } from '@/types';
import type { ExplanationActionId, SelectionAssistantRequest } from './types';

/**
 * Prompt module for the Selection Assistant — the inline "highlight text,
 * get a short explanation" tutor available across every learning activity.
 * Pure data/string assembly, no network calls — mirrors
 * src/lib/ai/aiPartner/prompt.ts and src/lib/ai/writingTutor/prompt.ts.
 */

const ACTION_INSTRUCTIONS: Record<ExplanationActionId, string> = {
  translate:
    'Give a natural Japanese translation of the selected text as it is used in this specific context. Prefer a natural, idiomatic Japanese translation over a stiff, literal, word-for-word one.',
  easy:
    "Rewrite or explain the selected text using much simpler English — vocabulary and grammar a Japanese high school student at roughly Eiken Grade 2 level would already be comfortable with. Keep the original meaning exactly; don't add new information.",
};

const LEVEL_GUIDANCE: Record<Level, string> = {
  foundation: 'This student is at Foundation level — keep your own explanation itself in very simple English and short sentences.',
  advanced: 'This student is at Advanced level — normal, clear English in your explanation is fine.',
};

/** Both current actions (translate, easy) are full-text transformations of
 *  whatever the student selected — a one-sentence selection and a
 *  whole-paragraph selection are the same action, just at different
 *  scales, and the response must cover 100% of the selection either way.
 *  This is CORE RULE 1 below, and it deliberately overrides the generic
 *  "keep it short" instinct that's correct for a lookup/explanation-style
 *  action (e.g. a future "what does this word mean?" action) but wrong
 *  here: without an explicit override, the model was observed treating a
 *  short-response norm as license to translate/rewrite only the
 *  selection's first sentence and silently drop the rest on
 *  paragraph-length selections. */
const RESPONSE_COVERAGE_INSTRUCTIONS: Record<ExplanationActionId, string> = {
  translate:
    'Translate the ENTIRE selected text, from start to finish — every sentence, not only the first one. Do not omit, summarize, or compress any sentence or idea. Your response length should scale naturally with the length of the selection: one sentence selected gets one translated sentence back; a full multi-sentence paragraph gets a full multi-sentence translation covering all of it. Do not cap this response to a fixed number of sentences, and never pad it with anything beyond what is needed to fully translate the selection.',
  easy:
    'Rewrite the ENTIRE selected text, from start to finish — every sentence, not only the first one. Do not omit, summarize, or compress any sentence or idea; every idea present in the original must still be present in the rewrite. Your response length should scale naturally with the length of the selection: one sentence selected gets one rewritten sentence back; a full multi-sentence paragraph gets a full multi-sentence rewrite covering all of it. Do not cap this response to a fixed number of sentences, and never pad it with anything beyond what is needed to fully rewrite the selection.',
};

export function buildSelectionAssistantSystemInstructions(level: Level, action: ExplanationActionId): string {
  return `You are a quick, inline dictionary/tutor built into an English-learning app for a Japanese high school student preparing for university. The student just highlighted a piece of text inside a learning activity and asked for help understanding it.

CORE RULES:

1. ${RESPONSE_COVERAGE_INSTRUCTIONS[action]}

2. Ground your answer in how the selected text is actually being used in its surrounding sentence and paragraph — not just an abstract, out-of-context dictionary definition. The exact same words can mean different things in different contexts, and the student needs the meaning that fits here. That surrounding sentence and paragraph are context only, never something to restate or include in your response — your response is about the selected text itself.

3. ${LEVEL_GUIDANCE[level]}

4. Be warm and direct — like a good tutor answering one quick question, not a chatbot making conversation. No greetings, no "Great question!", no follow-up questions of your own.

5. Output only the explanation itself as plain text — no labels like "Explanation:", no markdown headers or bullet lists, no wrapping the whole response in quotation marks.`;
}

export function buildSelectionAssistantTaskInput(request: SelectionAssistantRequest): string {
  const { selectedText, surroundingSentence, surroundingParagraph, activityType, themeId, action } = request;

  return [
    `Activity: ${activityType}${themeId ? ` (theme: ${themeId})` : ''}`,
    `Selected text: "${selectedText}"`,
    surroundingSentence ? `Surrounding sentence: "${surroundingSentence}"` : '',
    surroundingParagraph && surroundingParagraph !== surroundingSentence
      ? `Surrounding paragraph (for extra context if needed): "${surroundingParagraph}"`
      : '',
    `Requested action: ${action} — ${ACTION_INSTRUCTIONS[action]}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function buildSelectionAssistantPrompt(request: SelectionAssistantRequest) {
  return {
    systemInstructions: buildSelectionAssistantSystemInstructions(request.level, request.action),
    input: buildSelectionAssistantTaskInput(request),
  };
}
