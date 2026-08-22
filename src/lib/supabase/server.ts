import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * PESM (Pre-Entrance Study Material) — Supabase server client.
 *
 * The single entry point for talking to Supabase from Server Components,
 * Route Handlers, and Server Actions. Every server-side call site should
 * `await createClient()` from here rather than constructing its own
 * `createServerClient` — one place owns the cookie-adapter wiring.
 *
 * `setAll` is wrapped in try/catch because Server Components are allowed to
 * *read* cookies but not to *write* them — only Route Handlers and Server
 * Actions can. Calling this from a Server Component still works for reads
 * (e.g. checking whether a session exists to decide what to render); the
 * write no-ops there because `src/proxy.ts` is already responsible for
 * refreshing and persisting the session cookie on every request, so a
 * missed write from a Server Component doesn't lose anything.
 *
 * Only the URL and the publishable key are used here — the same
 * browser-safe pair as src/lib/supabase/client.ts. This file never touches
 * SUPABASE_SECRET_KEY; ordinary authenticated access relies entirely on
 * Row Level Security, not an elevated key.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — safe to ignore; proxy.ts
            // already refreshes the session cookie on every request.
          }
        },
      },
    },
  );
}
