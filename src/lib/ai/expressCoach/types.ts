/**
 * Shared contract for every "💡 Help me say it" coaching chat in the app
 * (Writing's WritingExpressPanel, AI Talk's ConversationSupportPanel, and any
 * future one). One interaction model, one response shape — only each
 * feature's own system prompt and grounding context differ (written vs.
 * conversational English). See src/components/express-coach/ExpressCoachPanel.tsx
 * for the shared UI that consumes this shape.
 */

/** One turn of a "Help me say it" coaching chat — a separate, small conversation from whatever the student is doing in the host activity (writing a draft, having an AI Talk conversation). */
export interface ExpressChatTurn {
  role: 'student' | 'coach';
  text: string;
  /** 0–3 short, ready-to-use expressions extracted from `text`, only when this coach turn genuinely offered new usable phrasing. Absent/empty for purely explanatory turns (e.g. explaining vocabulary, grammar, nuance, or register). */
  suggestions?: string[];
}

export interface ExpressChatResult {
  /** The coach's natural-language answer, as plain conversational/prose text. */
  reply: string;
  /** 0 to 3 short, clean, ready-to-insert expressions extracted from `reply`. Empty when the reply is purely explanatory. */
  suggestions: string[];
}

export type ExpressChatResponse =
  | ({ ok: true } & ExpressChatResult)
  | { ok: false; error: string };

/** Shared JSON-schema the model must fill for every coaching-chat reply, in either feature. */
export const expressChatResponseSchema = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description:
        "The coach's natural-language answer to the student's actual message, as plain conversational text. No markdown formatting.",
    },
    suggestions: {
      type: 'array',
      items: { type: 'string' },
      description:
        '0 to 3 short, clean, ready-to-insert expressions extracted from `reply`, only when the reply genuinely offers a new concrete phrasing the student could use right now. Empty array for purely explanatory replies (e.g. explaining vocabulary, grammar, nuance, or register without proposing usable text).',
    },
  },
  required: ['reply', 'suggestions'],
  additionalProperties: false,
} as const;

export function isValidExpressChatTurn(value: unknown): value is ExpressChatTurn {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  if (t.role !== 'student' && t.role !== 'coach') return false;
  if (typeof t.text !== 'string') return false;
  if (t.suggestions !== undefined && (!Array.isArray(t.suggestions) || !t.suggestions.every(s => typeof s === 'string'))) {
    return false;
  }
  return true;
}
