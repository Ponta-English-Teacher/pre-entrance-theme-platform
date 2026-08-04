import type { NoticeLanguageActivity } from '@/data/reading/masterReadings';
import type { Level } from '@/types';
import SelectableContent from '@/components/selection-assistant/SelectableContent';

const QUOTE_TYPES = new Set(['grammar-pattern', 'discourse-marker', 'main-idea', 'reference-words']);
const CHIP_TYPES = new Set(['target-vocab', 'recycled-vocab', 'expressions']);

const LABELS: Record<NoticeLanguageActivity['type'], string> = {
  'target-vocab': "Today's Vocabulary",
  'recycled-vocab': 'Words You Already Know',
  'expressions': 'Useful Expressions',
  'grammar-pattern': 'Grammar Pattern',
  'discourse-marker': 'Connecting Word',
  'main-idea': 'Main Idea',
  'reference-words': 'Reference Words',
  'paragraph-organization': 'How the Passage Is Organized',
  'tone-purpose': "The Author's Purpose",
};

export default function NoticeLanguageSection({
  activities,
  themeId,
  level,
}: {
  activities: NoticeLanguageActivity[];
  themeId?: string;
  level?: Level;
}) {
  return (
    <div>
      <p className="text-base text-slate-600 mb-5 leading-relaxed">
        A quick look at how the language in this passage actually works, before you think it through.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((activity, i) => (
          <div key={i} className="bg-white rounded-2xl border border-yellow-100 shadow-sm p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-yellow-800 mb-2">
              {LABELS[activity.type]}
            </p>
            <SelectableContent activityType="notice-language" themeId={themeId} level={level} label={LABELS[activity.type]}>
              <p className="text-base text-slate-800 mb-3 leading-snug">{activity.prompt}</p>

              {activity.items && CHIP_TYPES.has(activity.type) && (
                <div className="flex flex-wrap gap-1.5">
                  {activity.items.map(item => (
                    <span key={item} className="px-2.5 py-1 rounded-full text-sm font-semibold bg-yellow-50 text-yellow-800">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {activity.items && QUOTE_TYPES.has(activity.type) && (
                <div className="flex flex-col gap-2">
                  {activity.items.map(item => (
                    <p key={item} className="font-serif italic text-slate-700 border-l-2 border-yellow-200 pl-3 text-base">
                      &ldquo;{item}&rdquo;
                    </p>
                  ))}
                </div>
              )}

              {activity.note && (
                <p className="text-base text-slate-600 leading-relaxed">{activity.note}</p>
              )}
            </SelectableContent>
          </div>
        ))}
      </div>
    </div>
  );
}
