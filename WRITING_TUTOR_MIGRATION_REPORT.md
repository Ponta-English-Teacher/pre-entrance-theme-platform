# Writing Tutor — Migration Report

Source studied: `/Users/eguchihitoshi/Documents/English Department/2026/Class 2026/MPG2026/Lesson 11/mpg11-writing-coach` (full read of every source file: `app/page.tsx`, `app/actions.ts`, `app/layout.tsx`, `components/LessonApp.tsx`, `components/CorrectionCard.tsx`, `components/PatternDiagram.tsx`, `components/PointBadge.tsx`, `components/PreviousButton.tsx`, `components/ProgressBar.tsx`, `components/screens/{WelcomeScreen,TeachScreen,TranslateScreen,WriteScreen,ReviewScreen}.tsx`, `lib/{lesson-data,progress,progress-store}.ts`, `package.json`).

Analysis only — nothing has been implemented or changed in either project.

---

## 1. Overall architecture

**Stack**: Next.js 16.2.10 (App Router), React 19, Tailwind v4, TypeScript. One real dependency the theme-platform doesn't have yet: `openai` (v6.45.0) — this project has an actual, working AI backend, not a mock.

**UI flow**: A single client component (`LessonApp.tsx`) owns a flat `steps` array built once at module load:

```
welcome
→ [ teach, translate(Q1), translate(Q2), write ]  × 12 grammar points
→ review
```

Every grammar point produces exactly the same 4-step sequence. There is no branching — `stepIndex` is a single integer into this flattened array, driven by `next()`/`back()`. This is a **linear stepper over a fixed curriculum**, not a set of independent activities.

**Component structure**:
- `app/page.tsx` → renders `LessonApp` (the entire app is one route).
- `LessonApp.tsx` → owns `stepIndex`/progress, dispatches to one of 5 screen components per step.
- `components/screens/*` → one component per step type (`WelcomeScreen`, `TeachScreen`, `TranslateScreen`, `WriteScreen`, `ReviewScreen`). `TranslateScreen` and `WriteScreen` are near-duplicates (see §6).
- `components/{CorrectionCard,PatternDiagram,PointBadge,PreviousButton,ProgressBar}.tsx` → small presentational pieces shared across screens.

**AI call flow**:
```
TranslateScreen/WriteScreen textarea
  → onSubmit(text) prop
  → LessonApp.submitAnswer()
  → app/actions.ts: getCorrection()  ["use server" — a real Next.js Server Action]
  → OpenAI Responses API (client.responses.create), strict JSON-schema output
  → parsed CorrectionResult
  → LessonApp.updateProgress() persists {text, correction} into the store
  → screen sets local state, renders <CorrectionCard>
```

**Prompt flow**: One large hardcoded `SYSTEM_INSTRUCTIONS` string (defined once, module-level) + a per-request `input` string assembled from the grammar point's `title`/`explanation`/`teacherNote` plus the student's answer. The JSON schema (`responseSchema`) is also hardcoded once, with per-field `description`s that double as inline prompt engineering (the schema descriptions repeat and reinforce the same rules stated in `SYSTEM_INSTRUCTIONS` — deliberate redundancy).

**State management**: A custom `useSyncExternalStore`-based singleton (`lib/progress-store.ts`) backed by `localStorage` (`lib/progress.ts`), single key `mpg11-writing-coach:v1`. One `LessonProgress` object holds `{ stepIndex, answers: Record<grammarPointId, {translate1?, translate2?, write?}>, completedAt? }` for the *entire* 12-point lesson — i.e. one combined blob per whole lesson, not per-exercise.

**Data structure**: `lib/lesson-data.ts` exports a flat `GrammarPoint[]` array — each point bundles teaching content (`pattern`/`meaning`, `explanation`, `examples`), two fixed Japanese→English translation prompts, one free `writingPrompt`, and a `teacherNote` that exists purely to steer the AI, not for student display.

---

## 2. Educational workflow

Per grammar point, the student always does the same four things in order:
1. **Teach** — read the pattern/meaning and 2 example sentences (no interaction).
2. **Translate ×2** — translate a fixed Japanese sentence into English (controlled practice), get AI feedback, optionally revise ("Check Again"), continue.
3. **Write** — produce one original sentence from an open prompt (free production, same target grammar), get AI feedback.
4. After all 12 points: **Review** — every answer and its feedback listed together; a "Save My Corrected Workbook" button that is a stubbed "coming soon."

This repeats for 12 points, then review. Total: 36 graded exercises (12 × 3) in one continuous session.

**Embedded philosophy**:
- **Controlled → free production**, a standard scaffolding progression (translate a given sentence before writing your own).
- **Non-punitive tone by design**: "Always praise first, then polish," never treat a different-but-valid phrasing as an error, reserve real correction for genuine mistakes only.
- **Transfer over template-matching**: the AI is explicitly told there is no single correct translation — it evaluates whether the *target grammar pattern* was used correctly, not whether the sentence matches a reference answer.
- **Brief, teacher-like feedback**: "a student should be able to read the feedback in about 5 seconds" is a literal prompt instruction, not just a UI constraint.
- **Everything is graded** — there's no ungraded/exploratory step; every translate/write action is a submit-and-correct loop. There is no staged coaching (no hints before an answer, no "help me start") — the interaction model is *evaluate the finished sentence*, not *coach toward one*.

---

## 3. AI behavior

**Prompts**: One system prompt (`SYSTEM_INSTRUCTIONS`) shared across all 12 grammar points and both task types (translate/write); only the `input` payload changes per request (grammar point metadata + student answer). There is no prompt template per grammar point — genericity comes from injecting `explanation`/`teacherNote` as data, not from separate prompts.

**Prompt structure**: System instructions define the assistant's persona ("experienced, encouraging university English writing instructor") and a strict 4-way decision procedure with worked examples and explicit anti-patterns ("never do X just because Y"). The per-request `input` is a plain labeled-line string (`Grammar point: ...`, `Explanation: ...`, `Writing prompt: ...`, `Student's English: "..."`) — not JSON, not chat-turn history; it's a single-shot classification request, no conversation memory.

**System instructions**: Extremely detailed and example-driven — this is the strongest part of the whole project. It defines exactly 4 outcomes, gives a worked example for the trickiest distinction (off_pattern vs needs_revision vs minor_correction), and gives an explicit worked example of what *not* to over-correct ("made her my girlfriend" vs "asked her to be my girlfriend").

**Response format**: Strict JSON Schema via OpenAI's `text.format: { type: "json_schema", strict: true }` — a discriminated-union-shaped object with `status` plus per-status optional fields, where the *contract* (which fields must be empty vs filled for each status) is documented redundantly in both the schema field descriptions and the system prompt.

**Feedback strategy**: One-shot, terminal. Submit → one verdict → optionally submit again ("Check Again") which just re-runs the same call with the new text; no memory of the previous attempt is passed back to the model.

**Strengths**:
- The 4-status rubric with precise, non-overlapping definitions and worked "don't do this" examples is genuinely well-engineered prompt design — it prevents the most common LLM-grading failure mode (over-correcting stylistically-valid variation).
- Strict JSON schema + discriminated result type means the UI never has to guess what fields are populated.
- Grounding evaluation in "did you use today's target pattern," not a fixed reference sentence, is the right call for grammar-focused practice and avoids penalizing valid alternative phrasing.
- The "brief feedback" and "praise first" instructions are baked directly into the system prompt, not left to the UI layer to enforce.

**Weaknesses**:
- The entire rubric (all 4 statuses) is built around "there is one target grammar pattern per exercise." It does not generalize to open-ended, non-grammar-focused writing (e.g., an opinion response with no single target structure) — that's a Lesson-11-shaped rubric, not a general-purpose one.
- No vocabulary-usage dimension at all — it checks grammar/naturalness only, never whether target vocabulary was used.
- No retry/backoff/rate-limit handling — a single `try/catch` around the whole call, falling back to one generic error string.
- No streaming — the student waits for the full JSON response with no incremental feedback.
- Single fixed voice/complexity level in the prompt — no notion of A2 vs B1 vs harder, no per-level adjustment.
- No staged/coach-style interaction (hints before answers, "help me think of an idea," "help me start") — it only evaluates a completed sentence. This is the opposite interaction model from the contextual `AI Help` pattern already built for the Reading module.
- System prompt + schema are one hardcoded blob, not parameterized/generated per lesson — there's no "rubric builder."

---

## 4. Feedback categories

The tutor gives exactly one graded verdict per submission, from a closed set of 4:

| Status | Meaning | What's shown |
|---|---|---|
| `correct` | Grammatically correct, natural, uses the target pattern, nothing to fix. | ✅ praise + up to 2 optional "alternatives" (other natural phrasings), shown only if genuinely interesting. |
| `minor_correction` | Target pattern used correctly; 1–2 small genuine errors *outside* the pattern (preposition/article/collocation/vocabulary). | ✅ praise + up to 2 wrong→correct pairs + an optional single rewritten sentence. |
| `off_pattern` | Correct, natural English, but doesn't use today's target grammar at all. | 🔵 explicitly framed as *not a mistake* + one example sentence showing the same idea using the target pattern. |
| `needs_revision` | An actual grammar error *inside* the target pattern itself. | 🟠 the corrected sentence + exactly one short reason. |

There is no separate "organization" or "encouragement" category as distinct feedback types — encouragement is folded into the copy/tone of every card (e.g. "Good job! One small correction"), not a standalone dimension. There is no vocabulary-usage feedback and no discourse/organization feedback (unsurprising — every exercise is a single sentence, not a paragraph).

---

## 5. Lesson-specific elements (do NOT carry into the new platform)

- **`lessonTitle`/`lessonSubtitle`** — "MPG 11: Hypothetical & Unreal Expressions."
- **All 12 entries of `grammarPoints`** in full — id, title, `pattern`/`meaning`, `explanation`, `teacherNote`, `examples`, both fixed Japanese `translations`, `writingPrompt`. Every value is specific to conditionals/wish/as-if/etc.
- **`REALITY_SCALE`** in `WelcomeScreen.tsx` (Real → Unlikely → Present → Past → Mixed) — a visual metaphor specific to the conditional-grammar spectrum of this exact lesson.
- **The fixed "teach → translate×2 → write" shape** itself, hardcoded into `LessonApp`'s `steps` construction — this 4-step-per-unit structure is Lesson-11's grammar-drill pedagogy, not a universal lesson shape. (Knowing Myself's Reading/Writing lesson has no translation-drill step at all.)
- **The 4-status grammar rubric** in `SYSTEM_INSTRUCTIONS`/`responseSchema` — built entirely around "was today's target grammar pattern used correctly," which presumes every exercise has exactly one target grammar structure. Opinion/reflection writing (no single target pattern) doesn't fit this rubric as-is.
- **The Review screen's per-point grouping** (translate1/translate2/write rows) and the "Save My Corrected Workbook" stub — tied to the 3-answers-per-point shape.
- **`STORAGE_KEY = "mpg11-writing-coach:v1"`** and the single-blob-for-the-whole-lesson progress shape — lesson-specific namespacing that doesn't scale to a platform with many independent lessons.
- Copy referencing "2 translations + 1 original sentence each" on the welcome screen — describes this lesson's specific exercise count, not a general contract.

---

## 6. Reusable components / architecture

- **The submit → structured AI correction → discriminated feedback card → continue loop** as an interaction *pattern* (not its specific 4 statuses) — this generalizes well to any single-response writing exercise.
- **Server Action + OpenAI Responses API + strict JSON schema** (`app/actions.ts`) — this is the first working example of a *real* AI backend available to study. The theme-platform currently has zero backend (confirmed: no API routes, no AI SDK dependency) — everything in Reading's `aiAssistant.ts` is deliberately mocked for exactly that reason. This file is the natural template for a real backend call later.
- **The discriminated-union JSON-schema pattern**: strict schema with per-field "fill this only when status is X, otherwise leave empty" descriptions, parsed straight into a typed result, UI branches on `status`. Worth reusing as an *architecture discipline* for any future rubric, even with a different status set.
- **`CorrectionCard`'s pattern** of "one component, branch on `result.status`, render a differently-styled card per branch" — reusable as a generic `<FeedbackCard>` shape, once the status set itself is made configurable.
- **`ProgressBar`/`PreviousButton`/stepper mechanics** — a legitimate linear-stepper pattern, though currently scoped to one global `stepIndex` across the whole app rather than per-lesson.
- **`useSyncExternalStore` + module-singleton + localStorage** (`progress-store.ts`) — a more rigorously "React-correct" reactive-store pattern than the simpler `useState`+`useEffect` pattern already used in the theme-platform (e.g. `ReadingLessonView`). Worth considering if the Writing Tutor needs multiple components reacting to the same draft/progress simultaneously, but not a requirement — the simpler existing pattern is probably sufficient and more consistent with the rest of the platform.
- **Prompt-design principles** (not code, but worth preserving deliberately): praise-first ordering, "~5 seconds to read," "never over-correct a valid alternative," grounding evaluation in lesson metadata (explanation + teacherNote) rather than a fixed reference answer. These should be preserved as *defaults* in any new rubric-builder, regardless of theme/lesson.

---

## 7. Recommended improvements for the new platform

- **Configurable writing prompts**: generalize the fixed `grammarPoints` shape into the `WritingTask` structure already partially in place for Reading (`prompt`, `minSentences`, `wordBank`, `usefulExpressions`) — add an *optional* target-grammar-pattern field for lessons that have one (most won't).
- **Reusable rubrics**: replace the one hardcoded prompt/schema blob with a rubric-builder that generates system instructions + JSON schema *from* a lesson's data (target vocab, optional grammar pattern, level, minSentences) at request time — parameterize what MPG hardcoded, while keeping its core discrimination discipline and non-punitive philosophy as always-on defaults. Consider a smaller universal status set (e.g. `strong` / `good_with_notes` / `needs_work`) that works whether or not a lesson has a single target grammar structure, with grammar-pattern-specific statuses layered on only when a lesson declares one.
- **Contextual AI**: MPG only supports "submit finished sentence → get verdict." The Writing Tutor should also expose the staged, coach-style hints already built for Reading (`aiAssistant.ts` / `ContextualHelpButton`) — idea, start, word suggestion, naturalness — with MPG's real strict-schema correction becoming *one* of the help types (e.g. "check my grammar," "tell me whether I answered the question"), not the only interaction mode.
- **Word Bank integration**: MPG has zero vocabulary-usage awareness. Feed the lesson's target vocab (already modeled in Reading's `WritingTask.wordBank`) into both the rubric (so the AI can note vocabulary use) and the existing click-to-insert Word Bank UI.
- **Lesson-aware feedback**: system instructions/schema should be generated from the lesson's own data (mission, level, target vocab, optional grammar focus), the same way `ReadingLessonView` already builds a `HelpContext` per lesson dynamically — not one prompt hardcoded for one grammar unit.
- **Support for different levels**: MPG has one fixed voice/expectation level. Feedback tone, vocabulary, and expected sentence complexity should scale with `Level` (`foundation`/`standard`/`challenge`).
- **Progress storage**: replace the single global linear `stepIndex`-over-one-lesson model with per-lesson-id namespaced progress, matching the `etp-*` convention already used for Vocabulary/Reading, so multiple lessons/themes don't collide in one combined blob.
- **Infrastructure prerequisite, flagged explicitly**: connecting a real AI backend requires adding the `openai` package, an API key (env var), and a server-side call path (Server Action or API route) — none of which exist in the theme-platform today. This is a real infrastructure decision, not just a code change, and needs explicit sign-off before implementation, since Reading's current assistant is intentionally mocked for exactly this reason.

---

## 8. Migration plan (proposed, no code yet)

1. **Data model**: extend the existing `WritingTask` shape (already used by Reading's "Your Turn") with an optional grammar-focus field and whatever rubric parameters a lesson wants to declare — do not resurrect MPG's `GrammarPoint`/teach-translate-write shape unless a future lesson genuinely needs grammar drilling.
2. **Rubric builder (server-side)**: a function that takes a lesson's `WritingTask` + level + target vocab and produces system instructions + a JSON schema, generalizing MPG's hardcoded prompt into a parameterized template. Preserve MPG's non-punitive philosophy and brevity rule as built-in defaults, not per-lesson options.
3. **Real AI call path**: add a Server Action mirroring `app/actions.ts`'s pattern (OpenAI Responses API, strict JSON schema, graceful "not configured" fallback exactly like MPG's `if (!apiKey)` check) as an *additional* tier alongside the existing mocked `aiAssistant.ts` — the mock stays for cheap staged coaching hints; the real call becomes the "final check" tier, gated on an available API key.
4. **Generic feedback component**: a `<FeedbackCard>` driven by a configurable status→style map, replacing `CorrectionCard`'s 4 hardcoded blocks, so different rubrics with different status sets still render coherently through one component.
5. **Integration point**: wire this into the Reading lesson's existing "Your Turn" section first — smallest, lowest-risk integration, since that embedded-writing slot already exists and matches the platform's "reading and writing are one lesson" decision. Evaluate only afterward whether a standalone Writing activity type is ever needed.
6. **Progress**: persist per-lesson-id, extending `ReadingProgress` (or a sibling `WritingProgress`) rather than a global stepIndex.
7. **Explicitly deferred / not migrated**: the teach→translate×2→write curriculum sequencer, the grammar-pattern-specific 4-status rubric as a hardcoded default, the "Save My Corrected Workbook" export stub, and the single-global-stepIndex progress model — none of these are needed unless a future lesson is itself grammar-drill-shaped, which Knowing Myself Level 1 is not.

---

**Awaiting your approval before any implementation begins.**
