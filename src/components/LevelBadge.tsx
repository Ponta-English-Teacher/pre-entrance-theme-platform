import type { Level } from '@/types';

const CONFIG: Record<Level, { label: string; className: string }> = {
  foundation: { label: 'Foundation', className: 'bg-emerald-100 text-emerald-700' },
  standard:   { label: 'Standard',   className: 'bg-blue-100 text-blue-700' },
  challenge:  { label: 'Challenge',  className: 'bg-violet-100 text-violet-700' },
};

export default function LevelBadge({ level }: { level: Level }) {
  const { label, className } = CONFIG[level];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
