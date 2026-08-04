export default function ProgressBar({
  current,
  total,
  colorClassName = 'bg-indigo-500',
}: {
  current: number;
  total: number;
  colorClassName?: string;
}) {
  const percent = total > 0 ? (current / total) * 100 : 0;
  return (
    <div
      className="w-full bg-slate-100 rounded-full h-1.5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div
        className={`${colorClassName} h-1.5 rounded-full transition-all`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
