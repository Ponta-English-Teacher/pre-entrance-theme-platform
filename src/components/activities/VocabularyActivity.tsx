import { getThemeVocabIds } from '@/data/vocabulary/themeVocabSets';
import { getVocabSubset } from '@/data/vocabulary/masterVocabulary';
import type { Level } from '@/types';

const POS_STYLE: Record<string, string> = {
  noun:      'bg-blue-100 text-blue-700',
  verb:      'bg-emerald-100 text-emerald-700',
  adjective: 'bg-amber-100 text-amber-700',
  adverb:    'bg-purple-100 text-purple-700',
  phrase:    'bg-rose-100 text-rose-700',
};

const LEVEL_INTRO_LABEL: Record<string, string> = {
  foundation: 'Foundation',
  standard:   'Standard',
  challenge:  'Challenge',
};

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

      {/* Word list */}
      <div className="space-y-3">
        {words.map(entry => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-slate-200 px-6 py-4"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-lg font-bold text-slate-900">{entry.word}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${POS_STYLE[entry.pos]}`}>
                    {entry.pos}
                  </span>
                  {level !== 'foundation' && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                      {LEVEL_INTRO_LABEL[entry.introductionLevel]}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-indigo-600 mb-1">{entry.japanese}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{entry.coreMeaning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
