import { redirect } from 'next/navigation';
import { getThemeBySlug, isValidLevel } from '@/data/themes';
import { getReadingsByTheme } from '@/data/reading/masterReadings';
import { getVocabSubset } from '@/data/vocabulary/masterVocabulary';
import { getThemeVocabIds } from '@/data/vocabulary/themeVocabSets';
import { getAITalkOpener } from '@/data/aiPartner/openers';
import AITalkSessionView from '@/components/ai-talk/AITalkSessionView';
import type { Level } from '@/types';

export default async function AITalkPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { theme, level: rawLevel } = await searchParams;

  const themeId  = typeof theme === 'string' ? theme : null;
  const rawLevelStr = typeof rawLevel === 'string' ? rawLevel : null;

  if (!themeId || !rawLevelStr) redirect('/themes');
  if (!isValidLevel(rawLevelStr)) redirect('/themes');

  const themeData = getThemeBySlug(themeId);
  if (!themeData) redirect('/themes');

  const level = rawLevelStr as Level;
  const readingLesson = getReadingsByTheme(themeId, level)[0];
  const opener = getAITalkOpener(themeId, level);

  if (!readingLesson || !opener) redirect(`/themes/${themeId}/${level}`);

  const targetVocab = getVocabSubset(getThemeVocabIds(themeId, level)).map(v => ({
    word: v.word,
    japanese: v.japanese,
    coreMeaning: v.coreMeaning,
  }));

  return (
    <AITalkSessionView
      themeId={themeId}
      themeTitle={themeData.title}
      themeDescription={themeData.description}
      themeDescriptionJapanese={themeData.descriptionJapanese}
      level={level}
      mission={readingLesson.mission}
      readingPassage={readingLesson.paragraphs.map(p => p.english)}
      targetVocab={targetVocab}
      opener={opener}
      backHref={`/themes/${themeId}/${level}`}
    />
  );
}
