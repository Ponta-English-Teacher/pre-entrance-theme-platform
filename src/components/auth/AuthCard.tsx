import Link from 'next/link';

/** Shared narrow-card layout for every PESM auth page (Sign Up, Log In,
 *  Forgot Password, Reset Password) — reuses the app's existing card
 *  language (bg-white rounded-2xl border, indigo accents) rather than a
 *  generic Supabase-looking auth screen. A single reused wrapper so all
 *  four pages stay visually and structurally consistent. */
export default function AuthCard({
  titleEn,
  titleJa,
  subtitleEn,
  children,
}: {
  titleEn: string;
  titleJa: string;
  subtitleEn?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link href="/themes" className="inline-block mb-6 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
        ← Pre-Entrance English
      </Link>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{titleEn}</h1>
        <p className="text-sm font-medium text-indigo-500 mt-0.5">{titleJa}</p>
        {subtitleEn && <p className="text-sm text-slate-500 mt-3 leading-relaxed">{subtitleEn}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/** Consistent bilingual field label — "English / 日本語" inline, matching
 *  the app's established bilingual convention (LevelBadge, nav labels). */
export function FieldLabel({ en, ja }: { en: string; ja: string }) {
  return (
    <span className="block text-sm font-semibold text-slate-700 mb-1.5">
      {en} <span className="text-slate-400 font-normal">/ {ja}</span>
    </span>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
    />
  );
}

export function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-3 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

/** Bilingual error banner — English primary, Japanese secondary, matching
 *  the app's established hierarchy (primary content first, Japanese
 *  supports comprehension rather than duplicating everything equally). */
export function ErrorBanner({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 mb-4">
      <p className="text-sm text-rose-800">{en}</p>
      <p className="text-xs text-rose-600 mt-0.5">{ja}</p>
    </div>
  );
}
