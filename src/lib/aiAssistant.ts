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
    /** Pre-generated narration audio, when available (see scripts/generate-reading-audio.ts). */
    audioUrl?: string;
  };

  // missionCheck location
  missionCheckQuestion?: string;
  missionCheckExplainerJa?: string;
  missionCheckHintJa?: string;
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
  /** English text to speak aloud via the Web Speech API — used only when audioUrl is absent, or as the runtime-failure fallback for it. */
  speak?: string;
  /** Pre-generated narration audio to play directly, when available. Takes priority over `speak`. */
  audioUrl?: string;
}

export const PARAGRAPH_HELP_OPTIONS: HelpOption[] = [
  { id: 'easier', label: 'やさしい英語で説明' },
  { id: 'japanese', label: '日本語でわかりやすく説明' },
  { id: 'word', label: '難しい単語を確認' },
  { id: 'sentence', label: '文の意味を確認' },
  { id: 'readAloud', label: '読み上げを聞く' },
  { id: 'mission', label: '今日のミッションを確認' },
  { id: 'question', label: 'この段落の簡単な問題に挑戦' },
];

export const MISSION_CHECK_HELP_OPTIONS: HelpOption[] = [
  { id: 'meaning', label: '質問の意味を確認' },
  { id: 'word', label: '質問の難しい単語を確認' },
  { id: 'hint', label: 'ヒントを見る' },
  { id: 'reread', label: '読み返す段落を確認' },
  { id: 'noAnswer', label: '答えは言わずにヒントだけ' },
];

export const WRITING_HELP_OPTIONS: HelpOption[] = [
  { id: 'understand', label: '質問の意味を確認' },
  { id: 'idea', label: 'アイデアのヒント' },
  { id: 'start', label: '書き出しのヒント' },
  { id: 'word', label: '使える単語を確認' },
  { id: 'grammar', label: '文法をチェック' },
  { id: 'natural', label: 'より自然な表現を確認する' },
  { id: 'answered', label: '質問に答えられているか確認' },
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
      return { text: `段落全体を、やさしい英語で言い換えるとこうなります。\n\n${p.plainEnglish}` };
    case 'japanese':
      return { text: `日本語にすると、こんな意味です。\n\n${p.japanese}` };
    case 'word': {
      const hits = findVocabHits(p.english, ctx.targetVocab);
      if (hits.length === 0) {
        return { text: '今日の単語は、この段落には出てきていないようです。気になる単語があれば、辞書で調べてみましょう。' };
      }
      return {
        text: `この段落に出てくる今日の単語はこちらです。\n\n${hits.map(v => `・${v.word}（${v.japanese}）`).join('\n')}`,
      };
    }
    case 'sentence':
      return {
        text: `わかりにくいところがあるかもしれませんね。段落をやさしい英語にすると、こうなります。\n\n${p.plainEnglish}\n\nそれでも迷ったら、日本語訳とも見比べてみましょう。\n${p.japanese}`,
      };
    case 'readAloud':
      return p.audioUrl
        ? { text: '🔊 読み上げますね。', audioUrl: p.audioUrl, speak: p.english }
        : { text: '🔊 読み上げますね。', speak: p.english };
    case 'mission':
      return { text: `今日のミッションはこちらです。\n\n${ctx.mission}` };
    case 'question':
      return { text: `この段落について、簡単な問題に挑戦してみましょう。\n\n${p.checkQuestion}` };
    default:
      return { text: 'ごめんなさい、その質問にはまだうまく答えられません。' };
  }
}

function missionCheckHelp(ctx: HelpContext): AIHelpResponse {
  switch (ctx.helpType) {
    case 'meaning':
      return { text: `質問をやさしく言うと、こういうことです。\n\n${ctx.missionCheckExplainerJa ?? ''}` };
    case 'word': {
      const hits = findVocabHits(ctx.missionCheckQuestion ?? '', ctx.targetVocab);
      if (hits.length === 0) {
        return { text: 'この質問には、今日の単語は使われていないようです。落ち着いてもう一度読んでみましょう。' };
      }
      return {
        text: `質問に出てくる今日の単語はこちらです。\n\n${hits.map(v => `・${v.word}（${v.japanese}）`).join('\n')}`,
      };
    }
    case 'hint':
      return { text: `ヒントはこちらです。\n\n${ctx.missionCheckHintJa ?? ''}` };
    case 'reread':
      return { text: `もう一度、第${ctx.answerParagraphNumber}段落を読んでみましょう。答えのヒントがそこにありますよ。` };
    case 'noAnswer':
      return {
        text: `答えをそのまま伝えることはしませんが、ヒントを出しますね。\n\n${ctx.missionCheckHintJa ?? ''}\n\n第${ctx.answerParagraphNumber}段落を読み返して、登場人物にどんな変化があったかを探してみましょう。`,
      };
    default:
      return { text: 'ごめんなさい、その質問にはまだうまく答えられません。' };
  }
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length;
}

function writingHelp(ctx: HelpContext): AIHelpResponse {
  const text = (ctx.studentText ?? '').trim();

  switch (ctx.helpType) {
    case 'understand':
      return {
        text: '簡単に言うと、この質問は「筆者の考えに賛成かどうか、そしてその理由を自分の言葉で説明できるか」を聞いています。',
      };
    case 'idea':
      return {
        text: '考えるヒントを2つ挙げますね。\n① アヤのように、自分も新しいことに挑戦した経験はありますか？\n② 自信は生まれつきのものだと思いますか、それとも経験を通して身についていくものだと思いますか？',
      };
    case 'start': {
      const suggestion = ctx.usefulExpressions?.[0]?.phrase ?? 'I think...';
      return { text: `書き出しのヒントです。こんな表現から始めてみましょう。\n\n"${suggestion}"` };
    }
    case 'word': {
      const usedWords = new Set(findVocabHits(text, ctx.wordBank ?? []).map(v => v.word));
      const unused = (ctx.wordBank ?? []).filter(v => !usedWords.has(v.word));
      if (unused.length === 0) {
        return { text: '今日のワードバンクの単語は、もう使えていますね。よくできました！' };
      }
      const pick = unused[0];
      return { text: `「${pick.word}」（${pick.japanese}）という単語を、文章のどこかで使ってみましょう。` };
    }
    case 'grammar': {
      if (!text) return { text: 'まずは何か書いてみましょう。書けたら、一緒に文法をチェックしますね。' };
      const tips: string[] = [];
      if (!/[.!?]$/.test(text)) tips.push('文の最後にピリオド（.）を忘れずに付けてみましょう。');
      if (!/^[A-Z]/.test(text)) tips.push('文の最初の文字は大文字にしましょう。');
      if (/(^|[^a-zA-Z])i(?![a-zA-Z])/.test(text)) tips.push('「I」は一文字で使うときも大文字にすることを忘れずに。');
      if (tips.length === 0) tips.push('文法はきれいに書けていますね！声に出して読んでみると、自然かどうか確認できますよ。');
      return { text: tips.join('\n') };
    }
    case 'natural': {
      if (!text) return { text: 'まずは何か書いてみましょう。書けたら、もっと自然な言い方を一緒に考えますね。' };
      const starter = ctx.usefulExpressions?.[0]?.phrase ?? 'I think...';
      return {
        text: `声に出して読んでみましょう。短くわかりやすい文の方が、自然に聞こえることが多いですよ。"${starter}" のような表現から始めるのもおすすめです。`,
      };
    }
    case 'answered': {
      if (!text) return { text: 'まだ何も書かれていないようです。賛成か反対か、そこから書き始めてみましょう。' };
      const sentenceCount = countSentences(text);
      const mentionsAgreement = /\b(agree|disagree)\b/i.test(text);
      if (sentenceCount < (ctx.minSentences ?? 2)) {
        return { text: `いいスタートです。考えをもっとはっきり伝えるために、${ctx.minSentences ?? 2}文以上書いてみましょう。` };
      }
      if (!mentionsAgreement) {
        return {
          text: '賛成か反対か、まだはっきり伝わってきません。"I agree because..." や "I disagree because..." のような文を加えてみましょう。',
        };
      }
      return { text: 'しっかり自分の意見を伝えられていますね。よく書けています！' };
    }
    default:
      return { text: 'ごめんなさい、その質問にはまだうまく答えられません。' };
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
      return { text: 'ごめんなさい、その質問にはまだうまく答えられません。' };
  }
}
