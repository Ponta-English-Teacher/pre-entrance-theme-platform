import { redirect } from 'next/navigation';
import { isValidLevel } from '@/data/themes';
import { getReadingById } from '@/data/reading/masterReadings';
import ReadingPassageReader from '@/components/reading/ReadingPassageReader';

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { theme, level, passage } = await searchParams;

  const themeId    = typeof theme   === 'string' ? theme   : null;
  const rawLevel   = typeof level   === 'string' ? level   : null;
  const passageId  = typeof passage === 'string' ? passage : null;

  if (!themeId || !rawLevel || !passageId) redirect('/themes');
  if (!isValidLevel(rawLevel))              redirect('/themes');

  const readingPassage = getReadingById(passageId);
  if (!readingPassage || readingPassage.themeId !== themeId || readingPassage.level !== rawLevel) {
    redirect('/themes');
  }

  const backHref = `/themes/${themeId}/${rawLevel}/reading`;

  return (
    <ReadingPassageReader
      passage={readingPassage}
      themeId={themeId}
      backHref={backHref}
    />
  );
}
