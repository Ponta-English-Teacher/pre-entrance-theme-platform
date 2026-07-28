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
  themeNote: string;           // why this word matters in this specific theme
  themeNoteJa?: string;        // short Japanese version of themeNote (prototype field)
  collocations: string[];      // 3–5 common phrases and patterns
  collocationsDetailed?: Array<{ phrase: string; glossJa: string; example: string }>;
  otherMeanings?: string[];    // only when meaningfully different meanings exist
  otherMeaningsBilingual?: Array<{ en: string; ja: string; example: string; exampleJa: string }>;
  coreMeaningJa?: string;      // Japanese translation of coreMeaning (prototype field)
  exampleTranslations?: [string, string]; // Japanese translations of the two examples
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
    themeNote: 'Identity is the central question of this theme: what combination of experiences, values, and choices makes you distinctively you?',
    collocations: ['sense of identity', 'cultural identity', 'discover your identity', 'shape one\'s identity', 'national identity'],
    otherMeanings: ['identity (documents): proof of who you are, such as an ID card or passport (e.g., show your identity)'],
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
    themeNote: 'Your values act as a compass — they guide every important decision you make. In Knowing Myself, you practise naming and explaining what truly matters to you.',
    collocations: ['core values', 'shared values', 'hold a value', 'conflict of values', 'value honesty'],
    otherMeanings: ['value (monetary): the worth or price of something (e.g., the value of a house)', 'to value something (verb): to consider it important (e.g., I value your friendship)'],
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
    themeNote: 'Knowing Myself starts with being honest about where you want to go. Naming your goals clearly is the first step toward achieving them.',
    collocations: ['set a goal', 'achieve a goal', 'long-term goal', 'short-term goal', 'work toward a goal'],
    otherMeanings: ['goal (sport): the point where the ball must reach to score (e.g., scored a goal in the final minute)'],
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
    themeNote: 'Knowing your strengths — not just your weaknesses — is the foundation of self-awareness and confidence in this theme.',
    collocations: ['personal strength', 'play to your strengths', 'build on strengths', 'strength of character', 'identify your strengths'],
    otherMeanings: ['physical strength: the power of your body', 'the strength of an argument: how convincing or powerful it is'],
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
    themeNote: 'In Knowing Myself, your dream represents your deepest hope for the future — often more emotional and personal than a goal.',
    collocations: ['follow your dream', 'pursue a dream', 'give up on a dream', 'dream of becoming', 'make a dream come true'],
    otherMeanings: ['dream (verb, sleep): to experience images or stories during sleep', 'daydream: imagining something pleasant while you are awake'],
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
    themeNote: 'Confidence in Knowing Myself is not about being perfect — it is about trusting yourself enough to try, share, and grow.',
    collocations: ['build confidence', 'lack confidence', 'speak with confidence', 'gain confidence', 'confidence in yourself'],
    otherMeanings: ['confidence (formal): private information shared in trust (e.g., "I told him in confidence — please don\'t repeat it")'],
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
    themeNote: 'Character is what you do when no one is watching. In this theme, reflecting on your character helps you understand what kind of person you are becoming.',
    collocations: ['strong character', 'character trait', 'reveal your character', 'moral character', 'build character'],
    otherMeanings: ['character (fiction): a person in a novel, film, or play (e.g., the main character)', 'a written character: a letter or symbol in a writing system (e.g., Chinese characters)'],
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
    themeNote: 'Describing yourself clearly — in English — is a core skill of this theme. It connects vocabulary, grammar, and self-knowledge.',
    collocations: ['describe yourself', 'describe in detail', 'describe your experience', 'describe what happened', 'hard to describe'],
  },

  {
    id: 'km-f-09',
    word: 'reflect',
    japanese: '振り返る・内省する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'To think carefully about something, especially your own experiences.',
    coreMeaningJa: '自分の経験などについて、じっくりと考えること。',
    examples: [
      'At the end of each day, I like to reflect on what I learned.',
      'Reflecting on your mistakes is how you grow as a person.',
    ],
    exampleTranslations: [
      '毎日の終わりに、その日に学んだことを振り返るようにしています。',
      '自分の失敗を振り返ることが、人として成長する方法です。',
    ],
    relatedWords: ['introspection', 'awareness', 'describe'],
    tags: ['self', 'action'],
    themeNote: 'In this course, you will use "reflect on" many times — in writing, in discussion, and when introducing yourself.',
    themeNoteJa: 'このコースの作文やディスカッションで、「reflect on」という表現を何度も使います。',
    collocations: ['reflect on', 'reflect deeply', 'take time to reflect', 'reflect carefully', 'reflect on your past'],
    collocationsDetailed: [
      { phrase: 'reflect on', glossJa: '～を振り返る', example: 'I want to reflect on my three years in high school.' },
      { phrase: 'take time to reflect', glossJa: 'じっくり振り返る', example: 'Before writing, take time to reflect on your experience.' },
      { phrase: 'reflect on your past', glossJa: '自分の過去を振り返る', example: 'It helps to reflect on your past to understand who you are.' },
    ],
    otherMeanings: ['to reflect light or an image: to show back (e.g., the lake reflects the sky)', 'to reflect something: to be an expression of it (e.g., her grades reflect her effort)'],
    otherMeaningsBilingual: [
      { en: 'to show back (light or image)', ja: '光・像を映し出す', example: 'The lake reflects the sky.', exampleJa: '湖が空を映し出している。' },
      { en: 'to express or show something', ja: '～を反映する・示す', example: 'Her grades reflect her effort.', exampleJa: '彼女の成績は努力の結果を示している。' },
    ],
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
    themeNote: 'Sharing your story — in writing or in conversation — is how self-knowledge becomes connection with others. It is both a language skill and a personal one.',
    collocations: ['share your story', 'share your thoughts', 'share with others', 'feel comfortable sharing', 'share openly'],
    otherMeanings: ['share (finance, noun): a unit of ownership in a company (e.g., company shares)', 'share (divide, verb): to split something equally (e.g., share the cost)'],
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
    themeNote: 'Aspiration is a deeper word than goal or dream — it suggests something meaningful you are working toward over a long time. This is often asked in university admissions in Japan.',
    collocations: ['career aspiration', 'express your aspirations', 'aspiration to become', 'share aspirations', 'aspirations for the future'],
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
    themeNote: 'Your perspective is shaped by your unique life. In Knowing Myself, recognising your own perspective — and understanding that others have different ones — is a key insight.',
    collocations: ['from my perspective', 'gain a new perspective', 'shift your perspective', 'offer a perspective', 'see from a different perspective'],
    otherMeanings: ['perspective (art): the technique of showing depth on a flat surface, making distant objects look smaller (e.g., linear perspective)'],
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
    themeNote: 'Self-awareness is knowing what you think, feel, and value. In this theme, developing awareness of yourself is the first step toward meaningful growth.',
    collocations: ['self-awareness', 'raise awareness', 'lack of awareness', 'grow in awareness', 'awareness of others'],
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
    themeNote: 'Personality describes the patterns of behaviour and feeling that make you recognisably you. Being able to discuss your personality in English is a key university skill.',
    collocations: ['personality type', 'outgoing personality', 'develop your personality', 'strong personality', 'personality trait'],
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
    themeNote: 'Knowing what motivates you — internally or externally — is central to self-understanding and to explaining your choices clearly in English.',
    collocations: ['inner motivation', 'source of motivation', 'stay motivated', 'find motivation', 'motivation to study'],
    otherMeanings: ['motivation (formal): the stated reason for an action or decision (e.g., his motivation for leaving was never made clear)'],
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
    themeNote: 'Resilience is one of the most valued qualities in higher education and the workplace. In Knowing Myself, you explore where your resilience comes from.',
    collocations: ['show resilience', 'build resilience', 'emotional resilience', 'resilience in the face of', 'resilience through hardship'],
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
    themeNote: 'Expressing yourself in a second language is the practical challenge of this entire course. In Knowing Myself, you practise expressing who you are with increasing precision.',
    collocations: ['express yourself', 'express your feelings', 'express an opinion', 'express clearly', 'find words to express'],
    otherMeanings: ['express train: a fast service that stops at few stations', 'express delivery: a fast shipping or postal service'],
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
    themeNote: 'Challenges — and how you responded to them — often reveal character. In Knowing Myself, you practise telling the story of a challenge you have faced and overcome.',
    collocations: ['face a challenge', 'rise to a challenge', 'overcome a challenge', 'a major challenge', 'learn from a challenge'],
    otherMeanings: ['to challenge someone (verb): to question or dispute what they say (e.g., she challenged his assumption)', 'a sports challenge: a formal competition or contest'],
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
    themeNote: 'Introspection is the most deliberate form of self-knowledge — sitting quietly and examining the workings of your own mind. It is the hallmark of a reflective thinker.',
    collocations: ['practise introspection', 'moment of introspection', 'through introspection', 'deep introspection', 'introspection and growth'],
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
    themeNote: 'Speaking with conviction means saying what you truly believe, not what you think others want to hear. It is a sign of authentic self-knowledge.',
    collocations: ['speak with conviction', 'hold a conviction', 'act on your convictions', 'deep conviction', 'personal conviction'],
    otherMeanings: ['legal conviction: a formal court declaration that someone is guilty of a crime (e.g., a criminal conviction)'],
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
    themeNote: 'Being authentic — true to your own values and personality — is the ultimate goal of Knowing Myself. It distinguishes genuine self-expression from performance.',
    collocations: ['be authentic', 'authentic self', 'authentic voice', 'authentic experience', 'remain authentic'],
    otherMeanings: ['authentic (objects): genuine and not a copy or fake (e.g., an authentic signature, authentic Japanese cuisine)'],
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
    themeNote: 'Being able to articulate your thoughts clearly — especially in a second language — is what this entire course trains. It bridges knowing yourself and communicating that to others.',
    collocations: ['articulate your thoughts', 'articulate clearly', 'difficult to articulate', 'articulate your values', 'well-articulated'],
    otherMeanings: ['articulate (adjective): able to speak clearly and effectively (e.g., she was a highly articulate speaker)'],
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
    themeNote: 'Your self-concept is the mental model you carry of who you are. In Knowing Myself, you examine whether your self-concept is accurate, helpful, and worth keeping.',
    collocations: ['positive self-concept', 'develop a self-concept', 'self-concept and identity', 'challenge your self-concept', 'self-concept formation'],
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
    themeNote: 'Affirming your own values and strengths — through writing, reflection, or conversation — is one of the most practical ways to develop confidence and self-knowledge.',
    collocations: ['affirm your values', 'affirm yourself', 'affirm a belief', 'self-affirming', 'affirm someone\'s worth'],
    otherMeanings: ['affirm (legal): to make a formal declaration in court without swearing an oath'],
  },
];

export function getVocabById(id: string): VocabEntry | undefined {
  return MASTER_VOCABULARY.find(entry => entry.id === id);
}

export function getVocabSubset(ids: string[]): VocabEntry[] {
  const map = new Map(MASTER_VOCABULARY.map(e => [e.id, e]));
  return ids.flatMap(id => (map.has(id) ? [map.get(id)!] : []));
}

export function getVocabByTheme(themeId: string): VocabEntry[] {
  return MASTER_VOCABULARY.filter(entry => entry.themes.includes(themeId));
}
