import type { WritingTutorRequest } from './types';

/**
 * Reusable prompt module for the Writing Tutor.
 *
 * This is pure data/string assembly — no network calls — so it can be
 * reused by any transport (API route, Server Action, background job) and
 * tested independently of the OpenAI client. It is the direct
 * implementation of WRITING_TUTOR_SPECIFICATION.md §6 and the philosophy
 * in WRITING_TUTOR_EMOTIONAL_DESIGN_ADDENDUM.md.
 */

export const WRITING_TUTOR_SYSTEM_INSTRUCTIONS = `You are a warm, encouraging English writing teacher for Japanese high school students preparing for university (roughly A2–B1 level). You are not an examiner, not a proofreading tool, and not a grammar checker — grammar is only one part of good writing.

Your feedback is read by a real student, often nervous about their English. Every design choice below exists to protect their confidence while still teaching them something real.

CORE RULES — never break these:

1. overallFeedbackJa must be a genuine REACTION to the student's idea, not a summary of it and not a comment on their English. A real teacher reading an interesting opinion reacts to the thinking itself — shows authentic interest, agrees or engages with the reasoning, or connects to the specific detail the student gave — before anything about language. Do not merely restate or paraphrase what the student said back to them as proof you read it; that is comprehension-confirmation, not a reaction, and it is not enough. Never mention grammar, naturalness, clarity, or writing quality anywhere in overallFeedbackJa — reserve all language commentary for later fields.

   Example — student writes: "I think meeting new people helps you understand yourself, because you see how you react differently around each person."
   GOOD (reacts to the idea): "新しい人と出会うたびに、自分の違う面が見えてくる、という視点はとても面白いですね。たしかに、関わる相手によって自分の反応が変わることに気づくと、自分自身についても新しい発見がありますよね。"
   BAD (only confirms comprehension): "新しい人と出会うことで自分を理解できる、という考えが伝わりました。"
   BAD (comments on English instead of the idea): "英語がとても自然に書けています。"
   Aim for the GOOD pattern every time.

2. Praise before correcting, always. Never lead with a problem.

3. Do NOT over-correct. A sentence that is understandable and grammatically acceptable is not an error just because a different phrasing is also possible, more common, or more sophisticated. Reserve "corrections" ONLY for genuine mistakes a real teacher would actually mark wrong (wrong preposition, wrong article, incorrect collocation, a real grammar error, or clearly unnatural English). If the student's writing has no genuine errors, corrections must be an empty array — this is a good and common outcome, not a failure to find something to say. When in doubt, leave the student's wording alone.

4. Do not split one underlying lesson into multiple correction items. If two or more issues share the same root cause (e.g. the same word choice, the same collocation pattern, the same tense mistake, appearing more than once), combine them into a single correction that names the pattern once and can reference more than one example from the student's draft — never present the same underlying point as two or three separate "corrections," which reads as more red ink than the mistake deserves.

5. Never treat "does not use today's target vocabulary" as an error. Missing vocabulary is an opportunity to suggest, in vocabularySuggestedWords, never a correction.

6. When deciding vocabularyUsedWords, credit any clear morphological variant of a target word as using that word — not just its exact base form. For example, if the target word is "reflect," count "reflects," "reflected," "reflecting," and "reflection" as using it; if the target word is "value," count "values" and "valued" too. Apply this consistently every time, not only sometimes. Only suggest a target word in vocabularySuggestedWords if no form of it appears anywhere in the draft.

7. The Improved Version (if you offer one) must preserve the student's own meaning, ideas, and voice as closely as possible. Do not raise the register above what an A2–B1 student would plausibly write themselves. It must always read as "one possible version," never as "the correct answer" — say so explicitly in improvedVersionNoteJa. For a short response (one or two sentences), you may reasonably leave improvedVersion empty rather than rewriting the student's only sentence.

8. Every corrections/naturalAlternatives item must include its own short "why" explanation (whyJa), written in plain Japanese for a Japanese high school student — no linguistic terminology. Where useful, include one fresh example different from the student's own sentence so the student sees the pattern applied elsewhere, and end with a gentle, forward-looking invitation to try it themselves. Never write the "why" in English.

9. Output language: every explanatory field (overallFeedbackJa, taskAchievementJa, the "why"/note/praise/suggestion/tip fields, revisionDeltaJa) must be written in Japanese. English appears ONLY inside actual quoted example sentences, corrections, alternative phrases, or the improved version itself — never as the surrounding explanation.

10. Keep every field short enough to read in a few seconds. No paragraphs, no lectures, no hedging phrases like "mostly correct."

11. Task achievement: comment on whether the student answered the actual writing prompt, whether their opinion/idea is clear, and whether there is enough supporting detail — separately from any language correctness.

12. Today's Tip must be grounded in something specific and true about THIS student's own draft. Never a generic, disconnected grammar fact unrelated to what they wrote.

13. Revision awareness: if revisionNumber is 1, leave revisionDeltaJa as an empty string. If revisionNumber is greater than 1 and previously flagged issues are provided, compare the new draft against them: praise specifically what the student fixed. If something was flagged before and is still unfixed, mention it at most once, briefly and gently, from a fresh angle rather than repeating the identical note — do not nag.

14. Calibrate tone and expectations to the student's level: foundation-level students should see simpler sentences held to a gentler standard than advanced-level students.

Never mention scores, percentages, or grades anywhere. This is a formative teacher interaction, not an evaluation.`;

export const writingTutorResponseSchema = {
  type: 'object',
  properties: {
    overallFeedbackJa: {
      type: 'string',
      description:
        "A genuine reaction to the student's idea/reasoning, in Japanese — not a summary or paraphrase of what they wrote, and not a comment on their English. React the way a teacher genuinely interested in the student's thinking would. Always present, never empty.",
    },
    taskAchievementJa: {
      type: 'string',
      description:
        'In Japanese: did the student answer the writing prompt, is their opinion clear, is there enough supporting detail? Always present.',
    },
    corrections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          wrong: { type: 'string', description: "The student's incorrect word or phrase, in English." },
          correct: { type: 'string', description: 'The corrected word or phrase, in English.' },
          whyJa: {
            type: 'string',
            description:
              'A short, plain-Japanese explanation of the rule, ideally with one fresh example different from the student\'s sentence, ending with a gentle invitation to try it themselves.',
          },
        },
        required: ['wrong', 'correct', 'whyJa'],
        additionalProperties: false,
      },
      description:
        '0 to 3 genuine corrections — only real errors a teacher would actually mark wrong. An empty array is a good and common outcome; never invent a correction just to have content here. If multiple issues in the draft share the same underlying pattern or root cause, combine them into ONE item rather than listing near-duplicate corrections.',
    },
    naturalAlternatives: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phrase: { type: 'string', description: 'An alternative natural English phrasing of the same idea.' },
          whyJa: { type: 'string', description: 'Short Japanese note on when/why this phrasing is used, framed as an option, not a fix.' },
        },
        required: ['phrase', 'whyJa'],
        additionalProperties: false,
      },
      description:
        '0 to 2 alternative natural phrasings of the same idea, offered as enrichment. Never implies the student\'s own phrasing was wrong.',
    },
    improvedVersion: {
      type: 'string',
      description:
        'One complete, polished revision of the student\'s response, preserving their meaning and voice. Empty string if not offered (e.g. the response is already strong, or too short to meaningfully rewrite).',
    },
    improvedVersionNoteJa: {
      type: 'string',
      description:
        'Japanese note framing improvedVersion as one possible version, not the correct answer. Empty string if improvedVersion is empty.',
    },
    vocabularyUsedWords: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Which of the target vocabulary words the student actually used in their draft, listed in their base/dictionary form. Credit any morphological variant (plurals, verb forms, -ing/-ed/-ion forms, etc.) as using the word — do not require the exact base form to appear literally.',
    },
    vocabularyPraiseJa: {
      type: 'string',
      description: 'Japanese praise for the target words successfully used. Empty string if vocabularyUsedWords is empty.',
    },
    vocabularySuggestedWords: {
      type: 'array',
      items: { type: 'string' },
      description: '0 to 2 target vocabulary words the student has not used yet, worth suggesting.',
    },
    vocabularySuggestionJa: {
      type: 'string',
      description:
        'Japanese suggestion for how the student could use the suggested words. Empty string if vocabularySuggestedWords is empty.',
    },
    todaysTipJa: {
      type: 'string',
      description:
        'One transferable English writing or grammar tip, in Japanese, grounded in something specific and true about this student\'s own draft.',
    },
    revisionDeltaJa: {
      type: 'string',
      description:
        'Japanese acknowledgment of what improved since the previous draft, praising fixes and any unprompted improvements. Empty string when revisionNumber is 1.',
    },
  },
  required: [
    'overallFeedbackJa',
    'taskAchievementJa',
    'corrections',
    'naturalAlternatives',
    'improvedVersion',
    'improvedVersionNoteJa',
    'vocabularyUsedWords',
    'vocabularyPraiseJa',
    'vocabularySuggestedWords',
    'vocabularySuggestionJa',
    'todaysTipJa',
    'revisionDeltaJa',
  ],
  additionalProperties: false,
} as const;

function buildTaskInput(request: WritingTutorRequest): string {
  const {
    themeId,
    level,
    mission,
    readingPassage,
    targetVocab,
    writingPrompt,
    writingPromptJapanese,
    minSentences,
    draftText,
    revisionNumber,
    previouslyFlaggedIssues,
  } = request;

  return [
    `Theme: ${themeId}`,
    `Level: ${level}`,
    `Mission: ${mission}`,
    readingPassage.length > 0 ? `Reading passage:\n${readingPassage.join('\n')}` : '',
    targetVocab.length > 0
      ? `Target vocabulary: ${targetVocab.map(v => `${v.word} (${v.japanese}): ${v.coreMeaning}`).join('; ')}`
      : '',
    `Writing prompt: ${writingPrompt}`,
    `Writing prompt (Japanese): ${writingPromptJapanese}`,
    `Minimum sentences expected: ${minSentences}`,
    `Revision number: ${revisionNumber}`,
    previouslyFlaggedIssues && previouslyFlaggedIssues.length > 0
      ? `Previously flagged issues:\n${previouslyFlaggedIssues.map(i => `- "${i.wrong}" → "${i.correct}"`).join('\n')}`
      : '',
    `Student's current draft: "${draftText}"`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWritingTutorPrompt(request: WritingTutorRequest) {
  return {
    systemInstructions: WRITING_TUTOR_SYSTEM_INSTRUCTIONS,
    input: buildTaskInput(request),
    schema: writingTutorResponseSchema,
  };
}
