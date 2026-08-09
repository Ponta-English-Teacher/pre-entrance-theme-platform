'use client';

import { useState, useEffect } from 'react';
import { getGlossary, getNotebookItems } from '@/lib/store';
import type { GlossaryItem, NotebookItem } from '@/lib/store';
import { THEMES } from '@/data/themes';
import { NOTEBOOK_SECTIONS } from '@/data/notebook/sections';
import SelectableContent from '@/components/selection-assistant/SelectableContent';

export default function PortfolioPage() {
  const [glossary, setGlossary] = useState<GlossaryItem[]>([]);
  const [notebook, setNotebook] = useState<NotebookItem[]>([]);

  useEffect(() => {
    const items = getGlossary();
    setGlossary([...items].sort((a, b) => b.savedDate.localeCompare(a.savedDate)));

    const notebookItems = getNotebookItems();
    setNotebook([...notebookItems].sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
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

        {/* My English Notebook — Phase 1: infrastructure only. No existing
            feature writes to this yet, so today its only content is
            migrated from the Vocabulary Glossary below (still shown
            separately, unchanged, so the two can be compared directly
            while both exist side by side). */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <span className="text-xl">📓</span>
            <div>
              <h2 className="font-bold text-slate-900">My English Notebook</h2>
              <p className="text-xs text-slate-400">マイ英語ノート</p>
            </div>
            {notebook.length > 0 && (
              <span className="ml-auto text-xs font-semibold text-slate-500">
                {notebook.length} {notebook.length === 1 ? 'item' : 'items'} saved
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {NOTEBOOK_SECTIONS.map(section => {
              const sectionItems = notebook.filter(item => item.category === section.id);
              const sectionGrouped = THEMES
                .map(theme => ({
                  theme,
                  items: sectionItems.filter(item => item.themeId === theme.id),
                }))
                .filter(g => g.items.length > 0);

              return (
                <div key={section.id} className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm" aria-hidden="true">{section.icon}</span>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {section.label}
                    </h3>
                    <span className="text-xs text-slate-300">{section.labelJapanese}</span>
                    {sectionItems.length > 0 && (
                      <span className="ml-auto text-xs font-semibold text-slate-400">
                        {sectionItems.length}
                      </span>
                    )}
                  </div>

                  {sectionItems.length === 0 ? (
                    <p className="text-sm text-slate-400">Nothing saved here yet.</p>
                  ) : (
                    <div className="space-y-5">
                      {sectionGrouped.map(({ theme, items }) => (
                        <div key={theme.id}>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            {theme.title}
                          </p>
                          <div className="space-y-3">
                            {items.map(item => (
                              <NotebookItemCard key={item.id} item={item} themeId={theme.id} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vocabulary Glossary — unchanged (Phase 1 scope: do not modify
            existing features; this keeps working exactly as it does today,
            still reading and writing its own separate storage key). */}
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

/** One generic template for every Notebook category — deliberately not
 *  forked per category, since NotebookItem's shape (content/explanation/
 *  japanese/context) is already generic enough to render uniformly. */
function NotebookItemCard({ item, themeId }: { item: NotebookItem; themeId: string }) {
  return (
    <div className="flex items-start gap-3">
      <SelectableContent activityType="vocabulary" themeId={themeId} label={`Notebook — ${item.content}`} className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
          {item.label && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 uppercase tracking-wide">
              {item.label}
            </span>
          )}
          <span className="font-bold text-slate-900">{item.content}</span>
          {item.japanese && <span className="text-sm font-medium text-indigo-600">{item.japanese}</span>}
        </div>
        {item.explanation && <p className="text-sm text-slate-600 leading-relaxed">{item.explanation}</p>}
        {item.context && <p className="text-xs text-slate-400 leading-relaxed mt-0.5 italic">{item.context}</p>}
      </SelectableContent>
      <time className="text-xs text-slate-400 whitespace-nowrap mt-0.5">
        {new Date(item.savedAt).toLocaleDateString()}
      </time>
    </div>
  );
}
