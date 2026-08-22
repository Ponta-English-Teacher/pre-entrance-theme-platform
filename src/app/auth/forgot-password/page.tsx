'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getAuthErrorMessage } from '@/lib/auth/errorMessages';
import AuthCard, { ErrorBanner, FieldLabel, SubmitButton, TextInput } from '@/components/auth/AuthCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ en: string; ja: string } | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError({ en: 'Please enter your email address.', ja: 'メールアドレスを入力してください。' });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setLoading(false);

    if (resetError) {
      setError(getAuthErrorMessage(resetError));
      return;
    }
    setSubmittedEmail(email.trim());
  }

  if (submittedEmail) {
    return (
      <AuthCard titleEn="Check your email" titleJa="メールを確認してください">
        <p className="text-base text-slate-800 leading-relaxed">
          We sent a password reset email to <span className="font-semibold">{submittedEmail}</span>. Open the
          email and click the link to set a new password.
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mt-3">
          パスワードリセット用のメールを {submittedEmail} に送信しました。メールを開き、リンクをクリックして新しいパスワードを設定してください。
        </p>
        <p className="mt-6 text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Back to Log In / ログインへ戻る
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      titleEn="Forgot Password"
      titleJa="パスワードを忘れた場合"
      subtitleEn="Enter your email address and we'll send you a link to reset your password."
    >
      {error && <ErrorBanner {...error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel en="Email Address" ja="メールアドレス" />
          <TextInput type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <SubmitButton disabled={loading}>{loading ? 'Sending...' : 'Send Reset Email / リセットメールを送信'}</SubmitButton>
      </form>
      <p className="mt-6 text-sm text-slate-500 text-center">
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Back to Log In / ログインへ戻る
        </Link>
      </p>
    </AuthCard>
  );
}
