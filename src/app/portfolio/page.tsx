'use client';

const SECTIONS = [
  {
    id:      'vocabulary',
    label:   'Vocabulary Glossary',
    labelJa: '語彙リスト',
    icon:    '📖',
    empty:   'Words you save during Vocabulary activities will appear here.',
  },
  {
    id:      'writing',
    label:   'Writing Samples',
    labelJa: '作文サンプル',
    icon:    '✏️',
    empty:   'Writing samples you save will appear here.',
  },
  {
    id:      'speaking',
    label:   'Speaking Records',
    labelJa: '録音記録',
    icon:    '🎙️',
    empty:   'Your speaking recordings will appear here.',
  },
];

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
      <p className="text-slate-500 text-sm mb-8">
        Your saved work across all themes and levels.
      </p>
      <div className="space-y-6">
        {SECTIONS.map(section => (
          <div key={section.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <span className="text-xl">{section.icon}</span>
              <div>
                <h2 className="font-bold text-slate-900">{section.label}</h2>
                <p className="text-xs text-slate-400">{section.labelJa}</p>
              </div>
            </div>
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-400">{section.empty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
