import { getThemeBySlug, isValidLevel } from '@/data/themes';
import { getThemeVocabIds } from '@/data/vocabulary/themeVocabSets';
import { getVocabSubset } from '@/data/vocabulary/masterVocabulary';
import { getReadingById } from '@/data/reading/masterReadings';
import { KNOWING_MYSELF_TEST_OPENERS } from '@/data/aiPartner/testOpeners';
import AIPartnerConversation from '@/components/ai-partner/AIPartnerConversation';
import type { Level } from '@/types';

/**
 * TEMPORARY Milestone 2 test harness — not linked from any nav or the
 * activity grid, reachable only by typing this URL directly. Exists purely
 * to exercise AIPartnerConversation against the real Milestone 1 backend
 * before a final activity route exists.
 *
 * Only km-f-reading-01 (Foundation) has real reading content today, so its
 * mission/passage are reused as grounding text for the Standard/Challenge
 * test levels too — a test-only shortcut, not a claim that those lessons
 * exist yet.
 */
export default async function AIPartnerDevPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { level: rawLevel } = await searchParams;
  const level: Level = typeof rawLevel === 'string' && isValidLevel(rawLevel) ? rawLevel : 'foundation';

  const themeId = 'knowing-myself';
  const theme = getThemeBySlug(themeId)!;
  const readingLesson = getReadingById('km-f-reading-01')!;

  const targetVocab = getVocabSubset(getThemeVocabIds(themeId, level)).map(v => ({
    word: v.word,
    japanese: v.japanese,
    coreMeaning: v.coreMeaning,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">
          Dev test harness — Milestone 2, not a real route
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Talk with Your AI Partner</h1>
        <p className="text-sm text-slate-500">
          {theme.title} · {level} · switch level with ?level=foundation|standard|challenge
        </p>
      </div>

      <AIPartnerConversation
        themeId={themeId}
        level={level}
        themeDescription={theme.description}
        themeDescriptionJapanese={theme.descriptionJapanese}
        mission={readingLesson.mission}
        readingPassage={readingLesson.paragraphs.map(p => p.english)}
        targetVocab={targetVocab}
        opener={KNOWING_MYSELF_TEST_OPENERS[level]}
      />
    </div>
  );
}
