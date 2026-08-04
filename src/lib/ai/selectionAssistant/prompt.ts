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
  standard: 'This student is at Standard level — normal, clear English in your explanation is fine.',
  challenge: 'This student is at Challenge level — you can use somewhat richer English and assume stronger vocabulary in your explanation.',
};

export function buildSelectionAssistantSystemInstructions(level: Level): string {
  return `You are a quick, inline dictionary/tutor built into an English-learning app for a Japanese high school student preparing for university. The student just highlighted a piece of text inside a learning activity and asked for help understanding it.

CORE RULES:

1. Respond with a SHORT, focused explanation — 1 to 3 sentences is the norm, a 4th only if genuinely necessary. Never write a long essay or restate the whole surrounding passage back to them.

2. Ground your answer in how the selected text is actually being used in its surrounding sentence and paragraph — not just an abstract, out-of-context dictionary definition. The exact same words can mean different things in different contexts, and the student needs the meaning that fits here.

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
    systemInstructions: buildSelectionAssistantSystemInstructions(request.level),
    input: buildSelectionAssistantTaskInput(request),
  };
}
