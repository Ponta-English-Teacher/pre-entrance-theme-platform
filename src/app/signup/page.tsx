'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getAuthErrorMessage } from '@/lib/auth/errorMessages';
import AuthCard, { ErrorBanner, FieldLabel, SubmitButton, TextInput } from '@/components/auth/AuthCard';

const MIN_PASSWORD_LENGTH = 6;

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [highSchoolName, setHighSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ en: string; ja: string } | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side checks first — friendlier and faster than waiting on
    // Supabase for mistakes we can already see. Supabase's own validation
    // is still the real authority (see getAuthErrorMessage below).
    if (!email.trim() || !fullName.trim() || !highSchoolName.trim()) {
      setError({ en: 'Please fill in every field.', ja: 'すべての項目を入力してください。' });
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError({ en: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, ja: `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。` });
      return;
    }
    if (password !== confirmPassword) {
      setError({ en: 'Passwords do not match.', ja: 'パスワードが一致しません。' });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // 'app: pesm' is what identifies this signup as PESM's own on the
        // shared Supabase project — see supabase/migrations/... and
        // docs/PESM_SUPABASE_ARCHITECTURE.md §2. Routing only, never an
        // authorization signal: the database trigger hardcodes role='student'
        // regardless of anything sent here.
        data: {
          app: 'pesm',
          full_name: fullName.trim(),
          high_school_name: highSchoolName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/portfolio`,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError));
      return;
    }
    setSubmittedEmail(email.trim());
  }

  async function handleResend() {
    if (!submittedEmail) return;
    setResendState('sending');
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: submittedEmail });
    setResendState('sent');
    if (resendError) setError(getAuthErrorMessage(resendError));
  }

  if (submittedEmail) {
    return (
      <AuthCard titleEn="Check your email" titleJa="メールを確認してください">
        <p className="text-base text-slate-800 leading-relaxed">
          We sent a verification email to <span className="font-semibold">{submittedEmail}</span>. Open the email
          and click the verification link. Once verified, you can log in with your email address and password.
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mt-3">
          {submittedEmail} に確認メールを送信しました。メールを開き、確認リンクをクリックしてください。確認が完了すると、メールアドレスとパスワードでログインできます。
        </p>

        {error && <div className="mt-4"><ErrorBanner {...error} /></div>}

        <button
          type="button"
          onClick={handleResend}
          disabled={resendState === 'sending'}
          className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-40"
        >
          {resendState === 'sent' ? '✓ Email resent / メールを再送しました' : 'Resend verification email / 確認メールを再送する'}
        </button>

        <p className="mt-6 text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Go to Log In / ログインへ
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard titleEn="Sign Up" titleJa="新規登録">
      {error && <ErrorBanner {...error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel en="Email Address" ja="メールアドレス" />
          <TextInput type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel en="Full Name" ja="氏名" />
          <TextInput type="text" required autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <FieldLabel en="High School Name" ja="高校名" />
          <TextInput type="text" required value={highSchoolName} onChange={e => setHighSchoolName(e.target.value)} />
        </div>
        <div>
          <FieldLabel en="Password" ja="パスワード" />
          <TextInput type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <FieldLabel en="Confirm Password" ja="パスワード（確認）" />
          <TextInput type="password" required autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        <SubmitButton disabled={loading}>{loading ? 'Creating account...' : 'Create Account / アカウントを作成'}</SubmitButton>
      </form>
      <p className="mt-6 text-sm text-slate-500 text-center">
        Already have an account? / すでにアカウントをお持ちの方は{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Log In / ログイン
        </Link>
      </p>
    </AuthCard>
  );
}
