import type { Level } from '@/types';

/**
 * Contextual AI assistant — currently a MOCK.
 *
 * This project has no AI backend yet (no API routes, no LLM SDK/API key).
 * requestAIHelp() simulates a coach-style assistant using the lesson's own
 * authored data (plain-English paragraphs, hints, vocabulary) plus small
 * heuristics for the writing checks — it never invents lesson content.
 *
 * To connect a real AI backend later: replace the body of requestAIHelp with
 * a call to a real endpoint (e.g. `POST /api/ai-help` with this same
 * HelpContext as the payload). Every call site and all UI already treat this
 * as an async call, so no other code needs to change.
 */

export type HelpLocation = 'paragraph' | 'missionCheck' | 'writing';

export interface HelpOption {
  id: string;
  label: string;
}

export interface HelpContext {
  themeId: string;
  level: Level;
  lessonId: string;
  mission: string;
  targetVocab: { word: string; japanese: string; coreMeaning: string }[];
  location: HelpLocation;
  helpType: string;

  // paragraph location
  paragraph?: {
    english: string;
    japanese: string;
    plainEnglish: string;
    checkQuestion: string;
  };

  // missionCheck location
  missionCheckQuestion?: string;
  missionCheckExplainer?: string;
  missionCheckHint?: string;
  answerParagraphNumber?: number;

  // writing location
  writingPrompt?: string;
  studentText?: string;
  minSentences?: number;
  usefulExpressions?: { phrase: string; japanese: string }[];
  wordBank?: { word: string; japanese: string }[];
}

export interface AIHelpResponse {
  text: string;
  /** English text to speak aloud via the Web Speech API, when relevant. */
  speak?: string;
}

export const PARAGRAPH_HELP_OPTIONS: HelpOption[] = [
  { id: 'easier', label: 'Explain this paragraph in easier English' },
  { id: 'japanese', label: 'Explain it in Japanese' },
  { id: 'word', label: 'Explain a difficult word' },
  { id: 'sentence', label: 'Explain a sentence' },
  { id: 'readAloud', label: 'Read it aloud' },
  { id: 'mission', label: "Remind me of today's mission" },
  { id: 'question', label: 'Ask me a simple question about this paragraph' },
];

export const MISSION_CHECK_HELP_OPTIONS: HelpOption[] = [
  { id: 'meaning', label: 'What does this question mean?' },
  { id: 'word', label: 'Explain a difficult word in the question' },
  { id: 'hint', label: 'Give me a hint' },
  { id: 'reread', label: 'Tell me which paragraph to read again' },
  { id: 'noAnswer', label: 'Help me without giving me the answer' },
];

export const WRITING_HELP_OPTIONS: HelpOption[] = [
  { id: 'understand', label: 'Help me understand the writing question' },
  { id: 'idea', label: 'Help me think of an idea' },
  { id: 'start', label: 'Help me start' },
  { id: 'word', label: 'Suggest a useful target word' },
  { id: 'grammar', label: 'Check my grammar' },
  { id: 'natural', label: 'Make my sentence more natural' },
  { id: 'answered', label: 'Tell me whether I answered the question' },
];

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findVocabHits<T extends { word: string }>(text: string, vocab: T[]): T[] {
  const lower = text.toLowerCase();
  return vocab.filter(v => lower.includes(v.word.toLowerCase()));
}

function paragraphHelp(ctx: HelpContext): AIHelpResponse {
  const p = ctx.paragraph!;
  switch (ctx.helpType) {
    case 'easier':
      return { text: p.plainEnglish };
    case 'japanese':
      return { text: p.japanese };
    case 'word': {
      const hits = findVocabHits(p.english, ctx.targetVocab);
      if (hits.length === 0) {
        return { text: "I don't see one of today's target words in this paragraph — try looking up any word in the Dictionary." };
      }
      return { text: hits.map(v => `• ${v.word} (${v.japanese}) — ${v.coreMeaning}`).join('\n') };
    }
    case 'sentence':
      return { text: `Here it is in simpler English: "${p.plainEnglish}"\n\nIf one sentence is still unclear, compare it with the Japanese: ${p.japanese}` };
    case 'readAloud':
      return { text: '🔊 Playing this paragraph aloud...', speak: p.english };
    case 'mission':
      return { text: `Your mission: ${ctx.mission}` };
    case 'question':
      return { text: p.checkQuestion };
    default:
      return { text: "I'm not sure how to help with that yet." };
  }
}

function missionCheckHelp(ctx: HelpContext): AIHelpResponse {
  switch (ctx.helpType) {
    case 'meaning':
      return { text: ctx.missionCheckExplainer ?? '' };
    case 'word': {
      const hits = findVocabHits(ctx.missionCheckQuestion ?? '', ctx.targetVocab);
      if (hits.length === 0) {
        return { text: "There isn't a target vocabulary word in this question — try reading it once more, slowly." };
      }
      return { text: hits.map(v => `• ${v.word} (${v.japanese}) — ${v.coreMeaning}`).join('\n') };
    }
    case 'hint':
      return { text: ctx.missionCheckHint ?? '' };
    case 'reread':
      return { text: `Try reading paragraph ${ctx.answerParagraphNumber} again — the answer is closest to that part.` };
    case 'noAnswer':
      return {
        text: `I won't give the answer directly, but here is a hint: ${ctx.missionCheckHint} Re-read paragraph ${ctx.answerParagraphNumber} and look for what actually changed for the person in the example.`,
      };
    default:
      return { text: "I'm not sure how to help with that yet." };
  }
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length;
}

function writingHelp(ctx: HelpContext): AIHelpResponse {
  const text = (ctx.studentText ?? '').trim();

  switch (ctx.helpType) {
    case 'understand':
      return { text: 'In simple words, the question is asking: do you agree with what the author said, and can you explain why in your own words?' };
    case 'idea':
      return {
        text: 'Here are two ways to start thinking:\n1) Do you remember a time you tried something new, like Aya did?\n2) Do you believe confidence is something people are born with, or something they build over time?',
      };
    case 'start': {
      const suggestion = ctx.usefulExpressions?.[0]?.phrase ?? 'I think...';
      return { text: `A simple way to start: "${suggestion}"` };
    }
    case 'word': {
      const usedWords = new Set(findVocabHits(text, ctx.wordBank ?? []).map(v => v.word));
      const unused = (ctx.wordBank ?? []).filter(v => !usedWords.has(v.word));
      if (unused.length === 0) {
        return { text: "You've already used the key words from today's Word Bank — nice work!" };
      }
      const pick = unused[0];
      return { text: `Try using the word "${pick.word}" (${pick.japanese}) somewhere in your answer.` };
    }
    case 'grammar': {
      if (!text) return { text: 'Write a sentence first, and I can check it with you.' };
      const tips: string[] = [];
      if (!/[.!?]$/.test(text)) tips.push('Try ending your sentence with a period (.).');
      if (!/^[A-Z]/.test(text)) tips.push('Start your sentence with a capital letter.');
      if (/(^|[^a-zA-Z])i(?![a-zA-Z])/.test(text)) tips.push('Remember to capitalize "I" when it stands alone.');
      if (tips.length === 0) tips.push('Your sentence looks clear! Read it aloud once to check it sounds natural.');
      return { text: tips.join(' ') };
    }
    case 'natural': {
      if (!text) return { text: 'Write a sentence first, and I can suggest a more natural way to say it.' };
      const starter = ctx.usefulExpressions?.[0]?.phrase ?? 'I think...';
      return { text: `Try reading your sentence aloud. Short, clear sentences often sound more natural than long ones. Starting with "${starter}" can also help it flow.` };
    }
    case 'answered': {
      if (!text) return { text: "You haven't written anything yet — start with whether you agree or disagree." };
      const sentenceCount = countSentences(text);
      const mentionsAgreement = /\b(agree|disagree)\b/i.test(text);
      if (sentenceCount < (ctx.minSentences ?? 2)) {
        return { text: `You're off to a good start, but try writing at least ${ctx.minSentences ?? 2} sentences so your idea is clear.` };
      }
      if (!mentionsAgreement) {
        return { text: 'Your answer does not clearly say whether you agree or disagree. Try adding a sentence like "I agree because..." or "I disagree because..."' };
      }
      return { text: 'Yes — you clearly stated your opinion and explained it. Good work!' };
    }
    default:
      return { text: "I'm not sure how to help with that yet." };
  }
}

export async function requestAIHelp(context: HelpContext): Promise<AIHelpResponse> {
  await wait(350 + Math.round(Math.random() * 250));

  switch (context.location) {
    case 'paragraph':
      return paragraphHelp(context);
    case 'missionCheck':
      return missionCheckHelp(context);
    case 'writing':
      return writingHelp(context);
    default:
      return { text: "I'm not sure how to help with that yet." };
  }
}
