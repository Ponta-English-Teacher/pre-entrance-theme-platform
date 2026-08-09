/**
 * "My English Notebook" — the fixed set of learner-facing sections Portfolio
 * displays, one per place a student can save something from. This is the
 * only place a new category needs to be registered: NotebookItem.category
 * (src/lib/store.ts) is a plain string specifically so adding a future
 * category (Listening, Debate, Teacher Feedback, ...) means adding one row
 * here, never touching the NotebookItem interface itself.
 *
 * Deliberately learner-facing, not implementation-facing: Reading and AI
 * Talk share the same underlying Selection Assistant component, but each
 * host page tags what it saves with its own category ('reading' vs.
 * 'ai-talk'), so they stay separate sections here — mirroring how
 * SelectableContent's existing activityType prop already lets one shared
 * component be tagged differently per host page.
 */

export interface NotebookSectionConfig {
  /** Matches NotebookItem.category. */
  id: string;
  label: string;
  labelJapanese: string;
  icon: string;
}

export const NOTEBOOK_SECTIONS: NotebookSectionConfig[] = [
  { id: 'vocabulary',     label: 'Vocabulary',     labelJapanese: '語彙',           icon: '📖' },
  { id: 'reading',        label: 'Reading',        labelJapanese: 'リーディング',    icon: '📰' },
  { id: 'ai-help',        label: 'AI Help',        labelJapanese: 'AIヘルプ',        icon: '💡' },
  { id: 'help-me-say-it', label: 'Help Me Say It', labelJapanese: '言い方サポート',  icon: '💬' },
  { id: 'ai-talk',        label: 'AI Talk',        labelJapanese: 'AIトーク',        icon: '🗣️' },
  { id: 'writing',        label: 'Writing',        labelJapanese: 'ライティング',    icon: '🖊️' },
];

export function getNotebookSectionConfig(category: string): NotebookSectionConfig | undefined {
  return NOTEBOOK_SECTIONS.find(section => section.id === category);
}
