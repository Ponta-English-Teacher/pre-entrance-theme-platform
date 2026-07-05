import { getThemeVocabIds } from '@/data/vocabulary/themeVocabSets';
import { getVocabSubset } from '@/data/vocabulary/masterVocabulary';
import VocabularyWordList from '@/components/activities/VocabularyWordList';
import type { Level } from '@/types';

export default function VocabularyActivity({
  themeId,
  level,
}: {
  themeId: string;
  level: Level;
}) {
  const ids   = getThemeVocabIds(themeId, level);
  const words = getVocabSubset(ids);

  if (words.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">Vocabulary coming soon</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Words for this theme and level will be added here.
        </p>
      </div>
    );
  }

  const foundationCount = words.filter(w => w.introductionLevel === 'foundation').length;
  const standardCount   = words.filter(w => w.introductionLevel === 'standard').length;
  const challengeCount  = words.filter(w => w.introductionLevel === 'challenge').length;

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-slate-700 font-semibold">{words.length} words</span>
        {foundationCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Foundation ×{foundationCount}
          </span>
        )}
        {standardCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            Standard ×{standardCount}
          </span>
        )}
        {challengeCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
            Challenge ×{challengeCount}
          </span>
        )}
      </div>

      <VocabularyWordList words={words} themeId={themeId} level={level} />
    </div>
  );
}
