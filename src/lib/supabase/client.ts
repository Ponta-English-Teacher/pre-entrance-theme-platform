import { createBrowserClient } from '@supabase/ssr';

/**
 * PESM (Pre-Entrance Study Material) — Supabase browser client.
 *
 * The single, obvious entry point for talking to Supabase from client
 * components. No component should call `createBrowserClient` directly —
 * always import `createClient` from here, so there is exactly one place
 * that knows the env var names and client configuration.
 *
 * Only the URL and the publishable key are used here — both are meant to
 * ship in the browser bundle (hence NEXT_PUBLIC_*). Row Level Security on
 * every pesm.* table is what makes that safe, not secrecy of this key.
 * The secret key (SUPABASE_SECRET_KEY, if ever configured) must never be
 * referenced from this file or any other client-side code.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
