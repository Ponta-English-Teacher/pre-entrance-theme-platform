import type { Theme, LevelInfo, ActivityDef, Level, ActivityType } from '@/types';

export const THEMES: Theme[] = [
  {
    id: 'knowing-myself',
    slug: 'knowing-myself',
    title: 'Knowing Myself',
    titleJapanese: '自己理解',
    description: 'Explore who you are — your personality, values, and aspirations.',
    descriptionJapanese: '自分の性格、価値観、将来の夢について英語で表現する力を身につけます。',
    color: 'violet',
    order: 1,
  },
  {
    id: 'university-student',
    slug: 'university-student',
    title: 'What Does It Mean to Be a University Student?',
    titleJapanese: '大学生になるということ',
    description: 'Think about the transition into university life and the kind of student you want to become.',
    descriptionJapanese: '大学生活への移行や、自分がどんな学生になりたいかについて英語で考えます。',
    color: 'sky',
    order: 2,
  },
  {
    // Renamed from the earlier "building-my-future" placeholder to match the frozen
    // docs/CURRICULUM_MAP.md title exactly (see that doc's Theme 3 Notes).
    id: 'designing-my-future',
    slug: 'designing-my-future',
    title: 'Designing My Future',
    titleJapanese: '未来を描く',
    description: 'Think about your future goals, choices, and the path after university.',
    descriptionJapanese: '将来の目標や進路の選択について、英語で考え表現します。',
    color: 'amber',
    order: 3,
  },
  {
    id: 'living-together',
    slug: 'living-together',
    title: 'Living Together',
    titleJapanese: '共に生きる',
    description: 'Understand relationships, community, and what it means to live with others.',
    descriptionJapanese: '人間関係、コミュニティ、多様性について英語で考え、表現します。',
    color: 'emerald',
    order: 4,
  },
  {
    id: 'facts-or-fake',
    slug: 'facts-or-fake',
    title: 'Facts or Fake?',
    titleJapanese: '情報を見きわめる',
    description: 'Build critical thinking and media literacy skills to evaluate what you read online.',
    descriptionJapanese: '情報の真偽を見極める力とメディアリテラシーを英語で身につけます。',
    color: 'orange',
    order: 5,
  },
  {
    id: 'peace-and-war',
    slug: 'peace-and-war',
    title: 'Peace and War',
    titleJapanese: '平和と戦争',
    description: 'Think about conflict, peace, and the lessons history offers.',
    descriptionJapanese: '争いや平和、歴史から学べる教訓について英語で考えます。',
    color: 'indigo',
    order: 6,
  },
  {
    id: 'caring-for-our-planet',
    slug: 'caring-for-our-planet',
    title: 'Caring for Our Planet',
    titleJapanese: '地球を守る',
    description: 'Engage with environmental challenges and what individuals can do.',
    descriptionJapanese: '環境問題と私たちにできる行動について、英語で意見を表現します。',
    color: 'teal',
    order: 7,
  },
  {
    id: 'living-with-ai',
    slug: 'living-with-ai',
    title: 'Living with AI',
    titleJapanese: 'AIと生きる',
    description: 'Think about the role of AI in daily life, learning, and the future.',
    descriptionJapanese: '日常生活や学び、未来におけるAIの役割について英語で考えます。',
    color: 'fuchsia',
    order: 8,
  },
  {
    id: 'learning-from-history',
    slug: 'learning-from-history',
    title: 'Learning from History',
    titleJapanese: '歴史に学ぶ',
    description: 'Explore historical events and the lessons they carry into the present.',
    descriptionJapanese: '歴史的な出来事を英語で読み解き、現在との関係を考えます。',
    color: 'rose',
    order: 9,
  },
  {
    id: 'science-in-everyday-life',
    slug: 'science-in-everyday-life',
    title: 'Science in Everyday Life',
    titleJapanese: '日常のサイエンス',
    description: 'Connect scientific thinking to your daily life and curiosity.',
    descriptionJapanese: '身近な出来事から科学的な考え方や好奇心について英語で学びます。',
    color: 'cyan',
    order: 10,
  },
];

export const LEVEL_INFO: LevelInfo[] = [
  {
    level: 'foundation',
    label: 'Foundation',
    labelJapanese: '基礎',
    descriptionJapanese: '読みやすい文・基本的な語彙。英語に慣れるところからはじめます。',
  },
  {
    level: 'advanced',
    label: 'Advanced',
    labelJapanese: '上級',
    descriptionJapanese: '豊かな語彙と自然な英語で、より深く考え、意見を表現します。',
  },
];

export const ACTIVITY_DEFS: ActivityDef[] = [
  { type: 'vocabulary',  label: 'Vocabulary',         labelJapanese: '語彙',                    estimatedMinutes: 20, icon: '📖' },
  // Renamed from "Reading & Writing" — Reading and Writing are two
  // standalone activities in the Theme Experience Template (Writing has its
  // own WritingActivity.tsx page/route since the V2 experience), so the
  // combined label is obsolete for any migrated theme/level. The `type`
  // stays 'reading' (an id, not user-facing) so no routes or stored
  // progress break.
  { type: 'reading',     label: 'Reading',            labelJapanese: 'リーディング',             estimatedMinutes: 45, icon: '📰' },
  // Reserved for a future Pronunciation & Delivery activity (reading aloud, rhythm, stress,
  // intonation) — a distinct activity from AI Talk. Hidden until that activity has a real
  // design and implementation; the type/route stay valid so nothing breaks when it's built.
  { type: 'speaking',    label: 'Speaking',           labelJapanese: 'スピーキング',             estimatedMinutes: 20, icon: '🎙️', hidden: true },
  // Hidden from the activity grid for now — routes stay valid so old links don't break, and the
  // underlying activity-player dispatch (src/app/themes/[slug]/[level]/[type]/page.tsx) is untouched.
  { type: 'grammar',     label: 'Grammar',            labelJapanese: '文法',                    estimatedMinutes: 25, icon: '✏️', hidden: true },
  // NOT statically hidden — visibility is content-gated per theme/level in
  // ActivityGrid.tsx (only shown where a lesson has experienceVersion === 2,
  // i.e. Theme 1, during this prototype stage — see also `writingReady` for
  // per-level content gating within that). Every other theme/level has no
  // such lesson, so this stays invisible for them exactly as `hidden: true`
  // would have made it, with no change needed here later as more themes
  // migrate. Positioned right after Reading, before AI Talk, to match the
  // approved Theme Experience Template sequence: Vocabulary → Reading →
  // Writing → AI Talk.
  { type: 'writing',     label: 'Writing',            labelJapanese: 'ライティング',             estimatedMinutes: 35, icon: '🖊️' },
  { type: 'ai-talk',     label: 'AI Talk',            labelJapanese: 'AIトーク',                estimatedMinutes: 15, icon: '💬' },
  { type: 'translation', label: 'Translation',        labelJapanese: '翻訳',                    estimatedMinutes: 20, icon: '🔄', hidden: true },
];

export function getThemeBySlug(slug: string): Theme | undefined {
  return THEMES.find(t => t.slug === slug);
}

export function isValidLevel(value: string): value is Level {
  return ['foundation', 'advanced'].includes(value);
}

export function isValidActivityType(value: string): value is ActivityType {
  return ['vocabulary', 'grammar', 'reading', 'writing', 'ai-talk', 'speaking', 'translation'].includes(value);
}
