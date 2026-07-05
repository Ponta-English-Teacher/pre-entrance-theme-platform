import type { Level } from '@/types';

export interface ThemeVocabSet {
  themeId: string;
  foundation: string[];
  standard: string[];
  challenge: string[];
}

export const THEME_VOCAB_SETS: Record<string, ThemeVocabSet> = {
  'knowing-myself': {
    themeId: 'knowing-myself',
    foundation: ['km-f-01', 'km-f-02', 'km-f-03', 'km-f-04', 'km-f-05', 'km-f-06', 'km-f-07', 'km-f-08', 'km-f-09', 'km-f-10'],
    standard:   ['km-s-01', 'km-s-02', 'km-s-03', 'km-s-04', 'km-s-05', 'km-s-06', 'km-s-07', 'km-s-08'],
    challenge:  ['km-c-01', 'km-c-02', 'km-c-03', 'km-c-04', 'km-c-05', 'km-c-06'],
  },
};

export function getThemeVocabIds(themeId: string, level: Level): string[] {
  const set = THEME_VOCAB_SETS[themeId];
  if (!set) return [];
  if (level === 'foundation') return set.foundation;
  if (level === 'standard') return [...set.foundation, ...set.standard];
  return [...set.foundation, ...set.standard, ...set.challenge];
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
