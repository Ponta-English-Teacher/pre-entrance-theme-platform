'use client';

/**
 * Shared "Save to My English Notebook" affordance — one compact, low-
 * emphasis pattern reused everywhere the Notebook can be saved to.
 * THEME_EXPERIENCE_TEMPLATE.md §12, "Notebook Save Action visual
 * hierarchy": saving is a secondary, archival action and must never
 * compete visually with the learning content it sits beside — never
 * full-width, never styled like a primary CTA (no solid fill, no brand
 * border), never the brand accent color. Neutral slate by default; the
 * emerald "saved" state is the one deliberate exception, since it's
 * feedback about something that already happened, not a call to action.
 */
export default function NotebookSaveButton({
  saved,
  onSave,
  label = '📓 Save to My English Notebook',
  savedLabel = '✓ Saved',
  className = '',
}: {
  saved: boolean;
  onSave: () => void;
  /** Visible text while unsaved. Override for a localized or context-specific label (e.g. Japanese). */
  label?: string;
  /** Visible text once saved. */
  savedLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saved}
      aria-label={saved ? 'Saved to My English Notebook' : 'Save to My English Notebook'}
      title={saved ? 'Saved to My English Notebook' : 'Save to My English Notebook'}
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
        saved
          ? 'text-emerald-600 cursor-default'
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
      } ${className}`}
    >
      {saved ? savedLabel : label}
    </button>
  );
}
