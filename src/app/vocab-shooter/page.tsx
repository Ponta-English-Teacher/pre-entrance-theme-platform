import { redirect } from 'next/navigation';
import { isValidLevel } from '@/data/themes';
import { THEME_VOCAB_SETS, getThemeVocabIds, buildShooterSets } from '@/data/vocabulary/themeVocabSets';
import { getVocabSubset } from '@/data/vocabulary/masterVocabulary';
import FlashCards from '@/components/vocab-shooter/FlashCards';

export default async function VocabShooterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { theme, level, set } = await searchParams;

  const themeId  = typeof theme === 'string' ? theme  : null;
  const rawLevel = typeof level === 'string' ? level  : null;
  const rawSet   = typeof set   === 'string' ? set    : null;

  if (!themeId || !rawLevel || !rawSet) redirect('/themes');
  if (!isValidLevel(rawLevel))          redirect('/themes');
  if (!THEME_VOCAB_SETS[themeId])       redirect('/themes');

  const setIndex = parseInt(rawSet, 10) - 1;
  if (isNaN(setIndex) || setIndex < 0 || setIndex > 3) redirect('/themes');

  const allIds  = getThemeVocabIds(themeId, rawLevel);
  const sets    = buildShooterSets(allIds);
  const setIds  = sets[setIndex];

  if (setIds.length === 0) redirect('/themes');

  const words    = getVocabSubset(setIds);
  const backHref = `/themes/${themeId}/${rawLevel}/vocabulary`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Flash Cards · Set {setIndex + 1} of 4
        </p>
        <h1 className="text-2xl font-bold text-slate-900 capitalize">
          {rawLevel} Vocabulary
        </h1>
      </div>

      <FlashCards words={words} backHref={backHref} />
    </div>
  );
}
