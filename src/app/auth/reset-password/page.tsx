'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getAuthErrorMessage } from '@/lib/auth/errorMessages';
import AuthCard, { ErrorBanner, FieldLabel, SubmitButton, TextInput } from '@/components/auth/AuthCard';

const MIN_PASSWORD_LENGTH = 6;

type SessionCheck = 'checking' | 'valid' | 'invalid';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [sessionCheck, setSessionCheck] = useState<SessionCheck>('checking');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ en: string; ja: string } | null>(null);
  const [done, setDone] = useState(false);

  // Reaching this page only makes sense after /auth/callback has already
  // exchanged a valid recovery link for a session. Someone arriving here
  // directly (bookmarked link, expired link that failed the exchange and
  // was already redirected to /login, etc.) has no session — show a clear
  // bilingual explanation instead of a form that would just fail.
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setSessionCheck(data.user ? 'valid' : 'invalid');
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(getAuthErrorMessage(updateError));
      return;
    }
    setDone(true);
  }

  if (sessionCheck === 'checking') return null;

  if (sessionCheck === 'invalid') {
    return (
      <AuthCard titleEn="Link Expired" titleJa="リンクの期限切れ">
        <p className="text-base text-slate-800 leading-relaxed">
          This password reset link has expired or is invalid. Please request a new one.
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mt-3">
          このリンクは期限切れか無効です。もう一度パスワードのリセットをお試しください。
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Request a new link / 新しいリンクをリクエスト
        </Link>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard titleEn="Password Updated" titleJa="パスワードを更新しました">
        <p className="text-base text-slate-800 leading-relaxed">Your password has been updated successfully.</p>
        <p className="text-sm text-slate-500 leading-relaxed mt-3">パスワードが正常に更新されました。</p>
        <button
          type="button"
          onClick={() => router.push('/portfolio')}
          className="w-full mt-6 py-3 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
        >
          Continue to PESM / PESMへ進む
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard titleEn="Reset Password" titleJa="パスワードの再設定">
      {error && <ErrorBanner {...error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel en="New Password" ja="新しいパスワード" />
          <TextInput type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <FieldLabel en="Confirm New Password" ja="新しいパスワード（確認）" />
          <TextInput type="password" required autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>
        <SubmitButton disabled={loading}>{loading ? 'Updating...' : 'Update Password / パスワードを更新'}</SubmitButton>
      </form>
    </AuthCard>
  );
}
