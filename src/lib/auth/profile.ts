import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Reads the current session's pesm.profiles row, if any. Works with either
 * the browser or server Supabase client (src/lib/supabase/*.ts) — both
 * expose the same query API.
 *
 * This is also the single place that decides "is this a PESM student" on a
 * shared Supabase project: a session can exist (the user authenticated
 * successfully via the shared auth.users table) without a pesm.profiles
 * row — that's exactly what happens for a user of the OTHER departmental
 * application, since only PESM's own signup (app: 'pesm' metadata, see
 * supabase/migrations/20260822121543_pesm_schema_and_profiles.sql) ever
 * creates one. `getPesmProfile` distinguishes three outcomes on purpose,
 * not just "found or not":
 *
 * - no session at all                       -> { status: 'no-session' }
 * - session exists, no pesm.profiles row     -> { status: 'not-pesm' }
 * - session exists, row exists               -> { status: 'ok', profile }
 * - the query itself failed (e.g. the `pesm` -> { status: 'unknown' }
 *   schema hasn't been added to Supabase's
 *   "Exposed schemas" setting yet)
 *
 * 'unknown' is kept separate from 'not-pesm' deliberately: a configuration
 * gap must never be treated as proof someone isn't a PESM student. Callers
 * that need to reject non-PESM sessions (e.g. login) should only reject on
 * 'not-pesm', never on 'unknown' — see src/app/login/page.tsx.
 */

export interface PesmProfile {
  id: string;
  full_name: string;
  high_school_name: string;
  role: 'student' | 'teacher';
}

export type PesmProfileResult =
  | { status: 'no-session' }
  | { status: 'not-pesm' }
  | { status: 'unknown' }
  | { status: 'ok'; profile: PesmProfile };

export async function getPesmProfile(supabase: SupabaseClient): Promise<PesmProfileResult> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { status: 'no-session' };

  const { data, error } = await supabase
    .schema('pesm')
    .from('profiles')
    .select('id, full_name, high_school_name, role')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (error) return { status: 'unknown' };
  if (!data) return { status: 'not-pesm' };
  return { status: 'ok', profile: data as PesmProfile };
}
