-- PESM (Pre-Entrance Study Material) — Phase 1: schema + profiles only.
--
-- Scope of this migration, deliberately: the `pesm` schema itself, the
-- `pesm.profiles` table, automatic profile creation on signup, and RLS for
-- that one table. NO learning-data tables (progress, reading, vocabulary,
-- notebook, practice) are created here — those are a later migration, once
-- Phase 1 is reviewed. See docs/PESM_SUPABASE_ARCHITECTURE.md for the full
-- plan and the reasoning behind every decision below.
--
-- NOT APPLIED YET. This file is reviewed here, then run manually (or via
-- the Supabase CLI) only after explicit approval — see the project's own
-- instructions for this phase.
--
-- Supabase-managed schemas (auth, storage, realtime, extensions) are never
-- touched by this file. The one exception is standard and Supabase-
-- documented: a trigger is attached to auth.users (not altering its
-- structure) so a pesm.profiles row is created automatically on signup —
-- this is the official Supabase pattern for a "profiles" table, not a
-- deviation from it.


-- ── Schema ───────────────────────────────────────────────────────────────
-- A dedicated schema (rather than `public`) is the project's naming
-- convention: it makes every PESM-owned object unambiguous without needing
-- a redundant "pesm_" prefix on every table/function name, and makes a
-- future account transfer (see docs/PESM_SUPABASE_ARCHITECTURE.md) a clean,
-- schema-scoped operation. `if not exists` here is a harmless safeguard;
-- the objects below are intentionally NOT all written to be re-runnable —
-- a migration failing loudly on a second run is correct, expected
-- behavior, not a bug to engineer around.
create schema if not exists pesm;


-- ── pesm.profiles ────────────────────────────────────────────────────────
-- One row per authenticated user. Deliberately contains NO password or
-- credential column of any kind — Supabase Auth's own auth.users table
-- owns password storage/hashing, sessions, email verification, and
-- password reset entirely; this table only ever extends it with
-- application-specific fields.
create table pesm.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  full_name         text not null,
  high_school_name  text not null,
  -- 'student' is the only role normal signup can ever produce (see the
  -- trigger below, which hardcodes it) — 'teacher' is intentionally only
  -- ever reachable via a manual, explicit admin action outside this app's
  -- own signup flow, never a value a client can request or set itself.
  role              text not null default 'student' check (role in ('student', 'teacher')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table pesm.profiles is
  'PESM student/teacher profile — extends auth.users. No credentials here; Supabase Auth owns those.';


-- ── updated_at maintenance ───────────────────────────────────────────────
-- Ordinary trigger, no elevated privilege needed: it only ever touches the
-- row already being updated within the same statement the caller was
-- already authorized (by GRANT + RLS, below) to perform.
create function pesm.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on pesm.profiles
  for each row
  execute function pesm.set_updated_at();


-- ── Automatic profile creation on signup ────────────────────────────────
-- SECURITY DEFINER is required here: this function must be able to insert
-- into pesm.profiles on behalf of a brand-new auth.users row, before that
-- user has any privileges of their own (they don't have a session yet).
--
-- Two things make this safe rather than a privilege-escalation risk:
--   1. `set search_path = ''` plus fully-qualifying every reference
--      (`pesm.profiles`, not `profiles`) closes the classic SECURITY
--      DEFINER hijack: without a locked-down search_path, a caller could
--      create an object earlier in the resolution path to shadow an
--      unqualified name and have this function operate on it instead.
--   2. `role` is hardcoded to the literal 'student' — never read from
--      raw_user_meta_data or any other client-supplied value — so there is
--      no metadata field a signup request could set to grant itself the
--      teacher role. full_name/high_school_name ARE read from metadata
--      (populated by the signup form via supabase.auth.signUp's
--      `options.data`), since those are ordinary profile fields with no
--      privilege implications.
--
-- coalesce(...,'') guards against the NOT NULL constraint if metadata is
-- ever missing/malformed — defensive, not expected in normal use.
create function pesm.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into pesm.profiles (id, full_name, high_school_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'high_school_name', ''),
    'student'
  );
  return new;
end;
$$;

-- Attaches to auth.users without altering its structure — see the note at
-- the top of this file. This is the ONLY way a pesm.profiles row is ever
-- created; there is deliberately no INSERT grant/policy for `authenticated`
-- below, so a client can never create or backdate its own profile row.
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function pesm.handle_new_user();


-- ── Row Level Security ───────────────────────────────────────────────────
alter table pesm.profiles enable row level security;

-- A student may read only their own profile row. No policy exists for
-- reading anyone else's — including no teacher-read policy yet. Broad
-- teacher access is an explicit, additive policy for a later phase (the
-- Teacher Page), not part of Phase 1.
create policy students_select_own
  on pesm.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- A student may update their own row. The WITH CHECK mirrors USING
-- defensively (id is the primary key, so this can't actually retarget a
-- different row) — real protection against self-promotion is the column-
-- level GRANT below, since RLS itself is row-level, not column-level, and
-- can't by itself stop `UPDATE ... SET role = 'teacher' WHERE id = auth.uid()`.
create policy students_update_own
  on pesm.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Deliberately no INSERT policy and no DELETE policy for `authenticated` —
-- profile creation is trigger-only (see above), and there is no product
-- reason yet for a student to delete their own profile row.


-- ── Grants ───────────────────────────────────────────────────────────────
-- Required in addition to RLS: RLS filters which ROWS a query can touch,
-- but the role still needs a base GRANT to attempt the operation at all.
-- A custom schema is not auto-exposed to Supabase's API roles the way
-- `public` is — see docs/PESM_SUPABASE_ARCHITECTURE.md for the one manual
-- dashboard step (Settings → API → Exposed schemas) this also requires.
grant usage on schema pesm to authenticated, anon;

grant select on pesm.profiles to authenticated;

-- Column-level UPDATE grant: the actual mechanism preventing a student from
-- ever setting their own role to 'teacher', enforced by Postgres itself,
-- independent of RLS policy logic. full_name/high_school_name only —
-- notably NOT role, id, created_at, or updated_at.
grant update (full_name, high_school_name) on pesm.profiles to authenticated;

-- `anon` (an unauthenticated/guest request) gets schema USAGE only, no
-- table grant at all — a guest cannot read or write pesm.profiles under
-- any circumstance. Combined with RLS's `auth.uid() = id` (which is never
-- true for an anonymous request, since auth.uid() is null), this is
-- enforced twice over: no grant to attempt the query, and no policy would
-- match even if grants were ever misconfigured.
