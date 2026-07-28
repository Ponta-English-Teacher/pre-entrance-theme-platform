# Writing Tutor Specification — Pre-Entrance Theme Platform

Status: design specification only. No code. This is the blueprint to be approved before implementation begins.

This Writing Tutor is **not a grammar checker**. It is an AI writing teacher for Japanese high school students preparing for university, whose purpose is to help students become better writers while protecting their confidence and motivation. Grammar is one input among several, never the point of the exercise.

Everything below is designed to sit inside the existing "Your Turn" writing section already built in `ReadingLessonView.tsx`, extending the existing `WritingTask` data shape, `WordBank` component, and `aiAssistant.ts` contextual-help architecture — not a parallel system.

---

## 1. Educational goals

- **Understand before correcting.** Every feedback pass starts by demonstrating that the tutor understood what the student was trying to say — content comes before form.
- **Protect confidence.** A student should never come away from feedback feeling they failed. Encouragement is not a wrapper around correction; it is the first and most prominent thing shown.
- **Teach English through the student's own writing**, not through abstract rules. Every "Today's English Tip" is grounded in something the student actually wrote, not a generic lecture.
- **Treat grammar as one dimension among several** — task achievement (did they answer the question), vocabulary use, and natural expression all matter as much as correctness.
- **Never over-correct.** A valid, understandable sentence is not an error just because a different phrasing also exists. This discipline — the strongest lesson from the MPG Writing Coach — is preserved and generalized.
- **Make feedback legible, not intimidating.** Japanese is the primary language of every explanation. English appears only where an English example, correction, or model sentence is educationally necessary.
- **Normalize revision.** Feedback is a beginning, not a verdict. The tutor actively invites a second attempt and treats revising as real learning, not remediation.
- **Build toward independence.** Hints and explanations model *how* to think about the language, so a student gradually needs less help — not just what to fix this one time.
- **Stay lesson-aware without being asked.** The student should never have to explain their context; the tutor already knows the theme, mission, passage, target vocabulary, and prompt.

---

## 2. User experience flow

The Tutor lives inside the existing "Your Turn" section, directly below the writing textarea and Word Bank — not a separate page or modal. Feedback appears *beside* the draft (or below it on mobile), so the student can keep reading their own writing while reading feedback about it.

```
1. Student writes/edits their draft (existing textarea + Word Bank, unchanged)
2. Student clicks "Ask My Writing Tutor" (not "Submit" or "Check Answer" — framed as asking a teacher)
3. Short loading state: "先生があなたの文章を読んでいます..." ("Your teacher is reading your writing...")
4. Feedback appears in three visual tiers, not all at once:

   Tier 1 — always expanded, shown first (the encouragement layer)
     • Overall Feedback
     • Task Achievement

   Tier 2 — collapsed by default behind a "提案を見る / Show suggestions" toggle (the editing layer)
     • Corrections
     • Natural English
     • Improved Version

   Tier 3 — always visible, compact card (the learning layer)
     • Vocabulary Feedback
     • Today's English Tip

5. Any item inside Tier 2 or Tier 3 can be tapped to reveal "Why?" — a short Japanese
   explanation, inline, no new screen.

6. Revision Cycle bar at the bottom of the feedback:
     [ 自分で直す ]  [ AIと一緒に直す ]  [ 次に進む ]
     Revise myself    Revise with AI      Continue
```

- **"Revise by myself"** collapses/dims the feedback panel and returns focus to the textarea. Submitting again starts a new feedback pass, aware of the previous draft and feedback (see §5).
- **"Revise together with AI"** does *not* open a second full Tutor report. It opens the same lightweight, staged contextual-help pattern already built for Reading (`ContextualHelpButton` / `aiAssistant.ts`'s `WRITING_HELP_OPTIONS`) — "help me think of an idea," "help me start," "suggest a word" — so co-revision feels like a conversation, not a second exam.
- **"Continue"** marks the writing complete for this lesson and proceeds exactly as `ReadingLessonView`'s existing `handleFinish` does today.
- A small **Draft History strip** (Draft 1 / Draft 2 / ...) appears once a student has revised more than once, so they can glance back — this is the seed of the "corrected workbook" feature the MPG project stubbed but never finished.

This flow deliberately avoids the MPG pattern of "submit → one verdict → optionally resubmit with no memory." Every resubmission here is a *conversation* the tutor remembers.

---

## 3. Screen design

- **Location**: embedded in the existing "Your Turn" section of the integrated Reading + Writing lesson. No new route.
- **Layout (desktop)**: draft editor + Word Bank on the left/top (existing), Feedback Panel appears below once requested, full width, using the platform's existing card conventions (`bg-white rounded-2xl border border-slate-200 shadow-sm`).
- **Layout (mobile)**: everything stacks vertically; the draft remains visible above the feedback panel (student can scroll up to re-read their own text while reading feedback below).
- **Tier 1 (Overall Feedback + Task Achievement)**: a single warm, indigo-tinted card, expanded by default, no icons that read as "grading" (no red X marks, no percentage scores anywhere in this feature).
- **Tier 2 (Corrections / Natural English / Improved Version)**: one collapsible card behind "Show suggestions ▾". When expanded, each of the three categories is its own labeled subsection so a student can absorb one at a time rather than a merged wall of edits.
- **Tier 3 (Vocabulary Feedback + Today's English Tip)**: a compact card, always visible, reusing the existing `ProgressBar` (target-words-used) already built in `ReadingLessonView`'s "Vocabulary Check" section — the Writing Tutor's vocabulary feedback should sit next to or extend that existing bar, not duplicate it.
- **"Why?"**: a small `❓なぜ？` inline button/chip next to any correction, alternative, or tip — click reveals a short Japanese explanation directly beneath that item (accordion-style, not a popup).
- **Revision Cycle bar**: three buttons at the very bottom of the feedback panel, same visual weight (this is a real choice, not a "primary vs. two throwaway options" pattern) — matches "promote learning through revision rather than one-time grading."
- Nothing about this screen should visually resemble a graded test: no scores, no percentages, no red ink as the dominant color.

---

## 4. Feedback categories

| # | Category | Purpose | Shown |
|---|---|---|---|
| 1 | **Overall Feedback** | Responds to the student's *ideas* first. Demonstrates the tutor understood what they meant. Praise leads. | Always, Tier 1 |
| 2 | **Task Achievement** | Did they answer today's question? Is their opinion clear? Is there enough supporting detail? | Always, Tier 1 |
| 3 | **Corrections** | Only genuine mistakes — never a valid alternative phrasing presented as an error. Each includes a short "why." | Tier 2, only if genuine errors exist |
| 4 | **Natural English** | One or two more natural ways to express the *same* idea, explicitly framed as options, not fixes. | Tier 2, optional |
| 5 | **Improved Version** | One polished rewrite of the whole response, explicitly labeled as *one possible* revision, not *the* correct answer. | Tier 2, optional |
| 6 | **Vocabulary Feedback** | Praises target vocabulary actually used; suggests 1–2 more words from today's Word Bank the student hasn't used yet. | Tier 3, always |
| 7 | **Today's English Tip** | One transferable writing/grammar point, drawn from something specific in the student's own draft — not a generic lecture. | Tier 3, always |
| 8 | **"Why?"** | On-demand, per-item, Japanese explanation of any correction/suggestion/tip. Never shown unsolicited. | On demand only |

Categories 2, 6, and 7 do not exist in the MPG Writing Coach at all — MPG only ever graded grammar against one target pattern. Categories 1, 3, 4, 5 are direct evolutions of MPG's `correct`/`minor_correction`/`alternatives`/`improvedSentence` concepts, generalized away from "one target grammar pattern" toward "did this response communicate the student's idea well."

---

## 5. AI interaction flow

**Trigger**: an explicit student action — "Ask My Writing Tutor" — never automatic. The student stays in control of when they're ready for feedback.

**Context assembly** (fully automatic, the student never explains anything): theme id, level, lesson id, mission, reading passage (paragraphs, for topical grounding so Task Achievement can reference the actual ideas the student is responding to), target vocabulary (word + Japanese + core meaning), Word Bank entries, writing prompt + its Japanese translation, `minSentences`, the student's current draft, the revision number, and — if this is not the first attempt — a short summary of the previous feedback pass. This directly extends the existing `HelpContext` shape already used by `aiAssistant.ts`, just with a richer payload for this deeper flow.

**One request, one structured response.** All 8 categories are generated in a single call and *displayed* in tiers — the staging is a presentation choice (§2/§3), not multiple round trips. This keeps latency and cost predictable and avoids the student waiting through several sequential "thinking" states.

**"Why?" is pre-generated, not a second call.** Every correction, alternative, and tip carries its own short Japanese explanation in the same response. Clicking "Why?" reveals text that already arrived with the main response — instant, no extra latency, no extra API cost. (If response size or cost ever becomes a real constraint, a lazy per-item follow-up call is the fallback — but pre-generation is the default.)

**Revision awareness.** When a student submits a revised draft, the request includes what changed and what was previously flagged, so the tutor can acknowledge progress ("前回指摘した前置詞、直せていますね!") rather than repeating identical feedback verbatim. This is the single biggest gap in MPG's "Check Again" behavior (which re-runs the same stateless call with no memory).

**Mock-first, matching the Reading module's precedent.** Per the migration report, this project currently has no AI backend at all. The Writing Tutor should be buildable and fully testable against an extended mock engine (building on `aiAssistant.ts`'s existing heuristics: sentence count, target-word usage, basic punctuation/capitalization checks, a small library of canned "natural English" alternatives) before any real backend decision is made. The swap-in point for a real API call (mirroring MPG's `app/actions.ts` Server Action pattern) should be a single, clearly marked function boundary — exactly like `requestAIHelp()` is today — so upgrading later requires no UI changes. Whether/when to connect a real backend (new dependency, API key, cost) is a separate decision for the user to make explicitly before implementation, not something this spec assumes.

---

## 6. Prompt architecture

**System instructions** (persona and rules, described conceptually):
- Persona: a supportive Japanese high-school/pre-university English writing teacher — explicitly *not* an examiner, not a proofreading tool.
- Rule: always address the content/ideas before any language issue.
- Rule: praise before correcting, every time, with no exceptions.
- Rule: never flag a valid, understandable phrasing as an error just because a different phrasing is also possible or more common — carried directly from MPG's strongest design principle, generalized beyond grammar to vocabulary and phrasing choices too.
- Rule: every corrections/alternatives/tip item must include its own short "why," written for a Japanese A2–B1 high school student, not linguistic jargon.
- Rule: output language is Japanese by default for every explanation, note, and piece of framing text; English appears only inside actual example sentences, corrections, or the improved version — never as the surrounding explanatory prose.
- Rule: keep every section short enough to read in a few seconds — no paragraphs, no lectures.
- Rule: the Improved Version must always be framed as "one possible version," never as "the correct answer," and must preserve the student's original meaning and voice as closely as possible (do not upgrade register beyond the student's level).
- Rule: Today's English Tip must be grounded in something specific and true about the student's own draft — never a generic, disconnected grammar fact.
- Rule: tone calibrates to `level` (foundation/standard/challenge) — vocabulary of the feedback itself, expected sentence complexity, and how much is corrected all scale down for foundation-level students.

**Task context injected per request** (lesson-aware, not hardcoded): mission, target vocabulary list, Word Bank, writing prompt (+ Japanese translation), `minSentences`, reading passage content, level, the student's draft, revision number, and prior-feedback summary if applicable. Exactly the same "inject lesson data instead of hardcoding a lesson" discipline the migration report recommended.

**Output schema** (structured, strict — following MPG's discriminated-JSON-schema discipline): one object per submission with a field per feedback category (overall feedback, task achievement assessment, corrections list, natural-alternatives list, improved version + disclaimer note, vocabulary feedback, today's tip, and a `why` string attached to every correction/alternative/tip item). Every field's schema description states exactly when it should be filled vs. left empty, mirroring MPG's "fill this only when X, otherwise empty" pattern — this is what keeps the UI simple and prevents hallucinated filler content.

---

## 7. Data structure

Described conceptually (no code):

- **`TutorContext`** — assembled automatically per request: theme, level, lesson id, mission, reading passage, target vocabulary (word/Japanese/meaning), Word Bank entries, writing prompt (+ Japanese), `minSentences`, current draft, revision number, prior feedback summary. A richer sibling of the existing `HelpContext` used by `aiAssistant.ts`.
- **`WritingFeedback`** (one per submission) — the 8 category payloads described in §4/§6, plus which draft text it was generated for and a timestamp. Every correction/alternative/tip item carries its own pre-generated Japanese "why" string.
- **`WritingSession`** (persisted per lesson, extending the existing `ReadingProgress` pattern in `lib/store.ts`) — an ordered list of `{ draftText, feedback, timestamp }` revisions, the current revision index, which revision-cycle choice was made after each pass (self / AI-assisted / continue), and a completion flag. This is the data foundation for a future "corrected workbook" portfolio view — the exact feature MPG stubbed as "coming soon" and never built.
- **Rubric/level parameters** — expected sentence complexity and feedback tone per `Level`, so the same lesson data drives appropriately-calibrated feedback across foundation/standard/challenge without new code paths per level.
- Everything here is scoped **per lesson id**, never a single global blob — directly addressing the migration report's critique of MPG's one-combined-progress-object-per-whole-lesson design.

---

## 8. Component architecture

Described conceptually (no code):

- **`WritingTutorPanel`** — the container embedded in "Your Turn," wrapping the existing draft textarea + `WordBank`, plus the "Ask My Writing Tutor" button and the Feedback Panel.
- **`FeedbackPanel`** — renders the three tiers described in §3: Tier 1 expanded, Tier 2 collapsed-by-default, Tier 3 always-visible compact card.
- **`WhyExplainer`** — a small reusable inline control attached to any item in Corrections/Natural English/Improved Version/Vocabulary/Tip; toggles the pre-generated Japanese explanation for that specific item.
- **`RevisionCycleBar`** — the three equally-weighted buttons (self / AI-assisted / continue) at the end of a feedback pass.
- **AI-assisted revision mode** reuses the existing `ContextualHelpButton` + `aiAssistant.ts` popover pattern already built for Reading, rather than inventing a new interaction style — the "quick coaching hint" surface and the "full Tutor feedback" surface should look and feel like the same product.
- **`DraftHistoryStrip`** — optional, appears once a student has more than one revision; lets them glance at earlier drafts/feedback.
- **Reused as-is, unchanged**: the existing `WordBank` component, the existing `ProgressBar` (for target-vocabulary-used tracking, shared with Reading's Vocabulary Check section rather than duplicated), and the platform's existing Tailwind card/button conventions — so this feature looks native to the platform rather than bolted on from a different design language.

---

## 9. Future extensibility

- Because every input is pulled from `TutorContext` rather than hardcoded, this same Tutor works unmodified for every future theme and level — exactly the migration report's top recommendation.
- An optional target-grammar-pattern field can be added to a lesson's `WritingTask` later, for a future lesson that genuinely wants MPG-style single-pattern grammar drilling — without changing the default opinion/reflection rubric used everywhere else.
- The mock-first architecture means a real AI backend can be connected later (Server Action + API key, mirroring MPG's `app/actions.ts`) with no UI changes — the decision of *whether and when* to do that stays separate from this spec.
- `WritingSession`'s draft-history data model is the direct foundation for a future portfolio "corrected workbook" view, achieving what MPG only stubbed.
- The pre-generated "Why?" pattern (explanation delivered with the main response, revealed on demand) generalizes to any future feature needing on-demand depth without extra latency.
- The same staged-feedback shape (understand → task achievement → corrections → natural alternatives → model version → vocabulary → tip → why) could plausibly extend to a future Speaking activity's feedback design — not being built now, but the shape transfers.

---

## 10. Examples of good feedback

Using the existing "Who Am I Becoming?" lesson's writing prompt ("Do you agree with the author? Why or why not?") as a concrete grounding example throughout.

**Overall Feedback**
> あなたが「小さな挑戦が自信につながる」という考えに賛成している理由が、とてもよく伝わってきました。アヤの例を自分の経験と結びつけようとしているところが素敵です。

**Task Achievement**
> 賛成か反対かがはっきり書けていて、理由も1つ示せています。もう少し具体的な経験を1文加えると、さらに説得力が増しますよ。

**Corrections** (genuine, minimal, with "why")
> "I think confidence is very important thing" → "I think confidence is a **very important thing**"
> なぜ？："thing" のような数えられる名詞の単数形の前には "a" が必要だからです。

**Natural English** (framed as an option, not a fix)
> あなたの文はこのままで自然です。もし他の言い方も知りたければ、こんな表現もよく使われます:「That's why I believe confidence really matters.」これは正解・不正解ではなく、もう一つの自然な言い方の例です。

**Improved Version** (with explicit disclaimer)
> 参考として、書き直しの一例を示します(これが唯一の正解ではありません):「I agree with the author because trying new things, even small ones, helped me become more confident, just like Aya in the reading.」自分の言葉や考えを大切にしながら、参考にしてください。

**Vocabulary Feedback**
> 今日の単語「confidence」と「reflect」を使えていて素晴らしいです!よければ「character」や「share」も使ってみると、表現がさらに広がりますよ。

**Today's English Tip**
> 今日のワンポイント:理由を説明するときは "because" の後に主語＋動詞を続けます(例: because I tried something new)。あなたの文でもこの形が使えていました、これからも意識してみましょう。

**Revision Cycle prompt**
> ここまでの内容をもとに、書き直してみますか?「自分で直す」「AIと一緒に直す」「次に進む」から選べます。書き直すことも、立派な学習です!

---

## 11. Examples of poor feedback to avoid

**Bad Overall Feedback** — skips understanding, jumps straight to a scoreboard:
> "Error 1: subject-verb disagreement. Error 2: missing article. Score: 6/10."
> *Why this fails*: no acknowledgment of ideas, purely mechanical, feels like grading rather than teaching, entirely in English, and introduces a score — which has no place in a formative writing coach.

**Bad Task Achievement** — blunt, no path forward:
> "You did not answer the question correctly. Try again."
> *Why this fails*: examiner tone, no explanation of what's missing, no encouragement, English-only.

**Bad Corrections** — a style preference dressed up as an error:
> "'I want to share that' → 'I would like to share the fact that' (more formal/academic)."
> *Why this fails*: this isn't a genuine mistake — it's over-correction, exactly the failure mode MPG's system prompt was specifically built to prevent. It also erases the student's natural voice.

**Bad Natural English** — presented as the only right answer, and above the student's level:
> "The correct way to say this is: 'That is precisely why confidence is paramount.'"
> *Why this fails*: "correct way" framing directly contradicts "these are suggestions, not correct answers"; "paramount" is far above A2–B1 register for a Level 1 student.

**Bad Improved Version** — erases the student's meaning and voice, no disclaimer:
> "Here is your corrected sentence: 'Confidence stems from overcoming successive minor adversities, as illustrated by Aya's narrative arc.'"
> *Why this fails*: register wildly above the student's level, doesn't preserve what the student was actually trying to say, and never states that this is only one possible version.

**Bad Vocabulary Feedback** — deficit-only, no praise:
> "You did not use 'character' or 'goal' in your response."
> *Why this fails*: ignores words the student *did* use successfully, purely gap-focused, no encouragement, no concrete suggestion of how to work the word in.

**Bad Today's English Tip** — disconnected from the student's actual writing:
> "Remember: the present perfect tense is formed with 'have/has' + past participle." (when the student's draft never touched this tense)
> *Why this fails*: not grounded in anything the student actually wrote — reads as a random grammar lecture, violating "teach from their own writing."

**Bad "Why?" explanation** — technical jargon, wrong language:
> "Because of subject-verb agreement rules in English morphosyntax."
> *Why this fails*: linguistic jargon inappropriate for a Japanese A2–B1 high schooler, and delivered in English when it should be Japanese.

**Bad Revision Cycle** — introduces grading pressure:
> "Your score was 60%. You must revise to improve your grade."
> *Why this fails*: scores/grades directly contradict the formative philosophy; frames revision as a penalty for failing rather than a normal, valuable part of writing.

**Bad language balance** (general) — an entire feedback response written as dense English paragraphs with no Japanese at all.
> *Why this fails*: directly violates "Japanese should be the main language" — creates exactly the "wall of English" intimidation this spec exists to prevent.

---

**This specification is the blueprint for implementation. No code has been written. Awaiting approval before implementation begins.**
