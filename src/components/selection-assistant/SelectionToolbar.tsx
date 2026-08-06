'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { SELECTION_ACTIONS } from '@/lib/selectionAssistant/types';
import type { ActiveSelection, SelectionActionId } from '@/lib/selectionAssistant/types';

const GAP = 8;

/** A compact floating toolbar that appears near a text selection inside
 *  any `SelectableContent` region. Positions itself above the selection
 *  by default, flipping below and clamping horizontally when there isn't
 *  room — never covers the selected text, never leaves the viewport. */
export default function SelectionToolbar({
  selection,
  onAction,
}: {
  selection: ActiveSelection | null;
  onAction: (action: SelectionActionId) => void;
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
    if (top < GAP) top = selection.rect.bottom + GAP; // flip below if no room above
    // A tall selection (a long paragraph) can push the flipped position off
    // the bottom of the screen too — clamp so the toolbar is always reachable.
    top = Math.max(GAP, Math.min(top, window.innerHeight - height - GAP));

    const left = Math.max(GAP, Math.min(midX - width / 2, window.innerWidth - width - GAP));

    setPosition({ top, left });
  }, [selection]);

  if (!selection) return null;

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Ask about this text"
      className="fixed z-50 flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-lg"
      style={position ? { top: position.top, left: position.left } : { top: -9999, left: -9999 }}
    >
      {SELECTION_ACTIONS.map(action => (
        <button
          key={action.id}
          type="button"
          // Prevent the click from stealing focus/collapsing the selection,
          // so the highlighted text stays visible while the panel opens.
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
