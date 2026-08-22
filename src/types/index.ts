export type Level = 'foundation' | 'advanced';

export type ActivityType =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'writing'
  | 'ai-talk'
  | 'speaking'
  | 'translation';

export type ThemeColor = 'violet' | 'emerald' | 'amber' | 'teal' | 'rose' | 'sky' | 'indigo' | 'orange' | 'fuchsia' | 'cyan';

export interface Theme {
  id: string;
  slug: string;
  title: string;
  titleJapanese: string;
  description: string;
  descriptionJapanese: string;
  color: ThemeColor;
  order: number;
}

export interface LevelInfo {
  level: Level;
  label: string;
  labelJapanese: string;
  descriptionJapanese: string;
}

export interface ActivityDef {
  type: ActivityType;
  label: string;
  labelJapanese: string;
  estimatedMinutes: number;
  icon: string;
  /** Excluded from the activity selection grid, but the route/type stays valid (old links keep working). */
  hidden?: boolean;
}

export interface LevelProgress {
  completedActivities: ActivityType[];
  startedAt: string | null;
}

export interface ThemeProgress {
  /** UI preference only — which level to default to / show as "last
   *  studied." Never used to attribute or gate activity completion:
   *  Foundation and Advanced progress live independently in `levels`,
   *  and switching this must never move or merge either level's data. */
  lastLevel: Level | null;
  levels: Partial<Record<Level, LevelProgress>>;
}

/** A word's self-reported review state, distinct from whether it has ever
 *  been opened at all: 'seen' is the default the moment a word is opened
 *  (no claim about learning either way), 'known' and 'learning' only ever
 *  come from an explicit student action ("I know this" / "Still learning")
 *  in Portfolio's My Vocabulary review queue. */
export type WordReviewStatus = 'seen' | 'known' | 'learning';
