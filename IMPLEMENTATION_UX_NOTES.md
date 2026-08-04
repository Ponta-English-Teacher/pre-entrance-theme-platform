# Implementation UX / Architecture Notes

Running log of things that came up while implementing the Reading & Writing
flow (Vocabulary → Reading → Notice Language → Comprehension → Writing → AI
Talk) in the app. This is observations only — nothing here changes the
curriculum or the frozen design docs. Decisions we make from these notes
happen in a separate conversation, after the Foundation workflow can
actually be tried in the browser.

---

## Content gap: Theme 1's in-code lesson is the pre-revision version

`docs/THEME_01_READING_WRITING.md` approved a revised, personality-focused
Theme 1 passage (target vocab: personality, confident, shy, strength,
interested, hobby, important, learn, goal, dream). The code currently
implements an earlier, identity-focused version (`src/data/reading/
masterReadings.ts`, lesson `km-f-reading-01`), with a matching vocabulary
set in `src/data/vocabulary/masterVocabulary.ts` (identity, value, goal,
strength, dream, confidence, character, describe, reflect, share).

Porting the approved revision means writing new `VocabEntry` records
(Japanese translations, core meanings, examples, collocations) for words
that don't exist in the data layer yet — a content task, not a workflow
task. For this pass, the workflow was built and validated against the
**existing** (unrevised) Theme 1 content, so the mechanics could be tested
without blocking on new vocabulary authoring. The revision port is still
outstanding.

## `MissionCheck.vocabInContext` is a minimal additive field, not a real restructure

Foundation always needs exactly 3 fixed task types (MCQ, evidence, vocab-in-
context), so a single additive `vocabInContext` field on `MissionCheck` was
enough. `docs/READING_WRITING_ARCHITECTURE.md` §4 specifies a different,
larger task mix for Standard (4 tasks: 1 literal + 2 inference + 1 vocab-
in-context) and Challenge (4–5: 1 inference + 2–3 critical-thinking + 1
vocab-in-context) — that will need `MissionCheck` to become something more
like a typed array, not another additive field. Flagged in the type's own
comment in `masterReadings.ts` so it isn't missed later.

## Deferred from `READING_WRITING_EXPERIENCE_DESIGN.md`

Everything below is specified in the frozen experience-design doc but was
left out of this pass, since the goal was validating the core flow, not
matching the doc's full fidelity on the first attempt:

- **Reflect section** (§5.5) — entirely new, ungraded metacognition step.
  Not built.
- **Revision nudge** in Improve (§5) — "Want to try revising with this in
  mind?" after feedback. Not built; `WritingTutor`'s existing feedback loop
  is used as-is.
- **Ask AI upgrade from mock to real, context-aware LLM** (§4, §8) — the
  single highest-leverage item in the doc, and the largest one. Notice
  Language doesn't have an Ask AI entry point at all yet (no
  `NOTICE_LANGUAGE_HELP_OPTIONS`).
- **Welcome-back cue** (§8.5) — no "pick up where you left off" messaging.

## Section naming: kept "Review", not "Improve"

The experience-design doc's **Improve** section is specifically about AI
feedback + the revision nudge. The existing word-bank/takeaway block (word
usage progress, takeaway pull-quote) doesn't map cleanly onto that — it's
closer to a "here's what you covered" summary. Kept it named **Review** for
now rather than force-fitting the doc's name onto content that doesn't
match its description. Worth revisiting once Reflect and the revision nudge
actually exist and the section boundaries need to be drawn for real.

## Reading-completion signal

Implemented via `IntersectionObserver` (50% threshold) on the last
paragraph, per the doc's own suggestion in §7. Not yet checked across
different viewport sizes or with browser zoom — only confirmed it fires in
one desktop-width test.

## Vocabulary-in-context content for Theme 1

Wrote a new Task 3 for the existing Theme 1 passage using "character" as
the target word (fiction-character / written-character / personal-
character ambiguity) — a genuine fit for the existing text, but authored
directly during implementation rather than through the same review process
the frozen `THEME_0N_READING_WRITING.md` docs went through. Worth a look
once curriculum review resumes.

## Themes 3–10 content port: spiral-vocabulary id policy

While porting Themes 3–10, several target words are documented as spiral
reinforcements of earlier themes (e.g. Theme 3's "goal"/"dream" reinforce
Theme 1; Theme 5's "trust" reinforces Theme 4; Theme 9's "history"/"legacy"
reinforce Theme 6). `VocabEntry.themes` already supports a word belonging to
multiple themes, so where the earlier theme's word was already correctly
coded (Theme 2 onward, and same-session Theme 6→9), I reused the existing
id and appended the new theme to its `themes` array, rather than creating a
duplicate entry.

I deliberately did **not** do this for anything tracing back to Theme 1,
since Theme 1's in-code vocabulary is the old, unrevised set (see the note
above) and doesn't reliably match the new curriculum's word list — e.g.
Theme 4's "share" is documented as first introduced *at* Theme 4, but old
Theme 1 code happens to also have a word called "share" for unrelated
reasons. Reusing that id would have wrongly linked the two. For every word
like this, I created a fresh entry under the current theme's own id prefix
instead. Net effect: a few words that are conceptually "the same word"
across themes (mainly anything touching Theme 1) exist as separate,
duplicate `VocabEntry` records with different ids. Not a functional bug —
each entry works correctly in its own theme — but worth deduplicating
once Theme 1's content is finally revised to match its approved curriculum.

## Themes 3–10 content port: Japanese translations are unreviewed

For every theme, the approved `docs/THEME_0N_READING_WRITING.md` documents
give the English passage, comprehension design, and writing task, but not
Japanese translations, `plainEnglish` paraphrases, or comprehension
`explainer`/`hint` text — those fields didn't exist as design deliverables,
only as code requirements. I authored all of this fresh, in the same style
as the existing Theme 1/2 entries. Same caveat as before: I'm not a
certified translator, and none of this Japanese content has had a native
or fluent-speaker review pass yet.
