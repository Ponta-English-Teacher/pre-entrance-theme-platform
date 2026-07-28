# Reading Module — Developer Handoff

Status: functionally verified (routes, data flow, persistence, a11y markup) via code review and curl-based testing. Not yet visually verified in a real browser — that's the next step before calling it done.

## 1. What was implemented

A reusable Reading activity for **Knowing Myself → Foundation**, plugged into the existing theme/level/activity flow:

- One reading passage, "Who Am I?" (6 paragraphs, English + Japanese), for `knowing-myself` / `foundation`.
- A passage list view at `/themes/[slug]/[level]/reading` (reuses the existing `[type]` activity player route — no new dynamic segment needed).
- A paragraph-by-paragraph reader at `/reading?theme=&level=&passage=` with:
  - progress bar + numbered paragraph navigator
  - per-paragraph toggleable Japanese translation
  - "Finish Reading" action that marks the passage and the `reading` activity complete
- localStorage-backed progress tracking (per-passage last-read paragraph + completion), following the same pattern as vocabulary practice-set tracking.
- A new shared `ProgressBar` component (not yet adopted by vocab-shooter — see Tech Debt).

The Vocabulary module was **not modified** except for two touch points: the activity-type dispatch in `[type]/page.tsx`, and additive-only changes to `src/lib/store.ts`.

## 2. Architecture

```
src/data/reading/masterReadings.ts
  ReadingPassage { id, themeId, level, title, titleJapanese, estimatedMinutes, paragraphs }
  ReadingParagraph { id, english, japanese }
  getReadingById(id) / getReadingsByTheme(themeId, level)

src/lib/store.ts
  getReadingProgress(passageId) / saveReadingProgress(passageId, index) / markReadingComplete(passageId)
  → localStorage key "etp-reading-progress", Record<passageId, ReadingProgress>
  markActivityComplete(themeId, 'reading') — existing shared function, called on finish

src/components/activities/ReadingActivity.tsx   (server component)
  → looks up passages for themeId+level, "coming soon" empty state, or:
src/components/activities/ReadingPassageList.tsx (client component)
  → cards linking to /reading?theme=&level=&passage=, shows Done/In-progress badges

src/app/reading/page.tsx                         (server component, flat route)
  → resolves + validates query params, redirects to /themes on anything invalid
src/components/reading/ReadingPassageReader.tsx  (client component)
  → the actual reading UI: navigation, progress bar, translation toggle, finish action

src/components/ProgressBar.tsx                   (new shared UI component)
```

**Routing decision**: the reader is a flat top-level route (`/reading?...`) rather than a nested dynamic segment under `[slug]/[level]/[type]/`, deliberately mirroring the existing `/vocab-shooter?theme=&level=&set=` convention. This avoids a static/dynamic route collision with the existing `[type]` catch-all and keeps the pattern consistent with the one other "deep" activity route already in the codebase.

**Data model decision**: unlike vocabulary (which has a separate `themeVocabSets.ts` mapping ids to levels, because vocab words are cumulative across levels — standard = foundation + standard, etc.), reading passages are **not cumulative**. Each passage belongs to exactly one theme+level pair, so `getReadingsByTheme(themeId, level)` filters directly on the passage object with no separate set-mapping file. If a future requirement needs passages reused/cumulative across levels, that's the point to introduce a `themeReadingSets.ts` analogous to vocab's.

## 3. How to add reading passages for future themes/levels

1. Open `src/data/reading/masterReadings.ts`.
2. Append a new `ReadingPassage` object to `MASTER_READINGS`, following the `km-f-reading-01` example:
   - `id`: `<theme-prefix>-<level-prefix>-reading-<NN>` (e.g. `lt-f-reading-01` for living-together/foundation), matching the `km-f-01` word-id convention used in vocab.
   - `themeId` must match a `Theme.id` in `src/data/themes/index.ts`.
   - `level` must be `'foundation' | 'standard' | 'challenge'`.
   - Each `paragraphs[].id` should be `<passageId>-p<N>`.
3. Nothing else needs to change — `getReadingsByTheme` picks it up automatically, `ReadingActivity` will render it instead of the "coming soon" state, and the existing route wiring works unmodified. This is what "reusable for every future theme" means in practice for this module.
4. Multiple passages per theme/level are already supported (the list view renders N cards) — there's no assumption of exactly one passage.

## 4. Where to connect TTS later

Every paragraph is rendered inside an element with a stable, addressable id:

```tsx
<div id={current.id} data-paragraph-index={index} ...>
  <p>{current.english}</p>
```
(`src/components/reading/ReadingPassageReader.tsx:97-102`)

`current.id` is the paragraph's own id (e.g. `km-f-reading-01-p1`), not the passage id — so a TTS controller can target the exact paragraph currently on screen. Suggested integration:

- Add a "Listen" button next to the translation toggle button (same location, `ReadingPassageReader.tsx` around line 113), that reads `current.english` aloud (Web Speech API `speechSynthesis`, or a hosted TTS call) for the paragraph identified by `current.id`.
- The paragraph navigator (`i === index` state) already tracks "current paragraph" — reuse that state to drive playback/highlighting instead of introducing a second source of truth.
- No TTS-specific data exists yet (no audio URLs, no phoneme/word-timing data) — `ReadingParagraph` currently has only `english`/`japanese`/`id`. If word-level highlighting during playback is wanted later, that's a schema addition to `ReadingParagraph`, not a rewrite.

## 5. Technical debt / recommended follow-ups

- **Progress-bar duplication remains in vocab-shooter.** `FlashCards.tsx`, `GameArena.tsx`, `FillBlank.tsx` each still hand-roll the same progress-bar markup that `src/components/ProgressBar.tsx` now replaces in Reading. Per explicit direction not to touch the "complete" Vocabulary module, these were left as-is. Worth a small follow-up PR later to retrofit them, purely as a cleanup — not urgent.
- **No comprehension check.** The module is pure reading (display + navigate + translate), no quiz/question step. Fine for now since Writing/Speaking/Ask AI are separate future modules — but worth confirming with product whether "Reading" should ever gate completion on a comprehension question, since currently "Finish Reading" only requires reaching the last paragraph, not demonstrating understanding.
- **No Portfolio surface for Reading yet.** `src/app/portfolio/page.tsx` shows a Vocabulary Glossary and placeholder cards for Writing/Speaking, but nothing for Reading (completed passages aren't listed there). `ReadingProgress` already stores `completedAt`, so a "Reading Log" card following the exact same pattern as the Vocabulary Glossary card would be a small, self-contained addition when Portfolio work resumes.
- **Single-passage content only.** Only one passage exists (`km-f-reading-01`). The list view and multi-passage plumbing work, but that's untested with >1 card in practice — worth a quick check with a second dummy passage before shipping the next theme.
- **Not yet visually verified.** All verification so far is functional (routes, SSR HTML, ARIA attributes via curl/grep). Layout, responsive behavior at narrow widths, and the click-through UX still need a real browser pass.

## 6. Key entry points for future development

| Concern | File |
|---|---|
| Add/edit passage content | `src/data/reading/masterReadings.ts` |
| Progress/completion persistence | `src/lib/store.ts` (Reading section, ~line 112 onward) |
| Passage list / empty state | `src/components/activities/ReadingActivity.tsx`, `ReadingPassageList.tsx` |
| Reader UI (navigation, translation, TTS hook point) | `src/components/reading/ReadingPassageReader.tsx` |
| Reader route / param validation | `src/app/reading/page.tsx` |
| Activity-type dispatch (wiring reading into the theme/level flow) | `src/app/themes/[slug]/[level]/[type]/page.tsx` |
| Shared progress bar (reusable across future modules) | `src/components/ProgressBar.tsx` |
