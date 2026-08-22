import { getGlossary, getNotebookItems } from '@/lib/store';
import type { GlossaryItem, NotebookItem } from '@/lib/store';
import type { Level } from '@/types';

/**
 * Shared read-only aggregation helpers for Portfolio. Every function here
 * only reads existing localStorage data (via src/lib/store.ts) and merges
 * it for display — no new storage keys, no writes, no inferred data.
 * Extracted here (rather than duplicated per section) so Vocabulary,
 * Notebook, and Recent Learning can never silently disagree about what
 * counts as "saved vocabulary" or "reviewable Notebook item."
 */

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

/** 'vocabulary' and writing-feedback items each have their own dedicated
 *  Portfolio section (My Vocabulary / My Writing); 'ai-help' is written
 *  only by ContextualHelpButton, which nothing in the live product renders
 *  anymore (every lesson uses ReadingLessonViewV2, which removed it) —
 *  excluded here rather than shown as a permanently empty, unreachable
 *  category. */
const NOTEBOOK_EXCLUDED_CATEGORIES = new Set(['vocabulary', 'ai-help']);

export function getReviewableNotebookItems(): NotebookItem[] {
  return getNotebookItems().filter(item => !NOTEBOOK_EXCLUDED_CATEGORIES.has(item.category) && !isWritingFeedbackItem(item));
}
