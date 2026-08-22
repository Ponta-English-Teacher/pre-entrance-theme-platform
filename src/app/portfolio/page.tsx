import PortfolioProgress from '@/components/portfolio/PortfolioProgress';
import PortfolioWriting from '@/components/portfolio/PortfolioWriting';
import PortfolioVocabulary from '@/components/portfolio/PortfolioVocabulary';
import PortfolioNotebook from '@/components/portfolio/PortfolioNotebook';
import PortfolioRecent from '@/components/portfolio/PortfolioRecent';

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
      <p className="text-slate-500 text-sm mb-5 sm:mb-8">Your learning, in one place.</p>

      <div className="space-y-6">
        <PortfolioProgress />
        <PortfolioWriting />
        <PortfolioVocabulary />
        <PortfolioNotebook />
        <PortfolioRecent />
      </div>
    </div>
  );
}
