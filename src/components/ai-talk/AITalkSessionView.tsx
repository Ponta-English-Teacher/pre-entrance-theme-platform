'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import type { Level } from '@/types';
import { markActivityComplete } from '@/lib/store';
import { AI_PARTNER_LEVEL_TURN_TARGETS } from '@/lib/ai/aiPartner/types';
import type { TargetVocabItem } from '@/lib/ai/aiPartner/types';
import AIPartnerConversation from '@/components/ai-partner/AIPartnerConversation';

/**
 * The production AI Talk full-session experience — the "immersive" route
 * content, matching Reading's separate-full-page pattern. Wraps the existing,
 * unrenamed AIPartnerConversation with the AI Talk activity's own concerns:
 * a header, a "Finish Conversation" action, and completion recording via
 * markActivityComplete — none of which the conversation component itself
 * needs to know about (AI_TALK_ACTIVITY_DESIGN.md §6: complete only once the
 * level's turn target is met; ending early still ends gracefully).
 */
export default function AITalkSessionView({
  themeId,
  themeTitle,
  themeDescription,
  themeDescriptionJapanese,
  level,
  mission,
  readingPassage,
  targetVocab,
  opener,
  backHref,
}: {
  themeId: string;
  themeTitle: string;
  themeDescription: string;
  themeDescriptionJapanese: string;
  level: Level;
  mission: string;
  readingPassage: string[];
  targetVocab: TargetVocabItem[];
  opener: string;
  backHref: string;
}) {
  const [studentTurnCount, setStudentTurnCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleTurnCountChange = useCallback((count: number) => {
    setStudentTurnCount(count);
  }, []);

  const targetMet = studentTurnCount >= AI_PARTNER_LEVEL_TURN_TARGETS[level];

  function handleFinish() {
    if (targetMet) {
      markActivityComplete(themeId, level, 'ai-talk');
    }
    setFinished(true);
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-4xl mb-4">💬</p>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {targetMet ? 'Great conversation!' : 'Thanks for talking with me!'}
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          {targetMet
            ? "You've completed today's conversation."
            : 'Come back anytime to keep the conversation going.'}
        </p>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
        >
          ← Back to Activities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-10">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">AI Talk</h1>
          <p className="text-sm font-medium text-indigo-600">{themeTitle}</p>
        </div>
        <Link
          href={backHref}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap mt-1"
        >
          ✕ Exit
        </Link>
      </div>
      <p className="text-slate-600 text-sm mb-4 sm:mb-8">
        Let&rsquo;s talk about who you&rsquo;re becoming — there&rsquo;s no right or wrong answer here.
      </p>

      <AIPartnerConversation
        themeId={themeId}
        level={level}
        themeDescription={themeDescription}
        themeDescriptionJapanese={themeDescriptionJapanese}
        mission={mission}
        readingPassage={readingPassage}
        targetVocab={targetVocab}
        opener={opener}
        onStudentTurnCountChange={handleTurnCountChange}
      />

      <button
        type="button"
        onClick={handleFinish}
        className="w-full mt-4 py-3 rounded-lg font-bold text-sm bg-white border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
      >
        Finish Conversation
      </button>
    </div>
  );
}
