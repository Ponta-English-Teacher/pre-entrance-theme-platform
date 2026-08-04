# Editorial Workflow

Status: **Approved — the permanent editorial process for the Pre-Entrance Theme
Platform**, effective 2026-08-02. Every theme, at every level, is reviewed
through this process from first read to publication sign-off. This document
governs the *sequence and gating* of editorial review; it does not itself
contain sentence-level principles (those live in `docs/EDITORIAL_GUIDELINES.md`,
invoked as a tool inside Phase 3) or curriculum content decisions (those live
in `docs/CURRICULUM_MAP.md`, `docs/VOCABULARY_PHILOSOPHY.md`, and
`docs/VOCABULARY_ARCHITECTURE.md`).

**Curriculum note**: this workflow assumes the current two-level curriculum,
**Foundation** and **Advanced**. Some referenced documents still describe a
three-level Foundation/Standard/Challenge structure from before the
simplification decision — treat those as pending revision, not as current
truth, wherever they conflict with this document.

---

## Why this document exists

Editorial review on this project began sentence-first: reading a passage line
by line, fixing pronouns and collocations, polishing prose. That process
produced real, valuable principles — `docs/EDITORIAL_GUIDELINES.md`'s eight
principles all came from genuine issues found this way.

But it also produced a costly failure. Theme 3 ("Designing My Future") passed
substantial sentence-level polishing before we discovered a much larger
problem underneath: the protagonist's background, motivation, and ability
were never sufficiently established, and beyond that, the underlying scenario
may not have been the strongest way to teach the theme at all. The English was
good. The story — and possibly the concept behind the story — was weak. We had
been polishing sentences before confirming the material deserved to be
polished, and before confirming it was even the right material.

This workflow exists to stop that from happening again: it identifies the
largest, most expensive-to-miss problems **first**, before any effort is spent
on problems that only matter if the bigger ones are already resolved.

---

## Core editorial philosophy

> **Never become attached to an existing story. If the story itself is weak,
> replacing it is better than endlessly repairing it.**

This principle is not limited to the reading passage. It applies to every
component of a theme — the reading passage, the writing prompt, the AI Help
design, the AI Talk framing, any piece of the theme's material. If a
component is fundamentally wrong, recommend rebuilding it. Do not patch
around a flawed foundation to avoid the cost of starting over.

**Our objective is not to preserve existing content. Our objective is to
publish the best possible educational material.** Existing work earns no
special protection simply because it already exists, has already been
edited, or would be costly to replace.

Every phase below exists in service of this principle. A phase's job is not
to find something to fix — it's to honestly determine whether what exists
deserves the next, more expensive kind of attention. Passing a phase because
rewriting feels costly, or because sentence-level work has already been done,
defeats the purpose of having phases at all.

---

## The sequencing rule

**Work moves in one direction: top-down, largest problems first.** A theme
must pass each phase before the next one begins. If a phase fails, stop —
resolve it at that level (which may mean returning to an earlier phase, or
even restarting from Phase 0) before any work continues downstream. Never
proceed provisionally "for now" with a plan to fix the bigger issue later;
that is exactly the sequence that produced the Theme 3 problem.

Each phase below states its **scope** (what you're actually reading), its
**reviewer stance** (what kind of judgment to apply — deliberately not a
language-teacher stance until Phase 3), its **evaluation questions**, and its
**gate** (what must be true to proceed, and what happens if it isn't).

---

## Phase 0 — Theme Concept Review

**Scope**: the story concept itself — protagonist, situation, central
conflict, and arc — read as a one-paragraph pitch, even when reviewing
existing drafted content. If the passage already exists, extract its concept
as if it were being pitched fresh, before reading it as prose.

**Reviewer stance**: an acquisitions editor deciding whether to greenlight a
concept — not yet a story editor, and not at all a language teacher. Nothing
about English quality is relevant at this phase.

**Evaluation questions**:
- Does this story naturally express the theme's educational objective, or
  does it merely sit near the topic?
- Is this the most effective scenario available for teaching this theme —
  not just *a* workable scenario?
- Is the protagonist memorable and believable?
- Is the central conflict interesting and meaningful, not merely present?
- Does the story have genuine narrative potential — somewhere real to go?
- Would a different story communicate this theme significantly better?
- Is this a story worth polishing?

**Gate**: If the honest answer to "is this a story worth polishing" is no —
stop. Do not proceed to Phase 1. Recommend redesigning the story concept
before any story-level or sentence-level editing begins. A concept that fails
here is a concept problem, not a writing problem, and no amount of downstream
editing fixes it.

---

## Phase 1 — Story & Content Integrity Review

**Scope**: the core passage's prose (the Foundation-level story, shared by
both levels), read as a complete narrative. Once the core passage passes,
apply a narrower version of this same review to the Advanced-level extension
paragraph on its own — does it deepen the same story coherently, or does it
feel appended to hit a length or vocabulary target.

**Reviewer stance**: a story editor. Grammar, word choice, and sentence
quality are still irrelevant here — a clumsy sentence carrying a sound story
is a Phase 3 problem; a clean sentence carrying a broken story is a Phase 1
problem, and the more expensive one to miss.

**Evaluation questions**:
- Is the protagonist earned — do we know enough about who they are, what they
  want, and why they're capable of what the story asks of them? (The exact
  Theme 3 failure: insufficient background, motivation, and ability.)
- Is the causal chain complete — does each event follow believably from the
  last, or does the reader have to fill in a logical gap the text never
  states?
- Does the story actually engage the theme's Essential Questions
  (`docs/CURRICULUM_MAP.md`), or only gesture at the topic?
- Is the takeaway sentence earned by the events, or bolted on as a moral the
  story never dramatizes?
- Would this survive as a short story on its own merits, read by someone with
  no interest in language teaching? (This is the existing standard in
  `docs/READING_WRITING_ARCHITECTURE.md` §9 — "real narrative stakes, never a
  vocabulary-delivery vehicle" — enforced concretely here.)

**Diagnostic to watch for**: if the story feels contorted specifically to fit
the required vocabulary list, the problem may not be the prose at all — it
may mean the vocabulary selection itself doesn't suit this theme's strongest
story. That is a rollback further upstream than a rewrite, and should be
flagged as a vocabulary-curriculum question, not silently patched at the
story level.

**Gate**: Pass, or Rework. On Rework, stop — replot or rewrite the passage
(or, if the diagnostic above applies, escalate back to a vocabulary-selection
question), then re-run Phase 1 on the revision before continuing. Nothing
downstream is touched until this passes.

---

## Phase 2 — Pedagogical Architecture Review

**Scope**: the whole theme unit built on top of the now-approved
passage — Vocabulary, Notice Language, Mission Check, Writing prompt, AI Help
framing, AI Talk opener.

**Reviewer stance**: a curriculum designer checking that everything
downstream is genuinely derived from *this specific* passage, not generic
scaffolding that would fit any passage.

**Evaluation questions**:
- Does the required vocabulary (Foundation and Advanced) appear naturally in
  the passage, not forced? Do spiral-reinforcement words genuinely reappear
  in a meaningfully new context, not just a checkbox reuse?
- Do the Notice Language activities selected for this theme actually fit this
  passage's real features, rather than a copy-pasted checklist
  (`docs/READING_WRITING_ARCHITECTURE.md` §5)?
- Do the Mission Check questions test something this passage actually
  supports?
- Does the Writing prompt grow naturally out of this story and stay
  answerable by every student, or does it assume an experience only the
  protagonist had (`docs/EDITORIAL_GUIDELINES.md` Principle 6)?
- Does AI Help's framing respond to what this specific writing prompt is
  actually asking (`docs/EDITORIAL_GUIDELINES.md` Principle 7)?
- Does the AI Talk opener stay strictly within what this passage established
  (`docs/EDITORIAL_GUIDELINES.md` Principle 5)?

### The Integrated Learning Experience Check

Reading, Writing Prompt, AI Help, and AI Talk are not four independent
components — they form **one integrated learning experience**. Evaluate the
chain directly, not only each link's individual alignment to the passage:

- Does the reading passage naturally lead to the writing prompt?
- Does the writing prompt naturally lead into AI Help?
- Does AI Help actually help the student answer *this specific* writing
  prompt, not a generic or assumed one?
- Does AI Talk naturally continue the discussion the reading and writing
  began?

A theme can pass every individual check above and still fail this one: each
component can be technically correct on its own while the chain as a whole
doesn't flow as one continuous experience. **If any link feels disconnected,
treat it as a design problem to be solved here, in Phase 2 — never a
sentence-level problem to be patched in Phase 3.**

**Gate**: Pass, or Rework — rebuilding the specific misaligned or
disconnected piece where patching would not produce a genuinely coherent
chain. This usually does not send the theme back to Phase 1 — unless the
misalignment reveals that the passage itself cannot actually support the
pedagogy it's supposed to, in which case it does.

---

## Phase 3 — Line Edit (Sentence-Level Review)

**Scope**: every piece of English text in the theme — passage, vocabulary
examples, Notice Language text, Mission Check questions, writing prompts, AI
Help copy, AI Talk openers.

**Reviewer stance**: a native-speaker line editor. This is where
`docs/EDITORIAL_GUIDELINES.md` is applied directly, principle by principle
(pronoun clarity, omitted objects, authentic collocations, target-word
survival, AI Talk factual grounding, writing-prompt accessibility, AI Help
task-relevance, cross-material consistency).

**Gate**: Every applicable principle in `docs/EDITORIAL_GUIDELINES.md` is
satisfied. If a genuinely new class of sentence-level problem is found that
the guidelines don't yet cover, add a new principle there the same inductive
way the existing eight were derived — this document does not duplicate that
list, only invokes it.

---

## Phase 4 — Cross-Activity Consistency Recheck

**Scope**: the whole theme again, read end-to-end — Vocabulary → Reading →
Notice Language → Mission Check → Writing → AI Talk — specifically hunting
for damage introduced by Phase 3's edits.

**Reviewer stance**: a copy editor doing a final consistency pass, not a
first-time reader yet.

**Evaluation questions**:
- Did any correction accidentally remove a target word from its own example
  sentence (`docs/EDITORIAL_GUIDELINES.md` Principle 4)?
- Does the passage still agree with its own paraphrase, vocabulary
  `themeNote`s, and Mission Check phrasing after editing (Principle 8)?
- Does AI Talk's opener still accurately reflect the passage as it now
  reads, if the passage changed during Phase 1 or Phase 3?

**Gate**: No inconsistency remains between any two pieces of the theme's
material. Any inconsistency found sends only the affected piece back through
Phase 3 — not the whole theme back to Phase 1.

---

## Phase 5 — Fresh-Eyes Final Read & Publication Sign-off

**Scope**: the complete theme, read once more as a first-time student would
experience it — ideally with some distance from the editing work itself.

**Reviewer stance**: the target reader — an incoming Hokusei student
encountering this theme for the first time — not an editor looking for
problems.

**Evaluation question**: is this something we are proud to publish, not
merely something with no remaining flagged issues. This is the gut check
referenced by the standing quality bar: *"I would rather rewrite a passage
than publish something that is merely acceptable."*

**Gate**: Formal approval. Only Phase 5 marks a theme as ready for
publication — no earlier phase, however clean, constitutes sign-off on its
own.

---

## Summary table

| Phase | Name | Scope | Reviewer stance | Fails toward |
|---|---|---|---|---|
| 0 | Theme Concept Review | Story concept/pitch | Acquisitions editor | Redesign the concept |
| 1 | Story & Content Integrity Review | Core passage + Advanced extension | Story editor | Replot or rewrite the passage |
| 2 | Pedagogical Architecture Review | Whole theme unit | Curriculum designer | Rebuild the misaligned or disconnected piece |
| 3 | Line Edit | Every sentence in the theme | Native-speaker line editor | Apply `docs/EDITORIAL_GUIDELINES.md` |
| 4 | Cross-Activity Consistency Recheck | Whole theme, post-edit | Copy editor | Send affected piece back to Phase 3 |
| 5 | Fresh-Eyes Final Read & Sign-off | Whole theme | Target student reader | Publication approval |

---

## Notes on institutional memory

`docs/EDITORIAL_GUIDELINES.md` was built inductively — every principle
derived from a real issue actually found, nothing speculative. Phases 0
through 2 of this workflow should be held to the same discipline: as genuine
concept- and story-level issues are found (starting with the Theme 3
protagonist and concept problems that motivated this document), they are
worth recording the same way, in a companion document to
`docs/EDITORIAL_GUIDELINES.md` scoped to concept and narrative integrity
rather than sentence quality. That document does not yet exist; it should be
created once this workflow has surfaced enough real findings to populate it
honestly, not written speculatively in advance.

---

## Out of scope for this document

This document governs process and sequencing only:

- It does not contain sentence-level editorial principles (`docs/EDITORIAL_GUIDELINES.md`).
- It does not define curriculum content, themes, or vocabulary (`docs/CURRICULUM_MAP.md`, `docs/VOCABULARY_PHILOSOPHY.md`, `docs/VOCABULARY_ARCHITECTURE.md`).
- It does not define production shape — passage length, question counts, writing-task targets (`docs/READING_WRITING_ARCHITECTURE.md`).
- It does not cover software, UI, or implementation in any form.
