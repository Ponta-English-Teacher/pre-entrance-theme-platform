import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * PESM (Pre-Entrance Study Material) — Supabase session refresh.
 *
 * Named `proxy.ts`, not `middleware.ts`: as of the Next.js version this repo
 * is pinned to (16.2.10), "middleware" is the deprecated file convention and
 * "proxy" is its replacement — confirmed directly from the installed
 * framework (node_modules/next/dist/lib/constants.js defines both
 * MIDDLEWARE_FILENAME and PROXY_FILENAME, and the middleware template emits
 * a `warnOnce` deprecation notice pointing at the proxy convention). A file
 * here must export a function named `proxy` (not `middleware`) for Next.js
 * to pick it up — see node_modules/next/dist/esm/build/templates/middleware.js,
 * which selects `mod.proxy` when the file is named proxy.ts.
 *
 * This file's ONLY job in Phase 1 is refreshing the Supabase auth session
 * cookie on every request, so a signed-in student's session stays valid as
 * they navigate. It deliberately does NOT redirect, gate, or inspect auth
 * state for any route — Guest/Demo mode must keep working exactly as today,
 * with no login wall anywhere. Route protection, if ever added, is a
 * separate, explicit decision for a later phase — never bundled silently
 * into this file.
 *
 * The env-var guard below is not defensive decoration: this file runs
 * unconditionally on every matched request, in dev and in production,
 * whether or not a Supabase project has been created yet. Confirmed by
 * running the app with no Supabase env vars set (the actual current state,
 * pre-project-creation): @supabase/ssr's createServerClient throws
 * synchronously — "Your project's URL and Key are required..." — which
 * took down every route, including plain Guest/Demo curriculum pages, with
 * a 500. Skipping Supabase entirely when unconfigured is what keeps Guest/
 * Demo mode working during the real gap between "this code exists" and "a
 * Supabase project has been created and its keys added to Vercel."
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Validates the JWT locally and refreshes it if needed — the current
  // Supabase-recommended call for this purpose (over the older getSession(),
  // which doesn't verify the token's signature here).
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    // Every route except static assets and image files — deliberately
    // broad. This only refreshes a cookie; it never blocks a request, so
    // running it everywhere (including curriculum/API routes) is safe for
    // Guest/Demo mode and has no user-visible effect until Phase 2 adds
    // real authenticated routes.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
