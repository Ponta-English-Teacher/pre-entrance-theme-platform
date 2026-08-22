'use client';

import type { Level } from '@/types';
import type { ConversationSupportRequest, ConversationSupportResponse, ConversationTurn } from '@/lib/ai/aiPartner/types';
import type { ExpressChatTurn, ExpressChatResponse } from '@/lib/ai/expressCoach/types';
import ExpressCoachPanel from '@/components/express-coach/ExpressCoachPanel';
import { addNotebookItem, isInNotebook } from '@/lib/store';

/**
 * "💡 Help me say it" — AI Talk's expression-support tool. Thin wrapper
 * around the shared ExpressCoachPanel: supplies AI Talk's own grounding
 * (theme, level, a slice of the live conversation) and hits AI Talk's own
 * endpoint, but the conversation UI itself is identical to Writing's version
 * (WritingExpressPanel) — see ExpressCoachPanel for the shared interaction
 * model. Input-based, not selection-based, and lives beside the reply box
 * (not attached to any particular message) since it's about something the
 * student wants to say, not something the AI already said. "What does it
 * mean?" is handled separately by the selection-based
 * AITalkSelectionToolbar/AITalkExplanationPanel — this panel no longer
 * handles it.
 *
 * Never navigates away and never ends the conversation — closing it (or
 * inserting a suggestion) returns the student straight back to typing.
 */
export default function ConversationSupportPanel({
  level,
  themeId,
  themeDescription,
  recentHistory,
  onClose,
  onInsertSuggestion,
}: {
  level: Level;
  /** Only used to populate NotebookItem.themeId on save — not part of the coaching request itself. */
  themeId: string;
  /** The AI Talk theme's description, for grounding. */
  themeDescription: string;
  /** A few recent turns of the MAIN AI Talk conversation, so the coach can ground follow-ups ("which sounds better here?") in what's actually being discussed. */
  recentHistory: ConversationTurn[];
  onClose: () => void;
  onInsertSuggestion: (text: string) => void;
}) {
  async function sendMessage(studentInput: string, history: ExpressChatTurn[]): Promise<ExpressChatResponse> {
    const request: ConversationSupportRequest = {
      action: 'express',
      level,
      themeDescription,
      recentHistory,
      studentInput,
      expressHistory: history,
    };
    const res = await fetch('/api/ai-partner/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const data: ConversationSupportResponse = await res.json();
    if (data.ok) {
      return { ok: true, reply: data.reply ?? '', suggestions: data.suggestions ?? [] };
    }
    return { ok: false, error: data.error ?? 'Something went wrong.' };
  }

  function handleSaveSuggestion(suggestion: string, context: string) {
    if (isInNotebook('help-me-say-it', suggestion, themeId)) return;
    addNotebookItem({
      category: 'help-me-say-it',
      themeId,
      level,
      favorite: false,
      label: 'Natural phrasing suggestion',
      content: suggestion,
      explanation: context,
      // Distinguishes this from Writing's identical-looking save (same
      // category/label) so Portfolio can attribute each save to the right
      // activity — see WritingExpressPanel.tsx for the counterpart tag.
      metadata: { source: 'ai-talk' },
    });
  }

  return (
    <ExpressCoachPanel
      placeholder="例：やる気が出ない"
      onClose={onClose}
      onInsert={onInsertSuggestion}
      onSaveSuggestion={handleSaveSuggestion}
      sendMessage={sendMessage}
    />
  );
}
