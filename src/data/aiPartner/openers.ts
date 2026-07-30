import type { Level } from '@/types';

/**
 * Authored AI Talk conversation openers — permanent lesson content, promoted
 * from the Milestone 2 test-only pool. Per AI_TALK_ACTIVITY_DESIGN.md §1, the
 * opener is always authored content, never generated live, and references
 * something concrete the student already engaged with rather than reading as
 * a cold interview question.
 *
 * Only populated where a theme+level actually has real reading content to
 * ground it in. A missing entry means that theme+level isn't playable yet —
 * callers should treat an undefined return as "coming soon," not fall back to
 * another level's opener.
 */
interface AITalkOpenerSet {
  themeId: string;
  foundation?: string;
  standard?: string;
  challenge?: string;
}

const AI_TALK_OPENERS: AITalkOpenerSet[] = [
  {
    themeId: 'knowing-myself',
    foundation:
      "Hi! I read about Aya — she was shy, but she gave that presentation anyway, and it gave her real confidence. Has trying something small like that ever changed how you feel about yourself?",
  },
];

export function getAITalkOpener(themeId: string, level: Level): string | undefined {
  const set = AI_TALK_OPENERS.find(s => s.themeId === themeId);
  return set?.[level];
}
