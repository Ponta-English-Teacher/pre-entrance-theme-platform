'use client';

import { useEffect, useState } from 'react';
import type { NotebookItem } from '@/lib/store';
import { getThemeNotebookItems } from '@/lib/portfolio';
import { getNotebookSectionConfig } from '@/data/notebook/sections';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import LevelBadge from '@/components/LevelBadge';

const LIMIT = 4;

/** One theme's deliberately-saved learning (Reading selections, AI Talk
 *  explanations, Help Me Say It from AI Talk) — Vocabulary and Writing
 *  feedback saves have their own dedicated sections above and are excluded
 *  here (see getReviewableNotebookItems in lib/portfolio.ts), so nothing
 *  shows twice. */
export default function ThemeNotebookSection({ themeId }: { themeId: string }) {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState<NotebookItem[]>([]);
  useEffect(() => setItems(getThemeNotebookItems(themeId)), [themeId]);

  const visible = showAll ? items : items.slice(0, LIMIT);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">📓 Saved Learning</p>
        {items.length > 0 && <span className="text-xs font-semibold text-slate-400">{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nothing saved yet. When you select text or get help during Reading or AI Talk, you can save it here.
        </p>
      ) : (
        <>
          <div className="space-y-2.5">
            {visible.map(item => {
              const section = getNotebookSectionConfig(item.category);
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <SelectableContent activityType="vocabulary" themeId={item.themeId} label={`Saved — ${item.content}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      {section && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">
                          <span aria-hidden="true">{section.icon}</span> {section.label}
                        </span>
                      )}
                      <span className="font-bold text-slate-900">{item.content}</span>
                      {item.japanese && <span className="text-sm font-medium text-indigo-600">{item.japanese}</span>}
                      {item.level && <LevelBadge level={item.level} />}
                    </div>
                    {item.explanation && <p className="text-sm text-slate-600 leading-relaxed">{item.explanation}</p>}
                  </SelectableContent>
                  <time className="text-xs text-slate-400 whitespace-nowrap mt-0.5">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </time>
                </div>
              );
            })}
          </div>
          {items.length > LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll(v => !v)}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {showAll ? 'Show fewer ▴' : `Show all ${items.length} ▾`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
