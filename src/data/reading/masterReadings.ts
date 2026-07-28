import type { Level } from '@/types';

export interface ReadingParagraph {
  id: string;
  english: string;
  japanese: string;
  /** Simplified paraphrase, used by the "explain in easier English" help option. */
  plainEnglish: string;
  /** A light comprehension question, used by the "ask me a question" help option. */
  checkQuestion: string;
}

export interface SurveyOption {
  id: string;
  label: string;
}

export interface PreReadingSurvey {
  question: string;
  options: SurveyOption[];
}

export interface MissionCheckOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface EvidenceOption {
  id: string;
  label: string;
  paragraphId: string;
}

export interface MissionCheck {
  question: string;
  /** Simpler restatement, for "what does this question mean?" */
  explainer: string;
  hint: string;
  options: MissionCheckOption[];
  /** Which paragraph the answer is grounded in, for "which paragraph should I reread?" */
  answerParagraphId: string;
  evidencePrompt: string;
  evidenceOptions: EvidenceOption[];
}

export interface WordBankEntry {
  vocabId: string;
  examplePhrase: string;
}

export interface UsefulExpression {
  phrase: string;
  japanese: string;
}

export interface WritingTask {
  prompt: string;
  promptJapanese: string;
  minSentences: number;
  wordBank: WordBankEntry[];
  usefulExpressions: UsefulExpression[];
}

export interface ReadingLesson {
  id: string;
  themeId: string;
  level: Level;
  title: string;
  titleJapanese: string;
  estimatedMinutes: number;
  welcome: string;
  mission: string;
  preReadingSurvey: PreReadingSurvey;
  paragraphs: ReadingParagraph[];
  /** Ids into MASTER_VOCABULARY — the target words this lesson recycles from Vocabulary. */
  targetVocabIds: string[];
  missionCheck: MissionCheck;
  writing: WritingTask;
  takeaway: string;
}

export const MASTER_READINGS: ReadingLesson[] = [

  // ── Knowing Myself — Foundation ──────────────────────────────────────────
  // Approved Version 1 lesson data (AI draft → teacher review → approved here).

  {
    id: 'km-f-reading-01',
    themeId: 'knowing-myself',
    level: 'foundation',
    title: 'Who Am I Becoming?',
    titleJapanese: '私はどんな人になっていくのだろう？',
    estimatedMinutes: 15,
    welcome: 'Today, you will think about the kind of person you are becoming.',
    mission: 'As you read, find what the author believes helps people grow and understand themselves. At the end, decide whether you agree.',

    preReadingSurvey: {
      question: 'Which statement is closest to your opinion?',
      options: [
        { id: 'born', label: 'People are born confident.' },
        { id: 'learned', label: 'Confidence can be learned.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'km-f-reading-01-p1',
        english:
          'Many people think they should already know exactly who they are. In truth, identity is not something you discover all at once. It grows slowly, through small experiences and quiet moments of reflection. Every new challenge you try adds one more piece to the picture.',
        japanese:
          '多くの人は、自分が何者であるかをすでにはっきり分かっているべきだと考えています。しかし実際には、アイデンティティは一度に発見されるものではありません。それは、小さな経験や静かに振り返る時間を通して、少しずつ育っていくものです。新しい挑戦をするたびに、自分がどんな人間になっていくのかという絵に、また一つのピースが加わります。',
        plainEnglish:
          'You do not have to know everything about yourself right now. You learn who you are little by little, especially when you try new things and think about them afterward.',
        checkQuestion: 'According to this paragraph, does your identity appear all at once, or does it grow slowly?',
      },
      {
        id: 'km-f-reading-01-p2',
        english:
          'For example, Aya used to feel too shy to speak in English class. One day, she agreed to give a short presentation about her values. Her voice shook at first, but she finished, and her classmates clapped for her. That small moment of courage gave her real confidence, and she noticed a new strength in herself.',
        japanese:
          '例えば、アヤは英語の授業で話すことをとても恥ずかしく感じていました。ある日、彼女は自分の価値観について短いプレゼンテーションをすることに決めました。最初は声が震えましたが、最後までやり遂げ、クラスメートたちは彼女に拍手を送りました。その小さな勇気の瞬間が、彼女に本当の自信を与え、自分の中にある新しい強みに気づかせてくれました。',
        plainEnglish:
          'Aya was shy, but she tried something difficult: speaking in English about what mattered to her. It was hard, but she did it. After that, she felt more confident and found a strength she did not know she had.',
        checkQuestion: 'What small challenge did Aya face, and what did it give her?',
      },
      {
        id: 'km-f-reading-01-p3',
        english:
          'This is how character is built — not in one dramatic moment, but through many small choices to try, share, and grow. When you reflect honestly on your experiences, you can describe yourself more clearly and set new goals. Each small step brings you a little closer to your dream. You do not need every answer today; you only need the courage to keep learning.',
        japanese:
          '人格というものは、一つの劇的な瞬間で作られるのではなく、挑戦し、分かち合い、成長しようとする小さな選択の積み重ねによって作られます。自分の経験について正直に振り返るとき、あなたは自分自身をより明確に説明し、新しい目標を立てることができます。小さな一歩一歩が、あなたの夢に少しずつ近づけてくれます。今日すべての答えを持っている必要はありません。ただ、学び続ける勇気さえあればいいのです。',
        plainEnglish:
          'Your character grows from many small choices, not one big moment. Thinking honestly about your experiences helps you understand and describe yourself, and set goals for the future. You do not need to have all the answers now — just keep trying and learning.',
        checkQuestion: 'According to this paragraph, what helps you move closer to your dream?',
      },
    ],

    targetVocabIds: [
      'km-f-01', // identity
      'km-f-02', // value
      'km-f-03', // goal
      'km-f-04', // strength
      'km-f-05', // dream
      'km-f-06', // confidence
      'km-f-07', // character
      'km-f-08', // describe
      'km-f-09', // reflect
      'km-f-10', // share
    ],

    missionCheck: {
      question: 'What does the author believe helps people grow and understand themselves?',
      explainer: 'In simple words: what does the writer think is the reason people slowly learn who they are?',
      hint: "Look at what happens to Aya in paragraph 2, and the phrase 'small choices' in paragraph 3.",
      options: [
        { id: 'a', label: 'Trying small challenges and reflecting on them', correct: true },
        { id: 'b', label: 'Being naturally confident from birth', correct: false },
        { id: 'c', label: 'Waiting until you are older to think about it', correct: false },
      ],
      answerParagraphId: 'km-f-reading-01-p1',
      evidencePrompt: 'Which idea from the reading best supports your answer?',
      evidenceOptions: [
        { id: 'e1', label: 'It grows slowly, through small experiences and quiet moments of reflection.', paragraphId: 'km-f-reading-01-p1' },
        { id: 'e2', label: 'That small moment of courage gave her real confidence...', paragraphId: 'km-f-reading-01-p2' },
        { id: 'e3', label: '...through many small choices to try, share, and grow.', paragraphId: 'km-f-reading-01-p3' },
      ],
    },

    writing: {
      prompt: 'Do you agree with the author? Why or why not? Write 2–3 sentences.',
      promptJapanese: 'あなたは筆者の考えに賛成ですか。それはなぜですか。2〜3文で書きましょう。',
      minSentences: 2,
      wordBank: [
        { vocabId: 'km-f-01', examplePhrase: 'I think my identity is still growing.' },
        { vocabId: 'km-f-06', examplePhrase: 'This helps me build confidence.' },
        { vocabId: 'km-f-04', examplePhrase: 'I found a new strength when...' },
        { vocabId: 'km-f-07', examplePhrase: 'I agree because character grows through...' },
        { vocabId: 'km-f-09', examplePhrase: 'When I reflect on my own experience,' },
        { vocabId: 'km-f-10', examplePhrase: 'I want to share that...' },
      ],
      usefulExpressions: [
        { phrase: 'I think...', japanese: '私は...と思います' },
        { phrase: 'I agree because...', japanese: '私が賛成する理由は...' },
        { phrase: 'In my experience,...', japanese: '私の経験では、...' },
        { phrase: 'For example,...', japanese: '例えば、...' },
        { phrase: 'I learned that...', japanese: '私は...ということを学びました' },
        { phrase: 'I want to...', japanese: '私は...したいです' },
      ],
    },

    takeaway: 'Small challenges can help you discover who you are becoming.',
  },

];

export function getReadingById(id: string): ReadingLesson | undefined {
  return MASTER_READINGS.find(r => r.id === id);
}

export function getReadingsByTheme(themeId: string, level: Level): ReadingLesson[] {
  return MASTER_READINGS.filter(r => r.themeId === themeId && r.level === level);
}
