import type { Level } from '@/types';

export interface ThemeVocabSet {
  themeId: string;
  foundation: string[];
  advanced: string[];
}

export const THEME_VOCAB_SETS: Record<string, ThemeVocabSet> = {
  'knowing-myself': {
    themeId: 'knowing-myself',
    foundation: ['km-f-01', 'km-f-06', 'km-f-07', 'km-f-02', 'km-f-04', 'km-f-08', 'km-f-10', 'km-f-11'],
    advanced:   ['km-s-01', 'km-s-02', 'km-s-03', 'km-s-04', 'km-s-05', 'km-s-06', 'km-s-07', 'km-s-08'],
  },
  'university-student': {
    themeId: 'university-student',
    foundation: ['us-f-01', 'us-f-02', 'us-f-03', 'us-f-04', 'us-f-05', 'us-f-06', 'us-f-07', 'us-f-08', 'us-f-09', 'us-f-10', 'us-f-11', 'us-f-12', 'us-f-13'],
    advanced:   [],
  },
  'designing-my-future': {
    themeId: 'designing-my-future',
    foundation: ['km-f-03', 'km-f-05', 'us-f-07', 'df-f-01', 'df-f-02', 'df-f-03', 'km-f-09'],
    advanced:   [],
  },
  'living-together': {
    themeId: 'living-together',
    foundation: ['lt-f-01', 'lt-f-02', 'lt-f-03', 'lt-f-04', 'lt-f-05', 'lt-f-06', 'lt-f-07', 'lt-f-08', 'lt-f-09', 'lt-f-10'],
    advanced:   [],
  },
  'facts-or-fake': {
    themeId: 'facts-or-fake',
    foundation: ['ff-f-01', 'ff-f-02', 'ff-f-03', 'ff-f-04', 'ff-f-05', 'ff-f-06', 'ff-f-07', 'lt-f-02', 'ff-f-08', 'ff-f-09'],
    advanced:   [],
  },
  'peace-and-war': {
    themeId: 'peace-and-war',
    foundation: ['pw-f-01', 'pw-f-02', 'pw-f-03', 'pw-f-04', 'pw-f-05', 'pw-f-06', 'pw-f-07', 'pw-f-08'],
    advanced:   [],
  },
  'caring-for-our-planet': {
    themeId: 'caring-for-our-planet',
    foundation: ['cp-f-01', 'cp-f-02', 'cp-f-03', 'cp-f-04', 'cp-f-05', 'cp-f-06'],
    advanced:   [],
  },
  'living-with-ai': {
    themeId: 'living-with-ai',
    foundation: ['la-f-01', 'la-f-02', 'la-f-03', 'la-f-04', 'la-f-05'],
    advanced:   [],
  },
  'learning-from-history': {
    themeId: 'learning-from-history',
    foundation: ['pw-f-07', 'pw-f-08', 'lh-f-01', 'lh-f-02', 'lh-f-03', 'lh-f-04', 'lh-f-05'],
    advanced:   [],
  },
  'science-in-everyday-life': {
    themeId: 'science-in-everyday-life',
    foundation: ['se-f-01', 'se-f-02', 'se-f-03', 'se-f-04', 'se-f-05', 'se-f-06'],
    advanced:   [],
  },
};

export function getThemeVocabIds(themeId: string, level: Level): string[] {
  const set = THEME_VOCAB_SETS[themeId];
  if (!set) return [];
  if (level === 'foundation') return set.foundation;
  return [...set.foundation, ...set.advanced];
}

export function buildShooterSets(ids: string[]): string[][] {
  if (ids.length === 0) return [[], [], [], []];
  const count = ids.length;
  const base = Math.floor(count / 4);
  const remainder = count % 4;
  const sets: string[][] = [];
  let cursor = 0;
  for (let i = 0; i < 4; i++) {
    const size = base + (i < remainder ? 1 : 0);
    sets.push(ids.slice(cursor, cursor + size));
    cursor += size;
  }
  return sets;
}

export function buildPracticeSets(ids: string[]): string[][] {
  if (ids.length === 0) return [];
  const numSets = Math.max(1, Math.min(4, Math.floor(ids.length / 5)));
  const base      = Math.floor(ids.length / numSets);
  const remainder = ids.length % numSets;
  const sets: string[][] = [];
  let cursor = 0;
  for (let i = 0; i < numSets; i++) {
    const size = base + (i < remainder ? 1 : 0);
    sets.push(ids.slice(cursor, cursor + size));
    cursor += size;
  }
  return sets;
}
