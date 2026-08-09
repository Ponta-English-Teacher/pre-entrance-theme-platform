import type { Level, ActivityType, ThemeProgress } from '@/types';

const STORAGE_KEY  = 'etp-progress';
const GLOSSARY_KEY = 'etp-glossary';
const NOTEBOOK_KEY = 'etp-notebook';

export interface GlossaryItem {
  word: string;
  japanese: string;
  definition: string;
  example: string;
  themeId: string;
  savedDate: string;
}

/** Pre-migration values that may still be sitting in a returning student's
 *  localStorage from before the three-level (Foundation/Standard/Challenge)
 *  to two-level (Foundation/Advanced) architecture change. */
type StoredLevel = Level | 'standard' | 'challenge';

function migrateStoredLevel(level: StoredLevel | null): Level | null {
  if (level === 'standard' || level === 'challenge') return 'advanced';
  return level;
}

function readAll(): Record<string, ThemeProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ThemeProgress & { chosenLevel: StoredLevel | null }>;

    let migrated = false;
    for (const themeId of Object.keys(parsed)) {
      const migratedLevel = migrateStoredLevel(parsed[themeId].chosenLevel);
      if (migratedLevel !== parsed[themeId].chosenLevel) {
        parsed[themeId] = { ...parsed[themeId], chosenLevel: migratedLevel };
        migrated = true;
      }
    }
    const result = parsed as Record<string, ThemeProgress>;
    if (migrated) writeAll(result); // persist the old-level → advanced migration immediately
    return result;
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

/** Composite keys are `${themeId}/${level}` — merge any pre-migration
 *  `.../standard` or `.../challenge` keys into `.../advanced` and drop the
 *  old keys, so completion progress isn't silently orphaned under a level
 *  name that no longer exists. */
function migratePracticeKeys(all: Record<string, number[]>): { data: Record<string, number[]>; migrated: boolean } {
  let migrated = false;
  const data = { ...all };
  for (const key of Object.keys(data)) {
    const match = key.match(/^(.*)\/(standard|challenge)$/);
    if (!match) continue;
    const advancedKey = `${match[1]}/advanced`;
    const merged = Array.from(new Set([...(data[advancedKey] ?? []), ...data[key]]));
    data[advancedKey] = merged;
    delete data[key];
    migrated = true;
  }
  return { data, migrated };
}

export function getCompletedPracticeSets(themeId: string, level: string): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRACTICE_KEY);
    const rawAll = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    const { data: all, migrated } = migratePracticeKeys(rawAll);
    if (migrated) {
      try { localStorage.setItem(PRACTICE_KEY, JSON.stringify(all)); } catch {}
    }
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

// ── Reading progress ──────────────────────────────────────────────────────────

const READING_KEY = 'etp-reading-progress';

export interface ReadingProgress {
  /** Means "the reading part is done." For lessons still using the original
   *  combined ReadingLessonView (V1), this has always included writing too.
   *  For Theme 1 (ReadingLessonViewV2 + standalone WritingActivity), this now
   *  means reading specifically — see writingCompleted below. */
  completed: boolean;
  completedAt: string | null;
  preReadingChoice: string | null;
  /** Reached the end of the Reading section — the one new completion signal per
   *  READING_WRITING_EXPERIENCE_DESIGN.md §7 (a scroll marker, not a "read every word" measure). */
  readingViewed: boolean;
  missionCheckAnswer: string | null;
  evidenceChoice: string | null;
  vocabInContextAnswer: string | null;
  writingDraft: string;
  /** Added when Writing became its own activity — independent of `completed`,
   *  which now means "reading part done" for lessons using the new experience. */
  writingCompleted: boolean;
  writingCompletedAt: string | null;
}

function readReadingProgress(): Record<string, ReadingProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(READING_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReadingProgress>) : {};
  } catch {
    return {};
  }
}

function writeReadingProgress(data: Record<string, ReadingProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READING_KEY, JSON.stringify(data));
  } catch {}
}

export function getReadingProgress(passageId: string): ReadingProgress {
  return readReadingProgress()[passageId] ?? {
    completed: false,
    completedAt: null,
    preReadingChoice: null,
    readingViewed: false,
    missionCheckAnswer: null,
    evidenceChoice: null,
    vocabInContextAnswer: null,
    writingDraft: '',
    writingCompleted: false,
    writingCompletedAt: null,
  };
}

function mergeReadingProgress(passageId: string, patch: Partial<ReadingProgress>): void {
  const all = readReadingProgress();
  all[passageId] = { ...getReadingProgress(passageId), ...patch };
  writeReadingProgress(all);
}

export function saveReadingPreReadingChoice(passageId: string, choiceId: string): void {
  mergeReadingProgress(passageId, { preReadingChoice: choiceId });
}

export function saveReadingMissionCheck(passageId: string, answerId: string | null, evidenceId: string | null): void {
  mergeReadingProgress(passageId, { missionCheckAnswer: answerId, evidenceChoice: evidenceId });
}

export function saveReadingVocabInContext(passageId: string, answerId: string | null): void {
  mergeReadingProgress(passageId, { vocabInContextAnswer: answerId });
}

export function markReadingViewed(passageId: string): void {
  if (getReadingProgress(passageId).readingViewed) return;
  mergeReadingProgress(passageId, { readingViewed: true });
}

export function saveReadingDraft(passageId: string, text: string): void {
  mergeReadingProgress(passageId, { writingDraft: text });
}

export function markReadingComplete(passageId: string): void {
  mergeReadingProgress(passageId, { completed: true, completedAt: new Date().toISOString() });
}

export function markWritingComplete(passageId: string): void {
  mergeReadingProgress(passageId, { writingCompleted: true, writingCompletedAt: new Date().toISOString() });
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

// ── Notebook ("My English Notebook") ────────────────────────────────────────
//
// Phase 1 (infrastructure only, 2026-08-09): this store layer and the
// migration below are live, but no existing feature writes to it yet —
// VocabDictionaryModal and every other producer still call the Glossary
// functions above, unchanged. GLOSSARY_KEY is never written to or deleted by
// anything in this section; migration only ever reads it.

export interface NotebookItem {
  id: string;
  /** 'vocabulary' | 'reading' | 'ai-help' | 'help-me-say-it' | 'ai-talk' | 'writing' | any future
   *  value — deliberately a plain string, not a closed union, so a new category never requires a
   *  type change here, only a new entry in NOTEBOOK_SECTIONS (src/data/notebook/sections.ts). */
  category: string;
  themeId: string;
  level?: Level;
  savedAt: string;
  favorite?: boolean;

  label?: string;
  content: string;
  explanation?: string;
  japanese?: string;
  context?: string;

  metadata?: Record<string, unknown>;
}

function readNotebookRaw(): NotebookItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTEBOOK_KEY);
    return raw ? (JSON.parse(raw) as NotebookItem[]) : [];
  } catch {
    return [];
  }
}

function writeNotebook(items: NotebookItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(items));
  } catch {}
}

function generateNotebookId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `nb-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** One-time, lazy, non-destructive: runs only while NOTEBOOK_KEY has never
 *  been written (distinguished from "written but empty" via a null check on
 *  the raw string, not on the parsed array's length, so an empty Notebook a
 *  student has manually emptied is never re-migrated into). GLOSSARY_KEY is
 *  left fully intact either way — this only ever reads it. */
function migrateGlossaryToNotebook(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(NOTEBOOK_KEY) !== null) return;
    const glossaryItems = readGlossary();
    const migrated: NotebookItem[] = glossaryItems.map(item => ({
      id: generateNotebookId(),
      category: 'vocabulary',
      themeId: item.themeId,
      level: undefined,
      savedAt: item.savedDate,
      favorite: false,
      label: 'Word',
      content: item.word,
      explanation: item.definition,
      japanese: item.japanese,
      context: item.example,
    }));
    writeNotebook(migrated);
  } catch {}
}

export function getNotebookItems(): NotebookItem[] {
  migrateGlossaryToNotebook();
  return readNotebookRaw();
}

export function getNotebookItemsByCategory(category: string): NotebookItem[] {
  return getNotebookItems().filter(item => item.category === category);
}

/** Simple, opt-in dedup check for callers that want one (e.g. Vocabulary,
 *  mirroring isWordInGlossary's own case-insensitive word match) — not
 *  enforced inside addNotebookItem itself, since not every category should
 *  dedupe the same way (a Writing save of the same sentence twice, in two
 *  different revisions, is legitimate; a Vocabulary word saved twice isn't). */
export function isInNotebook(category: string, content: string, themeId: string): boolean {
  return getNotebookItems().some(
    item => item.category === category && item.themeId === themeId && item.content.toLowerCase() === content.toLowerCase(),
  );
}

export function addNotebookItem(item: Omit<NotebookItem, 'id' | 'savedAt'>): NotebookItem {
  const full: NotebookItem = { ...item, id: generateNotebookId(), savedAt: new Date().toISOString() };
  writeNotebook([...getNotebookItems(), full]);
  return full;
}
