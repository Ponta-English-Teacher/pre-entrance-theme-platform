import type { Level } from '@/types';

const CONFIG: Record<Level, { label: string; className: string }> = {
  foundation: { label: 'Foundation', className: 'bg-emerald-100 text-emerald-700' },
  advanced:   { label: 'Advanced',   className: 'bg-blue-100 text-blue-700' },
};

export default function LevelBadge({ level }: { level: Level }) {
  const { label, className } = CONFIG[level];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
