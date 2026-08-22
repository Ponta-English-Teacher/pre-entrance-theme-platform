'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SELECTION_ACTIONS } from '@/lib/selectionAssistant/types';
import type { ActiveSelection, SelectionActionId } from '@/lib/selectionAssistant/types';
import SelectableContent from './SelectableContent';
import { addNotebookItem, isInNotebook } from '@/lib/store';
import NotebookSaveButton from '@/components/notebook/NotebookSaveButton';

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

// Manual resize (desktop only — the mobile bottom sheet stays full-width,
// which already solves the "too narrow for a paragraph" problem there).
// Kept small enough that the header (drag handle + close button) and the
// Save button are never squeezed out.
const MIN_WIDTH = 300;
const MIN_HEIGHT = 240;

/** Section header shown above the AI's actual result, distinct from the
 *  toolbar/button label — a noun ("Translation") reads better as a result
 *  heading than the button's verb ("Translate"). Falls back to the
 *  toolbar label for any action not listed here. */
const RESULT_SECTION_LABELS: Partial<Record<SelectionActionId, string>> = {
  translate: 'Translation',
  easy: 'Easy English',
};

interface ResizeStart {
  axis: 'x' | 'y' | 'both';
  pointerX: number;
  pointerY: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

/** The response panel — a floating, draggable, resizable card near the
 *  selection on desktop, a bottom sheet on mobile (plain responsive CSS,
 *  not JS device detection). Built for reading: the student's original
 *  selection and the AI's result are always shown as two clearly labeled,
 *  visually distinct sections, never blended together. The original
 *  content stays visible underneath. */
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
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [resizing, setResizing] = useState(false);
  const resizeStartRef = useRef<ResizeStart | null>(null);
  const [saved, setSaved] = useState(false);

  // A genuinely new selection gets a new panel.selection reference (see the
  // comment on the anchoring effect above) — reset save state and any
  // manual resize then, not on every loading→result transition within the
  // same selection.
  useEffect(() => {
    setSaved(false);
    setSize(null);
  }, [panel.selection]);

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
      // word inside the original quote or the result to look it up again)
      // must never close it, even if the selection extends past the
      // panel's edge by the time this fires. Same guard used for the
      // Vocabulary Card's backdrop and the Writing Toolbox.
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

  // Resizing (desktop only, three independent handles) — entirely separate
  // state/effect from dragging above, so the two gestures can never fight
  // over the same mousemove/mouseup listeners. Clamped against the
  // panel's *current* position (captured at resize-start) so growing the
  // box can never push its right/bottom edge past the viewport, and
  // against MIN_WIDTH/MIN_HEIGHT so it can never shrink small enough to
  // hide the header or the Save button.
  useEffect(() => {
    if (!resizing) return;

    function handleMouseMove(e: MouseEvent) {
      const start = resizeStartRef.current;
      if (!start) return;
      const maxWidth = window.innerWidth - start.left - GAP;
      const maxHeight = window.innerHeight - start.top - GAP;

      setSize(prev => {
        const next = { width: prev?.width ?? start.width, height: prev?.height ?? start.height };
        if (start.axis === 'x' || start.axis === 'both') {
          next.width = Math.max(MIN_WIDTH, Math.min(start.width + (e.clientX - start.pointerX), maxWidth));
        }
        if (start.axis === 'y' || start.axis === 'both') {
          next.height = Math.max(MIN_HEIGHT, Math.min(start.height + (e.clientY - start.pointerY), maxHeight));
        }
        return next;
      });
    }
    function handleMouseUp() {
      setResizing(false);
      resizeStartRef.current = null;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  function handleHeaderMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (window.innerWidth < DESKTOP_BREAKPOINT) return; // mobile bottom sheet doesn't drag
    const target = e.target as HTMLElement;
    if (target.closest('button')) return; // let the close button handle its own click
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    dragStartRef.current = { pointerX: e.clientX, pointerY: e.clientY, top: rect.top, left: rect.left };
    setDesktopPosition({ top: rect.top, left: rect.left });
    setDragging(true);
    e.preventDefault();
  }

  function handleResizeMouseDown(axis: ResizeStart['axis']) {
    return (e: React.MouseEvent) => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return; // no resize handles on mobile
      if (!ref.current) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = ref.current.getBoundingClientRect();
      resizeStartRef.current = { axis, pointerX: e.clientX, pointerY: e.clientY, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
      setResizing(true);
    };
  }

  // Save is offered only for reading-passage selections with a real text
  // result — never for How to Read (audio only, no `explanation`) and never
  // for selections made elsewhere (Vocabulary, Writing, Mission Check, ...)
  // via this same shared panel, since those aren't "the Reading Selection
  // Assistant" this phase connects. themeId/level come straight from the
  // scope SelectableContent already attached to the reading passage wrapper
  // (ReadingLessonView(V2)) — no new props needed on this component.
  const selection = panel.selection;
  const canSave =
    !!selection && !!panel.explanation && !panel.loading &&
    selection.scope.activityType === 'reading' &&
    !!selection.scope.themeId;

  function handleSave() {
    if (!canSave || saved || !selection || !panel.explanation) return;
    const { themeId, level } = selection.scope;
    if (!themeId) return;
    if (!isInNotebook('reading', selection.text, themeId)) {
      addNotebookItem({
        category: 'reading',
        themeId,
        level,
        favorite: false,
        label: SELECTION_ACTIONS.find(a => a.id === panel.action)?.label ?? 'Explanation',
        content: selection.text,
        explanation: panel.explanation,
        context: selection.surroundingSentence,
        metadata: panel.action ? { action: panel.action } : undefined,
      });
    }
    setSaved(true);
  }

  if (!panel.open) return null;

  const actionMeta = SELECTION_ACTIONS.find(a => a.id === panel.action);
  const resultLabel = (panel.action && RESULT_SECTION_LABELS[panel.action]) ?? actionMeta?.label ?? 'Result';

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Selection explanation"
      // overflow-hidden (not overflow-y-auto) here deliberately — this
      // outer box is only ever the resize frame now; if IT scrolled, its
      // own native scrollbar would render in the exact same right-edge
      // strip as the horizontal resize handle below and steal every
      // pointer event meant for that handle. Scrolling instead happens on
      // the inner content div, which has no resize handles competing for
      // its edges.
      className={`fixed z-50 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:w-[32rem] sm:max-w-[calc(100vw-2rem)] flex flex-col rounded-t-3xl sm:rounded-3xl border border-indigo-100 bg-white shadow-2xl max-h-[70vh] sm:max-h-[34rem] overflow-hidden ${
        resizing ? 'select-none' : ''
      }`}
      style={{
        ...(desktopPosition ? { top: desktopPosition.top, left: desktopPosition.left } : {}),
        ...(size ? { width: size.width, height: size.height, maxWidth: 'none', maxHeight: 'none' } : {}),
      }}
    >
      <div
        onMouseDown={handleHeaderMouseDown}
        className={`shrink-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-3 flex items-center justify-between gap-3 sm:select-none ${
          dragging ? 'sm:cursor-grabbing' : 'sm:cursor-grab'
        }`}
      >
        {/* Deliberately generic, not the action's own label ("Easy
            English", "Translation") — that label belongs solely to the
            result section below, right above the actual result text. A
            second, decorative copy of it up here (right above the
            ORIGINAL quote that follows) would recreate exactly the
            "which part is the AI's answer?" ambiguity this panel exists
            to resolve. */}
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Selection Assistant</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* The one scrollable region — always visible header above it, so
          the close button (and drag handle) are reachable no matter how
          long the AI's result is. min-h-0 is required here: without it a
          flex child won't shrink below its content's intrinsic height,
          which would silently defeat this div's own overflow-y-auto. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {selection && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Original</p>
            <SelectableContent
              activityType={selection.scope.activityType}
              themeId={selection.scope.themeId}
              level={selection.scope.level}
              label="Original — recursive"
            >
              <p className="font-serif italic text-slate-700 text-base leading-snug">&ldquo;{selection.text}&rdquo;</p>
            </SelectableContent>
          </div>
        )}

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
          // Inherits activityType/themeId/level from whatever selection
          // opened this panel, rather than a fixed "selection-explanation"
          // identifier — so a selection made inside this explanation (i.e.
          // recursive exploration) is still recognized as part of the same
          // originating activity, at any recursion depth, with Save and the
          // AI's own prompt context ("Activity: ...") behaving identically
          // to the very first selection. A hardcoded activityType here was
          // the reason Save silently disappeared after one level of
          // recursion — canSave (below) gates on activityType === 'reading',
          // which a disconnected literal could never satisfy.
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1.5">{resultLabel}</p>
            <SelectableContent
              activityType={selection?.scope.activityType ?? 'reading'}
              themeId={selection?.scope.themeId}
              level={selection?.scope.level}
              label={`${actionMeta?.label ?? 'Explanation'} — result`}
            >
              <p className="text-base sm:text-lg leading-relaxed text-slate-800">{panel.explanation}</p>
            </SelectableContent>
          </div>
        )}
        {canSave && (
          <div className="flex justify-end">
            <NotebookSaveButton saved={saved} onSave={handleSave} />
          </div>
        )}
      </div>

      {/* Resize handles — desktop only, hidden on the mobile bottom sheet.
          Three independent hit targets (right edge / bottom edge / corner)
          so horizontal-only, vertical-only, and diagonal resizing are all
          directly reachable, matching the native OS affordance students
          already expect. Small hit areas positioned at the panel's own
          edges, well clear of the text content, so they never interfere
          with selecting/copying text inside the panel. */}
      <div
        onMouseDown={handleResizeMouseDown('x')}
        className="hidden sm:block absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize"
        aria-hidden="true"
      />
      <div
        onMouseDown={handleResizeMouseDown('y')}
        className="hidden sm:block absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize"
        aria-hidden="true"
      />
      <div
        onMouseDown={handleResizeMouseDown('both')}
        className="hidden sm:flex absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize items-end justify-end p-0.5 text-slate-300 hover:text-slate-400"
        aria-hidden="true"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1L1 7M7 4.5L4.5 7M7 7L7 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
