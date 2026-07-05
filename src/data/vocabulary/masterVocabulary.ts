import type { Level } from '@/types';

export interface VocabEntry {
  id: string;
  word: string;
  japanese: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  introductionLevel: Level;
  themes: string[];
  coreMeaning: string;
  examples: [string, string];
  relatedWords: string[];
  tags: string[];
}

export const MASTER_VOCABULARY: VocabEntry[] = [

  // ── Knowing Myself — Foundation ──────────────────────────────────────────

  {
    id: 'km-f-01',
    word: 'identity',
    japanese: 'アイデンティティ・自分らしさ',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'The qualities, beliefs, and experiences that make you who you are.',
    examples: [
      'My identity is shaped by my family, my culture, and my experiences.',
      'Joining the drama club helped me discover a new part of my identity.',
    ],
    relatedWords: ['character', 'personality', 'self-concept'],
    tags: ['self', 'core'],
  },
  {
    id: 'km-f-02',
    word: 'value',
    japanese: '価値観・大切にするもの',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'Something you believe is important and worth caring about.',
    examples: [
      'Honesty is one of my most important values.',
      'Knowing your values helps you make better decisions.',
    ],
    relatedWords: ['belief', 'conviction', 'character'],
    tags: ['self', 'core'],
  },
  {
    id: 'km-f-03',
    word: 'goal',
    japanese: '目標',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'Something you want to achieve in the future.',
    examples: [
      'My goal is to study environmental science at university.',
      'Setting small goals every week helps me make progress.',
    ],
    relatedWords: ['dream', 'aspiration', 'motivation'],
    tags: ['future', 'action'],
  },
  {
    id: 'km-f-04',
    word: 'strength',
    japanese: '強み・長所',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'A quality or ability that you are especially good at.',
    examples: [
      'One of my strengths is that I listen carefully to others.',
      'Understanding your strengths helps you choose the right path.',
    ],
    relatedWords: ['character', 'confidence', 'resilience'],
    tags: ['self', 'positive'],
  },
  {
    id: 'km-f-05',
    word: 'dream',
    japanese: '夢',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'A hope or wish for what you want your future to look like.',
    examples: [
      'My dream is to work with children in need around the world.',
      'She never gave up on her dream, even when it was difficult.',
    ],
    relatedWords: ['goal', 'aspiration', 'motivation'],
    tags: ['future', 'positive'],
  },
  {
    id: 'km-f-06',
    word: 'confidence',
    japanese: '自信',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'A feeling of trust in your own abilities and judgement.',
    examples: [
      'Giving my first presentation gave me more confidence.',
      'Confidence does not mean you never feel nervous — it means you try anyway.',
    ],
    relatedWords: ['strength', 'resilience', 'affirm'],
    tags: ['self', 'positive'],
  },
  {
    id: 'km-f-07',
    word: 'character',
    japanese: '性格・人柄',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'The combination of qualities that make a person who they are morally and socially.',
    examples: [
      'Her character is one of kindness, patience, and honesty.',
      'Difficult experiences often reveal a person\'s true character.',
    ],
    relatedWords: ['identity', 'personality', 'value'],
    tags: ['self', 'core'],
  },
  {
    id: 'km-f-08',
    word: 'describe',
    japanese: '説明する・表現する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'To say or write what someone or something is like.',
    examples: [
      'How would you describe yourself to someone who has never met you?',
      'It is hard to describe exactly how I felt when I achieved my goal.',
    ],
    relatedWords: ['express', 'articulate', 'share'],
    tags: ['language', 'action'],
  },
  {
    id: 'km-f-09',
    word: 'reflect',
    japanese: '振り返る・内省する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'To think carefully about something, especially your own experiences.',
    examples: [
      'At the end of each day, I like to reflect on what I learned.',
      'Reflecting on your mistakes is how you grow as a person.',
    ],
    relatedWords: ['introspection', 'awareness', 'describe'],
    tags: ['self', 'action'],
  },
  {
    id: 'km-f-10',
    word: 'share',
    japanese: '共有する・分かち合う',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'To tell others about your thoughts, feelings, or experiences.',
    examples: [
      'I felt nervous to share my story, but I am glad I did.',
      'Sharing your values with others can create deeper connections.',
    ],
    relatedWords: ['express', 'describe', 'articulate'],
    tags: ['language', 'connection'],
  },

  // ── Knowing Myself — Standard ─────────────────────────────────────────────

  {
    id: 'km-s-01',
    word: 'aspiration',
    japanese: '大きな夢・志',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'A strong desire to achieve something great or meaningful.',
    examples: [
      'Her aspiration to become a doctor was shaped by her grandmother\'s illness.',
      'Talking about your aspirations with others can make them feel more real.',
    ],
    relatedWords: ['goal', 'dream', 'motivation'],
    tags: ['future', 'core'],
  },
  {
    id: 'km-s-02',
    word: 'perspective',
    japanese: '視点・物の見方',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'A particular way of thinking about or understanding something.',
    examples: [
      'Living abroad changed my perspective on what is truly important.',
      'Listening to different perspectives helps you understand yourself better.',
    ],
    relatedWords: ['awareness', 'reflect', 'introspection'],
    tags: ['thinking', 'growth'],
  },
  {
    id: 'km-s-03',
    word: 'awareness',
    japanese: '意識・自覚',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'Knowledge or understanding of yourself, others, or a situation.',
    examples: [
      'Self-awareness is the foundation of personal growth.',
      'I developed more awareness of my habits when I started keeping a journal.',
    ],
    relatedWords: ['reflect', 'perspective', 'introspection'],
    tags: ['self', 'growth'],
  },
  {
    id: 'km-s-04',
    word: 'personality',
    japanese: '個性・人格',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'The set of qualities and patterns of behaviour that make you distinctively you.',
    examples: [
      'Her warm personality makes everyone around her feel welcome.',
      'Our personalities are shaped by both genetics and environment.',
    ],
    relatedWords: ['identity', 'character', 'self-concept'],
    tags: ['self', 'core'],
  },
  {
    id: 'km-s-05',
    word: 'motivation',
    japanese: '動機・やる気',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'The reason or drive that causes you to act or keep going.',
    examples: [
      'Understanding your motivation helps you stay focused when things get hard.',
      'My motivation for studying English is to connect with people around the world.',
    ],
    relatedWords: ['goal', 'aspiration', 'resilience'],
    tags: ['action', 'growth'],
  },
  {
    id: 'km-s-06',
    word: 'resilience',
    japanese: '回復力・折れない心',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'The ability to recover from difficulties and keep moving forward.',
    examples: [
      'Resilience is not about avoiding failure — it is about learning from it.',
      'The students showed great resilience after the challenges of the past year.',
    ],
    relatedWords: ['strength', 'confidence', 'conviction'],
    tags: ['self', 'growth'],
  },
  {
    id: 'km-s-07',
    word: 'express',
    japanese: '表現する・伝える',
    pos: 'verb',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'To communicate your thoughts, feelings, or ideas clearly.',
    examples: [
      'Writing in a journal is one way to express how you truly feel.',
      'It can be difficult to express complex emotions in a second language.',
    ],
    relatedWords: ['describe', 'articulate', 'share'],
    tags: ['language', 'action'],
  },
  {
    id: 'km-s-08',
    word: 'challenge',
    japanese: '挑戦・困難',
    pos: 'noun',
    introductionLevel: 'standard',
    themes: ['knowing-myself'],
    coreMeaning: 'Something difficult that requires effort and tests your abilities.',
    examples: [
      'Every challenge I have faced has taught me something about myself.',
      'She saw the difficult project not as a problem but as a challenge to grow.',
    ],
    relatedWords: ['resilience', 'strength', 'motivation'],
    tags: ['growth', 'action'],
  },

  // ── Knowing Myself — Challenge ────────────────────────────────────────────

  {
    id: 'km-c-01',
    word: 'introspection',
    japanese: '内省・自己観察',
    pos: 'noun',
    introductionLevel: 'challenge',
    themes: ['knowing-myself'],
    coreMeaning: 'The practice of closely examining your own thoughts, feelings, and motives.',
    examples: [
      'Regular introspection helps you notice patterns in your thinking.',
      'Philosophy encourages introspection by asking questions that have no easy answers.',
    ],
    relatedWords: ['reflect', 'awareness', 'self-concept'],
    tags: ['self', 'thinking'],
  },
  {
    id: 'km-c-02',
    word: 'conviction',
    japanese: '信念・確信',
    pos: 'noun',
    introductionLevel: 'challenge',
    themes: ['knowing-myself'],
    coreMeaning: 'A strong personal belief that you are confident is true or right.',
    examples: [
      'She spoke with such conviction that everyone in the room listened closely.',
      'Acting against your own convictions often leads to regret.',
    ],
    relatedWords: ['value', 'authentic', 'affirm'],
    tags: ['self', 'core'],
  },
  {
    id: 'km-c-03',
    word: 'authentic',
    japanese: '本物の・自分らしい',
    pos: 'adjective',
    introductionLevel: 'challenge',
    themes: ['knowing-myself'],
    coreMeaning: 'True to your own personality, values, and feelings rather than imitating others.',
    examples: [
      'Being authentic means saying what you truly believe, even when it is uncomfortable.',
      'People are drawn to leaders who are genuine and authentic.',
    ],
    relatedWords: ['identity', 'conviction', 'self-concept'],
    tags: ['self', 'core'],
  },
  {
    id: 'km-c-04',
    word: 'articulate',
    japanese: '明確に言葉にする',
    pos: 'verb',
    introductionLevel: 'challenge',
    themes: ['knowing-myself'],
    coreMeaning: 'To express an idea or feeling clearly and precisely in words.',
    examples: [
      'It took years before she could articulate what she really wanted from life.',
      'Being able to articulate your values is a powerful skill in any interview.',
    ],
    relatedWords: ['express', 'describe', 'introspection'],
    tags: ['language', 'action'],
  },
  {
    id: 'km-c-05',
    word: 'self-concept',
    japanese: '自己概念',
    pos: 'noun',
    introductionLevel: 'challenge',
    themes: ['knowing-myself'],
    coreMeaning: 'The overall picture you hold of who you are — your beliefs about your own nature.',
    examples: [
      'A positive self-concept develops when others respond to you with respect and care.',
      'Our self-concept is never fixed — it changes as we learn and grow.',
    ],
    relatedWords: ['identity', 'personality', 'introspection'],
    tags: ['self', 'core', 'thinking'],
  },
  {
    id: 'km-c-06',
    word: 'affirm',
    japanese: '肯定する・確かめる',
    pos: 'verb',
    introductionLevel: 'challenge',
    themes: ['knowing-myself'],
    coreMeaning: 'To state positively, or to confirm and strengthen a belief or feeling.',
    examples: [
      'Writing down what you are grateful for can affirm your sense of self-worth.',
      'A good mentor affirms your strengths while also helping you see your blind spots.',
    ],
    relatedWords: ['confidence', 'conviction', 'authentic'],
    tags: ['self', 'action', 'positive'],
  },
];

export function getVocabById(id: string): VocabEntry | undefined {
  return MASTER_VOCABULARY.find(entry => entry.id === id);
}

export function getVocabSubset(ids: string[]): VocabEntry[] {
  const idSet = new Set(ids);
  return MASTER_VOCABULARY.filter(entry => idSet.has(entry.id));
}

export function getVocabByTheme(themeId: string): VocabEntry[] {
  return MASTER_VOCABULARY.filter(entry => entry.themes.includes(themeId));
}
