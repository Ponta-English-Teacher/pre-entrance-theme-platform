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
}

export const MASTER_VOCABULARY: VocabEntry[] = [];

export function getVocabById(id: string): VocabEntry | undefined {
  return MASTER_VOCABULARY.find(entry => entry.id === id);
}

export function getVocabSubset(ids: string[]): VocabEntry[] {
  const idSet = new Set(ids);
  return MASTER_VOCABULARY.filter(entry => idSet.has(entry.id));
}

export function getVocabByTheme(themeId: string): VocabEntry[] {
  return MASTER_VOCABULARY.filter(entry => entry.themes.includes(themeId));
}
