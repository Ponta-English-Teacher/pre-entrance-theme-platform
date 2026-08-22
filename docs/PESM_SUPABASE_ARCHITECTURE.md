# PESM Supabase Architecture

Status: **Living document — the authoritative Supabase architecture/runbook for PESM.** Update this file whenever the schema, RLS, or Supabase project configuration changes; it should always describe the actual current state, not just the original plan.

PESM = **Pre-Entrance Study Material** — the project identity for this app's authentication and database work, established so the database, migration files, and documentation are obviously associated with this project rather than carrying generic, ambiguous names. This matters especially because the Supabase project currently lives under a personal account and is expected to move to the department's account later (§9).

**This is a shared, department-wide Supabase project**, confirmed live (§3) — not a project PESM owns alone. Every design decision below assumes that and is written to coexist safely with at least one other departmental application using the same project.

---

## 1. Current phase

**Phase 1 — plumbing only**, per the project's own phased plan:

- ✅ Supabase client/server infrastructure
- ✅ Session-refresh proxy
- ✅ `pesm` schema + `pesm.profiles` + RLS, shared-project-safe (migration file written, **not yet applied**)
- ✅ `.env.local` connected to the real, live, shared Supabase project — connectivity verified (§4)
- ❌ Learning-data tables (progress, reading, vocabulary, notebook, practice) — next phase
- ❌ Auth UI (signup/login/reset/verification pages) — next phase, call shape documented in §6
- ❌ Portfolio cloud sync — later phase
- ❌ Teacher Page — later phase

Guest/Demo mode (the entire app today, 100% localStorage) is unaffected by any of this and remains the only functioning way to use the app until the phases above are built and reviewed.

## 2. Shared Supabase project — coexistence design

**This project already serves at least one other departmental application through the same `auth.users` table.** Confirmed by a manual read-only audit run directly in the Supabase SQL Editor (catalog/`information_schema` queries only — no data read, no changes made): no existing trigger on `auth.users`, no existing `pesm` schema, no existing `profiles` object anywhere in the project at the time of the audit.

That audit also surfaced a real design flaw that was fixed *before* anything was applied: an `AFTER INSERT` trigger on `auth.users` fires for **every** new row in that table, project-wide — not just PESM's own signups. An earlier draft of the migration would have silently created a `pesm.profiles` row for a user of the *other* application the moment they signed up. That is not acceptable on a shared project, so the trigger design changed:

**PESM users are identified by an explicit `app` marker in Supabase Auth signup metadata, never by assuming every new user is PESM's.**

```
raw_user_meta_data ->> 'app' = 'pesm'
```

`pesm.handle_new_user()` (the trigger function, full detail in §7) checks this marker as its very first action. If it doesn't match, the function does nothing at all — no insert, no error, no side effect — and `auth.users`' own insert proceeds exactly as if the PESM trigger didn't exist. Only PESM's own signup call (§6) ever sets this marker; nothing else on the shared project has any reason to.

**This marker is a routing signal, not an authorization decision.** It answers "should this function do anything at all," never "what privilege should this row get." `role` is hardcoded to the literal `'student'` inside the function regardless of any metadata value — see §7 and the "never trust client metadata for authorization" principle repeated there. A client can influence *whether* a `pesm.profiles` row is created (by claiming to be a PESM signup) but never *what privilege* it receives.

**Multiple triggers on `auth.users` are safe to coexist mechanically** — Postgres fires every trigger matching an event (`AFTER INSERT`, here), and distinct trigger names never conflict with each other. The audit confirmed no trigger currently exists on `auth.users` in this project, so there is no name collision either, but the design doesn't depend on that staying true — a future trigger from the other application, under a different name, would simply run alongside PESM's without interference.

## 3. Why a dedicated `pesm` schema, not `public`

Postgres schemas are the actual namespace mechanism here — not table-name prefixes. Using `pesm.profiles` instead of `public.profiles` means:

- Every PESM-owned object is unambiguous at a glance, without a redundant `pesm_` prefix on every table (`pesm.profiles`, not `pesm.pesm_profiles`) — the schema already says that.
- A future account transfer (§9) can be scoped to `pg_dump --schema=pesm` cleanly, rather than picking specific tables out of a `public` schema shared with another application.
- On a shared project specifically, a dedicated schema is what makes "PESM never touches the other application's objects" trivially true by construction, not just by convention — PESM's migration never references anything outside `pesm.*` and `auth.users` (read-only, via the trigger).

**Supabase-managed schemas — `auth`, `storage`, `realtime`, `extensions` — are never renamed, restructured, or otherwise interfered with.** The one connection point is standard and Supabase-documented: a trigger is attached to `auth.users` (not altering its structure) so a `pesm.profiles` row is created automatically on signup, gated by the `app = 'pesm'` marker (§2). This is the official Supabase pattern for a profiles table, adapted for a shared project rather than a deviation from it.

Within `pesm`, table/function names stay clean and unprefixed (`pesm.profiles`, `pesm.handle_new_user()`) since the schema itself is the namespace.

## 4. Supabase Auth stays authoritative for credentials

`auth.users` (fully Supabase-managed, shared with the other application) owns password storage/hashing, sessions, email verification, and password reset entirely, for every application on this project — not just PESM. `pesm.profiles` extends it with PESM-specific application fields only — **it has no password column and never will.**

Verified live (read-only, via the Auth settings endpoint, which returns configuration metadata only — no user data): `mailer_autoconfirm: false` (email confirmation is already required project-wide) and email/password auth is enabled. **PESM has not changed and must never change these** — they are project-wide settings the other application also depends on. Any future change to Auth configuration (Site URL, Redirect URLs, email templates, SMTP) must be additive (e.g. appending a PESM redirect URL to the existing list) and reviewed explicitly, never a silent overwrite.

## 5. Guest vs. authenticated architecture

Two modes that don't need to share a runtime code path in Phase 1:

- **Guest/Demo** — no Supabase session. The app behaves exactly as it does today: 100% localStorage (`src/lib/store.ts`, `src/lib/portfolio.ts`), zero network calls to Supabase for learning data. Nothing in this phase changes that code path.
- **Authenticated** (future phases) — a real Supabase session exists; learning reads/writes go to Supabase instead.

**Enforcement is server-side, not UI-side.** Every RLS policy on every `pesm.*` table requires `auth.uid() = user_id` (or `= id` for `profiles`). An unauthenticated request has `auth.uid()` = `NULL`, which can never equal a real UUID — so a guest is *structurally* incapable of reading or writing any protected row, regardless of what the client sends. `src/proxy.ts` (§8) never redirects or gates routes based on auth state; it only refreshes a session cookie if one exists, and even that only when Supabase env vars are actually configured (see §8 — this was a real bug found and fixed during Phase 1 QA, not a hypothetical).

## 6. Future PESM signup call (Auth UI not built yet)

Documented now so the design is settled before the bilingual Sign Up page is built in a later phase. The eventual PESM signup form collects Email Address/メールアドレス, Full Name/氏名, High School Name/高校名, and Password/パスワード, and calls:

```ts
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      app: 'pesm',                    // routing marker — see §2; never an authorization signal
      full_name: fullName,
      high_school_name: highSchoolName,
    },
    emailRedirectTo: `${origin}/auth/callback`,
  },
});
```

`app: 'pesm'` is what makes `pesm.handle_new_user()` create a profile at all (§2, §7); `full_name`/`high_school_name` populate the two profile fields the trigger reads. After this call, the student sees an immediate bilingual "check your email" message — Supabase Auth sends the verification email itself (project-wide email settings, §4); the student cannot log in until they click the link. Login (`supabase.auth.signInWithPassword({ email, password })`) and "Forgot your password? / パスワードを忘れた場合" (`supabase.auth.resetPasswordForEmail`) follow the same shape, documented in full when the Auth UI phase is actually built. None of this is implemented yet — no `/signup`, `/login`, or related route exists in this repo.

## 7. Phase 1 database objects (`pesm.profiles`)

Defined in `supabase/migrations/20260822121543_pesm_schema_and_profiles.sql` — **written, reviewed, revised for the shared-project trigger design (§2), not yet applied to any live project.**

```sql
pesm.profiles
  id                uuid primary key references auth.users(id) on delete cascade
  full_name         text not null
  high_school_name  text not null
  role              text not null default 'student' check (role in ('student','teacher'))
  created_at        timestamptz not null default now()
  updated_at        timestamptz not null default now()
```

- No password/credential column (§4).
- `pesm.handle_new_user()` — a `SECURITY DEFINER` trigger function on `auth.users`. **First action: check `raw_user_meta_data ->> 'app' = 'pesm'`; if it doesn't match, `return new` immediately with no insert and no side effect** (§2 — this is what makes the trigger safe on a shared project). Only for an actual PESM signup does it create the matching profile row, reading `full_name`/`high_school_name` from signup metadata and **hardcoding `role = 'student'`** — never read from client-supplied metadata, so there is no field a signup request could set to grant itself a different role.
  - `set search_path = ''` plus fully-qualified references (`pesm.profiles`, never bare `profiles`) closes the standard `SECURITY DEFINER` search-path-hijack risk: without this, a caller could create an object earlier in the resolution path to shadow an unqualified name and have the function operate on the wrong table.
- `pesm.set_updated_at()` — ordinary (non-`SECURITY DEFINER`) trigger keeping `updated_at` current on every update.
- RLS enabled; a student may `SELECT`/`UPDATE` only their own row (`auth.uid() = id`).
- **Self-promotion prevention is a column-level `GRANT`**, not just RLS: `GRANT UPDATE (full_name, high_school_name) ON pesm.profiles TO authenticated` deliberately omits `role`, `id`, `created_at`, `updated_at`. RLS is row-level, not column-level, so this GRANT — enforced by Postgres itself — is the actual mechanism stopping `UPDATE ... SET role = 'teacher'`, not a side effect of the RLS policy.
- **No `INSERT` policy or grant for `authenticated`** — the trigger is the only path to a new row, and even the trigger only acts on a PESM-tagged signup, so a client can never fabricate or backdate its own profile.
- **No teacher-read policy yet.** Broad teacher access to student profiles is an explicit, additive policy for the future Teacher Page phase — schema-compatible with adding it later, but not built now.
- `anon` (guest/unauthenticated) receives schema `USAGE` only, no table grant at all — enforced twice over: no grant to attempt the query, and no RLS policy would match an anonymous request even if grants were ever misconfigured.
- **Nothing in this migration touches `public` or any other existing schema, table, function, trigger, or Auth setting** — verified both by static review and by the live read-only audit (§2, §3).

## 8. Client/proxy infrastructure

```
src/lib/supabase/client.ts   — browser client (createBrowserClient)
src/lib/supabase/server.ts   — server client (createServerClient, cookie-aware)
src/proxy.ts                 — session-refresh only, every request
```

One obvious place for each: no component should construct its own Supabase client.

**Why `proxy.ts`, not `middleware.ts`:** verified directly against the installed Next.js version (16.2.10) rather than assumed. `node_modules/next/dist/lib/constants.js` defines both `MIDDLEWARE_FILENAME` and `PROXY_FILENAME`; the middleware build template emits `The "middleware" file convention is deprecated. Please use "proxy" instead.` A file named `proxy.ts` must export a function literally named `proxy` (not `middleware`) — confirmed from the framework's own build template, which selects `mod.proxy` vs `mod.middleware` based on the file's name. Supabase's own current Next.js SSR guide already refers to this file as "a Proxy," consistent with this.

**What `src/proxy.ts` does — and deliberately doesn't:** refreshes the Supabase session cookie (via `supabase.auth.getClaims()`, the current recommended call — it validates the JWT locally rather than the older `getSession()`, which doesn't verify the signature) on every request matched by its `config.matcher`. It does **not** redirect, does **not** check auth state, does **not** gate any route. Route protection, if ever added, is a separate and explicit future decision — never something that arrives silently as a side effect of session refresh.

**Skips Supabase entirely when unconfigured** — found during Phase 1 QA, not theoretical: because this file runs on every request, running it before any Supabase project existed (env vars unset) made `createServerClient` throw synchronously, returning a 500 on every route, including plain Guest/Demo pages. Fixed by returning `NextResponse.next()` immediately when `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aren't set. Re-verified after real credentials were added (§1) that the actual Supabase-calling path also runs cleanly with zero errors.

## 9. Department account transfer

Two paths exist, with different transfer profiles — a decision for the project owner, not something this document prescribes:

- **Path A — Supabase's native "Transfer project"** (Project Settings → General): moves the same project into the department's org. Database, RLS, and most project settings move with it; URL/keys typically stay identical. On a shared project, this would move the *other* application too — a conversation to have with whoever owns that application, not a PESM-only decision.
- **Path B — a fresh project** created directly under the department's org, with the `pesm` schema replayed from the versioned migration files in `supabase/migrations/`. New URL, new keys, cleaner ownership provenance, more manual re-setup — and naturally isolates PESM from the other application if that's ever desired.

**Because every schema-affecting change lives in a version-controlled migration file (never an ad hoc dashboard edit), Path B is always straightforward** — the entire `pesm` schema, RLS, and triggers replay onto a brand-new project in minutes.

**Regardless of path, these do NOT travel automatically and must be explicitly re-verified or recreated:**

| Item | Notes |
|---|---|
| Auth redirect URL allow-list | Site URL + Redirect URLs in Auth settings — shared with the other application; PESM must only ever append, never replace, this list. Highest-risk item — if missed, verification/reset emails silently break for everyone. |
| "Confirm email" toggle | Project-level Auth setting, not data — shared, already on (§4). |
| Custom email templates | If the bilingual wording is ever moved into Supabase's own templates. |
| Custom SMTP config + credentials | If added later for deliverability — never assume these carry over silently. |
| **Exposed schemas setting** (`pesm`) | Dashboard config, not part of the SQL — see §10 below. Purely additive; does not affect the other application's exposed schemas. |
| API keys / project URL | Identical under Path A; **entirely different** under Path B — every environment (local `.env.local`, Vercel Production/Preview/Development) needs updating. |
| Vercel environment variables | Never move automatically with any Supabase-side change — must be manually updated (or re-verified unchanged) in Vercel's dashboard. |
| Vercel project/team ownership | A *separate* transfer from Supabase's, with its own mechanism, if the department also wants the Vercel project moved. |
| `OPENAI_API_KEY` | Currently presumably a personal key — same "personal → department" transfer concern, different service. |
| Supabase org billing/plan | New setup at the department org; nothing here transfers. |
| Local `.env.local` per developer | Manual, easy to forget. |
| CI secrets | Not present today; relevant only if CI is later added to deploy migrations. |

No Supabase project URL or key is ever hardcoded outside `.env.local`/Vercel env vars — `src/lib/supabase/*.ts` and `src/proxy.ts` only ever read `process.env.*`.

## 10. Future learning-data schema (planned, not implemented)

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

## 11. What is NOT stored (carried forward as a standing principle)

Consistent with how local storage already behaves today: full AI Talk transcripts, full AI feedback histories, unsaved generated suggestions, and temporary UI state are never persisted — only what a student explicitly saves, plus the current state needed for the product to function (e.g. a writing draft). This applies to every future table in §10, not just Phase 1.

## 12. Manual Supabase dashboard steps (not automatable from this repo)

These require the actual Supabase project, which is created and owned outside this codebase.

Already done:
1. ✅ **Supabase project created**, URL + publishable key added to `.env.local` — this is the existing, shared departmental project (§2).

Remaining, in order, when ready to move past Phase 1:

2. **Verify "Confirm email" is still on** under Settings → Authentication → Email — already confirmed true (§4); re-check only if Auth settings are ever touched by anyone for the other application.
3. **Settings → API → Exposed schemas**: add `pesm` alongside whatever is already exposed. Without this, PostgREST cannot see anything in the `pesm` schema at all, regardless of grants/RLS. Purely additive — does not remove or affect the other application's exposed schemas.
4. Only after step 3, and only with explicit approval: apply `supabase/migrations/20260822121543_pesm_schema_and_profiles.sql`.

Nothing in this repository can perform steps 2–4 — they require dashboard/SQL-Editor access to a project this codebase doesn't create or control.

## 13. Secrets discipline

- `.env.local` is gitignored (`.gitignore`'s `.env*` entry) and has never contained a real value in version control.
- `.env.local.example` contains placeholders only — verified empty on every value.
- `SUPABASE_SECRET_KEY` is documented but not wired into any code path in this phase; nothing in the app requires it to function. All live-project verification so far (Auth settings check, read-only SQL audit) was done with the publishable key and, for the SQL audit, the project owner's own SQL Editor access — never a service/secret key pasted into this tool.
- No Supabase project ref, URL, or key appears anywhere in `src/` outside the files in §8, both of which read exclusively from `process.env`.
