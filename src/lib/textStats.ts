/** Shared sentence/word counting for the Writing activity — used both by
 *  WritingActivity.tsx (the completion gate: sentences only, per
 *  THEME_EXPERIENCE_TEMPLATE.md §9) and WritingTutor.tsx (the live progress
 *  display). A single source of truth so the number shown to the student
 *  while typing always matches the number the completion gate actually
 *  checks. */

export function countSentences(text: string): number {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
