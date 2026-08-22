'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { AITalkActiveSelection, AITalkSelectionAction } from './AITalkSelectionToolbar';
import type { Level } from '@/types';
import { addNotebookItem, isInNotebook } from '@/lib/store';
import NotebookSaveButton from '@/components/notebook/NotebookSaveButton';

export interface AITalkSelectionPanelState {
  open: boolean;
  loading: boolean;
  action: AITalkSelectionAction | null;
  text: string | null;
  error: string | null;
  selection: AITalkActiveSelection | null;
}

const GAP = 12;
const DESKTOP_BREAKPOINT = 640;

const ACTION_META: Record<AITalkSelectionAction, { icon: string; label: string }> = {
  translate: { icon: '🇯🇵', label: 'Translate' },
  howToRead: { icon: '🔊', label: 'How to Read' },
  explain: { icon: '💬', label: 'What does it mean?' },
};

/**
 * Result panel for AI Talk's selection toolbar — shown for Translate and
 * What does it mean? ("How to Read" plays audio directly and only shows this
 * panel on failure). Modeled visually on Reading's SelectionExplanationPanel,
 * kept as separate code for the same reason as the toolbar.
 */
export default function AITalkExplanationPanel({
  panel,
  themeId,
  level,
  onClose,
}: {
  panel: AITalkSelectionPanelState;
  /** Only used to populate NotebookItem.themeId/level on save — not part of the Translate/explain requests themselves. */
  themeId: string;
  level: Level;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; left: number } | null>(null);
  const [saved, setSaved] = useState(false);

  // A genuinely new selection gets a new panel.selection reference (see
  // Reading's SelectionExplanationPanel for the identical pattern) — reset
  // save state then, not on every loading→result transition within it.
  useEffect(() => {
    setSaved(false);
  }, [panel.selection]);

  useLayoutEffect(() => {
    if (!panel.open || !panel.selection || !ref.current || window.innerWidth < DESKTOP_BREAKPOINT) {
      setDesktopPosition(null);
      return;
    }
    const { width, height } = ref.current.getBoundingClientRect();
    const { rect } = panel.selection;

    let top = rect.bottom + GAP;
    if (top + height > window.innerHeight - GAP) {
      top = Math.max(GAP, rect.top - height - GAP);
    }
    const left = Math.max(GAP, Math.min(rect.left, window.innerWidth - width - GAP));

    setDesktopPosition({ top, left });
  }, [panel.open, panel.selection]);

  useEffect(() => {
    if (!panel.open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      // A text-selection drag started inside the panel (e.g. selecting a
      // word inside the result to look it up again) must never close it,
      // even if the selection extends past the panel's edge by the time
      // this fires. Same guard used by Reading's SelectionExplanationPanel.
      if (window.getSelection()?.toString()) return;
      onClose();
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [panel.open, onClose]);

  // Save is offered only when a real text result exists — Translate and
  // "What does it mean?" ('explain'), never How to Read, which plays audio
  // directly and only ever populates `panel.text` on failure (see this
  // file's own header comment). Scoped to this component entirely, so it
  // can never affect Reading's separate SelectionExplanationPanel.
  const canSave = !!panel.selection && !!panel.text && !panel.loading;

  function handleSave() {
    if (!canSave || saved || !panel.selection || !panel.text) return;
    if (!isInNotebook('ai-talk', panel.selection.text, themeId)) {
      addNotebookItem({
        category: 'ai-talk',
        themeId,
        level,
        favorite: false,
        label: panel.action ? ACTION_META[panel.action].label : 'Explanation',
        content: panel.selection.text,
        explanation: panel.text,
        context: panel.selection.fullTurnText,
        metadata: panel.action ? { action: panel.action } : undefined,
      });
    }
    setSaved(true);
  }

  if (!panel.open) return null;

  const meta = panel.action ? ACTION_META[panel.action] : null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="AI Talk selection result"
      className="fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:w-96 sm:max-w-[calc(100vw-2rem)] rounded-t-3xl sm:rounded-3xl border border-indigo-100 bg-white shadow-2xl max-h-[70vh] sm:max-h-[28rem] overflow-y-auto"
      style={desktopPosition ? { top: desktopPosition.top, left: desktopPosition.left } : undefined}
    >
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1.5">
            {meta ? `${meta.icon} ${meta.label}` : 'Result'}
          </p>
          <p className="font-serif italic text-slate-800 text-base leading-snug">
            &ldquo;{panel.selection?.text}&rdquo;
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="px-5 py-6">
        {panel.loading && (
          <div className="flex items-center gap-2 text-slate-400 text-base">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-300 animate-pulse" aria-hidden="true" />
            Thinking...
          </div>
        )}
        {panel.error && !panel.loading && (
          <p className="text-base text-rose-600 leading-relaxed whitespace-pre-line">{panel.error}</p>
        )}
        {panel.text && !panel.loading && (
          // data-ai-talk-selectable: read by AIPartnerConversation's selection
          // listener so selecting text in here (not just in a partner turn)
          // still invokes the toolbar — enables recursive lookups.
          <p data-ai-talk-selectable className="text-base sm:text-lg leading-relaxed text-slate-800">{panel.text}</p>
        )}
        {canSave && (
          <div className="mt-3 flex justify-end">
            <NotebookSaveButton saved={saved} onSave={handleSave} />
          </div>
        )}
      </div>
    </div>
  );
}
