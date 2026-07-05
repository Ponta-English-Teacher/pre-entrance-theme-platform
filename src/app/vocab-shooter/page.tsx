import { redirect } from 'next/navigation';
import { isValidLevel } from '@/data/themes';
import { THEME_VOCAB_SETS, getThemeVocabIds, buildShooterSets } from '@/data/vocabulary/themeVocabSets';
import { getVocabSubset } from '@/data/vocabulary/masterVocabulary';
import ShooterShell from '@/components/vocab-shooter/ShooterShell';

export default async function VocabShooterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { theme, level, set } = await searchParams;

  const themeId  = typeof theme === 'string' ? theme : null;
  const rawLevel = typeof level === 'string' ? level : null;
  const rawSet   = typeof set   === 'string' ? set   : null;

  if (!themeId || !rawLevel || !rawSet) redirect('/themes');
  if (!isValidLevel(rawLevel))          redirect('/themes');
  if (!THEME_VOCAB_SETS[themeId])       redirect('/themes');

  const setIndex = parseInt(rawSet, 10) - 1;
  if (isNaN(setIndex) || setIndex < 0 || setIndex > 3) redirect('/themes');

  const allIds   = getThemeVocabIds(themeId, rawLevel);
  const sets     = buildShooterSets(allIds);
  const setIds   = sets[setIndex];

  if (setIds.length === 0) redirect('/themes');

  const setWords = getVocabSubset(setIds);
  const allWords = getVocabSubset(allIds);
  const backHref = `/themes/${themeId}/${rawLevel}/vocabulary`;

  return (
    <ShooterShell
      setWords={setWords}
      allWords={allWords}
      backHref={backHref}
      setNumber={setIndex + 1}
      level={rawLevel}
    />
  );
}
