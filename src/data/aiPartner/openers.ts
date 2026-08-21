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
      "Hi! Today's reading suggested that designing your future starts with understanding yourself, not with choosing a destination first. Has an ordinary experience — a class, working with others, a difficult task — ever revealed something about yourself that you didn't expect?",
    advanced:
      "Hi! Today's reading explored a real debate about how a future actually takes shape — is it something that already exists, just waiting to be found, or something you build gradually through experience? Which of those two ideas feels closer to your own experience so far?",
  },
  {
    themeId: 'living-together',
    foundation:
      "Hi! Do you have friends who are pretty different from you?",
    advanced:
      "Hi! Have you ever joined a new group where you didn't really know anyone at first?",
  },
  {
    themeId: 'facts-or-fake',
    foundation:
      "Hi! When you see something surprising online, do you usually believe it right away, or do you check it first?",
    advanced:
      "Hi! Do you ever come across information online that makes you stop and think, 'Is this actually true?'",
  },
  {
    themeId: 'peace-and-war',
    foundation:
      'Hi! When you and a friend disagree about something, what usually helps you two get past it?',
    advanced:
      "Hi! Do you think it's possible to fully 'make up' with someone after a serious disagreement, or does something always stay a little different afterward?",
  },
  {
    themeId: 'caring-for-our-planet',
    foundation:
      'Hi! Do you ever think about where your trash goes after you throw it away?',
    advanced:
      'Hi! Have you ever disagreed with someone about how serious a problem is, even though you both agreed on the basic facts?',
  },
  {
    themeId: 'living-with-ai',
    foundation:
      'Hi! Can you remember the first time you used an AI tool, like ChatGPT or something similar? What was that like?',
    advanced:
      'Hi! When you imagine AI in twenty years, do you feel curious, worried, or a mix of both? What makes you feel that way?',
  },
  {
    themeId: 'learning-from-history',
    foundation:
      "Hi! Has anyone older than you — a parent, grandparent, or teacher — ever taught you something they learned a long time ago, like a skill, a recipe, or a saying? What was it?",
    advanced:
      'Hi! What do you think people need to learn from history?',
  },
  {
    themeId: 'science-in-everyday-life',
    foundation:
      'Hi! What does science mean to you?',
    advanced:
      'Hi! Is there anything you think is difficult to explain through science?',
  },
];

export function getAITalkOpener(themeId: string, level: Level): string | undefined {
  const set = AI_TALK_OPENERS.find(s => s.themeId === themeId);
  return set?.[level];
}
