import Link from 'next/link';
import { getReadingsByTheme } from '@/data/reading/masterReadings';
import { getAITalkOpener } from '@/data/aiPartner/openers';
import type { Level } from '@/types';

export default function AITalkActivity({
  themeId,
  level,
}: {
  themeId: string;
  level: Level;
}) {
  const readingLesson = getReadingsByTheme(themeId, level)[0];
  const opener = getAITalkOpener(themeId, level);

  if (!readingLesson || !opener) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">💬</div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">AI Talk coming soon</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Conversations for this theme and level will be added here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <div className="text-5xl mb-4">💬</div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">Ready to talk about it?</h2>
      <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
        Let&rsquo;s talk about who you&rsquo;re becoming — there&rsquo;s no right or wrong answer here.
      </p>
      <Link
        href={`/ai-talk?theme=${themeId}&level=${level}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
      >
        Start Conversation
      </Link>
    </div>
  );
}
