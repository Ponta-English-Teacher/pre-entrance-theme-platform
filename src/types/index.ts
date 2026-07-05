export type Level = 'foundation' | 'standard' | 'challenge';

export type ActivityType =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'translation';

export type ThemeColor = 'violet' | 'emerald' | 'amber' | 'teal' | 'rose';

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
}

export interface ThemeProgress {
  chosenLevel: Level | null;
  completedActivities: ActivityType[];
  startedAt: string | null;
}
