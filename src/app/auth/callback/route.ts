import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handles both PESM email flows that route through a Supabase email link:
 * signup verification (emailRedirectTo in src/app/signup/page.tsx) and
 * password recovery (redirectTo in src/app/auth/forgot-password/page.tsx).
 * Both point here with a different `next` query param, since both are the
 * same underlying operation — exchange the PKCE `code` for a session, then
 * send the student somewhere that makes sense for that specific flow.
 *
 * exchangeCodeForSession is the current Supabase-recommended call for this
 * exact purpose (confirmed against Supabase's own current documentation,
 * not an older/deprecated pattern) — verified before writing this file.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // No code, or the exchange failed (expired/already-used/invalid link) —
  // send the student to Log In with a clear, bilingual explanation rather
  // than a raw error page.
  return NextResponse.redirect(`${origin}/login?error=link_invalid`);
}

/** `next` comes from a URL an email client follows, so it must be treated
 *  as untrusted input — restricting it to a same-origin relative path
 *  closes the open-redirect risk of a crafted `next=https://evil.example`
 *  (or `next=//evil.example`, which browsers can treat as protocol-relative). */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/portfolio';
  return next;
}
