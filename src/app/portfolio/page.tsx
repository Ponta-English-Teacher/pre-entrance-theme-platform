'use client';

import { useState, useEffect } from 'react';
import { getGlossary } from '@/lib/store';
import type { GlossaryItem } from '@/lib/store';
import { THEMES } from '@/data/themes';
import SelectableContent from '@/components/selection-assistant/SelectableContent';

export default function PortfolioPage() {
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);

  useEffect(() => {
    const items = getGlossary();
    setGlossary([...items].sort((a, b) => b.savedDate.localeCompare(a.savedDate)));
  }, []);

  const grouped = THEMES
    .map(theme => ({
      theme,
      items: glossary.filter(item => item.themeId === theme.id),
    }))
    .filter(g => g.items.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
      <p className="text-slate-500 text-sm mb-8">Your saved work across all themes and levels.</p>

      <div className="space-y-6">

        {/* Vocabulary Glossary */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="text-xl">📖</span>
            <div>
              <h2 className="font-bold text-slate-900">Vocabulary Glossary</h2>
              <p className="text-xs text-slate-400">語彙リスト</p>
            </div>
            {glossary.length > 0 && (
              <span className="ml-auto text-xs font-semibold text-slate-500">
                {glossary.length} {glossary.length === 1 ? 'word' : 'words'} saved
              </span>
            )}
          </div>

          {glossary.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-400">
                Words you save during Vocabulary activities will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {grouped.map(({ theme, items }) => (
                <div key={theme.id} className="px-6 py-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {theme.title}
                  </h3>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.word} className="flex items-start gap-3">
                        <SelectableContent activityType="vocabulary" themeId={theme.id} label={`Glossary — ${item.word}`} className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
                            <span className="font-bold text-slate-900">{item.word}</span>
                            <span className="text-sm font-medium text-indigo-600">{item.japanese}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.definition}</p>
                        </SelectableContent>
                        <time className="text-xs text-slate-400 whitespace-nowrap mt-0.5">
                          {new Date(item.savedDate).toLocaleDateString()}
                        </time>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Writing Samples — placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="text-xl">✏️</span>
            <div>
              <h2 className="font-bold text-slate-900">Writing Samples</h2>
              <p className="text-xs text-slate-400">作文サンプル</p>
            </div>
          </div>
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-400">Writing samples you save will appear here.</p>
          </div>
        </div>

        {/* Speaking Records — placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="text-xl">🎙️</span>
            <div>
              <h2 className="font-bold text-slate-900">Speaking Records</h2>
              <p className="text-xs text-slate-400">録音記録</p>
            </div>
          </div>
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-400">Your speaking recordings will appear here.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
