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
    // us-f-07 ("decide") deliberately excluded — not part of Theme 2's new
    // target set, kept only for Theme 3's cross-reference. "responsibility"
    // (us-f-05) is the one Foundation word this theme's Advanced level
    // reinforces; it is not duplicated into the advanced array below.
    foundation: ['us-f-01', 'us-f-02', 'us-f-03', 'us-f-04', 'us-f-05', 'us-f-06', 'us-f-08', 'us-f-09'],
    advanced:   ['us-s-01', 'us-s-02', 'us-s-03', 'us-s-04', 'us-s-05', 'us-s-06', 'us-s-07'],
  },
  'designing-my-future': {
    themeId: 'designing-my-future',
    foundation: ['df-f-01', 'df-f-02', 'df-f-03', 'df-f-04', 'df-f-05', 'df-f-06', 'df-f-07', 'df-f-08'],
    advanced:   ['df-s-01', 'df-s-02', 'df-s-03', 'df-s-04', 'df-s-05', 'df-s-06', 'df-s-07', 'df-s-08'],
  },
  'living-together': {
    themeId: 'living-together',
    foundation: ['lt-f-01', 'lt-f-02', 'lt-f-03', 'lt-f-04', 'lt-f-05', 'lt-f-06', 'lt-f-07', 'lt-f-08', 'lt-f-09', 'lt-f-10', 'lt-f-11'],
    advanced:   ['lt-s-01', 'lt-s-02', 'lt-s-03', 'lt-s-04', 'lt-s-05', 'lt-s-06', 'lt-s-07', 'lt-s-08'],
  },
  'facts-or-fake': {
    themeId: 'facts-or-fake',
    foundation: ['ff-f-01', 'ff-f-02', 'ff-f-03', 'ff-f-04', 'ff-f-05', 'ff-f-06', 'ff-f-07', 'lt-f-02', 'ff-f-08', 'ff-f-09'],
    advanced:   ['ff-s-01', 'ff-s-02', 'ff-s-03', 'ff-s-04', 'ff-s-05', 'ff-s-06', 'ff-s-07', 'ff-s-08', 'ff-s-09', 'ff-s-10'],
  },
  'peace-and-war': {
    themeId: 'peace-and-war',
    foundation: ['pw-f-01', 'pw-f-02', 'pw-f-03', 'pw-f-04', 'pw-f-05', 'pw-f-06', 'pw-f-08', 'pw-f-09', 'pw-f-10', 'pw-f-11'],
    advanced:   ['pw-s-01', 'pw-s-02', 'pw-s-03', 'pw-s-04', 'pw-s-05', 'pw-s-06', 'pw-s-07', 'pw-s-08', 'pw-s-09', 'pw-s-10'],
  },
  'caring-for-our-planet': {
    themeId: 'caring-for-our-planet',
    foundation: ['cp-f-01', 'cp-f-02', 'cp-f-03', 'cp-f-04', 'cp-f-05', 'cp-f-06', 'cp-f-07', 'cp-f-08', 'cp-f-09', 'cp-f-10'],
    advanced:   ['cp-s-01', 'cp-s-02', 'cp-s-03', 'cp-s-04', 'cp-s-05', 'cp-s-06', 'cp-s-07', 'cp-s-08', 'cp-s-09', 'cp-s-10'],
  },
  'living-with-ai': {
    themeId: 'living-with-ai',
    foundation: ['la-f-01', 'la-f-02', 'la-f-03', 'la-f-04', 'la-f-05', 'la-f-06', 'la-f-07', 'la-f-08', 'la-f-09', 'la-f-10'],
    advanced:   ['la-s-01', 'la-s-02', 'la-s-03', 'la-s-04', 'la-s-05', 'la-s-06', 'la-s-07', 'la-s-08', 'la-s-09', 'la-s-10'],
  },
  'learning-from-history': {
    themeId: 'learning-from-history',
    foundation: ['lh-f-01', 'lh-f-02', 'lh-f-03', 'lh-f-04', 'lh-f-05', 'lh-f-06', 'lh-f-07', 'lh-f-08', 'lh-f-09', 'lh-f-10'],
    advanced:   ['lh-s-01', 'lh-s-02', 'lh-s-03', 'lh-s-04', 'lh-s-05', 'lh-s-06', 'lh-s-07', 'lh-s-08', 'lh-s-09', 'lh-s-10'],
  },
  'science-in-everyday-life': {
    themeId: 'science-in-everyday-life',
    foundation: ['se-f-01', 'se-f-02', 'se-f-03', 'se-f-04', 'se-f-05', 'se-f-06', 'se-f-07', 'se-f-08', 'se-f-09', 'se-f-10'],
    advanced:   ['se-s-01', 'se-s-02', 'se-s-03', 'se-s-04', 'se-s-05', 'se-s-06', 'se-s-07', 'se-s-08', 'se-s-09', 'se-s-10'],
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
