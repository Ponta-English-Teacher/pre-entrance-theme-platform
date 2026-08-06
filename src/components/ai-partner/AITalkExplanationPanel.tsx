'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { AITalkActiveSelection, AITalkSelectionAction } from './AITalkSelectionToolbar';

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
  onClose,
}: {
  panel: AITalkSelectionPanelState;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; left: number } | null>(null);

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
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [panel.open, onClose]);

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
          <p className="text-lg leading-relaxed text-slate-800">{panel.text}</p>
        )}
      </div>
    </div>
  );
}
