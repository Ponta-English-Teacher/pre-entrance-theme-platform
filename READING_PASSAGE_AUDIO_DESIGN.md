# Reading Passage Audio — Design

Status: design only, no code yet. A prerequisite milestone, separate from and completed before AI Partner Milestone 1.

## Why this is a separate design from AI Partner speech

Reading passage text is **fixed** — authored once, reviewed, committed. AI Partner replies are **generated live**, different every session. These are different problems with different correct architectures: "generate once, reuse forever" for Reading vs. "generate on demand, don't persist" for AI Partner. Treating them as one problem would produce a design that's wrong for at least one of them.

---

## 1. Current browser-TTS implementation (as found)

Exactly two places in the codebase call the Web Speech API today:

- **`src/components/activities/VocabDictionaryModal.tsx`** (lines 15–21, 75–82) — a local `speak(word)` function, triggered by a small 🔊 button next to a vocabulary word in the dictionary modal. **Out of scope for this change** — stays exactly as-is (§C below).
- **`src/lib/aiAssistant.ts`** (the `readAloud` case, line ~119) + **`src/components/reading/ContextualHelpButton.tsx`** (lines 32–36) — the Reading paragraph's "read it aloud" contextual-help option. `aiAssistant.ts` returns `{ text: ..., speak: p.english }`; the button component checks for a `speak` field on any AI-help response and fires `window.speechSynthesis.speak(...)` if present. **This is the mechanism being replaced (with a fallback) for the Reading passage.**

The `speak?: string` field on `AIHelpResponse` is a generic mechanism (any contextual-help response can carry it) — it isn't Reading-specific by design, which is exactly what makes a clean fallback possible: nothing about this shared type needs to change.

---

## 2. Reading lesson data model change

Add one optional field to `ReadingParagraph` in `src/data/reading/masterReadings.ts`:

```ts
export interface ReadingParagraph {
  id: string;
  english: string;
  japanese: string;
  plainEnglish: string;
  checkQuestion: string;
  /** Path to a pre-generated audio file for this paragraph, e.g. "/audio/reading/km-f-reading-01-p1.mp3".
   *  Absent (undefined) means no generated audio exists yet — the UI falls back to browser TTS. */
  audioUrl?: string;
}
```

Deliberately an **explicit, optional, authored field** — not a filename convention the component guesses at runtime. Presence/absence of `audioUrl` is the single, unambiguous signal for "generated audio exists" vs. "fall back," decided at content-authoring time, not inferred by checking whether a file happens to exist.

---

## 3–4. Where files are stored

**`public/audio/reading/{paragraphId}.mp3`** — e.g. `public/audio/reading/km-f-reading-01-p1.mp3`.

Next.js serves everything under `public/` at the matching root URL path with zero configuration — `public/audio/reading/km-f-reading-01-p1.mp3` is reachable at `/audio/reading/km-f-reading-01-p1.mp3` from any `<audio>` tag, no server code, no new route. For the current scale (one theme, one lesson, three paragraphs today, growing slowly as more lessons are authored) this is the right amount of infrastructure — a cloud storage bucket would solve a scaling problem this project doesn't have yet.

---

## 5. Play / Pause / Resume / Restart

A native HTML `<audio>` element (hidden, no default browser chrome) driven by a small custom control matching the textbook visual language — not the browser's default `<audio controls>` widget, which would look like a generic media player.

- **Play/Pause**: one toggle button. `<audio>` naturally preserves playback position on pause, so "Resume" is just pressing the same button again — no separate control needed.
- **Restart**: a second, small icon that sets `audio.currentTime = 0` and plays from the beginning — genuinely useful for a learner re-listening to a paragraph.

**Decided**: the control sits *inside* the existing per-paragraph contextual-help popover — selecting "読み上げを聞く" reveals Play/Pause and Restart there, rather than a new always-visible margin icon. No new layout element on an already-approved page.

---

## 6–7. Fallback and failure handling

Two distinct cases, both falling back to the *existing, already-working* browser-TTS path — no new fallback mechanism needs to be built, only wired to trigger under two conditions instead of one:

- **No generated audio for this paragraph** (`audioUrl` is `undefined`): render the current contextual-help "read it aloud" behavior exactly as it works today. Nothing changes in that code path.
- **Generated audio fails at runtime** (file 404s, network hiccup, playback error): the `<audio>` element's `onError` handler triggers the same browser-TTS call as the "no audio" case. No error dialog, no broken button — it just quietly becomes the same experience a paragraph without generated audio already has today.

---

## 8. How audio should be generated

A **one-off developer script**, not an in-app tool and not a runtime API call.

- `scripts/generate-reading-audio.ts`, run manually (e.g. `npx tsx scripts/generate-reading-audio.ts`) whenever a lesson's passage is authored or revised.
- Imports `MASTER_READINGS` directly (via `tsx`, a lightweight TS-execution dev dependency) rather than duplicating passage text into the script — the script and the lesson data can never drift out of sync.
- For each paragraph, calls a TTS provider once, writes the result to `public/audio/reading/{paragraph.id}.mp3`, and the developer commits both the passage text and its audio file together.
- **Decided: OpenAI's TTS endpoint**, reusing the API key and client infrastructure already in this project (no new vendor account, no new key to manage).
- An in-app "generate audio" admin tool was considered and rejected for V1 — this happens rarely (once per new passage, by whoever is authoring content, not by students), so a script is correctly sized; building UI for it would be solving a problem that doesn't exist yet.

This is the exact shape the direction asked for:
**fixed passage text → generate once → save the file → reference it from lesson data → reuse for every student.**

---

## 9. Should this be its own milestone before AI Partner?

**Yes.** Reasoning:

1. It's a genuinely different technical concern (a build-time content-authoring script + static file serving) from AI Partner's runtime conversational architecture — bundling them would blur two unrelated pieces of work.
2. Reading is an already-approved, carefully-scoped feature. Every change to it this session has been small, isolated, and separately verified — this should be no exception.
3. It **de-risks** AI Partner's speech work: proving out a TTS provider, voice choice, audio format, and Next.js static-audio serving here first means AI Partner Milestone 1+ can reuse what's already been learned rather than solving the same unknowns under more time pressure.

---

**No code yet. See the main summary for open decisions before this can begin.**
