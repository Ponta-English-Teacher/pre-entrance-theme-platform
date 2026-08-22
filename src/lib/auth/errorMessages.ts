/**
 * Bilingual mapping for Supabase Auth errors — student-facing PESM auth
 * pages must never show Supabase's raw English error text. Keyed by the
 * stable `.code` Supabase's AuthError exposes (not the free-text
 * `.message`, which can change wording without notice).
 *
 * Kept intentionally small: only the codes this app's own signup/login/
 * reset flows can realistically trigger. Anything unmapped falls back to
 * a generic, still-bilingual message rather than leaking raw Supabase text.
 */

export interface BilingualMessage {
  en: string;
  ja: string;
}

const AUTH_ERROR_MESSAGES: Record<string, BilingualMessage> = {
  invalid_credentials: {
    en: 'Incorrect email or password.',
    ja: 'メールアドレスまたはパスワードが正しくありません。',
  },
  email_not_confirmed: {
    en: 'Please verify your email before logging in.',
    ja: 'ログインする前に、メールの確認を完了してください。',
  },
  user_already_exists: {
    en: 'This email is already registered. Try logging in instead.',
    ja: 'このメールアドレスはすでに登録されています。ログインをお試しください。',
  },
  weak_password: {
    en: 'Password is too short. Please use at least 6 characters.',
    ja: 'パスワードが短すぎます。6文字以上で入力してください。',
  },
  same_password: {
    en: 'Your new password must be different from your current one.',
    ja: '新しいパスワードは、現在のパスワードと異なるものにしてください。',
  },
  over_email_send_rate_limit: {
    en: 'Too many attempts. Please wait a few minutes and try again.',
    ja: '試行回数が多すぎます。数分待ってからもう一度お試しください。',
  },
  signup_disabled: {
    en: 'New sign-ups are currently unavailable. Please contact your teacher.',
    ja: '現在、新規登録はご利用いただけません。担当の先生にご連絡ください。',
  },
  validation_failed: {
    en: 'Please check the information you entered.',
    ja: '入力内容をご確認ください。',
  },
};

const FALLBACK: BilingualMessage = {
  en: "Something went wrong. Please check your connection and try again.",
  ja: '問題が発生しました。通信状態を確認して、もう一度お試しください。',
};

export function getAuthErrorMessage(error: unknown): BilingualMessage {
  const code = (error as { code?: string } | null | undefined)?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return FALLBACK;
}
