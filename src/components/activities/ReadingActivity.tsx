import { getReadingsByTheme } from '@/data/reading/masterReadings';
import ReadingPassageList from '@/components/activities/ReadingPassageList';
import type { Level } from '@/types';

export default function ReadingActivity({
  themeId,
  level,
}: {
  themeId: string;
  level: Level;
}) {
  const passages = getReadingsByTheme(themeId, level);

  if (passages.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">Reading coming soon</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Passages for this theme and level will be added here.
        </p>
      </div>
    );
  }

  return <ReadingPassageList passages={passages} themeId={themeId} level={level} />;
}
