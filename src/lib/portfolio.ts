import { getGlossary, getNotebookItems, getLevelProgress, getReadingProgress, getWordStatuses, getThemeProgress } from '@/lib/store';
import type { GlossaryItem, NotebookItem } from '@/lib/store';
import { THEMES, ACTIVITY_DEFS } from '@/data/themes';
import { getReadingsByTheme, MASTER_READINGS } from '@/data/reading/masterReadings';
import { getVocabById, type VocabEntry } from '@/data/vocabulary/masterVocabulary';
import { getNotebookSectionConfig } from '@/data/notebook/sections';
import type { Level, ActivityDef, WordReviewStatus } from '@/types';

/**
 * Shared read-only aggregation layer for Portfolio, organized around one
 * unit — a single theme — since that's now the primary Portfolio structure
 * (see PortfolioThemeCard.tsx). Every function here only reads existing
 * localStorage data (via src/lib/store.ts) and merges/filters it for
 * display — no new storage keys, no writes, no inferred data. Centralized
 * here rather than duplicated per component so the theme card, the top
 * summary, and every section inside a theme's expansion can never silently
 * disagree about what counts as "this theme's" vocabulary, writing, or
 * saved learning.
 */

// ── Level / theme progress ──────────────────────────────────────────────────

export interface LevelSummary {
  level: Level;
  totalActivities: number;
  completedActivities: number;
  status: 'complete' | 'in-progress' | 'not-started';
}

/** Mirrors ActivityGrid.tsx's own visible-activity computation exactly, so
 *  every progress number shown in Portfolio always matches what that
 *  level's own activity list page shows. */
export function getVisibleActivitiesForLevel(themeId: string, level: Level): ActivityDef[] {
  const hasStandaloneWriting = getReadingsByTheme(themeId, level).some(l => l.experienceVersion === 2);
  return ACTIVITY_DEFS.filter(a => {
    if (a.hidden) return false;
    if (a.type === 'writing') return hasStandaloneWriting;
    return true;
  });
}

export function getLevelSummary(themeId: string, level: Level): LevelSummary {
  const visible = getVisibleActivitiesForLevel(themeId, level);
  const completedTypes = new Set(getLevelProgress(themeId, level).completedActivities);
  const completedActivities = visible.filter(a => completedTypes.has(a.type)).length;
  const status: LevelSummary['status'] =
    completedActivities === 0 ? 'not-started' : completedActivities === visible.length ? 'complete' : 'in-progress';
  return { level, totalActivities: visible.length, completedActivities, status };
}

export interface PortfolioSummary {
  totalLevels: number;
  completeLevels: number;
  themesStarted: number;
  wordsToReview: number;
}

/** The compact global stats shown once at the top of Portfolio — every
 *  number here is a simple aggregate of the exact same per-theme data each
 *  theme card itself displays, never a separately-computed figure. */
export function getPortfolioSummary(): PortfolioSummary {
  let completeLevels = 0;
  let themesStarted = 0;
  for (const theme of THEMES) {
    let hasProgress = false;
    for (const level of ['foundation', 'advanced'] as Level[]) {
      const summary = getLevelSummary(theme.id, level);
      if (summary.status === 'complete') completeLevels++;
      if (summary.completedActivities > 0) hasProgress = true;
    }
    if (hasProgress) themesStarted++;
  }
  return {
    totalLevels: THEMES.length * 2,
    completeLevels,
    themesStarted,
    wordsToReview: getReviewableWordCount(),
  };
}

/** Existing data only — no new "last visited theme" tracking. A level's
 *  startedAt (set once, the first time a student picks that level) is
 *  already exactly this signal; the theme with the most recent one across
 *  either level is treated as "most recently studied." Returns null for a
 *  brand-new student with nothing started, so nothing auto-opens. */
export function getMostRecentlyStartedThemeId(): string | null {
  let latestThemeId: string | null = null;
  let latestDate = '';
  for (const theme of THEMES) {
    const progress = getThemeProgress(theme.id);
    for (const level of ['foundation', 'advanced'] as Level[]) {
      const startedAt = progress.levels[level]?.startedAt;
      if (startedAt && startedAt > latestDate) {
        latestDate = startedAt;
        latestThemeId = theme.id;
      }
    }
  }
  return latestThemeId;
}

// ── Vocabulary ───────────────────────────────────────────────────────────

export interface SavedVocabEntry {
  word: string;
  japanese: string;
  definition: string;
  themeId: string;
  savedDate: string;
  /** Only present for Notebook-sourced saves — GlossaryItem has never
   *  recorded a level, so this stays undefined for those rather than
   *  guessing one. */
  level?: Level;
  example?: string;
}

/** Merges the legacy Vocabulary Glossary (etp-glossary) and the Notebook's
 *  'vocabulary' category (etp-notebook) into one list — neither storage key
 *  is touched. The same word saved under the same theme from both sources
 *  collapses to one entry (keeping the newer date); the same word saved
 *  from two different themes stays as two entries, since that's a genuine
 *  separate save. */
export function getSavedVocabulary(): SavedVocabEntry[] {
  const glossary: GlossaryItem[] = getGlossary();
  const notebook: NotebookItem[] = getNotebookItems();

  const fromGlossary: SavedVocabEntry[] = glossary.map(g => ({
    word: g.word, japanese: g.japanese, definition: g.definition, themeId: g.themeId, savedDate: g.savedDate, example: g.example,
  }));
  const fromNotebook: SavedVocabEntry[] = notebook
    .filter(n => n.category === 'vocabulary')
    .map(n => ({
      word: n.content, japanese: n.japanese ?? '', definition: n.explanation ?? '', themeId: n.themeId, savedDate: n.savedAt, level: n.level, example: n.context,
    }));

  const dedup = new Map<string, SavedVocabEntry>();
  for (const entry of [...fromGlossary, ...fromNotebook]) {
    const key = `${entry.word.toLowerCase()}|${entry.themeId}`;
    const existing = dedup.get(key);
    if (!existing || entry.savedDate > existing.savedDate) dedup.set(key, entry);
  }
  return Array.from(dedup.values()).sort((a, b) => b.savedDate.localeCompare(a.savedDate));
}

export interface ReviewEntry {
  id: string;
  entry: VocabEntry;
  status: WordReviewStatus;
}

/** Every opened word resolved to its full VocabEntry, minus anything
 *  already in Saved (a stronger, deliberate signal) — the shared source
 *  for both the review queue and the "known" list, everywhere it's shown. */
function getResolvedReviewEntries(savedWordsLower: Set<string>): ReviewEntry[] {
  return Object.entries(getWordStatuses())
    .map(([id, status]) => ({ id, entry: getVocabById(id), status }))
    .filter((x): x is ReviewEntry => !!x.entry)
    .filter(x => !savedWordsLower.has(x.entry.word.toLowerCase()));
}

function getReviewableWordCount(): number {
  const savedWordsLower = new Set(getSavedVocabulary().map(s => s.word.toLowerCase()));
  return getResolvedReviewEntries(savedWordsLower).filter(x => x.status !== 'known').length;
}

export interface ThemeVocabulary {
  saved: SavedVocabEntry[];
  toReview: ReviewEntry[];
  known: ReviewEntry[];
}

/** Scoped to one theme: Saved entries whose themeId matches, and To
 *  Review/Known words whose VocabEntry.themes includes this theme — a word
 *  that spans multiple themes appears under each one, since review makes
 *  sense in the context it was actually encountered. */
export function getThemeVocabulary(themeId: string): ThemeVocabulary {
  const saved = getSavedVocabulary().filter(s => s.themeId === themeId);
  const savedWordsLowerGlobal = new Set(getSavedVocabulary().map(s => s.word.toLowerCase()));
  const resolved = getResolvedReviewEntries(savedWordsLowerGlobal).filter(x => x.entry.themes.includes(themeId));
  return {
    saved,
    toReview: resolved.filter(x => x.status !== 'known'),
    known: resolved.filter(x => x.status === 'known'),
  };
}

// ── Writing ──────────────────────────────────────────────────────────────

export interface WritingFeedbackItem {
  id: string;
  label: string;
  content: string;
  explanation?: string;
  savedAt: string;
  themeId: string;
  level?: Level;
}

/** category:'writing' (Corrections/Natural Alternatives/Improved Version,
 *  written only by WritingTutor.tsx) is unambiguous. category:'help-me-say-it'
 *  is written by BOTH Writing's and AI Talk's identically-labeled "Help me
 *  say it" panel with no other distinguishing field — WritingExpressPanel.tsx
 *  and ConversationSupportPanel.tsx now tag their own saves with
 *  metadata.source so this can tell them apart; older saves made before that
 *  tag existed have no metadata and are conservatively treated as NOT
 *  Writing's, rather than guessed. */
function isWritingFeedbackItem(item: NotebookItem): boolean {
  if (item.category === 'writing') return true;
  if (item.category === 'help-me-say-it') {
    return (item.metadata as { source?: string } | undefined)?.source === 'writing';
  }
  return false;
}

export function getAllWritingFeedback(): WritingFeedbackItem[] {
  return getNotebookItems()
    .filter(isWritingFeedbackItem)
    .map(n => ({ id: n.id, label: n.label ?? 'Saved', content: n.content, explanation: n.explanation, savedAt: n.savedAt, themeId: n.themeId, level: n.level }));
}

/** Everything a student saved while working on one specific theme+level's
 *  writing — corrections, natural alternatives, an improved version, and
 *  any Writing-sourced "Help me say it" suggestion. */
export function getWritingFeedbackFor(themeId: string, level: Level): WritingFeedbackItem[] {
  return getAllWritingFeedback()
    .filter(f => f.themeId === themeId && f.level === level)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export interface ThemeWritingEntry {
  lessonId: string;
  level: Level;
  prompt: string;
  text: string;
  status: 'completed' | 'draft';
  completedAt: string | null;
  feedback: WritingFeedbackItem[];
}

/** Foundation's piece first, then Advanced's — never merged, matching the
 *  level-independent progress model. Revising a completed piece later never
 *  touches writingCompleted/writingCompletedAt (WritingActivity only ever
 *  sets them once), so a completed date shown here always reflects the
 *  original completion, exactly as intended. */
export function getThemeWriting(themeId: string): ThemeWritingEntry[] {
  const entries: ThemeWritingEntry[] = [];
  for (const lesson of MASTER_READINGS) {
    if (lesson.themeId !== themeId) continue;
    const progress = getReadingProgress(lesson.id);
    const hasText = progress.writingDraft.trim().length > 0;
    if (!progress.writingCompleted && !hasText) continue;
    entries.push({
      lessonId: lesson.id,
      level: lesson.level,
      prompt: lesson.writing.prompt,
      text: progress.writingDraft,
      status: progress.writingCompleted ? 'completed' : 'draft',
      completedAt: progress.writingCompletedAt,
      feedback: getWritingFeedbackFor(themeId, lesson.level),
    });
  }
  return entries.sort((a, b) => (a.level === b.level ? 0 : a.level === 'foundation' ? -1 : 1));
}

// ── Notebook ─────────────────────────────────────────────────────────────

/** 'vocabulary' and writing-feedback items each have their own dedicated
 *  home (My Vocabulary / My Writing, both inside the same theme expansion);
 *  'ai-help' is written only by ContextualHelpButton, which nothing in the
 *  live product renders anymore (every lesson uses ReadingLessonViewV2,
 *  which removed it) — excluded here rather than shown as a permanently
 *  empty, unreachable category. */
const NOTEBOOK_EXCLUDED_CATEGORIES = new Set(['vocabulary', 'ai-help']);

export function getReviewableNotebookItems(): NotebookItem[] {
  return getNotebookItems().filter(item => !NOTEBOOK_EXCLUDED_CATEGORIES.has(item.category) && !isWritingFeedbackItem(item));
}

export function getThemeNotebookItems(themeId: string): NotebookItem[] {
  return getReviewableNotebookItems()
    .filter(item => item.themeId === themeId)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

// ── Recent activity ──────────────────────────────────────────────────────

export interface RecentEvent {
  date: string;
  icon: string;
  text: string;
  level?: Level;
}

function themeTitle(themeId: string): string {
  return THEMES.find(t => t.id === themeId)?.title ?? themeId;
}

/** Only events that already carry a real timestamp in existing storage.
 *  Vocabulary practice-set completion and AI Talk completion are
 *  deliberately excluded — neither records a date anywhere today, and this
 *  never manufactures one just to make an event appear here. */
export function getThemeRecentEvents(themeId: string): RecentEvent[] {
  const events: RecentEvent[] = [];

  for (const lesson of MASTER_READINGS) {
    if (lesson.themeId !== themeId) continue;
    const progress = getReadingProgress(lesson.id);
    if (progress.completed && progress.completedAt) {
      events.push({ date: progress.completedAt, icon: '📰', text: 'Completed Reading', level: lesson.level });
    }
    if (progress.writingCompleted && progress.writingCompletedAt) {
      events.push({ date: progress.writingCompletedAt, icon: '🖊️', text: 'Completed Writing', level: lesson.level });
    }
  }

  for (const entry of getSavedVocabulary()) {
    if (entry.themeId !== themeId) continue;
    events.push({ date: entry.savedDate, icon: '📖', text: `Saved word: ${entry.word}`, level: entry.level });
  }

  for (const item of getReviewableNotebookItems()) {
    if (item.themeId !== themeId) continue;
    const section = getNotebookSectionConfig(item.category);
    events.push({ date: item.savedAt, icon: section?.icon ?? '📓', text: `Saved ${section?.label ?? 'note'}`, level: item.level });
  }

  for (const item of getAllWritingFeedback()) {
    if (item.themeId !== themeId) continue;
    events.push({ date: item.savedAt, icon: '🖊️', text: 'Saved writing feedback', level: item.level });
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
}
