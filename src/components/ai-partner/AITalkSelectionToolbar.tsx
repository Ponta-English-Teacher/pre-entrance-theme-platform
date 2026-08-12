'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export type AITalkSelectionAction = 'translate' | 'howToRead' | 'explain';

export interface AITalkActiveSelection {
  text: string;
  fullTurnText: string;
  rect: { top: number; bottom: number; left: number; right: number };
}

const GAP = 8;

const ACTIONS: { id: AITalkSelectionAction; icon: string; label: string }[] = [
  { id: 'translate', icon: '🇯🇵', label: 'Translate' },
  { id: 'howToRead', icon: '🔊', label: 'How to Read' },
  { id: 'explain', icon: '💬', label: 'What does it mean?' },
];

/**
 * Floating toolbar for AI Talk's own selection-based understanding tools —
 * visually and behaviorally modeled on Reading's Selection Assistant
 * toolbar, but entirely separate code, scoped only to partner turns. Kept
 * independent so Reading/Writing's shared Selection Assistant never needs
 * to change to accommodate AI-Talk-specific behavior (explaining only a
 * selected snippet, never the whole message).
 */
export default function AITalkSelectionToolbar({
  selection,
  onAction,
}: {
  selection: AITalkActiveSelection | null;
  onAction: (action: AITalkSelectionAction) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!selection || !ref.current) {
      setPosition(null);
      return;
    }
    const { width, height } = ref.current.getBoundingClientRect();
    const midX = (selection.rect.left + selection.rect.right) / 2;

    let top = selection.rect.top - height - GAP;
    if (top < GAP) top = selection.rect.bottom + GAP;
    // A tall selection can push the flipped position off the bottom of the
    // screen too — clamp so the toolbar is always reachable.
    top = Math.max(GAP, Math.min(top, window.innerHeight - height - GAP));

    const left = Math.max(GAP, Math.min(midX - width / 2, window.innerWidth - width - GAP));

    setPosition({ top, left });
  }, [selection]);

  if (!selection) return null;

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="AI Talk selection tools"
      // z-[60], one step above AITalkExplanationPanel's z-50: this toolbar
      // must always render above an already-open explanation panel,
      // including when the new selection is made inside that same panel
      // (recursive exploration) — same rule as Reading's SelectionToolbar.
      className="fixed z-[60] flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-lg"
      style={position ? { top: position.top, left: position.left } : { top: -9999, left: -9999 }}
    >
      {ACTIONS.map(action => (
        <button
          key={action.id}
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={() => onAction(action.id)}
          title={action.label}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors whitespace-nowrap"
        >
          <span aria-hidden="true">{action.icon}</span>
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
