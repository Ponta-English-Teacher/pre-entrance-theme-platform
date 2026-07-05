import type { Level } from '@/types';

export interface ThemeVocabSet {
  themeId: string;
  foundation: string[];
  standard: string[];
  challenge: string[];
}

export const THEME_VOCAB_SETS: Record<string, ThemeVocabSet> = {};

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
