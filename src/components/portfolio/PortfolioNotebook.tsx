'use client';

import { useEffect, useState } from 'react';
import type { NotebookItem } from '@/lib/store';
import { getReviewableNotebookItems } from '@/lib/portfolio';
import { THEMES } from '@/data/themes';
import { getNotebookSectionConfig } from '@/data/notebook/sections';
import SelectableContent from '@/components/selection-assistant/SelectableContent';

interface ThemeGroup {
  themeId: string;
  themeTitle: string;
  items: NotebookItem[];
  latest: string;
}

function buildGroups(items: NotebookItem[]): ThemeGroup[] {
  const byTheme = new Map<string, NotebookItem[]>();
  for (const item of items) {
    const list = byTheme.get(item.themeId) ?? [];
    list.push(item);
    byTheme.set(item.themeId, list);
  }
  const groups: ThemeGroup[] = [];
  for (const [themeId, groupItems] of byTheme) {
    const sorted = [...groupItems].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    groups.push({
      themeId,
      themeTitle: THEMES.find(t => t.id === themeId)?.title ?? themeId,
      items: sorted,
      latest: sorted[0]?.savedAt ?? '',
    });
  }
  return groups.sort((a, b) => b.latest.localeCompare(a.latest));
}

const LIMIT = 3;

export default function PortfolioNotebook() {
  const [showAll, setShowAll] = useState(false);
  // Empty until mount, then populated — see PortfolioProgress.tsx for why.
  const [groups, setGroups] = useState<ThemeGroup[]>([]);
  useEffect(() => setGroups(buildGroups(getReviewableNotebookItems())), []);

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const visibleGroups = showAll ? groups : groups.slice(0, LIMIT);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">📓</span>
        <div>
          <h2 className="font-bold text-slate-900">My Notebook</h2>
          <p className="text-xs text-slate-400">マイノート — deliberately saved learning</p>
        </div>
        {totalCount > 0 && <span className="ml-auto text-xs font-semibold text-slate-500">{totalCount} saved</span>}
      </div>

      {groups.length === 0 ? (
        <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
          <p className="text-sm text-slate-400">
            Nothing saved yet. When you select text or get help during Reading, AI Talk, or Writing, you can save it here for review.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-slate-100">
            {visibleGroups.map(group => (
              <div key={group.themeId} className="px-4 sm:px-6 py-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{group.themeTitle}</p>
                <div className="space-y-4">
                  {group.items.map(item => {
                    const section = getNotebookSectionConfig(item.category);
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <SelectableContent activityType="vocabulary" themeId={item.themeId} label={`Notebook — ${item.content}`} className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            {section && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">
                                <span aria-hidden="true">{section.icon}</span> {section.label}
                              </span>
                            )}
                            <span className="font-bold text-slate-900">{item.content}</span>
                            {item.japanese && <span className="text-sm font-medium text-indigo-600">{item.japanese}</span>}
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
              </div>
            ))}
          </div>
          {groups.length > LIMIT && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAll(v => !v)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {showAll ? 'Show fewer themes ▴' : `Show all ${groups.length} themes ▾`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
