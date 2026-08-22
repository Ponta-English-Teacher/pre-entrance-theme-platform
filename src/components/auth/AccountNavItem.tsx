'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getPesmProfile } from '@/lib/auth/profile';

type DisplayState = 'loading' | 'guest' | { name: string };

/** Compact "Log In / Sign Up" vs "{name} · Log Out" nav item — the only
 *  account UI Phase 2 adds to the shared header. Guest/Demo mode is never
 *  gated: this only ever changes what this one nav item shows, never what
 *  routes are reachable. A session existing is not by itself enough to
 *  show a name/Log Out state — only a session backed by an actual
 *  pesm.profiles row counts (see src/lib/auth/profile.ts), so a user of
 *  the OTHER application on this shared Supabase project is correctly
 *  shown the guest state here, never mistaken for a PESM student. */
export default function AccountNavItem() {
  const [state, setState] = useState<DisplayState>('loading');

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function refresh() {
      const result = await getPesmProfile(supabase);
      if (!active) return;
      setState(result.status === 'ok' ? { name: result.profile.full_name } : 'guest');
    }

    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => refresh());
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  // Avoid a flash of the wrong state while the (fast, local-first) check
  // resolves — nothing rather than a guess.
  if (state === 'loading') return <span className="w-16 sm:w-24 shrink-0" aria-hidden="true" />;

  if (state === 'guest') {
    return (
      <Link
        href="/login"
        className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      >
        <span className="hidden sm:inline">Log In / Sign Up</span>
        <span className="sm:hidden">ログイン</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="hidden sm:inline text-sm text-slate-500 truncate max-w-[8rem]" title={state.name}>
        {state.name}
      </span>
      <button
        type="button"
        onClick={handleLogOut}
        className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      >
        <span className="hidden sm:inline">Log Out</span>
        <span className="sm:hidden">ログアウト</span>
      </button>
    </div>
  );
}
