import { THEMES } from '@/data/themes';
import ThemeCard from '@/components/ThemeCard';

export default function ThemesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Choose a Theme</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Select a topic that interests you. You will choose your English level next.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEMES.map(theme => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}
