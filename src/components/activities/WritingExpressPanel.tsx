'use client';

import type { Level } from '@/types';
import type { WritingExpressRequest, WritingExpressResponse } from '@/lib/ai/writingTutor/types';
import type { ExpressChatTurn } from '@/lib/ai/expressCoach/types';
import ExpressCoachPanel from '@/components/express-coach/ExpressCoachPanel';
import { addNotebookItem, isInNotebook } from '@/lib/store';

/**
 * "💡 Help me say it" — Writing's expression-support tool. Thin wrapper
 * around the shared ExpressCoachPanel: supplies Writing's own grounding
 * (theme, level, writing prompt, current draft) and hits Writing's own
 * endpoint, but the conversation UI itself is identical to AI Talk's version
 * (ConversationSupportPanel) — see ExpressCoachPanel for the shared
 * interaction model. Expression support, not grammar correction — never
 * touches what the student has already written; a suggestion is only ever
 * inserted at the cursor when the student clicks it.
 */
export default function WritingExpressPanel({
  level,
  themeId,
  writingPrompt,
  currentDraft,
  onClose,
  onInsertSuggestion,
}: {
  level: Level;
  themeId: string;
  writingPrompt: string;
  currentDraft: string;
  onClose: () => void;
  onInsertSuggestion: (text: string) => void;
}) {
  async function sendMessage(studentInput: string, history: ExpressChatTurn[]) {
    const request: WritingExpressRequest = {
      level,
      themeId,
      writingPrompt,
      currentDraft,
      studentInput,
      expressHistory: history,
    };
    const res = await fetch('/api/writing-tutor/express', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const data: WritingExpressResponse = await res.json();
    return data;
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
    });
  }

  return (
    <ExpressCoachPanel
      placeholder="例：自分の性格について考えたことを書きたい"
      onClose={onClose}
      onInsert={onInsertSuggestion}
      onSaveSuggestion={handleSaveSuggestion}
      sendMessage={sendMessage}
    />
  );
}
