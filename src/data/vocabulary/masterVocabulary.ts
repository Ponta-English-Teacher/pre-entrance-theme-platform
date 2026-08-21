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
  derivatives?: string[];      // same word-family members only (派生語), e.g. person/personal/personally/personality
  /** Word Family template addition (2026-08-08, extended 2026-08-09 with a
   *  short parallel Japanese gloss per member): the word's natural family,
   *  each member tagged with its own part of speech and a short Japanese
   *  meaning, so students connect the whole family almost instantly rather
   *  than just seeing a list of English forms — e.g. independent (adj.) ->
   *  [{ word: 'independence', pos: 'noun', japanese: '独立・自立' },
   *   { word: 'independently', pos: 'adverb', japanese: '独立して・自力で' }].
   *  Only genuinely useful, commonly used forms — omit entirely when a word
   *  has no natural family worth showing (e.g. "goal", "deadline"). A
   *  separate, additive field from `derivatives` (which stays exactly as
   *  it was — its own "Derivatives（派生語）" section, its own click-to-
   *  explore behavior, both untouched). */
  wordFamily?: Array<{ word: string; pos: 'noun' | 'verb' | 'adjective' | 'adverb'; japanese: string }>;
}

export const MASTER_VOCABULARY: VocabEntry[] = [

  // ── Knowing Myself — Foundation ──────────────────────────────────────────
  // Theme 1 Foundation manuscript rebuilt 2026-08-03 ("Will Personality Change
  // Over Time?"). Ids km-f-01/02/04/06/07/08/10 are reused from the old
  // "How Personality Is Built" set (repurposed for new words below — none of
  // them are referenced by any other theme). km-f-11 is a newly added id.

  {
    id: 'km-f-01',
    word: 'personality',
    japanese: '性格',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'The particular combination of qualities, thoughts, feelings, and behavior that makes a person who they are.',
    examples: [
      'Some people think our personality is decided when we are born.',
      "Everyone's personality is a little different, even in the same family.",
    ],
    relatedWords: ['experience', 'develop', 'value'],
    tags: ['self', 'core'],
    themeNote: "This theme's central question is whether personality is fixed from birth or built through experience — personality is the concept everything else in the passage examines.",
    themeNoteJa: 'このテーマの中心的な問いは、性格が生まれつき決まっているのか、経験を通して築かれるのか、ということです。',
    collocations: ['your own personality', 'personality is built', 'part of your personality', 'develop your personality', 'a strong personality'],
    derivatives: ['person', 'personal', 'personally', 'personality', 'personalize'],
    wordFamily: [
      { word: 'person', pos: 'noun', japanese: '人' },
      { word: 'personal', pos: 'adjective', japanese: '個人的な' },
      { word: 'personally', pos: 'adverb', japanese: '個人的に' },
    ],
  },

  {
    id: 'km-f-06',
    word: 'experience',
    japanese: '経験',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'Something that happens to you which you see, do, or feel, and which can teach you something.',
    examples: [
      'Today, many psychologists believe that both nature and experience are important.',
      'Studying abroad was a valuable experience for me.',
    ],
    relatedWords: ['personality', 'reflect', 'develop'],
    tags: ['self', 'core'],
    themeNote: 'The passage\'s whole argument depends on this word — it\'s the counterweight to "how we are born," the other half of what shapes personality.',
    themeNoteJa: 'この文章の議論全体がこの単語にかかっています——「生まれつき」に対するもう一方の要素として、性格を形作るものです。',
    collocations: ['gain experience', 'a valuable experience', 'learn from experience', 'our experiences', 'through experience'],
    derivatives: ['experience', 'experienced', 'inexperienced'],
    wordFamily: [
      { word: 'experienced', pos: 'adjective', japanese: '経験豊富な' },
      { word: 'inexperienced', pos: 'adjective', japanese: '経験不足の' },
    ],
  },

  {
    id: 'km-f-07',
    word: 'challenge',
    japanese: '難しいこと・挑戦',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'Something difficult that tests your ability and requires effort to deal with or overcome.',
    examples: [
      'Sometimes we face difficult challenges.',
      "Learning a new language is a challenge, but it's worth it.",
    ],
    relatedWords: ['confidence', 'strength', 'develop'],
    tags: ['self', 'action'],
    themeNote: 'The passage frames challenges as the specific mechanism through which confidence and strength are discovered — not obstacles to avoid, but the source of growth.',
    themeNoteJa: 'この文章では、挑戦は自信や強みを見つけるための具体的な手段として描かれています——避けるべき障害ではなく、成長の源です。',
    collocations: ['face a challenge', 'overcome a challenge', 'a difficult challenge', 'a big challenge', 'take on a challenge'],
    derivatives: ['challenge', 'challenging', 'challenged'],
    wordFamily: [
      { word: 'challenging', pos: 'adjective', japanese: 'やりがいのある・難しい' },
    ],
  },

  {
    id: 'km-f-02',
    word: 'confidence',
    japanese: '自信',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'A feeling of trust in your own abilities, qualities, or judgement.',
    examples: [
      'When we overcome them, we become more confident and discover new strengths.',
      'Her confidence grew every time she tried something new.',
    ],
    relatedWords: ['challenge', 'strength', 'personality'],
    tags: ['self', 'positive'],
    themeNote: 'The passage shows confidence as something built through overcoming challenges, not as a fixed trait some people simply have.',
    themeNoteJa: 'この文章では、自信は困難を乗り越えることによって築かれるものであり、一部の人が生まれつき持っている固定的な性質ではないと描かれています。',
    collocations: ['feel confident', 'become more confident', 'gain confidence', 'confidence in yourself', 'grow in confidence'],
    derivatives: ['confidence', 'confident', 'confidently'],
    wordFamily: [
      { word: 'confident', pos: 'adjective', japanese: '自信のある' },
      { word: 'confidently', pos: 'adverb', japanese: '自信を持って' },
    ],
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
      'We become more confident and discover new strengths.',
      'Understanding your strengths helps you choose the right path.',
    ],
    relatedWords: ['confidence', 'challenge', 'personality'],
    tags: ['self', 'positive'],
    themeNote: 'Strengths are described as things you discover through challenges, not things you already know about yourself before trying.',
    themeNoteJa: '強みは、試す前からすでに知っているものではなく、挑戦を通して発見するものとして描かれています。',
    collocations: ['discover a strength', 'a personal strength', 'new strengths', 'identify your strengths', 'find a strength'],
    derivatives: ['strength', 'strong', 'strongly', 'strengthen'],
    wordFamily: [
      { word: 'strong', pos: 'adjective', japanese: '強い' },
      { word: 'strongly', pos: 'adverb', japanese: '強く' },
      { word: 'strengthen', pos: 'verb', japanese: '強化する' },
    ],
  },

  {
    id: 'km-f-08',
    word: 'develop',
    japanese: '成長する・発展する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'To grow, change, or improve gradually over time.',
    examples: [
      'As we reflect on our experiences and continue to develop, we continue to build our personality.',
      'It takes time to develop a new skill.',
    ],
    relatedWords: ['reflect', 'experience', 'personality'],
    tags: ['self', 'action'],
    themeNote: 'The passage links developing directly to reflecting — the two verbs work together as the ongoing process the whole passage describes.',
    themeNoteJa: 'この文章では、develop（成長する）はreflect（振り返る）と結びついています——この二つの動詞が合わさって、文章全体が描く継続的なプロセスになっています。',
    collocations: ['continue to develop', 'develop as a person', 'develop a skill', 'develop over time', 'keep developing'],
    derivatives: ['develop', 'development', 'developed', 'developing'],
    wordFamily: [
      { word: 'development', pos: 'noun', japanese: '発達・発展' },
      { word: 'developed', pos: 'adjective', japanese: '発達した・先進的な' },
      { word: 'developing', pos: 'adjective', japanese: '発展途上の' },
    ],
  },

  {
    id: 'km-f-10',
    word: 'reflect',
    japanese: '振り返る',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'To think carefully about something, especially something that happened to you in the past.',
    examples: [
      'As we reflect on our experiences and continue to develop, we continue to build our personality.',
      'Take a few minutes to reflect on what you learned today.',
    ],
    relatedWords: ['experience', 'develop', 'value'],
    tags: ['self', 'action'],
    themeNote: 'Reflecting is presented as an active, ongoing part of building personality — not something you do once, but something you keep doing.',
    themeNoteJa: '振り返ることは、性格を築く上での積極的で継続的な行為として描かれています——一度きりではなく、繰り返し行うものです。',
    collocations: ['reflect on', 'reflect on your experiences', 'take time to reflect', 'reflect carefully', 'stop and reflect'],
    derivatives: ['reflect', 'reflection', 'reflective'],
    wordFamily: [
      { word: 'reflection', pos: 'noun', japanese: '反省・振り返り' },
      { word: 'reflective', pos: 'adjective', japanese: '内省的な' },
    ],
  },

  {
    id: 'km-f-11',
    word: 'value',
    japanese: '価値観',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['knowing-myself'],
    coreMeaning: 'A belief about what is important, good, or worthwhile in life, which guides how you think and act.',
    examples: [
      'Our values also grow through these experiences and help shape the person we become.',
      'Honesty is one of my most important values.',
    ],
    relatedWords: ['personality', 'reflect', 'develop'],
    tags: ['self', 'core'],
    themeNote: "The passage's final claim is that values — not just skills or confidence — also grow through experience, extending the whole argument to what we believe, not only what we can do.",
    themeNoteJa: 'この文章の最後の主張は、スキルや自信だけでなく、価値観も経験を通して育つということです——議論の対象を「できること」だけでなく「大切にしていること」にも広げています。',
    collocations: ['personal values', 'your values', 'values grow', 'important values', 'shape your values'],
    derivatives: ['value', 'valuable', 'valued'],
    wordFamily: [
      { word: 'valuable', pos: 'adjective', japanese: '価値がある' },
      { word: 'valued', pos: 'adjective', japanese: '大切にされている' },
    ],
  },

  // ── Knowing Myself — Advanced ─────────────────────────────────────────────
  // Rebuilt 2026-08-05 to match the frozen Advanced Reading manuscript
  // (docs/THEME_01_ADVANCED_READING_PASSAGE.md, "nature vs. nurture"). Every
  // word below appears in that passage; none duplicate a Foundation word.

  {
    id: 'km-s-01',
    word: 'nature',
    japanese: '生まれつきの性質',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'The inborn qualities and character a person is born with — used here in a specific sense, not its everyday meaning of the natural world.',
    examples: [
      'For many years, psychologists have debated whether personality comes mainly from nature or from experience.',
      'It can be hard to tell whether a habit comes from nature or simply from years of practice.',
    ],
    relatedWords: ['nurture', 'temperament', 'inherit'],
    tags: ['thinking', 'core'],
    themeNote: "This word names one whole side of the reading's central debate. Watch for its very specific meaning here — the qualities you are born with — which is quite different from its everyday sense of 'the natural world' (forests, animals, mountains).",
    themeNoteJa: 'この単語は、文章全体の中心的な議論の片方の立場を表しています。ここでの意味——生まれつき持っている性質——は、「自然」という日常的な意味（森や動物、山など）とはかなり異なるので注意しましょう。',
    collocations: ['nature versus nurture', 'human nature', 'by nature', 'a cautious nature', "a person's true nature"],
    otherMeanings: ["nature (everyday sense): the physical world, including plants, animals, and landscapes, as in 'a walk in nature.'"],
    derivatives: ['nature', 'natural', 'naturally', 'unnatural'],
    wordFamily: [
      { word: 'natural', pos: 'adjective', japanese: '自然な・生まれつきの' },
      { word: 'naturally', pos: 'adverb', japanese: '自然に・生まれつき' },
    ],
  },

  {
    id: 'km-s-02',
    word: 'nurture',
    japanese: '育ち・環境による影響',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'The environment, upbringing, and experiences that shape a person after birth — the counterpart to nature in this debate.',
    examples: [
      'Some psychologists argue that nurture keeps shaping who we are throughout our whole lives, not only in childhood.',
      'Good nurture cannot change everything about a person, but it can change a great deal.',
    ],
    relatedWords: ['nature', 'environment', 'upbringing'],
    tags: ['thinking', 'core'],
    themeNote: "The direct partner of 'nature' — together, these two words are the entire question this reading is built around. Notice that in the reading's argument, nurture is not limited to childhood; it keeps doing real work in adulthood too.",
    themeNoteJa: '「nature」と対になる言葉です。この2つの単語が、この文章全体の議論の土台になっています。この文章の主張では、nurture（育ち）は子供時代だけのものではなく、大人になってからも本当に影響を与え続けるものとして描かれている点に注目しましょう。',
    collocations: ['nature versus nurture', 'the power of nurture', 'shaped by nurture', 'nurture and environment'],
    otherMeanings: ["nurture (verb): to care for someone and help them grow, as in 'she nurtured her students' confidence for years.'"],
    derivatives: ['nurture', 'nurturing', 'nurtured'],
    wordFamily: [
      { word: 'nurturing', pos: 'adjective', japanese: '育成的な・愛情深い' },
      { word: 'nurtured', pos: 'adjective', japanese: '育まれた' },
    ],
  },

  {
    id: 'km-s-03',
    word: 'temperament',
    japanese: '気質',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: "A person's natural, inborn pattern of emotional reactions and behavior, often visible from a very young age.",
    examples: [
      'Even very young infants show real differences in temperament, some calm and others easily startled.',
      'Her calm temperament made her the person everyone trusted during an emergency.',
    ],
    relatedWords: ['nature', 'personality', 'inherit'],
    tags: ['self', 'thinking'],
    themeNote: "The reading's clearest piece of evidence for the 'nature' side: temperament differences that appear before a child has had much chance to be shaped by experience at all. It's a more precise, almost scientific word than 'personality' for this specific idea.",
    themeNoteJa: 'この文章における「nature（生まれつき）」側の最も明確な証拠となる単語です。経験によって形作られる前の、幼い子供にすでに見られる違いを指します。「personality」よりも、この特定の考えを表すのにより正確で、やや専門的な言葉です。',
    collocations: ['a calm temperament', 'a natural temperament', 'differences in temperament', 'temperament and personality'],
    wordFamily: [
      { word: 'temperamental', pos: 'adjective', japanese: '気分屋の・気質による' },
    ],
  },

  {
    id: 'km-s-04',
    word: 'inherit',
    japanese: '（性質などを）受け継ぐ',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'To receive a quality, characteristic, or possession from your parents or family, especially through genetics.',
    examples: [
      'Many of the qualities we inherit from our parents play a real and lasting role in who we become.',
      "She inherited her mother's quick sense of humor, even though they don't look alike at all.",
    ],
    relatedWords: ['nature', 'temperament', 'characteristic'],
    tags: ['core', 'thinking'],
    themeNote: "The reading's key verb for the 'nature' side of the argument. Here it specifically means genetic, biological inheritance — but it's also the everyday word for inheriting money or property, so context matters.",
    themeNoteJa: 'この文章における「nature」側の議論を支える重要な動詞です。ここでは特に、遺伝的・生物学的に受け継ぐことを意味していますが、日常的にはお金や財産を「相続する」という意味でも使われるため、文脈で判断する必要があります。',
    collocations: ['inherit a trait', 'inherit characteristics from', 'inherited qualities', 'genetically inherited'],
    otherMeanings: ["inherit (property/money): to receive money, property, or a title after someone dies, as in 'he inherited the family business.'"],
    derivatives: ['inherit', 'inherited', 'inheritance', 'inheritable'],
    wordFamily: [
      { word: 'inherited', pos: 'adjective', japanese: '受け継いだ' },
      { word: 'inheritance', pos: 'noun', japanese: '相続・遺伝' },
    ],
  },

  {
    id: 'km-s-05',
    word: 'interaction',
    japanese: '相互作用',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'The way two or more things affect and respond to each other, rather than acting separately.',
    examples: [
      'Modern psychology increasingly suggests that personality develops through the interaction of nature and nurture, not from either one alone.',
      'The result was not caused by one factor alone, but by the interaction between several factors working together.',
    ],
    relatedWords: ['nature', 'nurture', 'balance'],
    tags: ['thinking', 'core'],
    themeNote: "This is the single most important word in the entire reading — it names the passage's actual thesis. The whole argument is built to move you away from choosing a side and toward this word instead.",
    themeNoteJa: 'この文章全体の中で、最も重要な単語です。この文章の実質的な主張（テーゼ）そのものを表しています。文章全体の構成は、読者に「どちらか一方を選ぶ」のではなく、この「相互作用」という考え方へと導くように作られています。',
    collocations: ['the interaction of nature and nurture', 'a complex interaction', 'social interaction', 'interaction between two factors'],
    derivatives: ['interact', 'interaction', 'interactive'],
    wordFamily: [
      { word: 'interact', pos: 'verb', japanese: '相互作用する' },
      { word: 'interactive', pos: 'adjective', japanese: '双方向の・対話的な' },
    ],
  },

  {
    id: 'km-s-06',
    word: 'aspiration',
    japanese: '大きな夢・志',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'A strong desire to achieve something great or meaningful, usually over a long period of time.',
    examples: [
      'Aspirations, like personality itself, are not fixed at birth — they keep growing throughout a person\'s life.',
      'Talking about your aspirations with someone you trust can make them feel more real and more possible.',
    ],
    relatedWords: ['goal', 'dream', 'motivation'],
    tags: ['future', 'core'],
    themeNote: 'The reading\'s clearest example of nurture still doing real work in adulthood: aspirations, like resilience and motivation, are described as things that keep growing throughout life rather than being fixed at birth.',
    themeNoteJa: 'この文章の中で、nurture（育ち・経験）が大人になってからも本当に働き続けていることを示す、最も分かりやすい例です。aspiration（志）は、resilience（回復力）やmotivation（動機）と同じように、生まれつき決まっているのではなく、人生を通してずっと育っていくものとして描かれています。',
    collocations: ['career aspiration', 'express your aspirations', 'aspiration to become', 'share aspirations', 'aspirations for the future'],
    derivatives: ['aspire', 'aspiring', 'aspirational', 'aspiration'],
    wordFamily: [
      { word: 'aspire', pos: 'verb', japanese: '切望する' },
      { word: 'aspiring', pos: 'adjective', japanese: '意欲的な・～を志す' },
    ],
  },

  {
    id: 'km-s-07',
    word: 'motivation',
    japanese: '動機・やる気',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'The reason or inner drive that causes you to act or keep going, even when something is difficult.',
    examples: [
      'An employee\'s motivation to speak up in meetings can grow stronger with each small success, rather than appearing all at once.',
      'Understanding your own motivation can help you keep going when a task feels difficult.',
    ],
    relatedWords: ['aspiration', 'resilience', 'goal'],
    tags: ['action', 'growth'],
    themeNote: "The reading's adult example turns on exactly this word: an employee who was once quiet in meetings gradually builds a motivation that grew stronger through repeated small successes — not something she was simply born with.",
    themeNoteJa: 'この文章の「大人になってからの例」は、まさにこの単語を軸に描かれています。会議で発言できなかった社員が、小さな成功を積み重ねる中で少しずつ強くなっていくmotivation（やる気）を身につけていく——それは生まれつき持っていたものではありません。',
    collocations: ['inner motivation', 'source of motivation', 'stay motivated', 'find motivation', 'motivation to study'],
    otherMeanings: ["motivation (formal): the stated reason for an action or decision, as in 'his motivation for leaving was never made clear.'"],
    derivatives: ['motivate', 'motivated', 'motivating', 'motivation'],
    wordFamily: [
      { word: 'motivate', pos: 'verb', japanese: 'やる気にさせる' },
      { word: 'motivated', pos: 'adjective', japanese: 'やる気のある' },
    ],
  },

  {
    id: 'km-s-08',
    word: 'resilience',
    japanese: '回復力・折れない心',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['knowing-myself'],
    coreMeaning: 'The ability to recover from difficulty and keep moving forward, even after setbacks or failure.',
    examples: [
      'Some people gradually build the resilience to lead a difficult project, after years of practice and support from others.',
      'Resilience is not about avoiding failure completely — it is about recovering from it and continuing on.',
    ],
    relatedWords: ['strength', 'confidence', 'motivation'],
    tags: ['self', 'growth'],
    themeNote: "The reading's clearest proof that personality traits can still be built well into adulthood, not only in childhood — the quiet employee who learns to lead difficult projects is building resilience the same way the shy child earlier in the reading builds confidence.",
    themeNoteJa: '性格の特徴が、子供時代だけでなく大人になってからも育てられることを示す、この文章で最も分かりやすい証拠です。会議で発言できなかった社員が難しいプロジェクトを率いるまでになる過程は、文章の前半に出てくる内気な子供が自信を身につけていく過程と同じ仕組みで描かれています。',
    collocations: ['show resilience', 'build resilience', 'emotional resilience', 'resilience in the face of', 'resilience through hardship'],
    derivatives: ['resilient', 'resilience'],
    wordFamily: [
      { word: 'resilient', pos: 'adjective', japanese: '粘り強い・回復力のある' },
    ],
  },

  // ── What Does It Mean to Be a University Student? — Foundation ─────────────
  // Rebuilt 2026-08-07 from the frozen manuscript (docs/THEME_02_MANUSCRIPT.md).
  // Ids us-f-03/04/05/06 are reused as-is (same word, refreshed examples/
  // themeNote for the new passage). Ids us-f-01/02/08/09 are repurposed for
  // new words. us-f-07 ("decide") is left otherwise untouched — it is not
  // part of Theme 2's new target set, and (as of Theme 3's own 2026-08-09
  // rebuild) is no longer referenced by any theme's active vocabulary set;
  // kept as a non-target entry, not deleted, since it may still be useful
  // for Notice Language / recycled-vocab in a future theme.
  // Old ids us-f-10/11/12/13 (excited, nervous, join, introduce) are fully
  // retired — not referenced by any other theme.

  {
    id: 'us-f-01',
    word: 'attendance',
    japanese: '出席',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'Being present at a class, meeting, or event — and the record of whether you were there.',
    examples: [
      'In high school, teachers checked attendance every morning and reminded students about deadlines.',
      'Your grade sometimes depends partly on attendance, so missing class has a real cost.',
    ],
    relatedWords: ['independent', 'manage', 'responsibility'],
    tags: ['university-life'],
    themeNote: 'Attendance is the clearest example of a system that used to watch you and now simply doesn\'t — what you do with that gap is entirely up to you.',
    collocations: ['check attendance', 'poor attendance', 'attendance record', 'affect your attendance', 'take attendance'],
    wordFamily: [
      { word: 'attend', pos: 'verb', japanese: '出席する' },
    ],
  },

  {
    id: 'us-f-02',
    word: 'submission',
    japanese: '提出',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'The act of formally handing in a piece of work, usually by a deadline.',
    examples: [
      'At university, no one calls your name or reminds you when a submission is due.',
      'She almost missed the submission, but finished it with ten minutes to spare.',
    ],
    relatedWords: ['assignment', 'manage', 'responsibility'],
    tags: ['university-life', 'academic'],
    themeNote: 'Submission is a small, concrete word for a big shift: remembering a deadline is now entirely the student\'s own job.',
    collocations: ['submission deadline', 'late submission', 'submit an assignment', 'final submission', 'online submission'],
    derivatives: ['submit', 'submission', 'submitted'],
    wordFamily: [
      { word: 'submit', pos: 'verb', japanese: '提出する' },
    ],
  },

  {
    id: 'us-f-03',
    word: 'assignment',
    japanese: '課題',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'A piece of work given to a student to complete.',
    examples: [
      'At first, the answer seems simple: go to class, do your assignments, and pass your exams.',
      'This assignment is due next Friday, so I should start soon.',
    ],
    relatedWords: ['submission', 'manage', 'independent'],
    tags: ['academic'],
    themeNote: 'University assignments require more independence than high school homework — no one reminds you to do them, and no one checks that you started early.',
    collocations: ['finish an assignment', 'submit an assignment', 'assignment deadline', 'work on an assignment', 'a group assignment'],
    wordFamily: [
      { word: 'assign', pos: 'verb', japanese: '課す・割り当てる' },
    ],
  },

  {
    id: 'us-f-04',
    word: 'independent',
    japanese: '自立した',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'Able to think, decide, and act for yourself, without depending on others.',
    examples: [
      'Being independent does not mean nobody cares what you do. It means you are the one who has to care.',
      'Being independent like this is not always easy, but it opens doors that never existed before.',
    ],
    relatedWords: ['responsibility', 'manage', 'develop'],
    tags: ['university-life', 'core'],
    themeNote: 'Independence is the central shift this theme is about — from being guided at every step to making your own choices.',
    collocations: ['become independent', 'independent thinking', 'independent of', 'fully independent', 'more independent than before'],
    wordFamily: [
      { word: 'independence', pos: 'noun', japanese: '独立・自立' },
      { word: 'independently', pos: 'adverb', japanese: '独立して・自力で' },
    ],
  },

  {
    id: 'us-f-05',
    word: 'responsibility',
    japanese: '責任',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'A duty to take care of something and be answerable for the result.',
    examples: [
      'This is what real responsibility looks like — not one big moment, but many small choices, every week, that nobody else will make for you.',
      'Students who learn to manage this responsibility early do not just survive university.',
    ],
    relatedWords: ['independent', 'manage', 'develop'],
    tags: ['university-life', 'core'],
    themeNote: 'Responsibility pairs naturally with independence in this theme — freedom and responsibility arrive together, not separately. This same word deepens again at Advanced level, explored there as something a student must build for themselves rather than simply receive.',
    collocations: ['take responsibility', 'personal responsibility', 'a sense of responsibility', 'responsibility for your own...', 'more responsibility than before'],
    wordFamily: [
      { word: 'responsible', pos: 'adjective', japanese: '責任がある' },
      { word: 'responsibly', pos: 'adverb', japanese: '責任を持って' },
    ],
  },

  {
    id: 'us-f-06',
    word: 'manage',
    japanese: '管理する・なんとかやりくりする',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'To organize and take care of something successfully, even when it is difficult.',
    examples: [
      'You have to manage your own schedule, remember your own deadlines, and decide, every day, whether to actually show up.',
      'Students who learn to manage this responsibility early do not just survive university.',
    ],
    relatedWords: ['responsibility', 'attendance', 'submission'],
    tags: ['university-life', 'action'],
    themeNote: 'Managing your own schedule and deadlines, with nobody checking, is one of the most concrete daily skills this theme is really about.',
    collocations: ['manage your time', 'manage your schedule', 'manage to do something', 'manage well', 'hard to manage'],
    otherMeanings: ['manage (business): to be in charge of a company, team, or project (e.g., manage a store)'],
    wordFamily: [
      { word: 'management', pos: 'noun', japanese: '管理・経営' },
      { word: 'manageable', pos: 'adjective', japanese: '管理できる' },
    ],
  },

  {
    id: 'us-f-07',
    word: 'decide',
    japanese: '決める',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['university-student', 'designing-my-future'],
    coreMeaning: 'To choose something after thinking about it.',
    examples: [
      'You have to manage your own schedule, remember your own deadlines, and decide, every day, whether to actually show up.',
      'I haven\'t decided what club to join yet.',
    ],
    relatedWords: ['choice', 'independent', 'responsibility'],
    tags: ['university-life', 'action'],
    themeNote: 'University multiplies the number of everyday decisions a student must make alone — this word names that shift directly.',
    collocations: ['decide for yourself', 'decide to do something', 'hard to decide', 'decide on', 'still deciding'],
    wordFamily: [
      { word: 'decision', pos: 'noun', japanese: '決定' },
      { word: 'decisive', pos: 'adjective', japanese: '決断力のある' },
    ],
  },

  {
    id: 'us-f-08',
    word: 'challenge',
    japanese: '難しいこと・挑戦',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'Something difficult that tests your ability and requires effort to deal with or overcome.',
    examples: [
      'This freedom can feel like a real challenge at first.',
      'Managing everything yourself is a real challenge in the beginning, but it gets easier.',
    ],
    relatedWords: ['independent', 'develop', 'manage'],
    tags: ['university-life', 'core'],
    themeNote: 'A deliberate spiral word from Theme 1 (Knowing Myself), where challenge was the mechanism through which confidence and strength were discovered. Here it reappears in a new context: the challenge of managing real independence for the first time.',
    collocations: ['a real challenge', 'face a challenge', 'feel like a challenge', 'a new challenge', 'challenge at first'],
    derivatives: ['challenge', 'challenging', 'challenged'],
    wordFamily: [
      { word: 'challenging', pos: 'adjective', japanese: 'やりがいのある・難しい' },
    ],
  },

  {
    id: 'us-f-09',
    word: 'develop',
    japanese: '成長する・発展する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['university-student'],
    coreMeaning: 'To grow, change, or improve gradually over time.',
    examples: [
      'They begin to develop into someone stronger, more capable, and ready for whatever comes next.',
      'It takes time to develop good habits for managing your own schedule.',
    ],
    relatedWords: ['challenge', 'responsibility', 'manage'],
    tags: ['university-life', 'core'],
    themeNote: 'Another deliberate spiral word from Theme 1, where developing was linked to reflecting on experience. Here, development comes specifically from taking on real responsibility, not from one dramatic change.',
    collocations: ['develop into', 'continue to develop', 'develop a skill', 'develop good habits', 'develop over time'],
    derivatives: ['develop', 'development', 'developed', 'developing'],
    wordFamily: [
      { word: 'development', pos: 'noun', japanese: '発達・発展' },
      { word: 'developed', pos: 'adjective', japanese: '発達した・先進的な' },
      { word: 'developing', pos: 'adjective', japanese: '発展途上の' },
    ],
  },

  // ── What Does It Mean to Be a University Student? — Advanced ────────────────
  // Built 2026-08-07 from the frozen manuscript (docs/THEME_02_MANUSCRIPT.md).
  // "responsibility" is deliberately NOT duplicated here — it stays a single
  // Foundation entry (us-f-05) that this level reinforces in a new context,
  // exactly the mechanism getThemeVocabIds already relies on (Advanced's
  // Vocabulary Preview concatenates foundation + advanced ids).

  {
    id: 'us-s-01',
    word: 'independence',
    japanese: '自立・自律',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: "The state of being free to think, decide, and act for yourself, without depending on someone else's structure or supervision.",
    examples: [
      'It is easy to mistake this for simplicity — as if independence just means fewer people telling you what to do.',
      'Independence, then, is not the absence of structure; it is the quiet, ongoing work of building that structure yourself.',
    ],
    relatedWords: ['responsibility', 'self-discipline', 'adapt'],
    tags: ['university-life', 'core'],
    themeNote: "The Advanced passage deliberately complicates the easy version of this word — independence isn't freedom from structure, it's the ongoing work of building structure yourself.",
    collocations: ['gain independence', 'a sense of independence', 'true independence', 'independence from', 'value independence'],
    derivatives: ['independent', 'independence', 'independently'],
    wordFamily: [
      { word: 'independent', pos: 'adjective', japanese: '自立した' },
      { word: 'independently', pos: 'adverb', japanese: '独立して・自力で' },
    ],
  },

  {
    id: 'us-s-02',
    word: 'self-discipline',
    japanese: '自己規律',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: 'The ability to make yourself do something, or keep a rule you set for yourself, even when no one is checking and no one would know if you didn\'t.',
    examples: [
      'This is where self-discipline becomes something different from what it used to mean.',
      'A student has genuinely adapted to university life not when supervision disappears, but when self-discipline has already taken its place.',
    ],
    relatedWords: ['initiative', 'commitment', 'independence'],
    tags: ['university-life', 'core'],
    themeNote: 'The passage\'s central distinction: self-discipline is not the same as being obedient to someone else\'s rule — it is creating and keeping a rule for yourself.',
    collocations: ['real self-discipline', 'build self-discipline', 'lack self-discipline', 'self-discipline and initiative', 'require self-discipline'],
    wordFamily: [
      { word: 'self-disciplined', pos: 'adjective', japanese: '自己規律のある' },
    ],
  },

  {
    id: 'us-s-03',
    word: 'initiative',
    japanese: '自発性・率先して行うこと',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: 'The willingness to start doing something yourself, before being told or asked to do it.',
    examples: [
      'A student with genuine initiative does not wait to be told to start researching a topic.',
      'Taking initiative early in a semester often matters more than natural talent.',
    ],
    relatedWords: ['self-discipline', 'commitment', 'adapt'],
    tags: ['university-life', 'core'],
    themeNote: 'The passage\'s clearest behavioral test of self-discipline: acting before being asked, because you\'ve already decided the work matters.',
    collocations: ['take initiative', 'show initiative', 'on your own initiative', 'genuine initiative', 'lack initiative'],
    derivatives: ['initiative', 'initiate'],
    wordFamily: [
      { word: 'initiate', pos: 'verb', japanese: '始める・着手する' },
    ],
  },

  {
    id: 'us-s-04',
    word: 'commitment',
    japanese: '責任感・関わり続けること',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: 'A promise, to yourself or others, to keep doing something over time — especially one that is tested once the initial excitement fades.',
    examples: [
      'This kind of commitment is tested most severely not in the first exciting weeks of a semester, but months later.',
      'Real commitment shows up after the motivation that started it has already faded.',
    ],
    relatedWords: ['self-discipline', 'initiative', 'adapt'],
    tags: ['university-life', 'core'],
    themeNote: 'The passage is explicit that commitment is measured by what survives after motivation fades — not by how a student feels in an exciting first week.',
    collocations: ['a strong commitment', "test someone's commitment", 'commitment to something', 'keep a commitment', 'long-term commitment'],
    wordFamily: [
      { word: 'commit', pos: 'verb', japanese: '関わる・専念する' },
      { word: 'committed', pos: 'adjective', japanese: '専念している・熱心な' },
    ],
  },

  {
    id: 'us-s-05',
    word: 'adapt',
    japanese: '適応する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: 'To change your own behavior or approach so that you can succeed in a new situation.',
    examples: [
      'A student has genuinely adapted to university life not when supervision disappears, but when it no longer needs to exist.',
      'Some students adapt within a few weeks; for others, it takes most of the first year.',
    ],
    relatedWords: ['self-discipline', 'independence', 'priority'],
    tags: ['university-life'],
    themeNote: 'The passage redefines what "adapting" actually means here: not getting used to less supervision, but replacing that supervision with self-discipline.',
    collocations: ['adapt to', 'adapt quickly', 'fail to adapt', 'adapt your approach', 'adapt well'],
    derivatives: ['adapt', 'adapted', 'adaptable', 'adaptation'],
    wordFamily: [
      { word: 'adaptation', pos: 'noun', japanese: '適応' },
      { word: 'adaptable', pos: 'adjective', japanese: '順応性のある' },
    ],
  },

  {
    id: 'us-s-06',
    word: 'priority',
    japanese: '優先事項',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: 'The thing that matters most and should be dealt with first, when several things are competing for your attention.',
    examples: [
      'In high school, most students never had to invent their own sense of priority, because priorities arrived ready-made.',
      'A student has to decide, alone, which task deserves attention first — which priority is genuinely urgent.',
    ],
    relatedWords: ['deadline', 'manage', 'independence'],
    tags: ['university-life', 'core'],
    themeNote: "The passage's key example of a decision high school made for you: deciding what matters most is exactly the skill university suddenly requires without ever teaching it directly.",
    collocations: ['set a priority', 'top priority', 'a sense of priority', 'competing priorities', 'get your priorities right'],
    derivatives: ['priority', 'prioritize'],
    wordFamily: [
      { word: 'prioritize', pos: 'verb', japanese: '優先する' },
    ],
  },

  {
    id: 'us-s-07',
    word: 'deadline',
    japanese: '締め切り',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['university-student'],
    coreMeaning: 'The latest time or date by which something must be finished.',
    examples: [
      'A strict deadline, enforced by someone else, decided when the work actually had to be finished.',
      'Independence is the quiet, ongoing work of building that structure yourself, one priority and one deadline at a time.',
    ],
    relatedWords: ['priority', 'submission', 'manage'],
    tags: ['university-life'],
    themeNote: "This word already appears informally inside the Foundation passage ('remember your own deadlines'), but only here does it become the center of a real argument — about who gets to decide what counts as urgent.",
    collocations: ['meet a deadline', 'miss a deadline', 'strict deadline', 'deadline for submission', 'under deadline pressure'],
  },

  // ── Designing My Future — Foundation ────────────────────────────────────────
  // Rebuilt 2026-08-09 from the author's canonical manuscript ("Many people
  // think that designing a future begins by deciding what they want to
  // become..."). Ids df-f-01..08 kept, content fully replaced: df-f-05/07/08
  // change word (choose→reveal, notice→pursue, reveal→continuous); the other
  // five ids keep the same word with themeNote/examples otherwise unchanged
  // (they were already grounded in language present in this manuscript too).

  {
    id: 'df-f-01',
    word: 'discover',
    japanese: '発見する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To find out or realize something for the first time, especially through direct experience rather than by simply deciding it in advance.',
    examples: [
      'It is a continuous process of discovering who we are.',
      "She didn't expect to enjoy the subject — she discovered that only after actually trying it.",
    ],
    relatedWords: ['preference', 'potential', 'reveal'],
    tags: ['future', 'core'],
    themeNote: "This is the passage's central verb for how self-understanding actually happens — not decided in advance, but discovered gradually through the process the passage describes.",
    collocations: ['discover something new', 'discover a preference', 'gradually discover', 'discover through experience', 'discover who you are'],
    wordFamily: [
      { word: 'discovery', pos: 'noun', japanese: '発見' },
    ],
  },

  {
    id: 'df-f-02',
    word: 'preference',
    japanese: '好み',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'A liking for one thing over another, especially one that only becomes clear through trying different things.',
    examples: [
      'A new subject may reveal a preference.',
      'After trying a few different clubs, she finally noticed a clear preference for working with her hands.',
    ],
    relatedWords: ['discover', 'tendency', 'reveal'],
    tags: ['future'],
    themeNote: "One of the concrete things ordinary experience can reveal — the passage's smallest, most everyday form of self-understanding.",
    collocations: ['a clear preference', 'reveal a preference', 'have a preference for', 'personal preference', 'discover a preference'],
    wordFamily: [
      { word: 'prefer', pos: 'verb', japanese: '〜のほうを好む' },
      { word: 'preferred', pos: 'adjective', japanese: '好まれる' },
    ],
  },

  {
    id: 'df-f-03',
    word: 'tendency',
    japanese: '傾向',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'A pattern in how someone naturally thinks, acts, or reacts, that shows up again and again.',
    examples: [
      'Working with other people may reveal a tendency.',
      'Group work slowly showed him a tendency he had never noticed on his own — a habit of asking questions before jumping in.',
    ],
    relatedWords: ['preference', 'potential', 'reveal'],
    tags: ['future'],
    themeNote: "The passage's example of self-understanding built through working with others, not through thinking alone.",
    collocations: ['a natural tendency', 'reveal a tendency', 'notice a tendency', 'tendency to do something', 'a tendency toward'],
    wordFamily: [
      { word: 'tend', pos: 'verb', japanese: '〜する傾向がある' },
    ],
  },

  {
    id: 'df-f-04',
    word: 'potential',
    japanese: '可能性・素質',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'An ability or quality that exists but has not yet been tested or fully developed.',
    examples: [
      'A difficult task may reveal a strength or a potential that had never been noticed before.',
      'Nobody, including her, suspected the potential a single difficult assignment would end up revealing.',
    ],
    relatedWords: ['reveal', 'discover', 'tendency'],
    tags: ['future', 'core'],
    themeNote: 'The passage pairs potential directly with strength — both are things a difficult task can reveal, precisely because they had no earlier occasion to be tested.',
    collocations: ['reveal potential', 'have potential', 'real potential', 'untested potential', 'potential that had never been noticed'],
    wordFamily: [
      { word: 'potentially', pos: 'adverb', japanese: '可能性として・もしかしたら' },
    ],
  },

  {
    id: 'df-f-05',
    word: 'reveal',
    japanese: '明らかにする',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To make something clear or visible that was previously hidden or unknown, often without anyone intending it to happen.',
    examples: [
      'A new subject may reveal a preference. Working with other people may reveal a tendency.',
      'One difficult task revealed more about his real strengths than a whole year of easy classes.',
    ],
    relatedWords: ['tendency', 'potential', 'preference'],
    tags: ['future', 'core'],
    themeNote: "The passage's structural verb — a subject reveals a preference, working with others reveals a tendency, a difficult task reveals a strength or potential. Self-understanding here is not sought directly; it is revealed indirectly, through ordinary experience.",
    collocations: ['reveal a preference', 'reveal a tendency', 'reveal a strength', 'quietly reveal', 'reveal something about yourself'],
  },

  {
    id: 'df-f-06',
    word: 'suit',
    japanese: '〜に合う',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To be right or comfortable for a particular person, rather than simply good or bad in general.',
    examples: [
      'Experience also teaches us what does not suit us.',
      'The same class can suit one student perfectly and feel completely wrong for another.',
    ],
    relatedWords: ['discover', 'pursue', 'preference'],
    tags: ['future', 'core'],
    themeNote: 'The passage treats learning what does not suit you as just as valuable as learning what to pursue — both are described as equally important forms of self-understanding.',
    collocations: ['suit you', 'does not suit', 'suit your interests', 'what does not suit us', 'find what suits you'],
    otherMeanings: ['suit (clothing, noun): a matching jacket and trousers worn together (e.g., wear a suit to an interview)'],
    wordFamily: [
      { word: 'suitable', pos: 'adjective', japanese: '適した' },
    ],
  },

  {
    id: 'df-f-07',
    word: 'pursue',
    japanese: '追い求める',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To continue working toward something over time, because it genuinely interests or matters to you.',
    examples: [
      'Knowing what to leave behind is just as important as knowing what to pursue.',
      'It took a difficult class to help her figure out what she actually wanted to pursue.',
    ],
    relatedWords: ['suit', 'discover', 'potential'],
    tags: ['future', 'core'],
    themeNote: 'The passage pairs pursuing with leaving behind as equally important — self-understanding is built from both what you choose to continue and what you choose to let go.',
    collocations: ['knowing what to pursue', 'pursue something', 'worth pursuing', 'continue to pursue', 'decide what to pursue'],
    wordFamily: [
      { word: 'pursuit', pos: 'noun', japanese: '追求' },
    ],
  },

  {
    id: 'df-f-08',
    word: 'continuous',
    japanese: '継続的な',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'Happening without stopping or being interrupted — an ongoing process rather than a single event.',
    examples: [
      'It is a continuous process of discovering who we are.',
      'Learning what suits you is a continuous process, not something that finishes after one good or bad experience.',
    ],
    relatedWords: ['discover', 'pursue', 'reveal'],
    tags: ['future', 'core'],
    themeNote: 'The passage\'s key structural word — designing a future is described as a continuous process, not a single decision made once and finished.',
    collocations: ['a continuous process', 'continuous effort', 'continuous learning', 'remain continuous', 'continuous rather than one-time'],
    wordFamily: [
      { word: 'continue', pos: 'verb', japanese: '続ける' },
      { word: 'continuously', pos: 'adverb', japanese: '継続的に' },
    ],
  },

  // ── Designing My Future — Advanced ──────────────────────────────────────────
  // Rebuilt 2026-08-09 from the same canonical manuscript's Advanced passage
  // ("People often believe that designing a future begins with making an
  // important decision..."). construct/competence/assumption keep their
  // ids/words from the previous draft (content refreshed to this passage);
  // ambiguity and satisfaction are retired (no longer central to this
  // passage's argument); predetermined and interaction are new.
  // "interaction" is a deliberate spiral reinforcement from Theme 1 Advanced
  // (km-s-05, "the interaction of nature and nurture") — a separate entry
  // with its own theme-specific examples, same pattern as Theme 2's
  // "challenge"/"develop" reinforcing Theme 1 Foundation words.
  // construct/anxiety/purpose do not appear verbatim in this manuscript
  // (the text uses "shaped," "worry," and career/life/destination language
  // instead) — kept per the author's explicit instruction that target
  // vocabulary represents the manuscript's educational concepts, not
  // necessarily its literal wording; their first example below paraphrases
  // the relevant passage idea rather than quoting it directly.

  {
    id: 'df-s-01',
    word: 'construct',
    japanese: '築き上げる・構築する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'To build something gradually through action, rather than simply finding something that already existed.',
    examples: [
      "Instead of asking people to discover a future that already exists, this view suggests that a future is gradually shaped through experience — constructed through action rather than found by looking inward.",
      "Some people believe confidence is something you either have or don't; others believe you construct it, one small success at a time.",
    ],
    relatedWords: ['assumption', 'competence', 'purpose'],
    tags: ['future', 'core'],
    themeNote: "This word names the passage's alternative account of self-understanding: not discovered by looking inward, but constructed gradually through action — a required course, a job, a commitment made almost by accident.",
    collocations: ['construct something', 'construct it gradually', 'construct through action', 'actively construct', 'construct rather than discover'],
    wordFamily: [
      { word: 'construction', pos: 'noun', japanese: '構築・建設' },
      { word: 'constructive', pos: 'adjective', japanese: '建設的な' },
    ],
  },

  {
    id: 'df-s-02',
    word: 'competence',
    japanese: '能力・熟達',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A real, demonstrated ability to do something well, usually built through sustained effort rather than given from the start.',
    examples: [
      'People often discover that work they never considered eventually becomes meaningful because they have developed competence through sustained effort.',
      'Effort leads to competence, and competence gradually produces satisfaction.',
    ],
    relatedWords: ['construct', 'passion', 'purpose'],
    tags: ['future', 'core'],
    themeNote: "The keystone of the passage's central reversal: effort leads to competence, and competence gradually produces satisfaction — enjoyment follows competence rather than preceding it.",
    collocations: ['develop competence', 'lead to competence', 'competence through effort', 'gradually build competence', 'competence and satisfaction'],
    wordFamily: [
      { word: 'competent', pos: 'adjective', japanese: '有能な' },
    ],
  },

  {
    id: 'df-s-03',
    word: 'assumption',
    japanese: '思い込み・前提',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'Something accepted as true without being directly proven, often so automatically that it goes unquestioned.',
    examples: [
      'This way of thinking assumes that the destination already exists, waiting to be identified, and that success depends on finding the correct answer as early as possible.',
      "It's worth questioning the assumption that enjoyment always has to come before effort.",
    ],
    relatedWords: ['predetermined', 'construct', 'purpose'],
    tags: ['future'],
    themeNote: "The passage's rhetorical hinge — it names the popular assumption (that a destination already exists, waiting to be found) that the second half of the essay goes on to question.",
    collocations: ['a common assumption', 'question an assumption', 'the assumption that', 'based on an assumption', 'challenge an assumption'],
    wordFamily: [
      { word: 'assume', pos: 'verb', japanese: '思い込む・仮定する' },
      { word: 'assumed', pos: 'adjective', japanese: '当然とされた' },
    ],
  },

  {
    id: 'df-s-04',
    word: 'anxiety',
    japanese: '不安',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A persistent feeling of worry or unease, often about something uncertain in the future.',
    examples: [
      'As a result, many young people worry that they are falling behind if they cannot see a clear direction — an anxiety that assumes a single correct destination already exists, waiting to be found.',
      'A lot of the anxiety students feel about their future comes from believing they should already know the answer.',
    ],
    relatedWords: ['assumption', 'purpose', 'predetermined'],
    tags: ['future'],
    themeNote: "The passage names this feeling as 'worry' and traces its cause — the anxiety of not yet knowing your direction depends on assuming that a single correct answer already exists, waiting to be identified.",
    collocations: ['feel anxiety', 'a source of anxiety', 'ease your anxiety', 'anxiety about the future', 'the anxiety of not knowing'],
    wordFamily: [
      { word: 'anxious', pos: 'adjective', japanese: '不安な' },
    ],
  },

  {
    id: 'df-s-05',
    word: 'purpose',
    japanese: '目的・存在意義',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A clear sense of what you are meant to do or why what you do matters.',
    examples: [
      'Questions such as "What career should I choose?" or "What kind of life do I want to live?" seem to come first — as though a sense of purpose already exists somewhere, waiting to be identified.',
      'He stopped searching directly for his purpose and noticed, later, that it had been forming quietly through the work he was already doing.',
    ],
    relatedWords: ['passion', 'assumption', 'construct'],
    tags: ['future', 'core'],
    themeNote: 'Though the passage itself speaks in terms of career and destination, purpose is the deeper concept both accounts of the essay are really arguing about — whether it precedes action, or emerges from it.',
    collocations: ['a sense of purpose', 'search for purpose', 'find your purpose', 'purpose already exists', 'purpose in life'],
    wordFamily: [
      { word: 'purposeful', pos: 'adjective', japanese: '目的意識のある' },
    ],
  },

  {
    id: 'df-s-06',
    word: 'passion',
    japanese: '情熱',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A strong enthusiasm or love for something — often assumed to be the starting point for effort, rather than something that can follow it.',
    examples: [
      'What people later describe as a passion may therefore be the result of long-term engagement rather than its starting point.',
      'Everyone told her to follow her passion, but for her, passion only arrived after months of unglamorous practice.',
    ],
    relatedWords: ['purpose', 'competence', 'construct'],
    tags: ['future', 'core'],
    themeNote: 'The word at the center of the passage\'s biggest reversal — what people later call passion may be the result of long-term engagement, not its cause.',
    collocations: ['follow your passion', 'a lasting passion', 'passion for something', 'discover a passion', 'the result of engagement, not its starting point'],
    wordFamily: [
      { word: 'passionate', pos: 'adjective', japanese: '情熱的な' },
    ],
  },

  {
    id: 'df-s-07',
    word: 'predetermined',
    japanese: 'あらかじめ決められた',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'Decided or fixed in advance, before anything has actually happened.',
    examples: [
      'A career is often imagined as a sequence of correct decisions leading toward a predetermined destination.',
      'Treating your future as predetermined can make every ordinary experience feel like it barely matters.',
    ],
    relatedWords: ['assumption', 'construct', 'purpose'],
    tags: ['future'],
    themeNote: "The passage's clearest image of the view it goes on to question — a career imagined as a straight sequence of correct decisions leading to a destination that was fixed from the start.",
    collocations: ['a predetermined destination', 'predetermined outcome', 'treat something as predetermined', 'far from predetermined', 'not predetermined at all'],
    wordFamily: [
      { word: 'determine', pos: 'verb', japanese: '決定する' },
      { word: 'determined', pos: 'adjective', japanese: '決意した・決定された' },
    ],
  },

  {
    id: 'df-s-08',
    word: 'interaction',
    japanese: '相互作用',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'The way two or more things affect and respond to each other, rather than acting separately.',
    examples: [
      'It develops continuously through the interaction between our personal characteristics and the experiences we accumulate throughout life.',
      'The result was not caused by one factor alone, but by the interaction between several factors working together.',
    ],
    relatedWords: ['construct', 'competence', 'assumption'],
    tags: ['future', 'core'],
    themeNote: 'A deliberate spiral word from Theme 1 Advanced, where interaction named the relationship between nature and nurture. Here it reappears in a new context: self-understanding as something that develops through the interaction between personal characteristics and accumulated experience, not from either alone.',
    collocations: ['the interaction between', 'a continuous interaction', 'interaction between factors', 'develop through interaction', 'interaction over time'],
    wordFamily: [
      { word: 'interact', pos: 'verb', japanese: '相互作用する' },
      { word: 'interactive', pos: 'adjective', japanese: '双方向の・対話的な' },
    ],
  },

  // ── Living Together — Foundation ────────────────────────────────────────────
  // Rebuilt against docs/THEME_04_MANUSCRIPT.md (frozen) — supersedes the old
  // Mio/roommate placeholder entirely. lt-f-02/06/07/08 keep their original
  // ids (trust/respect/agree/disagree unchanged as words) since lt-f-02 is
  // cross-referenced by facts-or-fake's targetVocabIds and Writing wordBank;
  // lt-f-01/03/04/05/09/10 are repurposed for the manuscript's other words —
  // nothing outside this theme referenced those six ids.

  {
    id: 'lt-f-01',
    word: 'community',
    japanese: '地域社会・コミュニティ',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'A group of people who live, work, or spend time together and are connected to each other.',
    examples: [
      'No real community is made up of identical people.',
      'People feel they belong to the same community even when they think differently.',
    ],
    relatedWords: ['belong', 'harmony', 'trust'],
    tags: ['connection', 'core'],
    themeNote: 'This theme is about what actually makes a community strong — not agreement, but the ability to stay connected despite real differences.',
    collocations: ['a strong community', 'part of a community', 'build a community', 'a lasting community', 'the same community'],
  },

  {
    id: 'lt-f-02',
    word: 'trust',
    japanese: '信頼する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together', 'facts-or-fake'],
    coreMeaning: 'To believe that someone is honest and reliable, especially after getting to know them.',
    examples: [
      'When people respect one another and accept different opinions, trust can gradually develop.',
      'Over time, these experiences gradually build trust.',
    ],
    relatedWords: ['respect', 'accept', 'community'],
    tags: ['connection'],
    themeNote: 'Trust in this theme isn\'t automatic — it grows specifically through working with people who are different, not just being around people who are similar.',
    collocations: ['build trust', 'trust can develop', 'trust each other', 'gradually build trust', 'a lack of trust'],
  },

  {
    id: 'lt-f-03',
    word: 'belong',
    japanese: '所属する・仲間だと感じる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To feel accepted as part of a group, even when you are different from other members.',
    examples: [
      'These relationships help people feel they belong to the same community even when they do not think in the same way.',
      'People begin to feel they belong because they know they are accepted.',
    ],
    relatedWords: ['community', 'accept', 'trust'],
    tags: ['connection', 'core'],
    themeNote: 'Belonging here doesn\'t require sameness — the passage argues real belonging survives being different from others in the group.',
    collocations: ['feel they belong', 'belong to a community', 'a sense of belonging', 'still belong', 'belong together'],
  },

  {
    id: 'lt-f-04',
    word: 'cooperate',
    japanese: '協力する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To work together with someone toward a shared goal, especially when solving a problem.',
    examples: [
      'When people respect one another, cooperate to solve problems, and accept different opinions, trust can gradually develop.',
      'It is created when different people choose to build trust and keep cooperating.',
    ],
    relatedWords: ['respect', 'accept', 'community'],
    tags: ['action', 'connection'],
    themeNote: 'Cooperation is presented as something people actively choose to continue, not something that only happens when everyone already agrees.',
    collocations: ['cooperate to solve problems', 'keep cooperating', 'continue cooperating', 'cooperate with each other', 'willing to cooperate'],
  },

  {
    id: 'lt-f-05',
    word: 'accept',
    japanese: '受け入れる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To allow or welcome something, such as a different opinion, without rejecting it.',
    examples: [
      'When people respect one another, cooperate to solve problems, and accept different opinions, trust can gradually develop.',
      'People begin to feel they belong because they know they are accepted, even when they are different from others.',
    ],
    relatedWords: ['respect', 'different', 'trust'],
    tags: ['connection', 'core'],
    themeNote: 'Acceptance in this theme means still welcoming someone after you discover a real difference — not only when everyone already agrees.',
    collocations: ['accept different opinions', 'know they are accepted', 'accept that...', 'willing to accept', 'accepted by others'],
  },

  {
    id: 'lt-f-06',
    word: 'respect',
    japanese: '尊重する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To treat someone\'s opinions or differences as important, even when you don\'t share them.',
    examples: [
      'When people respect one another, cooperate to solve problems, and accept different opinions, trust can gradually develop.',
      'Respecting someone\'s opinion doesn\'t mean you have to agree with it.',
    ],
    relatedWords: ['accept', 'trust', 'cooperate'],
    tags: ['character', 'connection'],
    themeNote: 'The passage treats respect as one of the specific actions — along with cooperating and accepting — that let disagreement happen without damaging a community.',
    collocations: ['respect one another', 'respect for different opinions', 'show respect', 'mutual respect', 'respect someone\'s view'],
  },

  {
    id: 'lt-f-07',
    word: 'agree',
    japanese: '同意する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To have the same opinion as someone else.',
    examples: [
      'Many people assume that a strong community is built on agreement.',
      'Living together does not mean that people always agree.',
    ],
    relatedWords: ['disagree', 'similar', 'harmony'],
    tags: ['communication'],
    themeNote: 'The passage\'s whole argument depends on separating agreement from strength — a community can be strong without its members agreeing often.',
    collocations: ['always agree', 'agree with', 'built on agreement', 'agree more often', 'agreement between people'],
  },

  {
    id: 'lt-f-08',
    word: 'disagree',
    japanese: '意見が合わない',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To have a different opinion from someone else.',
    examples: [
      'Differences often lead to disagreement, but that does not always damage a community.',
      'Perhaps the strength of a community is not measured by how little disagreement it has.',
    ],
    relatedWords: ['agree', 'different', 'conflict'],
    tags: ['communication'],
    themeNote: 'Disagreement is treated as ordinary and survivable in this theme, not something a strong community avoids.',
    collocations: ['lead to disagreement', 'how little disagreement', 'after disagreement', 'often disagree', 'disagree about something'],
  },

  {
    id: 'lt-f-09',
    word: 'similar',
    japanese: '似ている',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'Having many of the same qualities, interests, or ways of thinking as someone else.',
    examples: [
      'People naturally feel most comfortable around others who are similar to them.',
      'If people think in similar ways, they may agree more often and face less conflict.',
    ],
    relatedWords: ['different', 'community', 'agree'],
    tags: ['connection'],
    themeNote: 'The passage takes the comfort of similarity seriously before arguing that it isn\'t, by itself, what makes a community strong.',
    collocations: ['similar to them', 'similar ways', 'similar backgrounds', 'quite similar', 'a similar experience'],
  },

  {
    id: 'lt-f-10',
    word: 'different',
    japanese: '異なる・違う',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'Not the same as someone or something else, in ideas, habits, or background.',
    examples: [
      'Every family, school, workplace, and neighborhood includes people with different personalities, ideas, and backgrounds.',
      'It is created when different people choose to build trust and continue cooperating.',
    ],
    relatedWords: ['similar', 'accept', 'disagree'],
    tags: ['connection', 'core'],
    themeNote: 'This is the theme\'s central word — the whole passage is an argument about what happens when a community includes people who are genuinely different.',
    collocations: ['different opinions', 'different personalities', 'people who are different', 'quite different', 'different from others'],
  },

  {
    id: 'lt-f-11',
    word: 'harmony',
    japanese: '調和',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'A peaceful, connected state among people, even when they are not all the same.',
    examples: [
      'Harmony is not created because everyone is the same.',
      'It is created when different people choose to build trust and continue cooperating.',
    ],
    relatedWords: ['community', 'trust', 'different'],
    tags: ['connection', 'core'],
    themeNote: 'The passage redefines harmony — not the absence of difference, but the result of people choosing to stay connected despite it.',
    collocations: ['create harmony', 'true harmony', 'live in harmony', 'harmony among people', 'a sense of harmony'],
  },

  // ── Living Together — Advanced ──────────────────────────────────────────────
  // New tier for this theme — the old placeholder had none. resilience and
  // assumption are deliberate spiral reinforcements (Theme 1's km-s-08 and
  // Theme 3's df-s-03 respectively), implemented as their own separate
  // entries per docs/THEME_04_MANUSCRIPT.md, not a duplicate of those ids.

  {
    id: 'lt-s-01',
    word: 'diversity',
    japanese: '多様性',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'The presence of people with different backgrounds, opinions, or characteristics within a group.',
    examples: [
      'In this way, diversity does not simply become a challenge to overcome.',
      'A community\'s diversity can become one of its greatest strengths over time.',
    ],
    relatedWords: ['different', 'tolerance', 'community'],
    tags: ['connection', 'core'],
    themeNote: 'The passage\'s key reframe: diversity isn\'t just something a community has to manage — it can be part of why the community grows stronger.',
    collocations: ['a team\'s diversity', 'embrace diversity', 'real diversity', 'genuine diversity', 'diversity within a group'],
  },

  {
    id: 'lt-s-02',
    word: 'tolerance',
    japanese: '寛容さ',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'The willingness to accept people or ideas that are different from your own, without necessarily agreeing with them.',
    examples: [
      'Communities that practice tolerance and keep working together after disagreement often develop greater resilience.',
      'Tolerance alone does not build trust — it has to be combined with real cooperation.',
    ],
    relatedWords: ['accept', 'empathy', 'diversity'],
    tags: ['character'],
    themeNote: 'Tolerance is presented as something a community actively practices over time, paired with continuing to work together, not a one-time attitude.',
    collocations: ['practice tolerance', 'a culture of tolerance', 'show tolerance', 'genuine tolerance', 'tolerance for difference'],
  },

  {
    id: 'lt-s-03',
    word: 'empathy',
    japanese: '共感',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'The ability to understand and share another person\'s perspective or feelings.',
    examples: [
      'People need empathy to understand another person\'s perspective.',
      'Real empathy means trying to understand someone\'s perspective even when you don\'t share it.',
    ],
    relatedWords: ['perspective', 'respect', 'accept'],
    tags: ['character', 'connection'],
    themeNote: 'Empathy is the specific mechanism the passage gives for how people manage real differences without simply avoiding them.',
    collocations: ['empathy to understand', 'show empathy', 'real empathy', 'empathy for someone', 'through empathy'],
  },

  {
    id: 'lt-s-04',
    word: 'perspective',
    japanese: '視点・見方',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'A particular way of thinking about or seeing a situation, shaped by a person\'s own experience.',
    examples: [
      'People need empathy to understand another person\'s perspective.',
      'Two people can have a completely different perspective on the same situation.',
    ],
    relatedWords: ['empathy', 'different', 'assumption'],
    tags: ['connection'],
    themeNote: 'Understanding someone\'s perspective — not just tolerating that they have one — is what the passage says real cooperation actually requires.',
    collocations: ['another person\'s perspective', 'understand a perspective', 'from this perspective', 'a different perspective', 'shift your perspective'],
  },

  {
    id: 'lt-s-05',
    word: 'conflict',
    japanese: '対立・衝突',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'A serious disagreement or clash between people with different opinions or needs.',
    examples: [
      'If people think in similar ways, they may agree more often and face less conflict.',
      'Some conflict is a normal part of any community that includes real differences.',
    ],
    relatedWords: ['disagree', 'resilience', 'accommodate'],
    tags: ['communication'],
    themeNote: 'The passage treats conflict as an expected result of real diversity, not a sign that a community has failed.',
    collocations: ['face less conflict', 'avoid conflict', 'a source of conflict', 'resolve a conflict', 'conflict between people'],
  },

  {
    id: 'lt-s-06',
    word: 'resilience',
    japanese: '回復力・立ち直る力',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'The ability to stay strong and recover well after a difficult experience.',
    examples: [
      'Communities that practice tolerance and keep working together after disagreement often develop greater resilience than communities that have never faced problems.',
      'A community\'s resilience is often tested for the first time by its first real disagreement.',
    ],
    relatedWords: ['conflict', 'tolerance', 'community'],
    tags: ['character', 'core'],
    themeNote: 'First introduced in Theme 1 Advanced to describe a person recovering from difficulty; here the same word describes a community — reinforcing it at the same level in a genuinely new context, per docs/VOCABULARY_PHILOSOPHY.md §5.',
    collocations: ['develop resilience', 'greater resilience', 'a community\'s resilience', 'build resilience', 'show resilience'],
  },

  {
    id: 'lt-s-07',
    word: 'accommodate',
    japanese: '配慮する・受け入れる',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'To adjust your own actions or expectations to make room for someone else\'s needs or differences.',
    examples: [
      'Sometimes this means learning to accommodate another person\'s needs without giving up one\'s own values.',
      'A strong community learns to accommodate real differences instead of ignoring them.',
    ],
    relatedWords: ['accept', 'cooperate', 'respect'],
    tags: ['action', 'connection'],
    themeNote: 'Accommodating someone is presented as more demanding than simply accepting them — it means actually adjusting, while still keeping your own values.',
    collocations: ['accommodate another person\'s needs', 'learn to accommodate', 'accommodate a difference', 'willing to accommodate', 'accommodate each other'],
  },

  {
    id: 'lt-s-08',
    word: 'assumption',
    japanese: '思い込み・前提',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-together'],
    coreMeaning: 'Something people believe is true without questioning it, often before real evidence is considered.',
    examples: [
      'A common assumption is that a successful community depends on agreement.',
      'The passage challenges a common assumption about what actually makes a community strong.',
    ],
    relatedWords: ['diversity', 'conflict', 'community'],
    tags: ['core'],
    themeNote: 'First introduced in Theme 3 Advanced to describe a belief about career destinations; here the same word describes a belief about what makes communities strong — reinforced at the same level in a new context, per docs/VOCABULARY_PHILOSOPHY.md §5.',
    collocations: ['a common assumption', 'challenge an assumption', 'based on an assumption', 'question an assumption', 'a false assumption'],
  },

  // ── Facts or Fake? — Foundation ─────────────────────────────────────────────
  // Rebuilt against docs/THEME_05_MANUSCRIPT.md (frozen) — supersedes the old
  // Haruto/"drinking cold water" placeholder entirely. ff-f-06/08/09 keep
  // their original ids (source/fact/opinion unchanged as words); ff-f-01/
  // 02/03/04/05/07 are repurposed for the manuscript's other words —
  // nothing outside this theme referenced those six ids. trust stays on
  // Theme 4's lt-f-02 (untouched, reused as-is), unchanged from before.

  {
    id: 'ff-f-01',
    word: 'claim',
    japanese: '主張',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'A statement that something is true, which may or may not be supported by evidence.',
    examples: [
      'A confident voice, a professional-looking website, or an impressive picture does not guarantee that a claim is supported by evidence.',
      'Before you share a claim, it is worth checking where it came from.',
    ],
    relatedWords: ['evidence', 'fact', 'source'],
    tags: ['information', 'core'],
    themeNote: 'A claim is simply a statement — this theme is about learning to check a claim before deciding whether to believe it.',
    collocations: ['support a claim', 'an important claim', 'check a claim', 'a claim is true', 'question a claim'],
  },

  {
    id: 'ff-f-02',
    word: 'evidence',
    japanese: '証拠',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Facts or information that show whether something is true.',
    examples: [
      'A confident voice, a professional-looking website, or an impressive picture does not guarantee that a claim is supported by evidence.',
      'Is there enough evidence?',
    ],
    relatedWords: ['claim', 'fact', 'verify'],
    tags: ['information', 'core'],
    themeNote: 'The theme\'s central habit is asking whether a claim is actually supported by evidence, not just whether it sounds confident.',
    collocations: ['enough evidence', 'supported by evidence', 'look for evidence', 'based on evidence', 'lack of evidence'],
  },

  {
    id: 'ff-f-03',
    word: 'examine',
    japanese: '詳しく調べる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'To look at something carefully in order to understand or judge it.',
    examples: [
      'Before trusting important information, people need to examine where it came from and whether it can be verified.',
      'Perhaps the most valuable habit is not knowing every answer but developing the ability to examine information carefully.',
    ],
    relatedWords: ['verify', 'source', 'reliable'],
    tags: ['action', 'core'],
    themeNote: 'Examining is presented as the theme\'s central action — the habit that makes every other question (is it a fact? is it reliable?) possible.',
    collocations: ['examine information', 'examine carefully', 'examine where it came from', 'examine a claim', 'worth examining'],
  },

  {
    id: 'ff-f-04',
    word: 'verify',
    japanese: '検証する・確認する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'To check that something is true or accurate.',
    examples: [
      'Before trusting important information, people need to examine where it came from and whether it can be verified.',
      'Good information can usually be verified by more than one source.',
    ],
    relatedWords: ['examine', 'evidence', 'reliable'],
    tags: ['action', 'core'],
    themeNote: 'Verifying is what turns examining into a real answer — not just looking closely, but actually confirming whether something holds up.',
    collocations: ['can be verified', 'verify information', 'verify a claim', 'hard to verify', 'verify where it came from'],
  },

  {
    id: 'ff-f-05',
    word: 'reliable',
    japanese: '信頼できる',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Able to be trusted to be true, accurate, or consistent.',
    examples: [
      'Much of this information is useful, but not all of it is equally reliable.',
      'Is the source reliable?',
    ],
    relatedWords: ['trust', 'source', 'evidence'],
    tags: ['information', 'core'],
    themeNote: 'Reliability is treated as something you check, not something you assume — a source doesn\'t become reliable just by sounding confident.',
    collocations: ['a reliable source', 'equally reliable', 'not very reliable', 'reliable information', 'seem reliable'],
  },

  {
    id: 'ff-f-06',
    word: 'source',
    japanese: '情報源',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'The place, person, or organization that information originally comes from.',
    examples: [
      'Before trusting important information, people need to examine where it came from and whether it can be verified.',
      'Is the source reliable?',
    ],
    relatedWords: ['reliable', 'verify', 'claim'],
    tags: ['information', 'core'],
    themeNote: 'Asking about the source — not just the claim itself — is the single most practical habit this theme teaches.',
    collocations: ['check the source', 'a reliable source', 'where it came from', 'the same source', 'an unfamiliar source'],
  },

  {
    id: 'ff-f-07',
    word: 'misleading',
    japanese: '誤解を招く・紛らわしい',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Giving a false or confusing impression, in a way that could cause someone to believe something untrue.',
    examples: [
      'Looking carefully before accepting information helps people avoid being misled.',
      'In a world where authentic and misleading information often look similar, careful thinking has become more important than ever.',
    ],
    relatedWords: ['reliable', 'fact', 'opinion'],
    tags: ['information', 'core'],
    themeNote: 'The theme\'s title question — facts or fake? — is really asking whether something is misleading, even when it looks completely genuine.',
    collocations: ['misleading information', 'avoid being misled', 'look misleading', 'a misleading claim', 'easily misled'],
  },

  {
    id: 'ff-f-08',
    word: 'fact',
    japanese: '事実',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Something that is true and can be checked or proven.',
    examples: [
      'Is this fact or opinion?',
      'A fact can usually be checked against more than one reliable source.',
    ],
    relatedWords: ['opinion', 'evidence', 'reliable'],
    tags: ['information', 'core'],
    themeNote: 'The theme\'s core question — fact or opinion? — becomes a simple habit students can apply to anything they read.',
    collocations: ['fact or opinion', 'based on facts', 'check the facts', 'a simple fact', 'state a fact'],
  },

  {
    id: 'ff-f-09',
    word: 'opinion',
    japanese: '意見',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'A personal belief or judgment that may not be provable as true.',
    examples: [
      'Is this fact or opinion?',
      'An opinion can still be worth hearing, even when it isn\'t a fact.',
    ],
    relatedWords: ['fact', 'claim', 'evidence'],
    tags: ['information', 'core'],
    themeNote: 'Opinions aren\'t treated as bad in this theme — the danger is an opinion presented as if it were a fact.',
    collocations: ['just an opinion', 'in my opinion', 'opinion vs. fact', 'share an opinion', 'strong opinion'],
  },

  // ── Facts or Fake? — Advanced ────────────────────────────────────────────────
  // New tier for this theme — the old placeholder had none. assumption is a
  // deliberate spiral reinforcement (third appearance: Theme 3's df-s-03,
  // then Theme 4's lt-s-08, now here), implemented as its own separate
  // entry per docs/THEME_05_MANUSCRIPT.md, not a duplicate of those ids.

  {
    id: 'ff-s-01',
    word: 'dubious',
    japanese: '疑わしい',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'Not completely certain to be true or trustworthy; causing doubt.',
    examples: [
      'A financial scheme that would seem dubious to an expert can still pass an ordinary examination, which is exactly why it succeeds.',
      'A dubious claim deserves a closer look, not automatic belief or automatic rejection.',
    ],
    relatedWords: ['suspicious', 'credibility', 'source'],
    tags: ['information'],
    themeNote: 'The passage shows that even a claim an expert would find dubious can still fool someone without that expertise — which is exactly what makes financial crime dangerous.',
    collocations: ['a dubious claim', 'seem dubious', 'a dubious source', 'somewhat dubious', 'dubious information'],
  },

  {
    id: 'ff-s-02',
    word: 'authenticity',
    japanese: '真正性・本物であること',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'The quality of being genuine or real, not fake or copied.',
    examples: [
      'A claim does not need real authenticity to feel authentic.',
      'It can be hard to judge the authenticity of a claim just by how many people seem to believe it.',
    ],
    relatedWords: ['dubious', 'misinformation', 'reliable'],
    tags: ['information', 'core'],
    themeNote: 'The passage\'s key claim about political and social influence: something can feel authentic through repetition alone, without actually having real authenticity behind it.',
    collocations: ['question the authenticity', 'authenticity of a source', 'doubt the authenticity', 'feel authentic', 'authenticity matters'],
  },

  {
    id: 'ff-s-03',
    word: 'suspicious',
    japanese: '疑わしく思う・怪しい',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'Having a feeling that something may be false, dishonest, or dangerous.',
    examples: [
      'Repetition makes an exaggerated claim sound less suspicious, even if it has never actually been checked.',
      'A suspicious claim is worth checking, not simply believing or dismissing.',
    ],
    relatedWords: ['dubious', 'examine', 'verify'],
    tags: ['information'],
    themeNote: 'The passage shows that familiarity, not evidence, is often what makes a claim feel less suspicious — which is exactly why a repeated claim can be more dangerous than a new one.',
    collocations: ['a suspicious claim', 'look suspicious', 'sound suspicious', 'suspicious of', 'seem suspicious'],
  },

  {
    id: 'ff-s-04',
    word: 'blindly',
    japanese: '盲目的に・何も考えずに',
    pos: 'adverb',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'Without thinking carefully or noticing something important; without questioning.',
    examples: [
      'The mistake was not that they trusted blindly — it was that the evidence itself had been manipulated.',
      'Following a confident voice blindly is exactly the habit this theme argues against.',
    ],
    relatedWords: ['examine', 'verify', 'credibility'],
    tags: ['character'],
    themeNote: 'The passage makes a careful distinction: even people who don\'t trust blindly, and who genuinely look for evidence, can still be fooled if that evidence has itself been manipulated.',
    collocations: ['blindly accepting', 'blindly trust', 'blindly follow', 'act blindly', 'blindly believe'],
  },

  {
    id: 'ff-s-05',
    word: 'credibility',
    japanese: '信頼性・信憑性',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'The quality of being believable or trustworthy, especially because it is deserved, not just assumed.',
    examples: [
      'It can be built, chosen, and repeated specifically to create trust or credibility, whether or not it is deserved.',
      'A message heard often enough can start to feel credible even when nothing about it has actually been checked.',
    ],
    relatedWords: ['reliable', 'evidence', 'authenticity'],
    tags: ['information', 'core'],
    themeNote: 'The passage\'s central concern: credibility can be created through repetition and presentation, separately from whether it is actually deserved.',
    collocations: ['earn credibility', 'feel credible', 'lack credibility', 'create credibility', 'credibility depends on'],
  },

  {
    id: 'ff-s-06',
    word: 'manipulate',
    japanese: '操作する・悪用する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'To control or influence something unfairly or dishonestly, often to deceive someone.',
    examples: [
      'The mistake was not that they trusted blindly — it was that the evidence itself had been manipulated.',
      'This does not mean that repeated or widely shared information is always a form of manipulation.',
    ],
    relatedWords: ['exaggerate', 'misinformation', 'bias'],
    tags: ['information'],
    themeNote: 'Manipulated evidence — not carelessness — is what the passage identifies as the real danger in financial crime: people who did look for evidence were still fooled.',
    collocations: ['manipulated evidence', 'manipulate information', 'a form of manipulation', 'easily manipulated', 'manipulate public opinion'],
  },

  {
    id: 'ff-s-07',
    word: 'exaggerate',
    japanese: '誇張する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'To make something seem larger, more extreme, or more dramatic than it actually is.',
    examples: [
      'This is one reason an exaggerated claim in an advertisement can still work: repetition makes it sound less suspicious.',
      'An exaggerated headline can make an ordinary story sound like a crisis.',
    ],
    relatedWords: ['misinformation', 'suspicious', 'bias'],
    tags: ['information'],
    themeNote: 'Exaggeration works precisely because repetition can make an exaggerated claim start to feel ordinary and safe, rather than alarming.',
    collocations: ['an exaggerated claim', 'exaggerate a story', 'tend to exaggerate', 'wildly exaggerated', 'exaggerate the risk'],
  },

  {
    id: 'ff-s-08',
    word: 'misinformation',
    japanese: '誤情報',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'False or inaccurate information, especially when it spreads without the person sharing it realizing it\'s false.',
    examples: [
      'This is one reason misinformation spreads so easily in groups: a claim does not need real authenticity to feel authentic.',
      'Misinformation can spread quickly, even when nobody involved meant to deceive anyone.',
    ],
    relatedWords: ['misleading', 'exaggerate', 'manipulate'],
    tags: ['information', 'core'],
    themeNote: 'The passage locates the danger of misinformation specifically in groups, where feeling shared substitutes for anyone actually having checked it.',
    collocations: ['spread misinformation', 'a source of misinformation', 'misinformation spreads', 'fight misinformation', 'unintentional misinformation'],
  },

  {
    id: 'ff-s-09',
    word: 'assumption',
    japanese: '思い込み・前提',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'Something people believe is true without questioning it, often before real evidence is considered.',
    examples: [
      'It only needs to be repeated by enough people who all share the same assumption — that someone else must have already checked it.',
      'That assumption is exactly what this theme asks readers to question.',
    ],
    relatedWords: ['credibility', 'dubious', 'evidence'],
    tags: ['core'],
    themeNote: 'Third appearance of this word in the curriculum (Theme 3 Advanced, then Theme 4 Advanced, now here) — here describing the shared, unquestioned assumption that lets misinformation spread in groups, at the same level as its earlier introductions, per docs/VOCABULARY_PHILOSOPHY.md §5.',
    collocations: ['share the same assumption', 'question an assumption', 'based on an assumption', 'a common assumption', 'challenge an assumption'],
  },

  {
    id: 'ff-s-10',
    word: 'bias',
    japanese: '偏見・偏り',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['facts-or-fake'],
    coreMeaning: 'An unfair tendency to support one side, opinion, or group over another, often without realizing it.',
    examples: [
      'This kind of bias does not require a single lie — it only requires choosing what people see and hear most often.',
      'Even a reliable source can contain some bias without meaning to mislead anyone.',
    ],
    relatedWords: ['misinformation', 'manipulate', 'credibility'],
    tags: ['information'],
    themeNote: 'The passage\'s account of political and social influence: bias can work entirely through selective repetition, without ever stating a single falsehood.',
    collocations: ['a form of bias', 'a source of bias', 'without bias', 'this kind of bias', 'bias in reporting'],
  },

  // ── Peace and War — Foundation ──────────────────────────────────────────────
  // Rebuilt 2026-08-20 against docs/THEME_06_MANUSCRIPT.md. pw-f-07 "history"
  // is preserved unchanged below (Theme 9 still depends on this exact id/word)
  // but is no longer part of Theme 6's own themeVocabSets entry — see the
  // manuscript's Foundation Vocabulary section for the full cross-theme note.

  {
    id: 'pw-f-01',
    word: 'trust',
    japanese: '信頼',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A feeling of confidence that someone is honest, reliable, or safe to depend on.',
    examples: [
      'People who have lost trust in one another may find it difficult to live together again.',
      'Rebuilding trust between two sides can take much longer than signing a treaty.',
    ],
    relatedWords: ['treaty', 'legacy', 'cooperation'],
    tags: ['society', 'core'],
    themeNote: 'This theme applies Theme 4\'s trust (lt-f-02) to a new, harder situation: trust between former enemies, not only within a community. Introduced here in its noun form, since the reading centers on trust as something that can be lost and slowly rebuilt.',
    collocations: ['lose trust', 'rebuild trust', 'trust in one another', 'a lack of trust', 'trust between'],
  },

  {
    id: 'pw-f-02',
    word: 'ceasefire',
    japanese: '停戦',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'An agreement to stop fighting, often temporary, before a longer-term peace is reached.',
    examples: [
      'A ceasefire may stop the violence for a period of time, but it does not end the war by itself.',
      'The two sides agreed to a ceasefire while they continued to negotiate.',
    ],
    relatedWords: ['negotiation', 'treaty', 'trust'],
    tags: ['society'],
    themeNote: 'A ceasefire is the first, most fragile step toward ending a war — this theme treats it as necessary but not sufficient, distinct from a treaty or from peace itself.',
    collocations: ['a ceasefire agreement', 'agree to a ceasefire', 'break a ceasefire', 'during the ceasefire', 'call for a ceasefire'],
  },

  {
    id: 'pw-f-03',
    word: 'victim',
    japanese: '犠牲者',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A person who is harmed or suffers because of an event, such as a war.',
    examples: [
      'Some become victims of violence, while others leave their homes and become refugees.',
      'War creates victims among civilians as well as soldiers.',
    ],
    relatedWords: ['civilian', 'refugee', 'ceasefire'],
    tags: ['society'],
    themeNote: 'This word widens the idea of war beyond soldiers — ordinary people who never fought can still be deeply harmed by it.',
    collocations: ['a victim of violence', 'become a victim', 'many victims', 'innocent victims', 'among the victims'],
  },

  {
    id: 'pw-f-04',
    word: 'refugee',
    japanese: '難民',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A person forced to leave their home, often because of war or danger, in search of safety.',
    examples: [
      'Others leave their homes and become refugees in search of safety.',
      'Refugees may be unable, or unwilling, to return home even after a war ends.',
    ],
    relatedWords: ['civilian', 'victim', 'ceasefire'],
    tags: ['society'],
    themeNote: 'The reading connects this word directly to loss — becoming a refugee means leaving nearly everything behind in search of safety.',
    collocations: ['become a refugee', 'a refugee family', 'refugees return', 'as a refugee', 'search for safety'],
  },

  {
    id: 'pw-f-05',
    word: 'civilian',
    japanese: '民間人',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A person who is not a member of the armed forces.',
    examples: [
      'During a war, soldiers take part in the fighting, but civilians are also deeply affected.',
      'Civilians may lose their homes or family members even though they never fought.',
    ],
    relatedWords: ['victim', 'refugee', 'negotiation'],
    tags: ['society'],
    themeNote: 'This word draws a clear line between soldiers and everyone else affected by a war — the majority of the people this theme is actually about.',
    collocations: ['civilians are affected', 'as a civilian', 'civilian population', 'ordinary civilians', 'affect civilians'],
  },

  {
    id: 'pw-f-06',
    word: 'treaty',
    japanese: '条約',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A formal, written agreement between countries or groups, often to end a conflict.',
    examples: [
      'Negotiation can lead to an agreement or a treaty.',
      'A treaty can settle political questions, but it cannot automatically rebuild trust.',
    ],
    relatedWords: ['negotiation', 'ceasefire', 'trust'],
    tags: ['society'],
    themeNote: 'A treaty is the formal, legal end of a war — this theme is careful to show that it is a real and important step, but not the same thing as peace itself.',
    collocations: ['sign a treaty', 'a peace treaty', 'under the treaty', 'negotiate a treaty', 'settle by treaty'],
  },

  {
    id: 'pw-f-07',
    word: 'history',
    japanese: '歴史',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'The events of the past, especially ones that are remembered and studied.',
    examples: [
      'Every family carries some piece of history worth knowing.',
      'Understanding history means understanding not just what happened, but why it still matters.',
    ],
    relatedWords: ['legacy'],
    tags: ['society', 'core'],
    themeNote: 'Orphaned as of the 2026 Theme 9 rebuild: previously reserved exclusively for Theme 9 (Learning from History), but Theme 9\'s approved final vocabulary list deliberately does not include "history" as a target word. Not part of Peace and War\'s active vocabulary either (no longer part of Theme 6\'s active vocabulary — the current Peace and War reading does not use this word). Currently unused by any theme; left in place rather than deleted, pending a decision on whether to delete, repurpose, or reassign it.',
    collocations: ['family history', 'a piece of history', 'part of history', 'learn history', 'know the history'],
  },

  {
    id: 'pw-f-08',
    word: 'legacy',
    japanese: '遺産・後世に残る影響',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'Something meaningful, often difficult, passed down from the past that still matters in the present.',
    examples: [
      'The legacy of a war may remain for many years, but people and communities can gradually rebuild their lives.',
      'These effects can become part of the legacy passed from one generation to another.',
    ],
    relatedWords: ['rebuild', 'trust', 'consequence'],
    tags: ['society', 'core'],
    themeNote: 'This word carries across from Foundation to Advanced almost unchanged, but Advanced adds a new idea to it: a legacy is not only remembered, it can be inherited by a generation that never experienced the war itself. Previously also reinforced in Theme 9 (learning-from-history); Theme 9\'s 2026 rebuild moved to different vocabulary (generation, inherit, knowledge, etc.) and no longer uses this word, so it now belongs to Peace and War only.',
    collocations: ['the legacy of', 'a lasting legacy', 'pass down a legacy', 'part of the legacy', 'leave a legacy'],
  },

  {
    id: 'pw-f-09',
    word: 'negotiation',
    japanese: '交渉',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A formal discussion between people or groups trying to reach an agreement.',
    examples: [
      'Negotiation can lead to an agreement or a treaty.',
      'Negotiation is not simply a matter of deciding who is right and who is wrong.',
    ],
    relatedWords: ['treaty', 'ceasefire', 'compromise'],
    tags: ['society', 'core'],
    themeNote: 'Negotiation is the process that connects a ceasefire to a treaty — this theme returns to it directly in Advanced, where it turns out to be far harder than simply agreeing to stop fighting.',
    collocations: ['begin negotiation', 'through negotiation', 'a round of negotiation', 'negotiation between', 'lead to negotiation'],
  },

  {
    id: 'pw-f-10',
    word: 'cooperation',
    japanese: '協力',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'Working together with others toward a shared goal, especially to solve a problem.',
    examples: [
      'A peaceful society needs safety, cooperation, and ways to solve disagreements without violence.',
      'Without cooperation between former enemies, a treaty is only words on paper.',
    ],
    relatedWords: ['negotiation', 'trust', 'legacy'],
    tags: ['society'],
    themeNote: 'Related to Theme 4\'s cooperate (working together within a community) — here the same idea is applied at a much larger, harder scale: cooperation between groups who were recently fighting each other.',
    collocations: ['need cooperation', 'international cooperation', 'through cooperation', 'a spirit of cooperation', 'cooperation between'],
  },

  {
    id: 'pw-f-11',
    word: 'rebuild',
    japanese: '再建する・立て直す',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'To build something again after it has been damaged or destroyed.',
    examples: [
      'Homes and communities may need to be rebuilt, and people who have lost trust in one another may find it difficult to live together again.',
      'People and communities can gradually rebuild their lives.',
    ],
    relatedWords: ['legacy', 'trust', 'cooperation'],
    tags: ['action', 'society'],
    themeNote: 'This theme uses "rebuild" for more than buildings — homes, communities, and trust itself all need to be rebuilt after a war, on very different timelines.',
    collocations: ['rebuild trust', 'rebuild communities', 'rebuild their lives', 'need to be rebuilt', 'slowly rebuild'],
  },

  // ── Peace and War — Advanced ─────────────────────────────────────────────────
  // New for this theme — conflict/perspective are deliberate spiral
  // reinforcement of Theme 4's lt-s-05/lt-s-04 (see manuscript). distrust is
  // the negative form of pw-f-01/lt-f-02 trust, kept deliberately distinct
  // per the manuscript's own reasoning, not replaced with trust itself.

  {
    id: 'pw-s-01',
    word: 'conflict',
    japanese: '対立・紛争',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'A serious disagreement or struggle, especially between groups with different interests or beliefs.',
    examples: [
      'It cannot immediately remove the reasons people fought or the distrust that developed during the conflict.',
      'The two sides may understand the same conflict very differently.',
    ],
    relatedWords: ['perspective', 'distrust', 'reconciliation'],
    tags: ['society', 'connection'],
    themeNote: 'Reinforces Theme 4\'s conflict (lt-s-05), which treated conflict as a normal part of community life. Here the same word is examined at its most serious and consequential scale — armed conflict between groups — where the same reasoning (differing perspectives, the difficulty of feeling fully resolved) still applies.',
    collocations: ['during the conflict', 'the same conflict', 'experienced conflict', 'a serious conflict', 'sides in a conflict'],
  },

  {
    id: 'pw-s-02',
    word: 'perspective',
    japanese: '視点・見方',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'A particular way of understanding a situation, shaped by a person\'s own experience and position.',
    examples: [
      'It often requires both sides to understand another perspective.',
      'People on each side may remember the same war from a very different perspective.',
    ],
    relatedWords: ['conflict', 'injustice', 'reconciliation'],
    tags: ['connection'],
    themeNote: 'Reinforces Theme 4\'s perspective (lt-s-04), which was about understanding a friend or classmate\'s different point of view. Here the same skill is applied to something far harder: understanding how a former enemy remembers the same war differently, without deciding that all versions of events are equally true.',
    collocations: ['understand a perspective', 'a different perspective', 'from another perspective', "each side's perspective", 'a shared perspective'],
  },

  {
    id: 'pw-s-03',
    word: 'injustice',
    japanese: '不正・不公正',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'Unfair treatment or a situation that is not right, especially one that causes lasting harm or resentment.',
    examples: [
      'People may also remember different events, losses, and injustices.',
      'A sense of injustice can outlast the war itself, long after the fighting has stopped.',
    ],
    relatedWords: ['distrust', 'conflict', 'consequence'],
    tags: ['society'],
    themeNote: 'This word explains part of why conflicts are remembered so differently by each side — what one side experienced as necessary, the other may remember as injustice.',
    collocations: ['a sense of injustice', 'past injustice', 'remember an injustice', 'suffer injustice', 'address an injustice'],
  },

  {
    id: 'pw-s-04',
    word: 'consequence',
    japanese: '結果・影響',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'A result or effect of an action or event, especially one that continues to matter afterward.',
    examples: [
      'These consequences can become part of the legacy passed from one generation to another.',
      'A war has consequences that continue long after the fighting ends.',
    ],
    relatedWords: ['legacy', 'injustice', 'distrust'],
    tags: ['society'],
    themeNote: 'Connects the passage\'s concrete details (lost homes, divided communities, painful memories) to its bigger idea — these are not separate problems, they are consequences that add up to become a legacy.',
    collocations: ['as a consequence', 'the consequences of', 'lasting consequences', 'suffer the consequences', 'face the consequences'],
  },

  {
    id: 'pw-s-05',
    word: 'diplomacy',
    japanese: '外交',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'The broader process of managing relationships between groups or countries, especially through negotiation and communication rather than force.',
    examples: [
      'Diplomacy is the broader process through which negotiation, compromise, and agreements between former enemies can gradually take place.',
      'Diplomacy does not end when a treaty is signed — it often continues for years afterward.',
    ],
    relatedWords: ['negotiation', 'compromise', 'reconciliation'],
    tags: ['society', 'core'],
    themeNote: 'This is the umbrella idea for the whole Advanced reading: negotiation, compromise, and reconciliation are not separate skills, but parts of the single larger process of diplomacy.',
    collocations: ['through diplomacy', 'a diplomacy effort', 'diplomacy between', 'the process of diplomacy', 'quiet diplomacy'],
  },

  {
    id: 'pw-s-06',
    word: 'compromise',
    japanese: '妥協・歩み寄り',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'An agreement reached when each side accepts less than everything it originally wanted.',
    examples: [
      'Lasting peace therefore often requires compromise and reconciliation as well as an end to violence.',
      'No agreement will give everyone everything they want, so compromise becomes necessary.',
    ],
    relatedWords: ['negotiation', 'reconciliation', 'diplomacy'],
    tags: ['society'],
    themeNote: 'The passage links compromise directly to its earlier point that no agreement satisfies everyone completely — compromise is what makes an imperfect agreement possible at all.',
    collocations: ['reach a compromise', 'require compromise', 'willing to compromise', 'a difficult compromise', 'compromise on'],
  },

  {
    id: 'pw-s-07',
    word: 'reconciliation',
    japanese: '和解・関係修復',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'The process of rebuilding a relationship between people or groups who were once in conflict, without pretending the conflict never happened.',
    examples: [
      'Reconciliation means finding a way for people who have experienced conflict to live together despite everything that came before.',
      'Reconciliation does not mean forgetting what happened.',
    ],
    relatedWords: ['compromise', 'trust', 'diplomacy'],
    tags: ['society', 'core'],
    themeNote: 'The most fully explained word in this theme — the passage gives it its own explicit definition, since it captures the reading\'s central point that ending violence and truly repairing a relationship are different achievements.',
    collocations: ['work toward reconciliation', 'a process of reconciliation', 'reconciliation between', 'true reconciliation', 'reconciliation efforts'],
  },

  {
    id: 'pw-s-08',
    word: 'distrust',
    japanese: '不信',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'A lack of confidence that someone is honest or reliable, especially built up over time.',
    examples: [
      'A ceasefire can stop violence, but it cannot immediately remove the distrust that developed during the conflict.',
      'Distrust, fear, anger, displacement, and divided communities may remain even after a treaty is signed.',
    ],
    relatedWords: ['conflict', 'trust', 'reconciliation'],
    tags: ['connection'],
    themeNote: 'This is deliberately the negative form of Theme 4\'s trust (lt-f-02, reinforced in this same theme as pw-f-01), not a new, unrelated word — the Advanced reading\'s central point is that fighting can stop while distrust remains exactly where trust used to be.',
    collocations: ['remove distrust', 'deep distrust', 'distrust between', 'a legacy of distrust', 'overcome distrust'],
  },

  {
    id: 'pw-s-09',
    word: 'lasting',
    japanese: '長続きする・永続的な',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'Continuing to exist for a long time, especially in a way that is stable and dependable.',
    examples: [
      'In reality, ending a war and building lasting peace are two different things.',
      'Lasting peace depends on whether former enemies can gradually replace violence with negotiation.',
    ],
    relatedWords: ['guarantee', 'reconciliation', 'consequence'],
    tags: ['core'],
    themeNote: 'A simple word doing the heaviest thesis-level work in the whole passage — the entire Advanced reading is really an explanation of the single word "lasting" in "lasting peace."',
    collocations: ['lasting peace', 'a lasting effect', 'lasting change', 'build something lasting', 'have a lasting impact'],
  },

  {
    id: 'pw-s-10',
    word: 'guarantee',
    japanese: '保証する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['peace-and-war'],
    coreMeaning: 'To promise with certainty that something will happen or be true.',
    examples: [
      'Neither can guarantee what happens afterward.',
      'No treaty can guarantee that two sides will trust each other again.',
    ],
    relatedWords: ['lasting', 'consequence', 'reconciliation'],
    tags: ['core'],
    themeNote: 'The passage\'s final, important limitation: a ceasefire and a treaty are real achievements, but neither can guarantee what happens next — that uncertainty is exactly why peace has to be treated as an ongoing process.',
    collocations: ['cannot guarantee', 'guarantee peace', 'guarantee that', 'no guarantee', 'guarantee success'],
  },

  // ── Caring for Our Planet — Foundation ──────────────────────────────────────
  // Rebuilt 2026-08-20 against docs/THEME_07_MANUSCRIPT.md. species is
  // replaced by damage (id repurposed, no cross-theme dependency); extreme
  // is replaced by adjust — both working-list words were absent from the
  // approved passage, see the manuscript's Foundation Vocabulary section.

  {
    id: 'cp-f-01',
    word: 'environment',
    japanese: '環境',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'The natural world — land, water, air, plants, and animals — around us.',
    examples: [
      'Environmental problems affect people and nature around the world.',
      'People depend on the environment for food, water, energy, and other natural resources.',
    ],
    relatedWords: ['ecosystem', 'pollution', 'climate'],
    tags: ['nature', 'core'],
    themeNote: 'This theme treats the environment as a connected global system, not a single local place — every part can affect every other part.',
    collocations: ['protect the environment', 'affect the environment', 'depend on the environment', 'the local environment', 'harm the environment'],
  },

  {
    id: 'cp-f-02',
    word: 'damage',
    japanese: '損なう・害する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'To harm something so that it no longer works or exists in the same way.',
    examples: [
      'This pollution can damage habitats and affect the plants, animals, and people that depend on them.',
      'Chemicals and waste can damage rivers and oceans.',
    ],
    relatedWords: ['pollution', 'habitat', 'ecosystem'],
    tags: ['nature', 'action'],
    themeNote: 'This word names the actual mechanism of harm running through the whole passage — pollution doesn\'t just exist, it damages specific things that living creatures depend on.',
    collocations: ['can damage', 'damage habitats', 'seriously damage', 'damage caused by', 'damage to the environment'],
  },

  {
    id: 'cp-f-03',
    word: 'ecosystem',
    japanese: '生態系',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'All the living things in a place, together with how they depend on and connect to each other.',
    examples: [
      'Pollution, climate change, and damage to ecosystems may seem like separate problems, but they are often connected.',
      'Understanding how pollution, climate, ecosystems, and human life are connected is an important first step toward protecting our planet.',
    ],
    relatedWords: ['species', 'environment', 'climate'],
    tags: ['nature', 'core'],
    themeNote: 'The passage treats ecosystems as one part of a larger connected system, not an isolated topic — damage to an ecosystem is never fully separate from climate or pollution.',
    collocations: ['damage to ecosystems', 'a local ecosystem', 'part of the ecosystem', 'affect the ecosystem', 'a healthy ecosystem'],
  },

  {
    id: 'cp-f-04',
    word: 'climate',
    japanese: '気候',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'The general weather conditions of a place over a long period of time.',
    examples: [
      "Earth's climate has always changed.",
      "This is one reason why today's climate change is a serious global problem.",
    ],
    relatedWords: ['environment', 'ecosystem', 'pollution'],
    tags: ['nature', 'core'],
    themeNote: 'The passage makes a careful distinction: climate has always changed naturally, but the speed of today\'s change is what makes it a serious problem — not the mere fact of change.',
    collocations: ['climate change', "Earth's climate", 'the climate changes', 'a warmer climate', 'affect the climate'],
  },

  {
    id: 'cp-f-05',
    word: 'pollution',
    japanese: '汚染',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Harmful substances or waste that damage the natural environment.',
    examples: [
      'Pollution comes from many sources.',
      'Cars and factories pollute the air, while chemicals, waste, and plastic can enter rivers and oceans.',
    ],
    relatedWords: ['environment', 'ecosystem', 'resource'],
    tags: ['nature', 'core'],
    themeNote: 'The passage traces pollution to its actual sources (cars, factories, chemicals, waste) rather than treating it as a vague, abstract problem.',
    collocations: ['pollution from', 'cause pollution', 'air pollution', 'reduce pollution', 'sources of pollution'],
  },

  {
    id: 'cp-f-06',
    word: 'resource',
    japanese: '資源',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'A natural material, like water or land, that people use in daily life.',
    examples: [
      'People depend on the environment for food, water, energy, and other natural resources.',
      'Countries can agree to... protect natural resources.',
    ],
    relatedWords: ['environment', 'pollution', 'ecosystem'],
    tags: ['nature', 'core'],
    themeNote: 'This word connects the environment directly to human survival — food, water, and energy are not separate from nature, they come from it.',
    collocations: ['natural resources', 'use resources', 'depend on resources', 'protect resources', 'limited resources'],
  },

  {
    id: 'cp-f-07',
    word: 'atmosphere',
    japanese: '大気',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: "The layer of gases surrounding the Earth.",
    examples: [
      'Burning coal, oil, and gas releases greenhouse gases into the atmosphere.',
      'Gases released into the atmosphere can stay there for a very long time.',
    ],
    relatedWords: ['greenhouse gas', 'climate', 'pollution'],
    tags: ['nature', 'core'],
    themeNote: 'The atmosphere is where a local action (burning fuel in one place) becomes a global effect — the physical link between pollution and climate change.',
    collocations: ['into the atmosphere', 'release into the atmosphere', "Earth's atmosphere", 'gases in the atmosphere', 'affect the atmosphere'],
  },

  {
    id: 'cp-f-08',
    word: 'greenhouse gas',
    japanese: '温室効果ガス',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: "A gas, such as carbon dioxide, that traps heat in the Earth's atmosphere and causes warming.",
    examples: [
      'Burning coal, oil, and gas releases greenhouse gases into the atmosphere.',
      'Countries can agree to reduce emissions of greenhouse gases.',
    ],
    relatedWords: ['atmosphere', 'climate', 'emissions'],
    tags: ['nature', 'core'],
    themeNote: "This is the specific mechanism behind the passage's central climate claim — greenhouse gases are the direct link between burning fuel and a warming planet.",
    collocations: ['release greenhouse gases', 'greenhouse gas emissions', 'reduce greenhouse gases', 'greenhouse gases trap heat', 'produce greenhouse gases'],
  },

  {
    id: 'cp-f-09',
    word: 'habitat',
    japanese: '生息地',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'The natural home or environment of a plant or animal.',
    examples: [
      'This pollution can damage habitats and affect the plants, animals, and people that depend on them.',
      'Protecting a habitat means protecting everything that lives there.',
    ],
    relatedWords: ['ecosystem', 'species', 'damage'],
    tags: ['nature'],
    themeNote: "Habitat is where the abstract idea of \"damage to an ecosystem\" becomes concrete — a specific place that specific living things actually depend on.",
    collocations: ['damage habitats', 'a natural habitat', 'protect habitats', 'lose a habitat', 'habitats for wildlife'],
  },

  {
    id: 'cp-f-10',
    word: 'adjust',
    japanese: '適応する・調整する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'To change gradually in response to new conditions.',
    examples: [
      'When the climate changes quickly, plants, animals, and people have less time to adjust.',
      'Slower change gives living things more time to adjust.',
    ],
    relatedWords: ['climate', 'habitat', 'damage'],
    tags: ['core'],
    themeNote: "This is the single word the passage's central argument depends on — the problem isn't that climate changes, it's that fast change leaves less time to adjust. A simple word carrying real thesis-level weight, similar to how \"lasting\" worked in Theme 6.",
    collocations: ['time to adjust', 'adjust to change', 'adjust quickly', 'struggle to adjust', 'unable to adjust'],
  },

  // ── Caring for Our Planet — Advanced ─────────────────────────────────────────
  // New for this theme. responsibility/priority are deliberate spiral
  // reinforcement of Theme 2's us-f-05/us-s-06 (see manuscript). conflict
  // and guarantee appear naturally in the reading but are deliberately NOT
  // target words here — both are already taught elsewhere (lt-s-05/pw-s-01,
  // pw-s-10) and reusing them again was judged unnecessary duplication.

  {
    id: 'cp-s-01',
    word: 'contribute',
    japanese: '貢献する・一因となる',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'To be one of the causes of something, or to give something as your share.',
    examples: [
      "Countries have not contributed equally to today's environmental problems.",
      'Countries that contributed more to the problem should take more responsibility for solving it.',
    ],
    relatedWords: ['responsibility', 'fairness', 'wealthy'],
    tags: ['society', 'core'],
    themeNote: "This word carries the passage's whole historical-fairness argument — the debate isn't about who is affected, it's about who contributed how much.",
    collocations: ['contribute to the problem', 'contributed equally', 'contribute more', 'countries that contributed', 'contribute less'],
  },

  {
    id: 'cp-s-02',
    word: 'wealthy',
    japanese: '裕福な・豊かな',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Having a large amount of money or resources.',
    examples: [
      'Many wealthy countries used large amounts of coal, oil, and other natural resources while developing their economies.',
      'Wealthy and developing countries often disagree about how quickly to act.',
    ],
    relatedWords: ['developing countries', 'contribute', 'responsibility'],
    tags: ['society'],
    themeNote: "The passage's key structural contrast word, always paired against \"developing countries\" — not a judgment, just an economic description used to frame the fairness question.",
    collocations: ['wealthy countries', 'wealthy nations', 'a wealthy country', 'wealthy and developing', 'wealthy economies'],
  },

  {
    id: 'cp-s-03',
    word: 'developing countries',
    japanese: '発展途上国（経済や社会が発展の過程にあり、高い経済成長を続けている国も多い）',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Countries whose economies and societies are in the process of developing, many of which are experiencing significant economic growth.',
    examples: [
      "Developing countries need energy, transportation, factories, and jobs to improve people's lives.",
      'Other countries developed later and have contributed less in the past.',
    ],
    relatedWords: ['wealthy', 'contribute', 'priority'],
    tags: ['society', 'core'],
    themeNote: "Important distinction: this term does not mean poor, backward, or inferior — it describes countries whose economies are actively growing, often quickly. The passage's whole tension depends on taking their growth needs seriously, not dismissing them.",
    collocations: ['developing countries need', 'many developing countries', 'developing economies', 'as developing countries', 'developing countries argue'],
  },

  {
    id: 'cp-s-04',
    word: 'fossil fuel',
    japanese: '化石燃料',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Fuel, such as coal, oil, or gas, formed underground from the remains of ancient plants and animals.',
    examples: [
      'Asking them to greatly reduce their use of fossil fuels may slow their economic growth.',
      'If every country continues to increase its use of fossil fuels, global warming will become more serious.',
    ],
    relatedWords: ['emissions', 'atmosphere', 'greenhouse gas'],
    tags: ['nature', 'core'],
    themeNote: 'This is the concrete technology at the center of the whole Advanced argument — the tension between economic growth and climate change is really a tension about fossil fuels specifically.',
    collocations: ['use of fossil fuels', 'burn fossil fuels', 'reduce fossil fuels', 'fossil fuel use', 'rely on fossil fuels'],
  },

  {
    id: 'cp-s-05',
    word: 'emissions',
    japanese: '排出（物）',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Substances, especially gases, that are released into the air, often as a result of burning fuel.',
    examples: [
      'Countries can agree to reduce emissions, develop cleaner energy, protect natural resources.',
      'Reducing emissions is one part of any international agreement.',
    ],
    relatedWords: ['fossil fuel', 'atmosphere', 'greenhouse gas'],
    tags: ['nature', 'core'],
    themeNote: 'The standard real-world term for what international agreements actually try to control — worth knowing beyond this passage, in any discussion of climate policy.',
    collocations: ['reduce emissions', 'emissions from', 'cut emissions', 'greenhouse gas emissions', 'lower emissions'],
  },

  {
    id: 'cp-s-06',
    word: 'fairness',
    japanese: '公平性',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'The quality of treating people or groups equally and reasonably, especially when interests conflict.',
    examples: [
      'This raises a difficult question of fairness: should every country be expected to do the same amount?',
      'Finding a solution therefore requires... difficult decisions about what is fair.',
    ],
    relatedWords: ['responsibility', 'ethical', 'contribute'],
    tags: ['society', 'core'],
    themeNote: "The word the passage's whole argument is really about — from the first mention in paragraph 2 to the final sentence, fairness is the thread connecting historical responsibility, economic development, and the passage's concluding claim that this isn't only a scientific question.",
    collocations: ['a question of fairness', 'decisions about fairness', 'what is fair', 'issues of fairness', 'fairness between countries'],
  },

  {
    id: 'cp-s-07',
    word: 'responsibility',
    japanese: '責任',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'A duty to deal with or take care of something, especially because you had a role in causing it.',
    examples: [
      'Countries that contributed more to the problem should take more responsibility for solving it.',
      'Science... cannot decide how responsibility and costs should be shared among countries.',
    ],
    relatedWords: ['contribute', 'fairness', 'priority'],
    tags: ['society', 'core'],
    themeNote: "Reinforces Theme 2's responsibility (us-f-05), which was about personal responsibility for your own coursework and independence. Here the same word is scaled up to something far larger and less personal: which countries bear how much responsibility for a shared global problem.",
    collocations: ['take responsibility', 'more responsibility', 'share responsibility', 'responsibility for', 'a sense of responsibility'],
  },

  {
    id: 'cp-s-08',
    word: 'priority',
    japanese: '優先事項',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Something considered more important than other things, especially when choices must be made.',
    examples: [
      'Environmental protection and economic development can therefore come into conflict, and different countries may have different priorities.',
      'Different countries may have different priorities depending on their own needs.',
    ],
    relatedWords: ['responsibility', 'fairness', 'developing countries'],
    tags: ['society'],
    themeNote: "Reinforces Theme 2's priority (us-s-06), which was about a student's own personal time-management choices. Here the same word describes something much larger: what a whole country chooses to value most when environmental and economic goals compete.",
    collocations: ['different priorities', 'a priority for', 'competing priorities', 'national priorities', 'set priorities'],
  },

  {
    id: 'cp-s-09',
    word: 'ethical',
    japanese: '倫理的な',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'Relating to what is morally right or wrong, especially in a situation without one clear correct answer.',
    examples: [
      'These are also economic, political, and ethical questions.',
      'Deciding what is fair is an ethical question, not only a scientific one.',
    ],
    relatedWords: ['fairness', 'responsibility', 'border'],
    tags: ['core'],
    themeNote: "The pivotal word in the passage's conclusion — the single term that names what science specifically cannot supply: a decision about what is right, not just what is true.",
    collocations: ['an ethical question', 'ethical issues', 'ethical and political', 'ethical decisions', 'from an ethical perspective'],
  },

  {
    id: 'cp-s-10',
    word: 'border',
    japanese: '国境',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'The line that divides one country from another.',
    examples: [
      'Environmental problems do not stop at national borders.',
      'Air and water pollution can move from one country to another.',
    ],
    relatedWords: ['wealthy', 'contribute', 'fairness'],
    tags: ['society'],
    themeNote: 'The very first idea in the passage, and the reason everything that follows is hard — if pollution respected borders, this would only be a scientific problem, not also a political and ethical one.',
    collocations: ['national borders', 'cross borders', 'stop at borders', 'beyond the border', 'move across borders'],
  },

  // ── Living with AI — Foundation ─────────────────────────────────────────────
  // Rebuilt 2026-08-27 against the revised, plainer approved Foundation
  // passage (docs/THEME_08_MANUSCRIPT.md). Only AI and respond carry over
  // from the previous version; the passage dropped "generative AI" and the
  // 1950s-research framing entirely, so generative/access/researcher/
  // decades/shift no longer occur naturally and are replaced below.
  // translation is corrected to translate (verb) to match actual usage
  // ("translate languages"). No id has any cross-theme dependency.

  {
    id: 'la-f-01',
    word: 'AI',
    japanese: 'AI・人工知能',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'Artificial intelligence — computer systems that can perform tasks that normally require human thinking.',
    examples: [
      'Artificial intelligence, or AI, did not begin with ChatGPT.',
      'AI became something that more people could use in their daily activities, rather than something that mainly worked behind other technology.',
    ],
    relatedWords: ['chatbot', 'data', 'respond'],
    tags: ['technology', 'core'],
    themeNote: 'This theme is careful to separate two ideas: AI itself, which existed for years working quietly behind technology, and the moment ordinary people began communicating with it directly.',
    collocations: ['use AI', 'ask AI', 'AI tool', 'communicate with AI', 'AI can help'],
  },

  {
    id: 'la-f-02',
    word: 'chatbot',
    japanese: 'チャットボット（会話形式で応答するAIプログラム）',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'A computer program that can have a conversation with a person by responding to what they type.',
    examples: [
      "It was a chatbot that could use what it had learned from a huge amount of data to respond to people's questions and produce new content.",
      'Millions of ordinary people began communicating directly with this kind of AI simply by typing what they wanted to know or do.',
    ],
    relatedWords: ['AI', 'data', 'respond'],
    tags: ['technology', 'core'],
    themeNote: "This is the concrete, ordinary word the passage uses for ChatGPT, deliberately instead of technical terms like \"generative AI\" — a chatbot is something students can picture directly.",
    collocations: ['a chatbot', 'talk to a chatbot', 'use a chatbot', 'this kind of chatbot', 'an AI chatbot'],
  },

  {
    id: 'la-f-03',
    word: 'data',
    japanese: 'データ・情報',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'Facts or information, especially in a form that can be stored, studied, or used by a computer.',
    examples: [
      "It was a chatbot that could use what it had learned from a huge amount of data to respond to people's questions and produce new content.",
      'AI systems like this learn from huge amounts of data before they can respond well.',
    ],
    relatedWords: ['chatbot', 'AI', 'respond'],
    tags: ['technology', 'core'],
    themeNote: "This word explains, in the simplest possible way, how a chatbot \"knows\" things — not by thinking like a person, but by learning patterns from a huge amount of data.",
    collocations: ['a huge amount of data', 'learn from data', 'use data', 'based on data', 'data and information'],
  },

  {
    id: 'la-f-04',
    word: 'translate',
    japanese: '翻訳する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'To change words from one language into another.',
    examples: [
      'People can ask AI to... translate languages, find and organize information, create images, or help solve problems.',
      'AI can translate a sentence in seconds.',
    ],
    relatedWords: ['organize', 'analyze', 'AI'],
    tags: ['technology'],
    themeNote: 'One concrete example, among several, of a practical task people began asking AI to do directly once ChatGPT made this kind of interaction widely accessible.',
    collocations: ['translate languages', 'translate a text', 'ask AI to translate', 'automatically translate', 'translate into'],
  },

  {
    id: 'la-f-05',
    word: 'organize',
    japanese: '整理する・まとめる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'To arrange things in a clear, useful order.',
    examples: [
      'People can ask AI to... find and organize information...',
      'AI can help organize notes, schedules, or ideas into something clearer.',
    ],
    relatedWords: ['translate', 'analyze', 'AI'],
    tags: ['technology'],
    themeNote: "One of several everyday intellectual tasks the passage lists — organizing information is a small, concrete example of AI's new practical usefulness in daily life.",
    collocations: ['organize information', 'help organize', 'organize notes', 'organize ideas', 'find and organize'],
  },

  {
    id: 'la-f-06',
    word: 'respond',
    japanese: '応答する・返答する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'To answer or react to something, especially a question.',
    examples: [
      "It was a chatbot that could use what it had learned from a huge amount of data to respond to people's questions and produce new content.",
      'Ordinary people could type what they wanted, and the chatbot would respond directly.',
    ],
    relatedWords: ['chatbot', 'AI', 'data'],
    tags: ['technology', 'core'],
    themeNote: 'This is the core action the passage describes — a person types a question, and the AI responds directly, without anyone else involved.',
    collocations: ['respond to', 'AI responds', 'respond quickly', 'a direct response', 'respond to a question'],
  },

  {
    id: 'la-f-07',
    word: 'analyze',
    japanese: '分析する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'To study something carefully in order to understand it.',
    examples: [
      'At work, AI can also help people analyze information, prepare documents, and develop ideas.',
      'Before AI could help analyze large amounts of information, this kind of task usually took people much longer.',
    ],
    relatedWords: ['organize', 'data', 'AI'],
    tags: ['technology'],
    themeNote: 'This word names one of the more advanced everyday uses the passage describes — not just answering simple questions, but helping people work through information at work.',
    collocations: ['analyze information', 'help analyze', 'carefully analyze', 'analyze data', 'analyze and organize'],
  },

  {
    id: 'la-f-08',
    word: 'involved',
    japanese: '関わっている・関与している',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'Taking part in or connected to something, especially an activity or situation.',
    examples: [
      'Since then, AI has become much more involved in everyday life.',
      'AI is now involved in many different parts of daily life, from schoolwork to workplaces.',
    ],
    relatedWords: ['AI', 'organization', 'spread'],
    tags: ['technology', 'core'],
    themeNote: "This is the passage's own summary word for its central claim — AI didn't just become more powerful, it became more involved in ordinary daily activities.",
    collocations: ['involved in', 'become involved', 'AI is involved', 'more involved in', 'deeply involved'],
  },

  {
    id: 'la-f-09',
    word: 'organization',
    japanese: '組織・団体',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'A group of people who work together for a particular purpose, such as a company, school, or workplace.',
    examples: [
      'The rapid spread of AI also changed how organizations used technology.',
      'Companies began adding AI to their products and services, and schools and workplaces began finding ways to use it.',
    ],
    relatedWords: ['spread', 'AI', 'involved'],
    tags: ['technology'],
    themeNote: 'The passage moves from individual people using AI directly to organizations — companies, schools, workplaces — building AI into how they already worked.',
    collocations: ['an organization', 'organizations used', 'a large organization', 'within an organization', 'organizations and companies'],
  },

  {
    id: 'la-f-10',
    word: 'spread',
    japanese: '広がり・普及',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'The way something becomes used by, or known to, more and more people over time.',
    examples: [
      'The rapid spread of AI also changed how organizations used technology.',
      'In only a few years, the relationship between people and AI changed greatly.',
    ],
    relatedWords: ['involved', 'organization', 'AI'],
    tags: ['technology', 'core'],
    themeNote: "This word names the passage's own topic sentence for its final paragraph — not just that AI changed, but that its use spread quickly across companies, schools, and workplaces.",
    collocations: ['the spread of', 'rapid spread', 'spread quickly', 'widespread use', 'the spread of technology'],
  },

  // ── Living with AI — Advanced ────────────────────────────────────────────────
  // Rebuilt 2026-08-21 against the final, settled 4-paragraph Advanced
  // Reading (docs/THEME_08_MANUSCRIPT.md). Responsibility is deliberately
  // no longer part of this theme's vocabulary — the passage no longer
  // treats it as an organizing topic. concern (la-s-02) is kept in place;
  // predict is renamed to prediction (noun) to match actual usage. All
  // other ids are repurposed for new words; none had cross-theme
  // dependencies. division's Japanese gloss deliberately foregrounds 分担
  // (how work is shared out), not the general 分割.

  {
    id: 'la-s-01',
    word: 'boundary',
    japanese: '境界（人間の仕事と機械の仕事の境目）',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'The line or point that separates one thing from another, especially where two areas meet or overlap.',
    examples: [
      'Both point to the same underlying shift: the boundary between human work and machine work keeps moving.',
      'As that boundary moves, work, education, and the value of human skill may change with it.',
    ],
    relatedWords: ['division', 'underlying', 'range'],
    tags: ['core'],
    themeNote: "This is the single word carrying the passage's entire conclusion — not a specific prediction about which jobs disappear, but the more durable idea that the line between human and machine work keeps shifting.",
    collocations: ['the boundary between', 'a moving boundary', 'the boundary shifts', 'cross a boundary', 'boundary between human and machine'],
  },

  {
    id: 'la-s-02',
    word: 'concern',
    japanese: '懸念・心配',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'A feeling of worry about something, or the thing that causes that worry.',
    examples: [
      'A more serious concern, raised by some experts, is that future AI could become capable enough that people find it difficult to understand or control.',
      'This is a real concern, not an established fact.',
    ],
    relatedWords: ['established', 'capable', 'boundary'],
    tags: ['society', 'core'],
    themeNote: 'The passage is careful to name this a concern, not a prediction or a fact — a distinction it makes explicit rather than letting it blur.',
    collocations: ['a serious concern', 'raise a concern', 'a real concern', 'concern about', 'a growing concern'],
  },

  {
    id: 'la-s-03',
    word: 'division',
    japanese: '分担（仕事の分担）',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'The way that work, tasks, or responsibilities are shared or split between different people or things.',
    examples: [
      'A more important change, though, may be that the division of work between people and AI shifts.',
      'AI may take on more parts of a task while people focus on different parts.',
    ],
    relatedWords: ['boundary', 'prediction', 'range'],
    tags: ['society', 'core'],
    themeNote: 'In this passage, division specifically means how work is shared out between people and AI — 仕事の分担 — not a general split or separation. This is the central reframing word, replacing the simpler "AI replaces jobs" prediction.',
    collocations: ['the division of work', 'a shift in division', 'division between', 'division of labor', 'division of tasks'],
  },

  {
    id: 'la-s-04',
    word: 'range',
    japanese: '範囲',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'The full extent of different things included in a category, from one limit to another.',
    examples: [
      'It is becoming able to perform a wider range of tasks once thought to need human knowledge, judgment, or skill.',
      'This range now includes analysis, planning, some management, and even intellectual or creative work.',
    ],
    relatedWords: ['boundary', 'managerial', 'capable'],
    tags: ['core'],
    themeNote: "This word sets up the whole first paragraph's argument — the passage isn't just claiming AI does more, it's specifying that the range of what counts as AI-involved work is expanding.",
    collocations: ['a wide range of', 'a wider range', 'range of tasks', 'across a range of', 'the full range'],
  },

  {
    id: 'la-s-05',
    word: 'prediction',
    japanese: '予測',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'A statement about what will happen in the future, based on what is known now.',
    examples: [
      'One common prediction is that AI will replace many jobs.',
      'A more important change, though, may be that the division of work between people and AI shifts.',
    ],
    relatedWords: ['concern', 'boundary', 'established'],
    tags: ['core'],
    themeNote: 'The passage names a common prediction only to move past it — this word marks the exact turn from a simple, familiar prediction to a more careful one.',
    collocations: ['a common prediction', 'make a prediction', 'a simple prediction', 'a more careful prediction', 'based on a prediction'],
  },

  {
    id: 'la-s-06',
    word: 'managerial',
    japanese: '管理職の・経営に関わる',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'Relating to the work of managing people, projects, or an organization.',
    examples: [
      'New kinds of work may appear, including in professional and managerial roles.',
      'Even managerial work may increasingly involve working closely with AI.',
    ],
    relatedWords: ['range', 'capable', 'process'],
    tags: ['society'],
    themeNote: "A concrete example the passage uses to show that AI's expanding range of work is not limited to routine tasks — even roles built around human judgment and oversight may change.",
    collocations: ['managerial roles', 'managerial work', 'a managerial position', 'managerial tasks', 'professional and managerial'],
  },

  {
    id: 'la-s-07',
    word: 'capable',
    japanese: '能力がある・（〜する）ことができる',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'Having the ability or skill to do something.',
    examples: [
      'Future AI could become capable enough that people find it difficult to understand or control.',
      'As AI becomes capable of more kinds of work, the boundary between human and machine work may keep moving.',
    ],
    relatedWords: ['range', 'concern', 'boundary'],
    tags: ['core'],
    themeNote: "This word names the actual source of the passage's long-term concern — not what AI currently does, but what it might become capable of doing.",
    collocations: ['capable enough', 'capable of', 'increasingly capable', 'a capable system', 'more capable AI'],
  },

  {
    id: 'la-s-08',
    word: 'process',
    japanese: '（情報などを）処理する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'To deal with or handle information in an organized way, especially using a system or method.',
    examples: [
      'AI may make work faster and help people process more information, freeing them to focus on harder problems.',
      'As AI helps process larger amounts of information, people may have more time for harder problems.',
    ],
    relatedWords: ['range', 'capable', 'managerial'],
    tags: ['technology'],
    themeNote: "A genuine academic/workplace verb naming exactly what AI does with information in this sentence — distinct from simply \"using\" information, it implies working through and organizing it.",
    collocations: ['process information', 'help process', 'process data', 'quickly process', 'process and organize'],
  },

  {
    id: 'la-s-09',
    word: 'established',
    japanese: '確立された・立証された',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'Accepted as true or certain, especially because it has been proven or widely confirmed.',
    examples: [
      'This is a real concern, not an established fact.',
      'The passage treats this possibility as a genuine concern, not something already established.',
    ],
    relatedWords: ['concern', 'prediction', 'capable'],
    tags: ['core'],
    themeNote: 'This word carries the passage\'s most important distinction — between something people are seriously worried about and something that has actually been proven. Losing sight of this difference is exactly what turns careful concern into science fiction.',
    collocations: ['an established fact', 'not yet established', 'well established', 'established evidence', 'established as true'],
  },

  {
    id: 'la-s-10',
    word: 'underlying',
    japanese: '根底にある・根本的な',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['living-with-ai'],
    coreMeaning: 'Being the real, deeper cause or basis of something, even when it is not immediately obvious.',
    examples: [
      'Both point to the same underlying shift: the boundary between human work and machine work keeps moving.',
      'The underlying idea is that this boundary, not any single job, is what is actually changing.',
    ],
    relatedWords: ['boundary', 'division', 'established'],
    tags: ['core'],
    themeNote: "This is the word that performs the passage's final move — showing that two separate fears (losing a job, losing control) actually come from one deeper, shared cause.",
    collocations: ['an underlying idea', 'the underlying cause', 'an underlying shift', 'underlying reason', 'point to an underlying'],
  },

  // ── Learning from History — Foundation ──────────────────────────────────────
  // Fully rebuilt against the approved "The Present Is Built on the Past"
  // passage. The old anecdotal reading (Rin/photograph) and its vocabulary
  // (event, era, cause, effect, ancestor) are retired — none of those words
  // occur naturally in the new passage. All 5 old ids are repurposed below;
  // 5 new ids (lh-f-06–10) are added for the remaining words. No id has any
  // cross-theme dependency other than the deliberate spiral reinforcements
  // noted individually (inherit, develop, discovery, reflect).

  {
    id: 'lh-f-01',
    word: 'generation',
    japanese: '世代',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'A group of people living at around the same time, often thought of in relation to the generations before and after them.',
    examples: [
      'No generation begins from zero.',
      'We use what they created, improve it, and pass it to the next generation.',
    ],
    relatedWords: ['inherit', 'develop', 'knowledge'],
    tags: ['history', 'core'],
    themeNote: 'This word frames the whole passage\'s structure — each generation is one link in a chain that neither starts nor ends with itself.',
    collocations: ['the next generation', 'earlier generations', 'from one generation to another', 'across generations', 'each generation'],
  },

  {
    id: 'lh-f-02',
    word: 'inherit',
    japanese: '受け継ぐ・引き継ぐ',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'To receive something — such as knowledge, tools, or ideas — from people who lived before you.',
    examples: [
      'We inherit their knowledge, ideas, and tools.',
      'Each generation inherits something from the people who came before it.',
    ],
    relatedWords: ['generation', 'knowledge', 'develop'],
    tags: ['history', 'core'],
    themeNote: 'Deliberate spiral reinforcement from Theme 1 (knowing-myself, km-s-04), where "inherit" meant receiving a personality trait genetically from your parents. Here the same verb is used for a different, related sense — receiving knowledge, ideas, and tools from earlier generations, not genetic traits — worth naming to students as the same word doing new work.',
    collocations: ['inherit knowledge', 'inherit tools and ideas', 'inherit from', 'what we inherit', 'inherited knowledge'],
  },

  {
    id: 'lh-f-03',
    word: 'knowledge',
    japanese: '知識',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'Information, understanding, and skills that people have gained, especially over time.',
    examples: [
      'We inherit their knowledge, ideas, and tools.',
      'In this way, human knowledge can continue to develop over a very long time.',
    ],
    relatedWords: ['inherit', 'develop', 'discovery'],
    tags: ['history', 'core'],
    themeNote: 'The passage\'s central resource — the thing that accumulates across generations and makes the whole argument possible.',
    collocations: ['human knowledge', 'inherit knowledge', 'a huge amount of knowledge', 'pass on knowledge', 'knowledge and tools'],
  },

  {
    id: 'lh-f-04',
    word: 'develop',
    japanese: '発展する・発達する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'To grow, change, or advance gradually over time.',
    examples: [
      'In this way, human knowledge can continue to develop over a very long time.',
      'Electricity, mathematics, communication technology, and computers all had to develop before a smartphone could exist.',
    ],
    relatedWords: ['knowledge', 'improve', 'discovery'],
    tags: ['history', 'core'],
    themeNote: 'Third appearance of this verb across the platform (Theme 1: personal growth; Theme 2: growth through responsibility; here: the historical development of human knowledge and technology) — same core meaning, a third distinct context.',
    collocations: ['continue to develop', 'had to develop', 'develop over time', 'developed over generations', 'human knowledge developed'],
  },

  {
    id: 'lh-f-05',
    word: 'improve',
    japanese: '改良する・向上させる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'To make something better than it was before.',
    examples: [
      'We use what they created, improve it, and pass it to the next generation.',
      'Each generation improves a little on what it inherited.',
    ],
    relatedWords: ['inherit', 'develop', 'generation'],
    tags: ['history', 'core'],
    themeNote: 'Names the second step in the passage\'s three-step process — inherit, improve, pass on — that repeats across generations.',
    collocations: ['improve it', 'improve on', 'continue to improve', 'improve over time', 'slowly improve'],
  },

  {
    id: 'lh-f-06',
    word: 'depend on',
    japanese: '〜に依存する・〜次第である',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'To need something else in order to exist, happen, or be possible.',
    examples: [
      'It may look like a completely modern invention, but it depends on many earlier discoveries.',
      'Even new technology depends on knowledge from the past.',
    ],
    relatedWords: ['discovery', 'develop', 'knowledge'],
    tags: ['history', 'core'],
    themeNote: 'The passage\'s key relational phrase — it names the exact connection between something new (a smartphone) and everything that had to happen before it.',
    collocations: ['depends on', 'depend on the past', 'still depends on', 'depend heavily on', 'depends on earlier work'],
  },

  {
    id: 'lh-f-07',
    word: 'discovery',
    japanese: '発見',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'Something that people find out or learn for the first time.',
    examples: [
      'It may look like a completely modern invention, but it depends on many earlier discoveries.',
      'Electricity and mathematics were both important discoveries long before smartphones existed.',
    ],
    relatedWords: ['depend on', 'develop', 'knowledge'],
    tags: ['history', 'core'],
    themeNote: 'Spiral reinforcement from Theme 3 (designing-my-future), where "discover" meant discovering things about yourself through experience. Here the noun form names historical, scientific discovery — a different, more external sense of the same word family.',
    collocations: ['earlier discoveries', 'an important discovery', 'scientific discovery', 'many discoveries', 'discoveries from the past'],
  },

  {
    id: 'lh-f-08',
    word: 'combine',
    japanese: '組み合わせる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'To join two or more different things together to make something new.',
    examples: [
      'Different kinds of knowledge were combined to create something new.',
      'A smartphone combines ideas from many different fields.',
    ],
    relatedWords: ['knowledge', 'discovery', 'develop'],
    tags: ['history', 'core'],
    themeNote: 'Shows that accumulation is not just one long line — separate strands of knowledge often had to be combined before something new could exist.',
    collocations: ['combine ideas', 'combined to create', 'combine different things', 'combine knowledge', 'combine with'],
  },

  {
    id: 'lh-f-09',
    word: 'reflect',
    japanese: '（〜を）反映する・示す',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'To show or be a sign of something, especially something that has developed over time.',
    examples: [
      'The way we live today therefore reflects many choices and developments from the past.',
      'Today\'s laws and schools reflect decisions people made long ago.',
    ],
    relatedWords: ['develop', 'knowledge', 'generation'],
    tags: ['history', 'core'],
    themeNote: 'Same word as Theme 1\'s "reflect," but a genuinely different sense — Theme 1 used it to mean "think back on your own experience"; here it means "show" or "be evidence of," describing how the present shows the past rather than how a person thinks about the past. Worth pointing out explicitly so students don\'t assume the meanings are identical.',
    collocations: ['reflects choices', 'reflect the past', 'reflects developments', 'today reflects', 'reflect many changes'],
  },

  {
    id: 'lh-f-10',
    word: 'countless',
    japanese: '数え切れないほどの・無数の',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'Too many to count; a very large, unspecified number.',
    examples: [
      'The world around us contains the work and knowledge of countless people who lived before us.',
      'Countless small improvements, made by countless people, add up over time.',
    ],
    relatedWords: ['generation', 'knowledge', 'inherit'],
    tags: ['history', 'core'],
    themeNote: 'The passage\'s final word for scale — accumulation is not the work of a few famous individuals, but of an uncountable number of ordinary people.',
    collocations: ['countless people', 'countless generations', 'countless small changes', 'countless discoveries', 'a countless number of'],
  },

  // ── Learning from History — Advanced ─────────────────────────────────────────
  // New — Theme 9 previously had no Advanced level. Built against the
  // approved "Why Do People Repeat the Same Mistakes?" passage. All 10 ids
  // are new (lh-s-01–10); no cross-theme dependency other than the
  // deliberate spiral reinforcements noted individually (nature, experience).

  {
    id: 'lh-s-01',
    word: 'motive',
    japanese: '動機',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'The inner reason that makes a person want to do something.',
    examples: [
      'Many historical mistakes are connected to human motives and desires that have not disappeared.',
      'The same motive can lead to very different actions in different situations.',
    ],
    relatedWords: ['desire', 'nature', 'force'],
    tags: ['history', 'core'],
    themeNote: 'Names the passage\'s central explanatory category — not what happened, but what made people want it to happen.',
    collocations: ['human motives', 'connected to a motive', 'the motive behind', 'a strong motive', 'motives and desires'],
  },

  {
    id: 'lh-s-02',
    word: 'desire',
    japanese: '欲望・欲求',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'A strong feeling of wanting something.',
    examples: [
      'People still feel jealousy, fear, pride, hatred, and the desire for greater wealth or control.',
      'A desire for something can stay the same even as the world around it changes completely.',
    ],
    relatedWords: ['motive', 'revenge', 'nature'],
    tags: ['history', 'core'],
    themeNote: 'Works alongside "motive" to name the passage\'s core claim — specific desires (for wealth, control, revenge) recur across very different historical situations.',
    collocations: ['the desire for', 'a strong desire', 'desire for control', 'desires that persist', 'human desires'],
  },

  {
    id: 'lh-s-03',
    word: 'revenge',
    japanese: '復讐・仕返し',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'Harmful action taken against someone because they hurt you first.',
    examples: [
      'They may want revenge when they believe they have been harmed.',
      'A desire for revenge can feel completely reasonable to the person who feels it.',
    ],
    relatedWords: ['retaliation', 'justified', 'desire'],
    tags: ['history', 'core'],
    themeNote: 'One of the passage\'s concrete examples of a motive that outlives any specific historical situation — the feeling, not the era, is what repeats.',
    collocations: ['want revenge', 'a desire for revenge', 'seek revenge', 'revenge for', 'out of revenge'],
  },

  {
    id: 'lh-s-04',
    word: 'retaliation',
    japanese: '報復',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'An action taken to hurt someone back after they have hurt you.',
    examples: [
      'Retaliation may then seem justified, even when people know that similar actions created more conflict in the past.',
      'Retaliation can feel fair to the person doing it, even when it repeats a known mistake.',
    ],
    relatedWords: ['revenge', 'justified', 'motive'],
    tags: ['history', 'core'],
    themeNote: 'The passage\'s example of how a motive (revenge) turns into an actual repeated pattern of behavior — retaliation is revenge put into action.',
    collocations: ['retaliation seems justified', 'a cycle of retaliation', 'retaliation against', 'in retaliation', 'avoid retaliation'],
  },

  {
    id: 'lh-s-05',
    word: 'justified',
    japanese: '正当化された・正当だと思える',
    pos: 'adjective',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'Seeming right or reasonable, especially as an excuse for an action.',
    examples: [
      'Retaliation may then seem justified, even when people know that similar actions created more conflict in the past.',
      'An action can feel completely justified in the moment, even if it repeats a known historical mistake.',
    ],
    relatedWords: ['retaliation', 'revenge', 'recognize'],
    tags: ['history', 'core'],
    themeNote: 'This is the exact word that names why knowledge fails to prevent repetition — people are not usually unaware that an action is a mistake; the action simply feels justified anyway.',
    collocations: ['seem justified', 'feel justified', 'justified even when', 'a justified response', 'seemed fully justified'],
  },

  {
    id: 'lh-s-06',
    word: 'nature',
    japanese: '（人間の）本性',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'The basic qualities and instincts that are part of being human, rather than learned or chosen.',
    examples: [
      'Human knowledge has changed enormously, but human nature may have changed much less.',
      'The passage\'s central contrast is between fast-changing knowledge and slow-changing human nature.',
    ],
    relatedWords: ['experience', 'motive', 'desire'],
    tags: ['history', 'core'],
    themeNote: 'Deliberate spiral reinforcement from Theme 1 (knowing-myself, km-s-02), where "nature" meant the inborn side of an individual\'s personality, contrasted with nurture/experience. Here the same word is applied collectively and historically — "human nature" as something shared across generations — directly echoing Theme 1\'s nature-vs-experience framing at a civilizational scale.',
    collocations: ['human nature', 'changed much less', 'part of human nature', 'against human nature', 'human nature itself'],
  },

  {
    id: 'lh-s-07',
    word: 'preserve',
    japanese: '保存する・残す',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'To keep something from being lost, damaged, or changed.',
    examples: [
      'History can preserve information about what happened.',
      'Books and records can preserve facts, but not the feeling of having lived through them.',
    ],
    relatedWords: ['experience', 'knowledge', 'recognize'],
    tags: ['history', 'core'],
    themeNote: 'Names exactly what history is good at — and, by implication, what it is not able to do (preserve experience itself).',
    collocations: ['preserve information', 'preserve a record', 'preserve knowledge', 'carefully preserved', 'preserve what happened'],
  },

  {
    id: 'lh-s-08',
    word: 'recognize',
    japanese: '認識する・気づく',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'To become aware of something as true, often something that was already there but not consciously noticed.',
    examples: [
      'Perhaps learning from history begins by recognizing that some of the forces that shaped the past still exist in ourselves today.',
      'Recognizing a motive in yourself is different from simply knowing that it exists in other people.',
    ],
    relatedWords: ['nature', 'force', 'experience'],
    tags: ['history', 'core'],
    themeNote: 'The passage\'s final, most important verb — its closing move is not a new fact but a shift from knowing about history to recognizing something in oneself.',
    collocations: ['begins by recognizing', 'recognize that', 'recognize a pattern', 'recognize in ourselves', 'fail to recognize'],
  },

  {
    id: 'lh-s-09',
    word: 'experience',
    japanese: '経験',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'Something a person lives through and feels directly, rather than simply learns about.',
    examples: [
      'One reason may be that knowing something is not the same as experiencing it.',
      'As generations pass, the experience disappears while the information remains.',
    ],
    relatedWords: ['nature', 'knowledge', 'preserve'],
    tags: ['history', 'core'],
    themeNote: 'Deliberate spiral reinforcement from Theme 1 (knowing-myself), where "experience" was the counterweight to nature in shaping personality. Here it becomes the counterweight to knowledge in explaining why history does not simply repeat as fact — the same word doing structurally similar work at a different scale.',
    collocations: ['experiencing it', 'the original experience', 'personal experience', 'experience disappears', 'not the same as experience'],
  },

  {
    id: 'lh-s-10',
    word: 'force',
    japanese: '力・要因',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['learning-from-history'],
    coreMeaning: 'Something that has power or influence over what people do, even when it cannot be seen directly.',
    examples: [
      'The situation may be new, but some of the forces behind it are not.',
      'Some of the forces that shaped the past still exist in ourselves today.',
    ],
    relatedWords: ['motive', 'nature', 'desire'],
    tags: ['history', 'core'],
    themeNote: 'The passage\'s own umbrella term for motives, desires, and human nature together — the abstract category the whole argument has been building toward.',
    collocations: ['the forces behind', 'forces that shaped', 'underlying forces', 'human forces', 'powerful forces'],
  },

  // ── Science in Everyday Life — Foundation ───────────────────────────────────

  {
    id: 'se-f-01',
    word: 'science',
    japanese: '科学',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['science-in-everyday-life'],
    coreMeaning: 'The careful study of how and why things in the world work.',
    examples: [
      'It was a small, everyday phenomenon, but knowing the science behind it made an ordinary afternoon feel more interesting.',
      'Science begins with curiosity about ordinary things.',
    ],
    relatedWords: ['experiment', 'observation', 'hypothesis'],
    tags: ['science', 'core'],
    themeNote: 'This theme shows science as something you can do in daily life, not only something studied in a classroom.',
    collocations: ['the science behind', 'science shows', 'learn science', 'science and everyday life', 'a science question'],
  },

  {
    id: 'se-f-02',
    word: 'observation',
    japanese: '観察',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['science-in-everyday-life'],
    coreMeaning: 'The careful watching and noticing of something in order to understand it.',
    examples: [
      'Through careful observation, Yuto realized the water was coming from the warm air itself.',
      'Good observation is the first step to understanding what is really happening.',
    ],
    relatedWords: ['science', 'hypothesis', 'experiment'],
    tags: ['science', 'core'],
    themeNote: 'Yuto\'s discovery comes from careful observation, not a guess he sticks with — a key habit of real scientific thinking.',
    collocations: ['through observation', 'careful observation', 'make an observation', 'based on observation', 'observation shows'],
  },

  {
    id: 'se-f-03',
    word: 'hypothesis',
    japanese: '仮説',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['science-in-everyday-life'],
    coreMeaning: 'A first guess or possible explanation that can be tested to see if it is true.',
    examples: [
      'At first, he guessed it might be a tiny hole in the can — a simple hypothesis, but one he could test.',
      'His hypothesis was wrong, but testing it helped him find the real answer.',
    ],
    relatedWords: ['experiment', 'observation', 'science'],
    tags: ['science', 'core'],
    themeNote: 'The passage shows a wrong hypothesis being revised through testing — modeling that being wrong is a normal, useful part of scientific thinking, not a failure.',
    collocations: ['form a hypothesis', 'test a hypothesis', 'a simple hypothesis', 'the hypothesis was wrong', 'a hypothesis about'],
  },

  {
    id: 'se-f-04',
    word: 'phenomenon',
    japanese: '現象',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['science-in-everyday-life'],
    coreMeaning: 'Something that happens or can be observed, especially something interesting to study.',
    examples: [
      'It was a small, everyday phenomenon, but knowing the science behind it made an ordinary afternoon feel more interesting.',
      'Condensation on a cold can is a common everyday phenomenon.',
    ],
    relatedWords: ['science', 'observation', 'experiment'],
    tags: ['science', 'core'],
    themeNote: 'This theme is built on the idea that everyday phenomena — not just laboratory experiments — are genuinely worth investigating.',
    collocations: ['an everyday phenomenon', 'a natural phenomenon', 'explain a phenomenon', 'observe a phenomenon', 'a common phenomenon'],
  },

  {
    id: 'se-f-05',
    word: 'experiment',
    japanese: '実験',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['science-in-everyday-life'],
    coreMeaning: 'A test done to find out whether a hypothesis or idea is true.',
    examples: [
      'He grabbed a dry glass, filled it with ice, and set it beside the can as a small experiment.',
      'A simple experiment can be done with things you already have at home.',
    ],
    relatedWords: ['hypothesis', 'observation', 'science'],
    tags: ['science', 'core'],
    themeNote: 'Yuto\'s experiment is deliberately small and doable with ordinary objects — the theme wants students to see real experimentation as accessible, not only for labs.',
    collocations: ['a small experiment', 'run an experiment', 'set up an experiment', 'experiment with', 'the experiment showed'],
  },

  {
    id: 'se-f-06',
    word: 'curiosity',
    japanese: '好奇心',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['science-in-everyday-life'],
    coreMeaning: 'A strong desire to know or learn more about something.',
    examples: [
      'He became curious: where was all that water coming from?',
      'Science begins with curiosity about ordinary things.',
    ],
    relatedWords: ['science', 'observation', 'hypothesis'],
    tags: ['science', 'core'],
    themeNote: 'This theme\'s central message: curiosity about something as small as a wet can is genuinely how scientific thinking starts.',
    collocations: ['out of curiosity', 'curiosity about', 'become curious', 'natural curiosity', 'satisfy your curiosity'],
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

export function findVocabEntryByWord(word: string): VocabEntry | undefined {
  const normalized = word.trim().toLowerCase();
  return MASTER_VOCABULARY.find(entry => entry.word.toLowerCase() === normalized);
}
