import type { Level, ActivityType, ThemeProgress } from '@/types';

const STORAGE_KEY  = 'etp-progress';
const GLOSSARY_KEY = 'etp-glossary';

export interface GlossaryItem {
  word: string;
  japanese: string;
  definition: string;
  example: string;
  themeId: string;
  savedDate: string;
}

function readAll(): Record<string, ThemeProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ThemeProgress>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ThemeProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getThemeProgress(themeId: string): ThemeProgress {
  return readAll()[themeId] ?? { chosenLevel: null, completedActivities: [], startedAt: null };
}

export function setChosenLevel(themeId: string, level: Level): void {
  const all = readAll();
  all[themeId] = {
    ...getThemeProgress(themeId),
    chosenLevel: level,
    startedAt: all[themeId]?.startedAt ?? new Date().toISOString(),
  };
  writeAll(all);
}

export function markActivityComplete(themeId: string, type: ActivityType): void {
  const all = readAll();
  const progress = getThemeProgress(themeId);
  if (!progress.completedActivities.includes(type)) {
    progress.completedActivities = [...progress.completedActivities, type];
  }
  all[themeId] = progress;
  writeAll(all);
}

export function getAllProgress(): Record<string, ThemeProgress> {
  return readAll();
}

// ── Studied words ─────────────────────────────────────────────────────────────

const STUDIED_KEY  = 'etp-studied-words';
const PRACTICE_KEY = 'etp-practice';

export function getStudiedWordIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STUDIED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markWordStudied(wordId: string): void {
  if (typeof window === 'undefined') return;
  const ids = getStudiedWordIds();
  if (!ids.includes(wordId)) {
    ids.push(wordId);
    try { localStorage.setItem(STUDIED_KEY, JSON.stringify(ids)); } catch {}
  }
}

// ── Practice set completion ───────────────────────────────────────────────────

export function getCompletedPracticeSets(themeId: string, level: string): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRACTICE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    return all[`${themeId}/${level}`] ?? [];
  } catch {
    return [];
  }
}

export function markPracticeSetComplete(themeId: string, level: string, setNumber: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw  = localStorage.getItem(PRACTICE_KEY);
    const all  = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    const key  = `${themeId}/${level}`;
    const sets = all[key] ?? [];
    if (!sets.includes(setNumber)) {
      sets.push(setNumber);
      all[key] = sets;
      localStorage.setItem(PRACTICE_KEY, JSON.stringify(all));
    }
  } catch {}
}

// ── Glossary ──────────────────────────────────────────────────────────────────

function readGlossary(): GlossaryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GLOSSARY_KEY);
    return raw ? (JSON.parse(raw) as GlossaryItem[]) : [];
  } catch {
    return [];
  }
}

function writeGlossary(items: GlossaryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GLOSSARY_KEY, JSON.stringify(items));
  } catch {}
}

export function getGlossary(): GlossaryItem[] {
  return readGlossary();
}

export function isWordInGlossary(word: string): boolean {
  return readGlossary().some(item => item.word.toLowerCase() === word.toLowerCase());
}

export function addGlossaryItem(item: GlossaryItem): void {
  if (isWordInGlossary(item.word)) return;
  writeGlossary([...readGlossary(), item]);
}
