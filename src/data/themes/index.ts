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
    id: 'living-together',
    slug: 'living-together',
    title: 'Living Together',
    titleJapanese: '共に生きる',
    description: 'Understand relationships, community, and what it means to live with others.',
    descriptionJapanese: '人間関係、コミュニティ、多様性について英語で考え、表現します。',
    color: 'emerald',
    order: 2,
  },
  {
    id: 'building-my-future',
    slug: 'building-my-future',
    title: 'Building My Future',
    titleJapanese: '未来を創る',
    description: 'Think about goals, choices, and the path ahead at university and beyond.',
    descriptionJapanese: '進路、目標、大学生活について英語で考え、自分の言葉で伝えます。',
    color: 'amber',
    order: 3,
  },
  {
    id: 'caring-for-our-planet',
    slug: 'caring-for-our-planet',
    title: 'Caring for Our Planet',
    titleJapanese: '地球を守る',
    description: 'Engage with environmental challenges and what individuals can do.',
    descriptionJapanese: '環境問題と私たちにできる行動について、英語で意見を表現します。',
    color: 'teal',
    order: 4,
  },
  {
    id: 'learning-from-history',
    slug: 'learning-from-history',
    title: 'Learning from History',
    titleJapanese: '歴史に学ぶ',
    description: 'Explore historical events and the lessons they carry into the present.',
    descriptionJapanese: '歴史的な出来事を英語で読み解き、現在との関係を考えます。',
    color: 'rose',
    order: 5,
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
    level: 'standard',
    label: 'Standard',
    labelJapanese: '標準',
    descriptionJapanese: '大学で求められる英語のレベル。このコースの中心となる学習範囲です。',
  },
  {
    level: 'challenge',
    label: 'Challenge',
    labelJapanese: '発展',
    descriptionJapanese: 'より複雑な表現・高度な語彙。力試しをしたい方に。',
  },
];

export const ACTIVITY_DEFS: ActivityDef[] = [
  { type: 'vocabulary',  label: 'Vocabulary',  labelJapanese: '語彙',        estimatedMinutes: 20, icon: '📖' },
  { type: 'grammar',     label: 'Grammar',     labelJapanese: '文法',        estimatedMinutes: 25, icon: '✏️' },
  { type: 'reading',     label: 'Reading',     labelJapanese: 'リーディング', estimatedMinutes: 30, icon: '📄' },
  { type: 'writing',     label: 'Writing',     labelJapanese: 'ライティング', estimatedMinutes: 35, icon: '🖊️' },
  { type: 'speaking',    label: 'Speaking',    labelJapanese: 'スピーキング', estimatedMinutes: 20, icon: '🎙️' },
  { type: 'translation', label: 'Translation', labelJapanese: '翻訳',        estimatedMinutes: 20, icon: '🔄' },
];

export function getThemeBySlug(slug: string): Theme | undefined {
  return THEMES.find(t => t.slug === slug);
}

export function isValidLevel(value: string): value is Level {
  return ['foundation', 'standard', 'challenge'].includes(value);
}

export function isValidActivityType(value: string): value is ActivityType {
  return ['vocabulary', 'grammar', 'reading', 'writing', 'speaking', 'translation'].includes(value);
}
