import type { Level } from '@/types';
import type { ConversationSupportRequest, ConversationTurn } from './types';
import { expressChatResponseSchema, type ExpressChatTurn } from '@/lib/ai/expressCoach/types';

/**
 * Prompt module for AI Talk's two conversation-support tools. Pure data/
 * string assembly, no network calls — mirrors prompt.ts. Both tools exist to
 * repair a communication breakdown without ending the conversation: the
 * student stays in AI Talk throughout, per AI_TALK_ACTIVITY_DESIGN.md's
 * philosophy that this activity is a conversation, not an exercise.
 */

const EXPLAIN_LEVEL_GUIDANCE: Record<Level, string> = {
  foundation: 'This student is at Foundation level — explain in very simple English, short sentences.',
  advanced: 'This student is at Advanced level — normal, clear English is fine.',
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
  foundation: 'This student is at Foundation level — keep your language simple and clear, use common everyday words, and give a little more guidance/explanation than you would for a more advanced student.',
  advanced: 'This student is at Advanced level — richer vocabulary and more nuanced explanation are welcome, as long as it still reads naturally.',
};

export function buildExpressSystemInstructions(level: Level): string {
  return `You are an English EXPRESSION COACH helping a Japanese high school student say exactly what they mean, in the middle of a live English conversation. This is an ongoing back-and-forth coaching chat, separate from the main conversation — the student may ask natural follow-up questions (e.g. "Can I still say X?", "Which sounds better?", "What's the difference?", "Is this too formal?", "Can you give me an example?", "Would a native speaker say this?"), and you should answer like a real teacher talking with them, not a one-shot dictionary or translator.

RULES:
1. Answer the student's ACTUAL question or request. Do not force every reply into the same fixed template — a simple follow-up deserves a simple, direct answer, not a repeated list of options.
2. When appropriate, and only when it genuinely helps, you may include: the best expression, other possibilities, why, brief examples, register (formal/informal), usage notes, collocations. Use only what's useful for THIS question — never all of them every time.
3. Register: this student is about to SAY this out loud in a live conversation, so favor natural, everyday CONVERSATIONAL English (not stiff written-style English) unless the student's own question is specifically about written/formal register.
4. ${EXPRESS_LEVEL_GUIDANCE[level]}
5. Stay consistent with the earlier turns of this coaching chat, shown to you below — you can see the whole conversation so far. Build on what you already said; never repeat an explanation you already gave, and never ask the student to restart or re-explain something they already told you.
6. Preserve the student's actual intended meaning — never add ideas they didn't express.
7. Keep replies conversational and reasonably short — a few sentences at most, like a quick real answer from a teacher, not an essay.
8. Never lecture with grammar terminology unless the student explicitly asks about grammar.

Output as structured JSON with two fields:
- "reply": your natural-language answer to the student, as plain text. You may use line breaks for readability, but do not use markdown headers, bold, or bullet symbols — plain conversational prose and short lines only.
- "suggestions": 0 to 3 short, clean, ready-to-say expressions extracted from your reply, ONLY when your reply genuinely offers one or more concrete new phrasings the student could use right now in the conversation. Leave this empty for purely explanatory answers that don't introduce a usable phrase (e.g. answering "is this too formal?" with just an explanation, or "yes, you can still say that" with no new wording).`;
}

function renderMainConversation(history: ConversationTurn[]): string {
  return history.map(t => `${t.role === 'student' ? 'Student' : 'Partner'}: ${t.text}`).join('\n');
}

function renderExpressHistory(history: ExpressChatTurn[]): string {
  return history.map(t => `${t.role === 'student' ? 'Student' : 'You (coach)'}: ${t.text}`).join('\n');
}

export function buildExpressTaskInput(request: ConversationSupportRequest): string {
  const { themeDescription, recentHistory, expressHistory, studentInput } = request;

  return [
    themeDescription ? `Conversation theme: ${themeDescription}` : '',
    recentHistory && recentHistory.length > 0
      ? `Recent moment in the live conversation, for context:\n${renderMainConversation(recentHistory)}`
      : '',
    expressHistory && expressHistory.length > 0
      ? `This coaching chat so far:\n${renderExpressHistory(expressHistory)}`
      : '',
    `Student's new message: "${studentInput ?? ''}"`,
    'Respond to the student\'s new message, continuing this coaching chat naturally.',
  ]
    .filter(Boolean)
    .join('\n\n');
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
    input: buildExpressTaskInput(request),
    schema: expressChatResponseSchema,
  };
}
