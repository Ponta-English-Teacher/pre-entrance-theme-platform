'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SELECTION_ACTIONS } from '@/lib/selectionAssistant/types';
import type { ActiveSelection, SelectionActionId } from '@/lib/selectionAssistant/types';
import SelectableContent from './SelectableContent';

export interface SelectionPanelState {
  open: boolean;
  loading: boolean;
  action: SelectionActionId | null;
  explanation: string | null;
  error: string | null;
  selection: ActiveSelection | null;
}

const GAP = 12;
const DESKTOP_BREAKPOINT = 640; // matches Tailwind's `sm`

/** The response panel — a floating card near the selection on desktop, a
 *  bottom sheet on mobile (plain responsive CSS, not JS device detection).
 *  Built for reading: one short explanation, generous spacing, no chat
 *  history. The original content stays visible underneath. */
export default function SelectionExplanationPanel({
  panel,
  onClose,
}: {
  panel: SelectionPanelState;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [desktopPosition, setDesktopPosition] = useState<{ top: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; top: number; left: number } | null>(null);

  // A genuinely new selection opens a new panel (new `panel.selection`
  // reference) and gets re-anchored; transitions within the same panel
  // (loading → result) keep whatever position the student left it at,
  // including anywhere they've dragged it to.
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
      // word inside the explanation to look it up again) must never close
      // it, even if the selection extends past the panel's edge by the
      // time this fires. Same guard used for the Vocabulary Card's
      // backdrop and the Writing Toolbox.
      if (window.getSelection()?.toString()) return;
      onClose();
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [panel.open, onClose]);

  // Dragging (header only, desktop only) — the mobile bottom sheet stays fixed.
  useEffect(() => {
    if (!dragging) return;

    function handleMouseMove(e: MouseEvent) {
      const start = dragStartRef.current;
      if (!start || !ref.current) return;
      const { width, height } = ref.current.getBoundingClientRect();
      const nextTop = start.top + (e.clientY - start.pointerY);
      const nextLeft = start.left + (e.clientX - start.pointerX);
      setDesktopPosition({
        top: Math.max(GAP, Math.min(nextTop, window.innerHeight - height - GAP)),
        left: Math.max(GAP, Math.min(nextLeft, window.innerWidth - width - GAP)),
      });
    }
    function handleMouseUp() {
      setDragging(false);
      dragStartRef.current = null;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  function handleHeaderMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return; // mobile bottom sheet doesn't drag
    const target = e.target as HTMLElement;
    if (target.closest('button')) return; // let the close button handle its own click
    // A mousedown that starts on the header's own text (the action label or
    // the quoted original selection) must not arm a drag — that text sits
    // directly above the explanation with no gap, so a gesture meant to
    // begin selecting the explanation easily lands here first. This text is
    // already sm:select-none, so it isn't selectable either way; the drag
    // handle is the header's background/padding only.
    if (target.closest('p')) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    dragStartRef.current = { pointerX: e.clientX, pointerY: e.clientY, top: rect.top, left: rect.left };
    setDesktopPosition({ top: rect.top, left: rect.left });
    setDragging(true);
    e.preventDefault();
  }

  if (!panel.open) return null;

  const actionMeta = SELECTION_ACTIONS.find(a => a.id === panel.action);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Selection explanation"
      className="fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:w-96 sm:max-w-[calc(100vw-2rem)] rounded-t-3xl sm:rounded-3xl border border-indigo-100 bg-white shadow-2xl max-h-[70vh] sm:max-h-[28rem] overflow-y-auto"
      style={desktopPosition ? { top: desktopPosition.top, left: desktopPosition.left } : undefined}
    >
      <div
        onMouseDown={handleHeaderMouseDown}
        className={`sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex items-start justify-between gap-3 sm:select-none ${
          dragging ? 'sm:cursor-grabbing' : 'sm:cursor-grab'
        }`}
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1.5">
            {actionMeta ? `${actionMeta.icon} ${actionMeta.label}` : 'Explanation'}
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
        {panel.explanation && !panel.loading && (
          <SelectableContent activityType="selection-explanation" label={`${actionMeta?.label ?? 'Explanation'} — result`}>
            <p className="text-lg leading-relaxed text-slate-800">{panel.explanation}</p>
          </SelectableContent>
        )}
      </div>
    </div>
  );
}
