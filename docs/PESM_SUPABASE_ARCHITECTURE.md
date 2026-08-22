# PESM Supabase Architecture

Status: **Living document — the authoritative Supabase architecture/runbook for PESM.** Update this file whenever the schema, RLS, or Supabase project configuration changes; it should always describe the actual current state, not just the original plan.

PESM = **Pre-Entrance Study Material** — the project identity for this app's authentication and database work, established so the database, migration files, and documentation are obviously associated with this project rather than carrying generic, ambiguous names. This matters especially because the Supabase project currently lives under a personal account and is expected to move to the department's account later (§8).

---

## 1. Current phase

**Phase 1 — plumbing only**, per the project's own phased plan:

- ✅ Supabase client/server infrastructure
- ✅ Session-refresh proxy
- ✅ `pesm` schema + `pesm.profiles` + RLS (migration file written, **not yet applied**)
- ❌ Learning-data tables (progress, reading, vocabulary, notebook, practice) — next phase
- ❌ Auth UI (signup/login/reset/verification pages) — next phase
- ❌ Portfolio cloud sync — later phase
- ❌ Teacher Page — later phase

Guest/Demo mode (the entire app today, 100% localStorage) is unaffected by any of this and remains the only functioning way to use the app until the phases above are built and reviewed.

## 2. Why a dedicated `pesm` schema, not `public`

Postgres schemas are the actual namespace mechanism here — not table-name prefixes. Using `pesm.profiles` instead of `public.profiles` means:

- Every PESM-owned object is unambiguous at a glance, without a redundant `pesm_` prefix on every table (`pesm.profiles`, not `pesm.pesm_profiles`) — the schema already says that.
- A future account transfer (§8) can be scoped to `pg_dump --schema=pesm` cleanly, rather than picking specific tables out of a `public` schema that might one day hold unrelated objects, especially since this Supabase project currently lives under a personal account that could plausibly host other things.

**Supabase-managed schemas — `auth`, `storage`, `realtime`, `extensions` — are never renamed, restructured, or otherwise interfered with.** The one connection point is standard and Supabase-documented: a trigger is attached to `auth.users` (not altering its structure) so a `pesm.profiles` row is created automatically on signup. This is the official Supabase pattern for a profiles table, not a deviation from it.

Within `pesm`, table/function names stay clean and unprefixed (`pesm.profiles`, `pesm.handle_new_user()`) since the schema itself is the namespace.

## 3. Supabase Auth stays authoritative for credentials

`auth.users` (fully Supabase-managed) owns password storage/hashing, sessions, email verification, and password reset entirely. `pesm.profiles` extends it with application fields only — **it has no password column and never will.**

## 4. Guest vs. authenticated architecture

Two modes that don't need to share a runtime code path in Phase 1:

- **Guest/Demo** — no Supabase session. The app behaves exactly as it does today: 100% localStorage (`src/lib/store.ts`, `src/lib/portfolio.ts`), zero network calls to Supabase for learning data. Nothing in this phase changes that code path.
- **Authenticated** (future phases) — a real Supabase session exists; learning reads/writes go to Supabase instead.

**Enforcement is server-side, not UI-side.** Every RLS policy on every `pesm.*` table requires `auth.uid() = user_id` (or `= id` for `profiles`). An unauthenticated request has `auth.uid()` = `NULL`, which can never equal a real UUID — so a guest is *structurally* incapable of reading or writing any protected row, regardless of what the client sends. `src/proxy.ts` (§6) never redirects or gates routes based on auth state; it only refreshes a session cookie if one exists.

## 5. Environment variables

**Public/browser-safe** (ship in the client bundle — safe because RLS protects the data, not key secrecy):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Supabase's current key format is the **publishable key** (`sb_publishable_...`), which replaces the older "anon key" naming — confirmed against Supabase's own current Next.js SSR documentation at the time this was written. Legacy anon/service_role keys still work but are being phased out; this project uses the current names from the start rather than the legacy pattern.

**Server-only** (never `NEXT_PUBLIC_*`, never referenced from client code):

```
SUPABASE_SECRET_KEY
```

This is the modern replacement for the old `service_role` key. **Not required for Phase 1, and not required for ordinary student authentication or any normal RLS-protected access at any phase** — RLS alone covers that. It's only needed for a future privileged admin operation that must bypass RLS (e.g., a script granting the `teacher` role — see §9's "role assignment is an explicit admin action"). Left blank until that specific need exists.

All three are documented with placeholders only in `.env.local.example`; real values live only in `.env.local` (already gitignored) and Vercel's environment variable settings. **No real key is ever committed.**

## 6. Client/proxy infrastructure

```
src/lib/supabase/client.ts   — browser client (createBrowserClient)
src/lib/supabase/server.ts   — server client (createServerClient, cookie-aware)
src/proxy.ts                 — session-refresh only, every request
```

One obvious place for each: no component should construct its own Supabase client.

**Why `proxy.ts`, not `middleware.ts`:** verified directly against the installed Next.js version (16.2.10) rather than assumed. `node_modules/next/dist/lib/constants.js` defines both `MIDDLEWARE_FILENAME` and `PROXY_FILENAME`; the middleware build template emits `The "middleware" file convention is deprecated. Please use "proxy" instead.` A file named `proxy.ts` must export a function literally named `proxy` (not `middleware`) — confirmed from the framework's own build template, which selects `mod.proxy` vs `mod.middleware` based on the file's name. Supabase's own current Next.js SSR guide already refers to this file as "a Proxy," consistent with this.

**What `src/proxy.ts` does — and deliberately doesn't:** refreshes the Supabase session cookie (via `supabase.auth.getClaims()`, the current recommended call — it validates the JWT locally rather than the older `getSession()`, which doesn't verify the signature) on every request matched by its `config.matcher`. It does **not** redirect, does **not** check auth state, does **not** gate any route. Route protection, if ever added, is a separate and explicit future decision — never something that arrives silently as a side effect of session refresh.

## 7. Phase 1 database objects (`pesm.profiles`)

Defined in `supabase/migrations/20260822121543_pesm_schema_and_profiles.sql` — **written, reviewed, not yet applied to any live project.**

```sql
pesm.profiles
  id                uuid primary key references auth.users(id) on delete cascade
  full_name         text not null
  high_school_name  text not null
  role              text not null default 'student' check (role in ('student','teacher'))
  created_at        timestamptz not null default now()
  updated_at        timestamptz not null default now()
```

- No password/credential column (§3).
- `pesm.handle_new_user()` — a `SECURITY DEFINER` trigger function on `auth.users` that creates the matching profile row, reading `full_name`/`high_school_name` from signup metadata and **hardcoding `role = 'student'`** — never read from client-supplied metadata, so there is no field a signup request could set to grant itself a different role.
  - `set search_path = ''` plus fully-qualified references (`pesm.profiles`, never bare `profiles`) closes the standard `SECURITY DEFINER` search-path-hijack risk: without this, a caller could create an object earlier in the resolution path to shadow an unqualified name and have the function operate on the wrong table.
- `pesm.set_updated_at()` — ordinary (non-`SECURITY DEFINER`) trigger keeping `updated_at` current on every update.
- RLS enabled; a student may `SELECT`/`UPDATE` only their own row (`auth.uid() = id`).
- **Self-promotion prevention is a column-level `GRANT`**, not just RLS: `GRANT UPDATE (full_name, high_school_name) ON pesm.profiles TO authenticated` deliberately omits `role`, `id`, `created_at`, `updated_at`. RLS is row-level, not column-level, so this GRANT — enforced by Postgres itself — is the actual mechanism stopping `UPDATE ... SET role = 'teacher'`, not a side effect of the RLS policy.
- **No `INSERT` policy or grant for `authenticated`** — the trigger is the only path to a new row, so a client can never fabricate or backdate its own profile.
- **No teacher-read policy yet.** Broad teacher access to student profiles is an explicit, additive policy for the future Teacher Page phase — schema-compatible with adding it later, but not built now.
- `anon` (guest/unauthenticated) receives schema `USAGE` only, no table grant at all — enforced twice over: no grant to attempt the query, and no RLS policy would match an anonymous request even if grants were ever misconfigured.

## 8. Department account transfer

Two paths exist, with different transfer profiles — a decision for the project owner, not something this document prescribes:

- **Path A — Supabase's native "Transfer project"** (Project Settings → General): moves the same project into the department's org. Database, RLS, and most project settings move with it; URL/keys typically stay identical.
- **Path B — a fresh project** created directly under the department's org, with the `pesm` schema replayed from the versioned migration files in `supabase/migrations/`. New URL, new keys, cleaner ownership provenance, more manual re-setup.

**Because every schema-affecting change lives in a version-controlled migration file (never an ad hoc dashboard edit), Path B is always straightforward** — the entire `pesm` schema, RLS, and triggers replay onto a brand-new project in minutes.

**Regardless of path, these do NOT travel automatically and must be explicitly re-verified or recreated:**

| Item | Notes |
|---|---|
| Auth redirect URL allow-list | Site URL + Redirect URLs in Auth settings. Highest-risk item — if missed, verification/reset emails silently break. |
| "Confirm email" toggle | Project-level Auth setting, not data. |
| Custom email templates | If the bilingual wording is ever moved into Supabase's own templates. |
| Custom SMTP config + credentials | If added later for deliverability — never assume these carry over silently. |
| **Exposed schemas setting** (`pesm`) | Dashboard config, not part of the SQL — see §11 below. |
| API keys / project URL | Identical under Path A; **entirely different** under Path B — every environment (local `.env.local`, Vercel Production/Preview/Development) needs updating. |
| Vercel environment variables | Never move automatically with any Supabase-side change — must be manually updated (or re-verified unchanged) in Vercel's dashboard. |
| Vercel project/team ownership | A *separate* transfer from Supabase's, with its own mechanism, if the department also wants the Vercel project moved. |
| `OPENAI_API_KEY` | Currently presumably a personal key — same "personal → department" transfer concern, different service. |
| Supabase org billing/plan | New setup at the department org; nothing here transfers. |
| Local `.env.local` per developer | Manual, easy to forget. |
| CI secrets | Not present today; relevant only if CI is later added to deploy migrations. |

No Supabase project URL or key is ever hardcoded outside `.env.local`/Vercel env vars — `src/lib/supabase/*.ts` and `src/proxy.ts` only ever read `process.env.*`.

## 9. Future learning-data schema (planned, not implemented)

Names only, for continuity with the next phase — none of these exist yet:

```
pesm.level_progress            -- user + theme + level is the identity; Foundation/Advanced never merge
pesm.reading_progress
pesm.vocabulary_saves
pesm.vocabulary_review_status
pesm.notebook_items
pesm.practice_completion
```

The governing invariant carried over from the local-storage progress model (`src/lib/store.ts`): **`user + theme + level` uniquely identifies a progress track — never `user + theme` alone.** Any future migration must enforce this the same way the local model does (`unique (user_id, theme_id, level)`), not silently merge Foundation and Advanced.

Role assignment (`student` → `teacher`) remains an explicit admin action outside the app's own signup flow at every future phase — never a client-settable value, and never automated as part of any of the tables above.

## 10. What is NOT stored (carried forward as a standing principle)

Consistent with how local storage already behaves today: full AI Talk transcripts, full AI feedback histories, unsaved generated suggestions, and temporary UI state are never persisted — only what a student explicitly saves, plus the current state needed for the product to function (e.g. a writing draft). This applies to every future table in §9, not just Phase 1.

## 11. Manual Supabase dashboard steps (not automatable from this repo)

These require the actual Supabase project, which is created and owned outside this codebase. Perform exactly one at a time, in this order, when ready to move past Phase 1:

1. **Create the Supabase project** (personal account, for now) and copy its URL + publishable key into `.env.local` (never into this repo).
2. **Settings → Authentication → Email**: enable "Confirm email" (required — Phase 2's signup flow depends on this being on).
3. **Settings → API → Exposed schemas**: add `pesm` alongside `public`. Without this, PostgREST cannot see anything in the `pesm` schema at all, regardless of grants/RLS.
4. Only after 1–3, and only with explicit approval: apply `supabase/migrations/20260822121543_pesm_schema_and_profiles.sql`.

Nothing in this repository can perform any of these four steps — they require dashboard access to a project this codebase doesn't create or control.

## 12. Secrets discipline

- `.env.local` is gitignored (`.gitignore`'s `.env*` entry) and has never contained a real value in version control.
- `.env.local.example` contains placeholders only — verified empty on every value.
- `SUPABASE_SECRET_KEY` is documented but not wired into any code path in this phase; nothing in the app requires it to function.
- No Supabase project ref, URL, or key appears anywhere in `src/` outside the two files in §6, both of which read exclusively from `process.env`.
