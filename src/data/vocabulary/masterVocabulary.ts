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
  // Rebuilt 2026-08-09 from the frozen manuscript (docs/THEME_03_MANUSCRIPT.md).
  // Old ids df-f-01/02/03 (choice, plan, step) are fully retired — not
  // referenced by any other theme — and repurposed below for new words.
  // The old cross-referenced ids km-f-03/05/09 (goal, dream, important) and
  // us-f-07 (decide) are no longer part of this theme's target vocabulary.

  {
    id: 'df-f-01',
    word: 'discover',
    japanese: '発見する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To find out or realize something for the first time, especially through direct experience rather than by simply deciding it in advance.',
    examples: [
      'In reality, most people discover their future gradually, through ordinary experience rather than one moment of clarity.',
      "She didn't plan to love biology — she discovered it almost by accident, in a class she almost didn't take.",
    ],
    relatedWords: ['notice', 'potential', 'tendency'],
    tags: ['future', 'core'],
    themeNote: "This is the theme's central verb — designing a future is framed here as something discovered gradually through experience, not something decided in a single moment.",
    collocations: ['discover something new', 'discover a passion', 'discover for yourself', 'gradually discover', 'discover through experience'],
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
      'A new subject can reveal a preference.',
      'After trying both, he realized his preference was for hands-on work rather than sitting at a desk all day.',
    ],
    relatedWords: ['discover', 'tendency', 'notice'],
    tags: ['future'],
    themeNote: 'One of the three concrete things ordinary experience can reveal, alongside a tendency and a potential — this word names the smallest, most everyday form of self-knowledge the passage describes.',
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
    coreMeaning: 'A pattern in how someone naturally tends to think, act, or react, that shows up again and again.',
    examples: [
      'A group project can reveal a tendency — perhaps a habit of taking the lead, or of thinking carefully before speaking.',
      'During the project, she noticed a tendency in herself to ask questions before jumping in.',
    ],
    relatedWords: ['preference', 'potential', 'reveal'],
    tags: ['future'],
    themeNote: "The passage's example of a tendency — 'taking the lead' or 'thinking carefully before speaking' — shows how ordinary group work can quietly reveal something about how a person naturally works.",
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
      'A difficult task can reveal a strength, or a potential, you had no reason to test before.',
      'The coach saw potential in him long before he saw it in himself.',
    ],
    relatedWords: ['reveal', 'discover', 'tendency'],
    tags: ['future', 'core'],
    themeNote: 'The passage pairs potential directly with strength — both are things a difficult task can reveal, precisely because they had no earlier reason to be tested.',
    collocations: ['reveal potential', 'have potential', 'real potential', 'potential you had no reason to test', 'untested potential'],
    wordFamily: [
      { word: 'potentially', pos: 'adverb', japanese: '可能性として・もしかしたら' },
    ],
  },

  {
    id: 'df-f-05',
    word: 'choose',
    japanese: '選ぶ',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To decide on one thing rather than another, especially after really trying or comparing the options.',
    examples: [
      'Choosing against something, once genuinely tried, is often just as valuable as choosing for something.',
      'Choosing not to continue with the debate club taught her almost as much as choosing to join it did.',
    ],
    relatedWords: ['discover', 'suit', 'notice'],
    tags: ['future', 'core'],
    themeNote: "The passage's boldest claim: choosing against something you genuinely tried is just as valuable as choosing for something — ruling things out is real progress, not falling behind.",
    collocations: ['choose against', 'choose for', 'choose between', 'genuinely tried and chose', 'choose to do something'],
    wordFamily: [
      { word: 'choice', pos: 'noun', japanese: '選択' },
      { word: 'chosen', pos: 'adjective', japanese: '選ばれた' },
    ],
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
      'Designing a future, then, is less a single decision than an ongoing process of noticing what interests you, what you are good at, and what does not suit you.',
      'A quiet library suits some students perfectly and drives others up the wall.',
    ],
    relatedWords: ['notice', 'choose', 'preference'],
    tags: ['future', 'core'],
    themeNote: "This word gives the whole theme its real meaning — designing a future isn't about finding the objectively 'right' path, but discovering what actually suits you personally.",
    collocations: ['suit you', 'does not suit', 'suit your interests', 'a class that suits', 'find what suits you'],
    otherMeanings: ['suit (clothing, noun): a matching jacket and trousers worn together (e.g., wear a suit to an interview)'],
    wordFamily: [
      { word: 'suitable', pos: 'adjective', japanese: '適した' },
    ],
  },

  {
    id: 'df-f-07',
    word: 'notice',
    japanese: '気づく',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To become consciously aware of something, often something small that would be easy to overlook.',
    examples: [
      'Designing a future, then, is less a single decision than an ongoing process of noticing what interests you, what you are good at, and what does not suit you.',
      'It took a whole semester before he noticed how much he looked forward to Tuesdays — the day of his art class.',
    ],
    relatedWords: ['discover', 'suit', 'reveal'],
    tags: ['future', 'core'],
    themeNote: "The passage's own name for the whole activity it describes — designing a future is 'an ongoing process of noticing,' not a single decisive act.",
    collocations: ['notice something', 'keep noticing', 'an ongoing process of noticing', 'notice what suits you', 'pay attention and notice'],
    wordFamily: [
      { word: 'noticeable', pos: 'adjective', japanese: '目立った・気づきやすい' },
    ],
  },

  {
    id: 'df-f-08',
    word: 'reveal',
    japanese: '明らかにする',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['designing-my-future'],
    coreMeaning: 'To make something clear or visible that was previously hidden or unknown, often without anyone intending it to happen.',
    examples: [
      'A group project can reveal a tendency — perhaps a habit of taking the lead, or of thinking carefully before speaking.',
      'One difficult group project revealed more about his real strengths than a whole year of easy classes.',
    ],
    relatedWords: ['tendency', 'potential', 'preference'],
    tags: ['future', 'core'],
    themeNote: "The passage's structural verb — a subject reveals a preference, a project reveals a tendency, a task reveals a potential. Self-knowledge here isn't sought directly; it's revealed indirectly, through ordinary activity.",
    collocations: ['reveal a preference', 'reveal a tendency', 'reveal a strength', 'quietly reveal', 'reveal something about yourself'],
  },

  // ── Designing My Future — Advanced ──────────────────────────────────────────
  // Built 2026-08-09 from the frozen manuscript (docs/THEME_03_MANUSCRIPT.md).
  // No word here is duplicated from Foundation — all 8 are new, following
  // the user's explicit decision (2026-08-09) to drop the "+1 reinforced"
  // slot originally proposed for "reflect" in favor of two words more
  // central to this passage's own argument (purpose, passion).

  {
    id: 'df-s-01',
    word: 'construct',
    japanese: '築き上げる・構築する',
    pos: 'verb',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'To build something gradually through deliberate action, rather than simply finding something that already existed.',
    examples: [
      'Others argue the opposite: that most people do not discover what suits them by looking inward at all, but construct it, gradually, through action taken for reasons that have little to do with passion.',
      "Some people believe confidence is something you either have or don't; others believe you construct it, one small success at a time.",
    ],
    relatedWords: ['assumption', 'competence', 'purpose'],
    tags: ['future', 'core'],
    themeNote: "This word names one whole side of the passage's central debate — discovery versus construction — and directly answers the Essential Question: is a future found, or built?",
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
      'What actually happens, more often, is the reverse: effort leads to competence, and competence, in turn, produces enjoyment.',
      "Her competence in the lab didn't come from natural talent — it came from hundreds of hours of unglamorous practice.",
    ],
    relatedWords: ['construct', 'satisfaction', 'assumption'],
    tags: ['future', 'core'],
    themeNote: 'The keystone of the passage\'s central reversal: effort leads to competence, and competence produces enjoyment — not the other way around, as most people assume.',
    collocations: ['lead to competence', 'build competence', 'real competence', 'competence and enjoyment', 'gain competence'],
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
      'On this view, the common assumption that enjoyment comes first and effort follows is exactly backward.',
      "It's worth questioning the assumption that a good job always has to feel enjoyable from day one.",
    ],
    relatedWords: ['construct', 'competence', 'ambiguity'],
    tags: ['future'],
    themeNote: "The passage's rhetorical hinge word — it names the popular belief (enjoyment before effort) that the whole argument is built to overturn.",
    collocations: ['a common assumption', 'question an assumption', 'the assumption that', 'challenge an assumption', 'based on an assumption'],
    wordFamily: [
      { word: 'assume', pos: 'verb', japanese: '思い込む・仮定する' },
      { word: 'assumed', pos: 'adjective', japanese: '当然とされた' },
    ],
  },

  {
    id: 'df-s-04',
    word: 'ambiguity',
    japanese: 'あいまいさ',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A state in which something is unclear or open to more than one interpretation, with no single obvious answer.',
    examples: [
      'They point out that certain tendencies — a comfort with ambiguity, a pull toward people rather than toward ideas, a lasting curiosity about how things work — do seem to appear early and remain remarkably stable over time.',
      'Some students panic at ambiguity in an assignment; others treat it as room to make their own decisions.',
    ],
    relatedWords: ['assumption', 'purpose', 'construct'],
    tags: ['future'],
    themeNote: "A comfort with ambiguity is offered as one of the early, stable tendencies that may shape a person's future — fittingly, since tolerating an unclear future is what this whole theme ultimately asks of a student.",
    collocations: ['a comfort with ambiguity', 'tolerate ambiguity', 'genuine ambiguity', 'live with ambiguity', 'deal with ambiguity'],
    wordFamily: [
      { word: 'ambiguous', pos: 'adjective', japanese: 'あいまいな' },
    ],
  },

  {
    id: 'df-s-05',
    word: 'satisfaction',
    japanese: '満足感',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A feeling of genuine fulfillment that comes from doing something well, especially after real effort.',
    examples: [
      'Effort leads to competence, and competence, in turn, produces real satisfaction — being good at something most people find genuinely satisfying.',
      "There's a particular kind of satisfaction that only comes after you've struggled with something difficult and finally understood it.",
    ],
    relatedWords: ['competence', 'construct', 'passion'],
    tags: ['future', 'core'],
    themeNote: 'The final link in the passage\'s reversed chain — effort leads to competence, and competence produces satisfaction, arriving last rather than first.',
    collocations: ['genuine satisfaction', 'find satisfaction in', 'produce satisfaction', 'real satisfaction', 'satisfaction from effort'],
    wordFamily: [
      { word: 'satisfy', pos: 'verb', japanese: '満足させる' },
      { word: 'satisfying', pos: 'adjective', japanese: '満足のいく' },
    ],
  },

  {
    id: 'df-s-06',
    word: 'anxiety',
    japanese: '不安',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A persistent feeling of worry or unease, often about something uncertain in the future.',
    examples: [
      'It suggests that somewhere inside every person there is already a correct answer, waiting to be uncovered — a career, a passion, a purpose — and that the anxiety so many young adults feel is simply the discomfort of not yet having found it.',
      'A lot of the anxiety students feel about their future comes from believing they should already have the answer.',
    ],
    relatedWords: ['purpose', 'assumption', 'ambiguity'],
    tags: ['future'],
    themeNote: "The passage names this feeling directly, then quietly reframes its cause — the anxiety isn't proof that something is wrong with you, but a side effect of assuming a single correct answer already exists.",
    collocations: ['feel anxiety', 'the anxiety of', 'a source of anxiety', 'ease your anxiety', 'anxiety about the future'],
    wordFamily: [
      { word: 'anxious', pos: 'adjective', japanese: '不安な' },
    ],
  },

  {
    id: 'df-s-07',
    word: 'purpose',
    japanese: '目的・存在意義',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A clear sense of what you are meant to do or why what you do matters — often imagined as something waiting to be found.',
    examples: [
      'It suggests that somewhere inside every person there is already a correct answer, waiting to be uncovered — a career, a passion, a purpose.',
      'He spent a year searching for his purpose before realizing it was forming quietly through the work he was already doing.',
    ],
    relatedWords: ['passion', 'anxiety', 'construct'],
    tags: ['future', 'core'],
    themeNote: "Named alongside 'a career' and 'a passion' as one of the things the essentialist view claims is already inside you, waiting to be uncovered — this word is the object the whole debate is actually about.",
    collocations: ['find your purpose', 'a sense of purpose', 'search for purpose', 'waiting to be uncovered', 'purpose in life'],
    wordFamily: [
      { word: 'purposeful', pos: 'adjective', japanese: '目的意識のある' },
    ],
  },

  {
    id: 'df-s-08',
    word: 'passion',
    japanese: '情熱',
    pos: 'noun',
    introductionLevel: 'advanced',
    themes: ['designing-my-future'],
    coreMeaning: 'A strong enthusiasm or love for something — often assumed to be the starting point for effort, rather than something that can follow it.',
    examples: [
      'Others argue the opposite: that most people do not discover what suits them by looking inward at all, but construct it, gradually, through action taken for reasons that have little to do with passion.',
      'Everyone told her to follow her passion, but for her, passion only arrived after months of unglamorous practice.',
    ],
    relatedWords: ['purpose', 'satisfaction', 'competence'],
    tags: ['future', 'core'],
    themeNote: 'The word at the center of the passage\'s biggest reversal — the popular idea that passion comes first and effort follows is, according to the passage, "exactly backward."',
    collocations: ['follow your passion', 'little to do with passion', 'a lasting passion', 'passion for something', 'discover a passion'],
    wordFamily: [
      { word: 'passionate', pos: 'adjective', japanese: '情熱的な' },
    ],
  },

  // ── Living Together — Foundation ────────────────────────────────────────────

  {
    id: 'lt-f-01',
    word: 'relationship',
    japanese: '人間関係',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'The way two or more people are connected to and behave toward each other.',
    examples: [
      'Slowly, they began to trust each other more, and their relationship grew closer.',
      'A good relationship takes effort from both people.',
    ],
    relatedWords: ['trust', 'close', 'get along'],
    tags: ['connection', 'core'],
    themeNote: 'This theme is centrally about how relationships are built and maintained, especially through difference.',
    collocations: ['a close relationship', 'build a relationship', 'a good relationship', 'relationship with', 'a working relationship'],
  },

  {
    id: 'lt-f-02',
    word: 'trust',
    japanese: '信頼する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together', 'facts-or-fake'],
    coreMeaning: 'To believe that someone is reliable and has good intentions toward you.',
    examples: [
      'Slowly, they began to trust each other more.',
      'It takes time to trust someone you live with.',
    ],
    relatedWords: ['relationship', 'close', 'respect'],
    tags: ['connection'],
    themeNote: 'Trust grows gradually through small, honest moments — not all at once — which is exactly how it develops in this theme\'s reading.',
    collocations: ['trust each other', 'build trust', 'trust someone', 'learn to trust', 'trust over time'],
  },

  {
    id: 'lt-f-03',
    word: 'close',
    japanese: '親しい・親密な',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'Emotionally connected to someone; having a strong bond.',
    examples: [
      'Their relationship grew closer by the end of the semester.',
      'We became close after spending so much time together.',
    ],
    relatedWords: ['relationship', 'trust', 'get along'],
    tags: ['connection'],
    themeNote: 'In this theme, "close" describes emotional connection, not physical distance — an important distinction for the vocabulary-in-context task.',
    collocations: ['grow closer', 'a close friend', 'feel close to', 'become close', 'close relationship'],
    otherMeanings: ['close (distance): physically near (e.g., the store is close to my house)', 'close (verb): to shut something (e.g., close the door)'],
  },

  {
    id: 'lt-f-04',
    word: 'neighbor',
    japanese: '隣人',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'A person who lives, works, or shares space near you.',
    examples: [
      'They learned to respect each other\'s differences, like good neighbors sharing the same small space.',
      'Being a good neighbor means being considerate of the people around you.',
    ],
    relatedWords: ['community', 'respect', 'share'],
    tags: ['community'],
    themeNote: 'The passage uses "good neighbors" as a model for how to share space respectfully, even with someone quite different from you.',
    collocations: ['good neighbor', 'next-door neighbor', 'neighbor relations', 'like a neighbor', 'neighbors sharing space'],
  },

  {
    id: 'lt-f-05',
    word: 'kind',
    japanese: '親切な',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'Friendly, gentle, and considerate toward others.',
    examples: [
      'Getting along with someone means being kind, showing respect, and trying to see things from the other person\'s side.',
      'She was kind enough to listen, even when she disagreed.',
    ],
    relatedWords: ['respect', 'get along', 'trust'],
    tags: ['character', 'connection'],
    themeNote: 'This theme treats kindness as an active practice — listening, understanding, adjusting — not simply a passive personality trait.',
    collocations: ['be kind to', 'kind enough to', 'a kind person', 'kind words', 'act kindly'],
  },

  {
    id: 'lt-f-06',
    word: 'respect',
    japanese: '尊重する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To treat someone or their differences as important and worthy of consideration.',
    examples: [
      'They learned to respect each other\'s differences.',
      'Respecting someone\'s needs doesn\'t mean you always agree with them.',
    ],
    relatedWords: ['kind', 'get along', 'agree'],
    tags: ['character', 'connection'],
    themeNote: 'Respect is presented here as the key that makes disagreement survivable — you can respect someone whose needs are different from your own.',
    collocations: ['respect each other', 'show respect', 'respect someone\'s choice', 'mutual respect', 'respect differences'],
  },

  {
    id: 'lt-f-07',
    word: 'agree',
    japanese: '同意する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To have the same opinion as someone else, or to accept a plan together.',
    examples: [
      'They agreed to try something new: quiet hours in the evening, and a shared night out once a week.',
      'We don\'t always agree, but we always talk it through.',
    ],
    relatedWords: ['disagree', 'get along', 'decide'],
    tags: ['communication'],
    themeNote: 'Agreeing on a compromise — not on everything — is the turning point of this theme\'s reading passage.',
    collocations: ['agree to', 'agree on', 'agree with someone', 'finally agree', 'agree to try'],
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
      'They still disagreed sometimes about small things.',
      'It\'s okay to disagree, as long as you talk about it calmly.',
    ],
    relatedWords: ['agree', 'respect', 'relationship'],
    tags: ['communication'],
    themeNote: 'This theme is explicit that disagreement doesn\'t have to threaten a relationship — it\'s something to be handled, not avoided.',
    collocations: ['disagree about', 'disagree with', 'still disagree', 'politely disagree', 'agree to disagree'],
  },

  {
    id: 'lt-f-09',
    word: 'get along (with)',
    japanese: '仲良くやっていく',
    pos: 'phrase',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To have a friendly, cooperative relationship with someone.',
    examples: [
      'Getting along with someone doesn\'t mean always agreeing.',
      'It took time, but they finally got along well.',
    ],
    relatedWords: ['relationship', 'close', 'respect'],
    tags: ['connection', 'core'],
    themeNote: 'This is the theme\'s own central phrase — the takeaway sentence is built directly around what "getting along" really means.',
    collocations: ['get along with', 'get along well', 'hard to get along with', 'learn to get along', 'get along fine'],
  },

  {
    id: 'lt-f-10',
    word: 'share',
    japanese: '共有する・分かち合う',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['living-together'],
    coreMeaning: 'To use, experience, or divide something together with someone else.',
    examples: [
      'They learned to respect each other\'s differences, like good neighbors sharing the same small space.',
      'Sharing a room with someone means learning to compromise.',
    ],
    relatedWords: ['neighbor', 'relationship', 'agree'],
    tags: ['connection', 'action'],
    themeNote: 'Living together means sharing space, time, and responsibilities — this word names the practical reality behind the whole theme.',
    collocations: ['share a room', 'share space', 'share responsibilities', 'learn to share', 'share with someone'],
  },

  // ── Facts or Fake? — Foundation ─────────────────────────────────────────────

  {
    id: 'ff-f-01',
    word: 'true',
    japanese: '本当の',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Matching reality; correct and not false.',
    examples: [
      'The message was not true — it was just something someone had made up.',
      'It sounded serious, but that doesn\'t mean it was true.',
    ],
    relatedWords: ['fact', 'fake', 'honest'],
    tags: ['information', 'core'],
    themeNote: 'This theme is about learning to pause and ask "is this actually true?" before reacting to information.',
    collocations: ['is it true?', 'turn out to be true', 'not true', 'true or false', 'sounds true'],
  },

  {
    id: 'ff-f-02',
    word: 'fake',
    japanese: '偽の',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Not real or true; made to look genuine when it is not.',
    examples: [
      'Not everything online is fake, but it is always worth a second look.',
      'It can be hard to tell a fake message from a real one.',
    ],
    relatedWords: ['true', 'source', 'believe'],
    tags: ['information', 'core'],
    themeNote: 'The theme title itself is built on this word — the essential skill is telling facts from fakes, not assuming everything online is one or the other.',
    collocations: ['fake news', 'fake message', 'look fake', 'spot something fake', 'fake or real'],
  },

  {
    id: 'ff-f-03',
    word: 'believe',
    japanese: '信じる',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'To accept that something is true.',
    examples: [
      'Part of him wanted to believe it immediately and share it with his family.',
      'I almost believed it before I checked the source.',
    ],
    relatedWords: ['doubt', 'trust', 'true'],
    tags: ['information', 'core'],
    themeNote: 'The theme\'s whole arc is about the gap between wanting to believe something and actually checking it first.',
    collocations: ['believe something', 'hard to believe', 'believe immediately', 'almost believed', 'believe without checking'],
  },

  {
    id: 'ff-f-04',
    word: 'doubt',
    japanese: '疑う',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'To feel unsure whether something is true.',
    examples: [
      'He learned to doubt messages that sounded too dramatic.',
      'It\'s healthy to doubt a claim before you share it.',
    ],
    relatedWords: ['believe', 'check', 'trust'],
    tags: ['information'],
    themeNote: 'Doubt is treated as a useful, healthy first reaction in this theme, not as rudeness or negativity.',
    collocations: ['doubt something', 'have doubts about', 'doubt a claim', 'without a doubt', 'start to doubt'],
  },

  {
    id: 'ff-f-05',
    word: 'honest',
    japanese: '正直な',
    pos: 'adjective',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'Telling the truth and not hiding or faking information.',
    examples: [
      'He learned to trust sources that were honest about where their information came from.',
      'An honest source will usually explain where its information comes from.',
    ],
    relatedWords: ['true', 'trust', 'source'],
    tags: ['information', 'character'],
    themeNote: 'An honest source is defined here very concretely — one that is transparent about where its information came from, not just one that "seems nice."',
    collocations: ['honest source', 'be honest about', 'an honest answer', 'honest information', 'honest and open'],
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
      'He searched for the source and found that no real doctor or hospital had ever said this.',
      'Always ask yourself: what is the source of this information?',
    ],
    relatedWords: ['check', 'honest', 'fact'],
    tags: ['information', 'core'],
    themeNote: 'Checking the source — not just the claim itself — is the single most practical skill this theme teaches.',
    collocations: ['check the source', 'a reliable source', 'source of information', 'trace the source', 'no real source'],
  },

  {
    id: 'ff-f-07',
    word: 'check',
    japanese: '確認する',
    pos: 'verb',
    introductionLevel: 'foundation',
    themes: ['facts-or-fake'],
    coreMeaning: 'To look into something carefully to see if it is true or correct.',
    examples: [
      'Instead of sharing it right away, Haruto decided to check where the claim came from.',
      'It only takes a minute to check before you share something.',
    ],
    relatedWords: ['source', 'doubt', 'trust'],
    tags: ['information', 'action', 'core'],
    themeNote: 'This is the theme\'s central action word — everything else (doubt, trust, honest) supports the habit of actually checking.',
    collocations: ['check the source', 'check before sharing', 'check if it\'s true', 'double-check', 'check carefully'],
    otherMeanings: ['check (mark): a small ✓ mark on paper', 'check (restaurant): the bill at a restaurant'],
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
      'Is this a fact, or just someone\'s opinion dressed up to look real?',
      'A fact can usually be checked against a real source.',
    ],
    relatedWords: ['opinion', 'true', 'source'],
    tags: ['information', 'core'],
    themeNote: 'The theme\'s core question — fact or opinion? — becomes a simple habit students can apply to anything they read.',
    collocations: ['a fact', 'fact or opinion', 'based on facts', 'check the facts', 'state a fact'],
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
      'Is this a fact, or just someone\'s opinion dressed up to look real?',
      'That\'s just one person\'s opinion, not a proven fact.',
    ],
    relatedWords: ['fact', 'believe', 'true'],
    tags: ['information', 'core'],
    themeNote: 'Opinions aren\'t treated as bad in this theme — the danger is an opinion disguised as a fact.',
    collocations: ['just an opinion', 'in my opinion', 'opinion vs. fact', 'share an opinion', 'strong opinion'],
  },

  // ── Peace and War — Foundation ──────────────────────────────────────────────

  {
    id: 'pw-f-01',
    word: 'peace',
    japanese: '平和',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A state without war or fighting, and the calm that comes with it.',
    examples: [
      'When the fighting finally ended, the two sides signed a peace treaty.',
      'She wanted Yuna to know this history as a legacy of choosing peace afterward.',
    ],
    relatedWords: ['war', 'treaty', 'legacy'],
    tags: ['society', 'core'],
    themeNote: 'This theme treats peace not as the simple absence of war, but as something people actively choose and work toward after conflict.',
    collocations: ['choose peace', 'a peace treaty', 'live in peace', 'bring peace', 'lasting peace'],
  },

  {
    id: 'pw-f-02',
    word: 'war',
    japanese: '戦争',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'Armed fighting between countries or groups of people.',
    examples: [
      'Yuna had heard her grandmother mention the war before, but never really asked about it.',
      'The war changed everything about her daily life.',
    ],
    relatedWords: ['peace', 'victim', 'civilian'],
    tags: ['society', 'core'],
    themeNote: 'The reading keeps war grounded in one family\'s real, human experience rather than abstract history.',
    collocations: ['during the war', 'the war changed', 'because of the war', 'after the war', 'talk about the war'],
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
      'The war created many victims, even among people who never fought.',
      'Civilians can become victims of a war without ever being soldiers.',
    ],
    relatedWords: ['civilian', 'refugee', 'war'],
    tags: ['society'],
    themeNote: 'This word widens students\' understanding of war beyond soldiers — ordinary people who never fought can still be deeply affected.',
    collocations: ['a victim of war', 'many victims', 'become a victim', 'innocent victim', 'among the victims'],
  },

  {
    id: 'pw-f-04',
    word: 'refugee',
    japanese: '難民',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war'],
    coreMeaning: 'A person forced to leave their home, often because of war or danger.',
    examples: [
      'They became refugees for almost a year, moving from place to place.',
      'Being a refugee meant carrying only what they could and never feeling quite safe.',
    ],
    relatedWords: ['civilian', 'victim', 'war'],
    tags: ['society'],
    themeNote: 'The passage makes "refugee" concrete through one grandmother\'s daily experience — carrying only what she could carry, never feeling safe.',
    collocations: ['become a refugee', 'refugee family', 'as a refugee', 'refugees fleeing', 'a year as refugees'],
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
      'As a civilian, she was never a soldier, but the war still changed everything about her daily life.',
      'Most victims of war are civilians, not soldiers.',
    ],
    relatedWords: ['victim', 'refugee', 'war'],
    tags: ['society'],
    themeNote: 'This word draws a clear, important line between soldiers and everyone else affected by war — most of the people in this story.',
    collocations: ['as a civilian', 'civilian life', 'civilian population', 'affect civilians', 'ordinary civilian'],
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
      'When the fighting finally ended and the two sides signed a peace treaty, her family could return home.',
      'A peace treaty officially ends a war between two sides.',
    ],
    relatedWords: ['peace', 'war', 'legacy'],
    tags: ['society'],
    themeNote: 'A treaty is the concrete, official moment where a war formally ends — the turning point in this theme\'s reading.',
    collocations: ['sign a treaty', 'a peace treaty', 'treaty between', 'under the treaty', 'after the treaty'],
  },

  {
    id: 'pw-f-07',
    word: 'history',
    japanese: '歴史',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war', 'learning-from-history'],
    coreMeaning: 'The events of the past, especially ones that are remembered and studied.',
    examples: [
      'Now, she wanted Yuna to know this piece of family history.',
      'Her grandmother\'s story is part of both family and world history.',
    ],
    relatedWords: ['legacy', 'peace', 'war'],
    tags: ['society', 'core'],
    themeNote: 'This theme makes history personal — not just something in a textbook, but a grandmother\'s own remembered experience.',
    collocations: ['family history', 'a piece of history', 'part of history', 'learn history', 'know the history'],
  },

  {
    id: 'pw-f-08',
    word: 'legacy',
    japanese: '遺産・受け継がれるもの',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['peace-and-war', 'learning-from-history'],
    coreMeaning: 'Something meaningful passed down from the past that still matters now.',
    examples: [
      'She wanted Yuna to know this as a legacy of surviving something very hard and choosing peace afterward.',
      'Every family carries some kind of legacy from the past.',
    ],
    relatedWords: ['history', 'peace', 'war'],
    tags: ['society', 'core'],
    themeNote: 'The passage reframes a hard family history as a legacy — something valuable passed down — rather than only something sad to carry.',
    collocations: ['a legacy of', 'family legacy', 'pass down a legacy', 'leave a legacy', 'part of the legacy'],
  },

  // ── Caring for Our Planet — Foundation ──────────────────────────────────────

  {
    id: 'cp-f-01',
    word: 'environment',
    japanese: '環境',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'The natural world — land, water, air, plants, and animals — around us.',
    examples: [
      'Pollution from nearby towns was affecting the local environment.',
      'Small daily choices can add up to a real difference for the environment.',
    ],
    relatedWords: ['ecosystem', 'pollution', 'climate'],
    tags: ['nature', 'core'],
    themeNote: 'This theme keeps "environment" concrete and local — one real beach, not an abstract global idea — before it becomes something to act on.',
    collocations: ['the local environment', 'protect the environment', 'affect the environment', 'good for the environment', 'harm the environment'],
  },

  {
    id: 'cp-f-02',
    word: 'species',
    japanese: '種（生物の）',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['caring-for-our-planet'],
    coreMeaning: 'A group of living things that share the same basic characteristics.',
    examples: [
      'Even one species, like the crabs she loved, depended on people using resources more carefully.',
      'Every species plays a role in its ecosystem.',
    ],
    relatedWords: ['ecosystem', 'environment', 'resource'],
    tags: ['nature'],
    themeNote: 'The passage makes "species" personal by grounding it in one specific animal — the crabs Aoi used to chase as a child.',
    collocations: ['one species', 'a species of', 'protect a species', 'species depend on', 'many species'],
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
      'The ecosystem — all the plants and animals connected to this one small beach — was slowly changing because of it.',
      'Pollution can quietly change an entire ecosystem over time.',
    ],
    relatedWords: ['species', 'environment', 'climate'],
    tags: ['nature', 'core'],
    themeNote: 'The passage defines this word for you the moment it\'s used — a good model for how a specific, technical word can be explained through context.',
    collocations: ['a local ecosystem', 'the whole ecosystem', 'part of the ecosystem', 'affect the ecosystem', 'a healthy ecosystem'],
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
      'A warmer climate was affecting the whole coastline.',
      'Scientists study how the climate is slowly changing around the world.',
    ],
    relatedWords: ['environment', 'ecosystem', 'pollution'],
    tags: ['nature', 'core'],
    themeNote: 'Climate here means the broad, gradual pattern affecting the whole coastline — distinct from a single day\'s weather.',
    collocations: ['a warmer climate', 'climate change', 'affect the climate', 'local climate', 'climate around the world'],
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
      'Pollution from nearby towns was affecting the local environment.',
      'Plastic bottles on the beach are one visible sign of pollution.',
    ],
    relatedWords: ['environment', 'ecosystem', 'resource'],
    tags: ['nature', 'core'],
    themeNote: 'The passage lets Aoi see pollution directly — more plastic bottles, fewer crabs — before naming the word itself.',
    collocations: ['cause pollution', 'plastic pollution', 'pollution from', 'reduce pollution', 'affected by pollution'],
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
      'She learned that even one species depended on people using resources like water and plastic more carefully.',
      'Using resources carefully is one small way to help the environment.',
    ],
    relatedWords: ['environment', 'pollution', 'ecosystem'],
    tags: ['nature', 'core'],
    themeNote: 'This word connects everyday choices (using water, using plastic) directly to the health of an entire ecosystem.',
    collocations: ['natural resources', 'use resources carefully', 'save resources', 'resources like water', 'limited resources'],
  },

  // ── Living with AI — Foundation ─────────────────────────────────────────────

  {
    id: 'la-f-01',
    word: 'AI',
    japanese: 'AI・人工知能',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'Artificial intelligence — computer systems that can perform tasks that normally need human thinking.',
    examples: [
      'Kenta typed his essay question into an AI tool and watched as a full paragraph appeared in seconds.',
      'AI could help him start, but the thinking still had to be his.',
    ],
    relatedWords: ['technology', 'algorithm', 'automation'],
    tags: ['technology', 'core'],
    themeNote: 'This theme is about how a student actually uses AI in daily life — not AI as an abstract topic, but as a tool with real usefulness and real limits.',
    collocations: ['use AI', 'an AI tool', 'ask AI for help', 'AI can help', 'rely on AI'],
  },

  {
    id: 'la-f-02',
    word: 'technology',
    japanese: '技術・テクノロジー',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'Tools, machines, and systems created using scientific knowledge to solve problems or do tasks.',
    examples: [
      'This kind of technology could save time, but automation could not do his thinking for him.',
      'New technology changes how students study and write.',
    ],
    relatedWords: ['AI', 'automation', 'algorithm'],
    tags: ['technology', 'core'],
    themeNote: 'The passage draws a careful line: technology can save time, but it cannot replace a student\'s own thinking or responsibility.',
    collocations: ['new technology', 'use technology', 'technology can...', 'rely on technology', 'modern technology'],
  },

  {
    id: 'la-f-03',
    word: 'automation',
    japanese: '自動化',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'The use of machines or systems to do tasks automatically, without a person doing them directly.',
    examples: [
      'This kind of technology could save time, but automation could not do his thinking for him.',
      'Automation can handle repetitive tasks, but not real understanding.',
    ],
    relatedWords: ['technology', 'AI', 'convenience'],
    tags: ['technology'],
    themeNote: 'Automation is presented as genuinely useful but limited — it can save time on a task, but it can\'t take over the thinking behind it.',
    collocations: ['automation can...', 'through automation', 'rely on automation', 'automation of tasks', 'automation and thinking'],
  },

  {
    id: 'la-f-04',
    word: 'convenience',
    japanese: '便利さ',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'The quality of being easy, quick, or effortless to use.',
    examples: [
      'It was so convenient — no searching, no staring at a blank page — that he almost forgot to think about whether it was actually good.',
      'The convenience of AI can make it easy to stop thinking critically.',
    ],
    relatedWords: ['AI', 'technology', 'automation'],
    tags: ['technology', 'core'],
    themeNote: 'The passage shows how convenience itself can be a trap — the easier something is, the easier it is to stop checking it.',
    collocations: ['for convenience', 'the convenience of', 'so convenient', 'convenience over quality', 'a convenient tool'],
  },

  {
    id: 'la-f-05',
    word: 'algorithm',
    japanese: 'アルゴリズム',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['living-with-ai'],
    coreMeaning: 'A set of steps or rules a computer program follows to complete a task.',
    examples: [
      'He was curious about how its algorithm could suggest angles he had not considered.',
      'An algorithm follows clear steps — it doesn\'t think or feel the way a person does.',
    ],
    relatedWords: ['AI', 'technology', 'automation'],
    tags: ['technology', 'core'],
    themeNote: 'Understanding what an algorithm actually is — a set of steps, not a thinking being — is essential to using AI thoughtfully rather than mysteriously.',
    collocations: ['an algorithm suggests', 'how the algorithm works', 'follow an algorithm', 'algorithm and data', 'a search algorithm'],
    otherMeanings: ['Often confused with "a robot" or "an AI company" — an algorithm is specifically the set of steps/rules a program follows, not the program, device, or company itself.'],
  },

  // ── Learning from History — Foundation ──────────────────────────────────────

  {
    id: 'lh-f-01',
    word: 'event',
    japanese: '出来事',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'Something that happens, especially something important or memorable.',
    examples: [
      'The shop had closed suddenly after one event: a fire that swept through the neighborhood.',
      'One small event can end up shaping a whole family\'s future.',
    ],
    relatedWords: ['cause', 'effect', 'history'],
    tags: ['history', 'core'],
    themeNote: 'The passage shows how a single, specific event — not a vague sense of "the past" — is what actually connects family history to the present.',
    collocations: ['a single event', 'an important event', 'because of one event', 'a historical event', 'the event changed'],
  },

  {
    id: 'lh-f-02',
    word: 'era',
    japanese: '時代',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'A period of time in history, often known for certain events or conditions.',
    examples: [
      'Rin\'s ancestor ran that little shop during a very different era, long before either of them was born.',
      'Life in that era was very different from life today.',
    ],
    relatedWords: ['history', 'event', 'ancestor'],
    tags: ['history'],
    themeNote: 'The passage uses "era" to mark the distance between Rin\'s own life and her ancestor\'s — a different time with different daily realities.',
    collocations: ['a different era', 'during that era', 'a new era', 'era of', 'live in an era'],
  },

  {
    id: 'lh-f-03',
    word: 'cause',
    japanese: '原因',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'The reason something happens; what makes an event occur.',
    examples: [
      'One cause, her grandmother said, had led to so many effects, some of which were still shaping the family even now.',
      'Understanding the cause of an event helps you understand what happened next.',
    ],
    relatedWords: ['effect', 'event', 'history'],
    tags: ['history', 'core'],
    themeNote: 'This theme treats cause and effect as a real, traceable chain — one specific event leading to specific, lasting changes.',
    collocations: ['the cause of', 'one cause', 'root cause', 'cause and effect', 'cause led to'],
  },

  {
    id: 'lh-f-04',
    word: 'effect',
    japanese: '結果・影響',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'A change or result that happens because of something else.',
    examples: [
      'One cause had led to so many effects, some of which were still shaping the family even now.',
      'A single event can have effects that last for generations.',
    ],
    relatedWords: ['cause', 'event', 'history'],
    tags: ['history', 'core'],
    themeNote: 'The passage makes effects concrete and personal — a family moving and finding new work — not an abstract historical consequence.',
    collocations: ['an effect on', 'lasting effects', 'the effects of', 'have an effect', 'still feel the effects'],
  },

  {
    id: 'lh-f-05',
    word: 'ancestor',
    japanese: '祖先',
    pos: 'noun',
    introductionLevel: 'foundation',
    themes: ['learning-from-history'],
    coreMeaning: 'A family member who lived a long time before you, often generations back.',
    examples: [
      'The woman in the photograph was Rin\'s own ancestor, who had run that little shop during a very different era.',
      'Learning about an ancestor can make history feel personal.',
    ],
    relatedWords: ['history', 'legacy', 'era'],
    tags: ['history', 'family'],
    themeNote: 'This word is what makes history personal in this theme — not a stranger from a textbook, but Rin\'s own family member.',
    collocations: ['a family ancestor', 'her own ancestor', 'ancestors before her', 'trace your ancestors', 'an ancestor\'s story'],
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
