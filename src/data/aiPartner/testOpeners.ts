import type { Level } from '@/types';

/**
 * Authored AI Partner conversation openers — TESTING ONLY, for the Milestone 2
 * dev route (src/app/dev/ai-partner/page.tsx). Per AI_PARTNER_ACTIVITY_DESIGN.md
 * §1, the opener is always authored content, never generated live, and should
 * reference something concrete the student already engaged with rather than
 * read as a cold interview question. Grounded in the real km-f-reading-01
 * passage (the "Aya" example). Not a complete per-lesson content set — that is
 * lesson-authoring work for a later milestone.
 */
export const KNOWING_MYSELF_TEST_OPENERS: Record<Level, string> = {
  foundation:
    "Hi! I read about Aya — she was shy, but she gave that presentation anyway, and it gave her real confidence. Has trying something small like that ever changed how you feel about yourself?",
  standard:
    "That story about Aya's presentation stuck with me — one small moment of courage, and suddenly she saw a new strength in herself. Do you think confidence usually comes from one moment like that, or does it build up in smaller ways?",
  challenge:
    "The reading argues that character comes from many small choices, not one dramatic moment. I'm not fully convinced — don't some single experiences really do change a person all at once? What's your take?",
};
