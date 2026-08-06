'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectionAssistantContext } from './SelectionAssistantContext';
import SelectionToolbar from './SelectionToolbar';
import SelectionExplanationPanel, { type SelectionPanelState } from './SelectionExplanationPanel';
import { extractSelectionContext } from '@/lib/selectionAssistant/extractContext';
import type { ActiveSelection, SelectionActionId, SelectionScopeMeta } from '@/lib/selectionAssistant/types';
import { SELECTION_ASSISTANT_MAX_TEXT_LENGTH, SELECTION_TEXT_TOO_LONG_MESSAGE } from '@/lib/ai/selectionAssistant/types';

interface ScopeEntry {
  el: HTMLElement;
  meta: SelectionScopeMeta;
}

const INITIAL_PANEL: SelectionPanelState = {
  open: false,
  loading: false,
  action: null,
  explanation: null,
  error: null,
  selection: null,
};

/**
 * App-wide "highlight text, get help" assistant. Mount once (in AppShell)
 * and every activity opts in by wrapping its educational content in
 * `<SelectableContent>` — no other page needs to know this exists.
 *
 * Single document-level `selectionchange` listener, filtered against a
 * registry of opted-in DOM regions, so this scales to any number of
 * activities without N separate listeners.
 */
export default function SelectionAssistantProvider({ children }: { children: React.ReactNode }) {
  const scopesRef = useRef<Map<string, ScopeEntry>>(new Map());
  const [activeSelection, setActiveSelection] = useState<ActiveSelection | null>(null);
  const [panel, setPanel] = useState<SelectionPanelState>(INITIAL_PANEL);

  const registerScope = useCallback((id: string, el: HTMLElement, meta: SelectionScopeMeta) => {
    scopesRef.current.set(id, { el, meta });
  }, []);

  const unregisterScope = useCallback((id: string) => {
    scopesRef.current.delete(id);
  }, []);

  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();
      const anchorNode = selection?.anchorNode;
      if (!selection || !anchorNode) {
        setActiveSelection(null);
        return;
      }

      const extracted = extractSelectionContext(selection);
      if (!extracted) {
        setActiveSelection(null);
        return;
      }

      let matchedScope: SelectionScopeMeta | null = null;
      for (const { el, meta } of scopesRef.current.values()) {
        if (el.contains(anchorNode)) {
          matchedScope = meta;
          break;
        }
      }
      if (!matchedScope) {
        setActiveSelection(null);
        return;
      }

      setActiveSelection({
        text: extracted.text,
        surroundingSentence: extracted.surroundingSentence,
        surroundingParagraph: extracted.surroundingParagraph,
        scope: matchedScope,
        rect: {
          top: extracted.rect.top,
          bottom: extracted.rect.bottom,
          left: extracted.rect.left,
          right: extracted.rect.right,
        },
      });
    }

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // "How to Read" — server-side TTS only, per project policy: dynamically
  // selected text always goes through server-side TTS, never browser
  // SpeechSynthesis, not even as a fallback. On failure, show an error and
  // stop; do not substitute browser speech.
  const requestSpeech = useCallback(async () => {
    if (!activeSelection) return;
    const snapshot = activeSelection;

    // Caught here, before any network call, so an over-limit selection never
    // depends on the API route to report it — see SELECTION_ASSISTANT_MAX_TEXT_LENGTH.
    if (snapshot.text.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
      setPanel({ open: true, loading: false, action: 'howToRead', explanation: null, error: SELECTION_TEXT_TOO_LONG_MESSAGE, selection: snapshot });
      return;
    }

    setPanel({ open: true, loading: true, action: 'howToRead', explanation: null, error: null, selection: snapshot });

    try {
      const res = await fetch('/api/selection-assistant/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: snapshot.text }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        setPanel(prev =>
          prev.selection !== snapshot
            ? prev
            : { ...prev, loading: false, error: data.error ?? "Couldn't generate audio for this text." }
        );
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      // Playback started successfully — close the panel rather than leaving
      // an empty "explanation" card open with nothing to show.
      setPanel(prev => (prev.selection !== snapshot ? prev : INITIAL_PANEL));
    } catch {
      setPanel(prev =>
        prev.selection !== snapshot
          ? prev
          : { ...prev, loading: false, error: "Couldn't reach the audio service. Please check your connection." }
      );
    }
  }, [activeSelection]);

  const requestAction = useCallback(async (actionId: SelectionActionId) => {
    if (actionId === 'howToRead') {
      await requestSpeech();
      return;
    }

    if (!activeSelection) return;
    const snapshot = activeSelection;

    // Same pre-flight check as requestSpeech — one shared limit for every
    // Selection Assistant action, so Translate/Easy English never silently
    // behave differently from How to Read on a long selection.
    if (snapshot.text.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
      setPanel({ open: true, loading: false, action: actionId, explanation: null, error: SELECTION_TEXT_TOO_LONG_MESSAGE, selection: snapshot });
      return;
    }

    setPanel({ open: true, loading: true, action: actionId, explanation: null, error: null, selection: snapshot });

    try {
      const res = await fetch('/api/selection-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedText: snapshot.text,
          surroundingSentence: snapshot.surroundingSentence,
          surroundingParagraph: snapshot.surroundingParagraph,
          activityType: snapshot.scope.activityType,
          themeId: snapshot.scope.themeId ?? '',
          level: snapshot.scope.level ?? 'foundation',
          action: actionId,
        }),
      });
      const data: { ok: boolean; explanation?: string; error?: string } = await res.json();

      setPanel(prev => {
        if (prev.selection !== snapshot) return prev; // a newer request has since taken over
        return data.ok
          ? { ...prev, loading: false, explanation: data.explanation ?? '' }
          : { ...prev, loading: false, error: data.error ?? 'Something went wrong.' };
      });
    } catch {
      setPanel(prev =>
        prev.selection !== snapshot
          ? prev
          : { ...prev, loading: false, error: "Couldn't reach the AI assistant. Please check your connection." }
      );
    }
  }, [activeSelection, requestSpeech]);

  const closePanel = useCallback(() => setPanel(INITIAL_PANEL), []);

  return (
    <SelectionAssistantContext.Provider value={{ registerScope, unregisterScope }}>
      {children}
      <SelectionToolbar selection={activeSelection} onAction={requestAction} />
      <SelectionExplanationPanel panel={panel} onClose={closePanel} />
    </SelectionAssistantContext.Provider>
  );
}
