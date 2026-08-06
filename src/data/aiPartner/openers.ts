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
  advanced?: string;
}

const AI_TALK_OPENERS: AITalkOpenerSet[] = [
  {
    themeId: 'knowing-myself',
    foundation:
      "Hi! Today's reading asked whether personality is something we're born with, or something we build through experience. What do you think — has a challenge or new experience ever changed who you are?",
    advanced:
      "Hi! Today's reading looked at one of psychology's oldest debates — nature versus nurture. I found it striking that even identical twins raised in completely different families can grow up surprisingly alike. What's your own take — do you think you're more a product of what you were born with, or everything you've experienced so far?",
  },
  {
    themeId: 'university-student',
    foundation:
      "Hi! Today's reading talked about how, at university, nobody checks your attendance or reminds you about deadlines anymore — you have to manage everything yourself. Is there a responsibility you're a little nervous about handling on your own, or one you're actually looking forward to?",
    advanced:
      "Hi! Today's reading argued that becoming independent isn't really about gaining more freedom — it's about relocating responsibility from an external system into yourself, building self-discipline to quietly replace supervision. Do you think you already have habits that show real self-discipline, or is that something you expect to build once you're at university?",
  },
  {
    themeId: 'designing-my-future',
    foundation:
      "Hi! I read about Ren — he didn't have a clear dream, until one small moment of helping his sister gave him a real sense of direction. Has anything small ever made you think differently about your own future?",
  },
  {
    themeId: 'living-together',
    foundation:
      "Hi! I read about Mio and her roommate — they didn't agree on much at first, but talking honestly helped them find a compromise and grow closer. Is there someone you get along well with, or someone you've learned to get along with over time?",
  },
  {
    themeId: 'facts-or-fake',
    foundation:
      "Hi! I read about Haruto — he almost believed a scary message in a group chat, until he checked the source and found out it wasn't true. Have you ever seen information online that turned out to be false?",
  },
  {
    themeId: 'peace-and-war',
    foundation:
      "Hi! I read about Yuna — she finally asked her grandmother about the war, and learned about a piece of her family's history. Is there something from an older family member's life you'd like to know more about?",
  },
  {
    themeId: 'caring-for-our-planet',
    foundation:
      "Hi! I read about Aoi — she noticed her favorite beach changing, and started small by carrying a reusable bottle and joining a beach cleanup. Is there a small environmental habit you already have, or one you'd like to start?",
  },
  {
    themeId: 'living-with-ai',
    foundation:
      "Hi! I read about Kenta — he learned that AI could help him start an essay, but the thinking had to be his. How do you make sure your own thinking stays part of the process when you use AI?",
  },
  {
    themeId: 'learning-from-history',
    foundation:
      "Hi! I read about Rin — she found an old photograph of her ancestor and discovered a piece of her family's history. Is there something from your own family's past that you'd like to know more about?",
  },
  {
    themeId: 'science-in-everyday-life',
    foundation:
      "Hi! I read about Yuto — he got curious about something ordinary, a wet can of juice, and investigated it like a scientist. Is there something in your everyday life you're curious about?",
  },
];

export function getAITalkOpener(themeId: string, level: Level): string | undefined {
  const set = AI_TALK_OPENERS.find(s => s.themeId === themeId);
  return set?.[level];
}
