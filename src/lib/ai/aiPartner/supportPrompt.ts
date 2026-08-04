import type { Level } from '@/types';
import type { ConversationSupportRequest } from './types';

/**
 * Prompt module for AI Talk's two conversation-support tools. Pure data/
 * string assembly, no network calls — mirrors prompt.ts. Both tools exist to
 * repair a communication breakdown without ending the conversation: the
 * student stays in AI Talk throughout, per AI_TALK_ACTIVITY_DESIGN.md's
 * philosophy that this activity is a conversation, not an exercise.
 */

const EXPLAIN_LEVEL_GUIDANCE: Record<Level, string> = {
  foundation: 'This student is at Foundation level — explain in very simple English, short sentences.',
  standard: 'This student is at Standard level — normal, clear English is fine.',
  challenge: 'This student is at Challenge level — you can use slightly richer English.',
};

export function buildExplainSystemInstructions(level: Level): string {
  return `You are helping a Japanese high school student understand ONE SPECIFIC word, phrase, idiom, or expression from something their English conversation partner just said, in the middle of a live conversation. This is NOT a translation tool, and the student is NOT asking you to explain the whole message — assume they understand most of the sentence already and are only stuck on the one part they selected.

RULES:
1. Explain ONLY the selected part — its meaning, idiom, humor, tone, or implied meaning as actually used in this specific sentence. Do NOT paraphrase or re-explain the rest of the message around it.
2. Use the full message (and recent turns, if given) only as context to understand what the selected part means here — never as something to also explain.
3. ${EXPLAIN_LEVEL_GUIDANCE[level]} A short Japanese gloss is welcome if it genuinely helps, but the explanation itself should stay brief overall — 1 to 2 sentences total.
4. Do not teach grammar terminology. Do not lecture.
5. Do not ask a question and do not try to keep the conversation going yourself — the student will return to the conversation right after reading your explanation. Just explain, then stop.
6. Output only the explanation as plain text — no labels, no quotation marks around the whole thing, no markdown.`;
}

export function buildExplainTaskInput(request: ConversationSupportRequest): string {
  const { selectedText, fullTurnText, recentHistory } = request;
  const historyText =
    recentHistory && recentHistory.length > 0
      ? recentHistory.map(t => `${t.role === 'student' ? 'Student' : 'Partner'}: ${t.text}`).join('\n')
      : '';

  return [
    historyText ? `Recent conversation, for context:\n${historyText}` : '',
    `The partner's full message this came from: "${fullTurnText}"`,
    `The specific part the student selected and wants explained: "${selectedText}"`,
    'Explain only the selected part, using the full message for context.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

const EXPRESS_LEVEL_GUIDANCE: Record<Level, string> = {
  foundation: 'This student is at Foundation level — keep suggestions short and use simple, common everyday words.',
  standard: 'This student is at Standard level — natural everyday English is fine, a little more varied.',
  challenge: 'This student is at Challenge level — you can suggest slightly richer, more idiomatic conversational English.',
};

export function buildExpressSystemInstructions(level: Level): string {
  return `You are helping a Japanese high school student say something in English, in the middle of a live spoken-style conversation. This is NOT a grammar-correction tool — the student isn't asking you to fix a sentence, they're asking how to say an idea they have in mind, which they may give you in Japanese or in rough/broken English.

RULES:
1. Give exactly 1 or 2 short, natural, CONVERSATIONAL English expressions (not formal or written-style English) the student could say right now to continue the conversation with that idea.
2. ${EXPRESS_LEVEL_GUIDANCE[level]}
3. Preserve the student's actual intended meaning — don't add ideas they didn't express.
4. Output ONLY the expression(s), one per line, nothing else — no numbering, no bullet points, no quotation marks, no explanation of why.`;
}

export function buildExpressTaskInput(studentInput: string): string {
  return `The student wants to say (in Japanese or rough English): "${studentInput}"\n\nGive them 1–2 natural conversational English ways to say this.`;
}

export function buildExplainPrompt(request: ConversationSupportRequest) {
  return {
    systemInstructions: buildExplainSystemInstructions(request.level),
    input: buildExplainTaskInput(request),
  };
}

export function buildExpressPrompt(request: ConversationSupportRequest) {
  return {
    systemInstructions: buildExpressSystemInstructions(request.level),
    input: buildExpressTaskInput(request.studentInput ?? ''),
  };
}
