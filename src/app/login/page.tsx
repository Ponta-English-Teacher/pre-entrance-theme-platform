'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getPesmProfile } from '@/lib/auth/profile';
import { getAuthErrorMessage } from '@/lib/auth/errorMessages';
import AuthCard, { ErrorBanner, FieldLabel, SubmitButton, TextInput } from '@/components/auth/AuthCard';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ en: string; ja: string } | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const linkInvalid = searchParams.get('error') === 'link_invalid';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShowResend(false);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (signInError) {
      setLoading(false);
      setError(getAuthErrorMessage(signInError));
      if ((signInError as { code?: string }).code === 'email_not_confirmed') setShowResend(true);
      return;
    }

    // Shared Supabase project: a successful sign-in only proves this is a
    // valid account on THIS project's auth.users — not that it's a PESM
    // student. Only 'not-pesm' (a confirmed absence of a pesm.profiles row)
    // is grounds to reject; 'unknown' (e.g. the pesm schema not yet exposed
    // via the dashboard) must never be treated as "not a PESM account" — see
    // src/lib/auth/profile.ts for the full reasoning.
    const result = await getPesmProfile(supabase);
    setLoading(false);

    if (result.status === 'not-pesm') {
      await supabase.auth.signOut();
      setError({
        en: 'This account is not registered as a PESM student. Please sign up first.',
        ja: 'このアカウントはPESMの学生として登録されていません。先に新規登録を行ってください。',
      });
      return;
    }

    router.push('/portfolio');
    router.refresh();
  }

  async function handleResend() {
    if (!email.trim()) return;
    setResendState('sending');
    const supabase = createClient();
    await supabase.auth.resend({ type: 'signup', email: email.trim() });
    setResendState('sent');
  }

  return (
    <AuthCard titleEn="Log In" titleJa="ログイン">
      {linkInvalid && (
        <ErrorBanner
          en="This link has expired or is invalid. Please try again."
          ja="このリンクは期限切れか無効です。もう一度お試しください。"
        />
      )}
      {error && <ErrorBanner {...error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel en="Email Address" ja="メールアドレス" />
          <TextInput type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel en="Password" ja="パスワード" />
          <TextInput type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="text-right -mt-2">
          <Link href="/auth/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Forgot your password? / パスワードを忘れた場合
          </Link>
        </div>
        <SubmitButton disabled={loading}>{loading ? 'Logging in...' : 'Log In / ログイン'}</SubmitButton>
      </form>

      {showResend && (
        <button
          type="button"
          onClick={handleResend}
          disabled={resendState === 'sending'}
          className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-40"
        >
          {resendState === 'sent' ? '✓ Email resent / メールを再送しました' : 'Resend verification email / 確認メールを再送する'}
        </button>
      )}

      <p className="mt-6 text-sm text-slate-500 text-center">
        New here? / はじめての方は{' '}
        <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Sign Up / 新規登録
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
