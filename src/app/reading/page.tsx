import { redirect } from 'next/navigation';
import { isValidLevel } from '@/data/themes';
import { getReadingById } from '@/data/reading/masterReadings';
import ReadingLessonView from '@/components/reading/ReadingLessonView';
import ReadingLessonViewV2 from '@/components/reading/ReadingLessonViewV2';

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { theme, level, lesson } = await searchParams;

  const themeId  = typeof theme  === 'string' ? theme  : null;
  const rawLevel = typeof level  === 'string' ? level  : null;
  const lessonId = typeof lesson === 'string' ? lesson : null;

  if (!themeId || !rawLevel || !lessonId) redirect('/themes');
  if (!isValidLevel(rawLevel))             redirect('/themes');

  const readingLesson = getReadingById(lessonId);
  if (!readingLesson || readingLesson.themeId !== themeId || readingLesson.level !== rawLevel) {
    redirect('/themes');
  }

  const backHref = `/themes/${themeId}/${rawLevel}/reading`;

  // Theme 1 Foundation only, during this prototype stage — every other
  // theme/level keeps using the original ReadingLessonView, unchanged.
  if (readingLesson.experienceVersion === 2) {
    return (
      <ReadingLessonViewV2
        lesson={readingLesson}
        themeId={themeId}
        backHref={backHref}
      />
    );
  }

  return (
    <ReadingLessonView
      lesson={readingLesson}
      themeId={themeId}
      backHref={backHref}
    />
  );
}
