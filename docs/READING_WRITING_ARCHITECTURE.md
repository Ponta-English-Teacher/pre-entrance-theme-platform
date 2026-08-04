# Reading & Writing Architecture

Status: **Frozen — the permanent production framework for all ten themes.** Do not redesign unless a significant practical problem is discovered during implementation.

This document governs *how long, how many, and what shape* Reading & Writing materials take, mirroring the relationship between `docs/VOCABULARY_PHILOSOPHY.md` and `docs/VOCABULARY_ARCHITECTURE.md`. `docs/READING_WRITING_EXPERIENCE_DESIGN.md` governs the student-facing UX and instructional philosophy (the Mission → Reading → Notice Language → Think → Write → Improve → Reflect → Continue flow, Ask AI's context-aware tutor role, writing-feedback philosophy, completion criteria); this document governs the production blueprint content writers follow for every theme.

---

## 1. Purpose

Reading & Writing is the bridge between Vocabulary (isolated words and meanings) and AI Talk (spontaneous conversational use). It is where a student first meets each theme's target vocabulary in authentic, connected context, notices how that language actually works, practices comprehension at increasing cognitive depth, and produces original language using that vocabulary — moving from "study" to "practiced use" before AI Talk asks for "spontaneous use."

## 2. Passage structure

One core passage per theme, shared by all three levels, plus level-specific extensions — not three separate passages. Target learners are one population (Eiken Grade 2 baseline) choosing a difficulty level per theme, not three groups of different raw reading ability (`docs/PROJECT_VISION.md`: levels are "difficulty choices, not ability labels").

Extensions are **cumulative**, not parallel: a Standard reader sees the core passage plus one Standard extension paragraph; a Challenge reader sees everything a Standard reader sees, plus one further Challenge extension paragraph. This deliberately mirrors the vocabulary curriculum's own cumulative structure (Standard = Foundation + Standard words; Challenge = all three).

- **Standard extension**: deepens the same events — a complication, consequence, or secondary detail — carrying that theme's Standard-level vocabulary.
- **Challenge extension**: zooms out from the personal story to the theme's broader essential question (`docs/CURRICULUM_MAP.md`), carrying Challenge-level, more reflective vocabulary.

This produces a natural arc: concrete personal experience (Foundation) → a complication or deeper look at the same experience (Standard) → reflection on what it means more broadly (Challenge).

## 3. Passage length

| Level | Structure | Length |
|---|---|---|
| Foundation | Core passage only | 180–220 words |
| Standard | Core + Standard extension | 250–320 words |
| Challenge | Core + Standard extension + Challenge extension | 350–450 words |

Kept deliberately short: Reading exists to support vocabulary learning, not to become an extensive-reading course. Students should be willing to reread a passage multiple times.

## 4. Comprehension questions

| Level | Count | Types |
|---|---|---|
| Foundation | 3 | 2 literal comprehension, 1 vocabulary-in-context |
| Standard | 4 | 1 literal, 2 inference, 1 vocabulary-in-context |
| Challenge | 4–5 | 1 inference, 2–3 critical thinking (evaluate, agree/disagree, connect to a bigger issue), 1 vocabulary-in-context |

A genuine progression in cognitive demand — understand → infer → evaluate — not simply more questions. The existing Mission Check two-task structure (multiple-choice question + supporting-evidence selection) covers Foundation well and should be extended for Standard/Challenge, not replaced.

## 5. Notice Language

A flexible toolbox, not a fixed sequence. For each theme, select the **2–4 activities that best match that theme's actual passage** — never the same checklist every time. The goal is helping students notice how language works naturally in context, immediately before comprehension questions.

**Toolbox** (draw from freely; not all apply to every theme):
- Find today's target vocabulary.
- Find recycled vocabulary from previous themes.
- Notice useful expressions or collocations.
- Notice an interesting grammar pattern.
- Notice a discourse marker (however, therefore, although, etc.).
- Identify the sentence expressing the main idea.
- Identify reference words (this, they, it, these, etc.).
- Notice paragraph organization.
- Consider the author's tone or purpose.

As a loose tendency, not a rule: simpler noticing tasks (target vocabulary, recycled vocabulary) suit Foundation more often; structural and rhetorical noticing (main idea, tone/purpose, paragraph organization) suit Challenge more often. The passage itself, not the level alone, should decide the selection. Non-gating — like the pre-reading survey, it supports the activity but is never a completion requirement.

## 6. Writing task progression

| Level | Task | Length |
|---|---|---|
| Foundation | Answer a question | 2–3 sentences |
| Standard | Explain your opinion | 80–120 words |
| Challenge | Discuss the issue more critically | 120–180 words |

The progression is **Answer → Explain → Discuss** — a change in cognitive demand, not simply length. Kept proportionate to Reading & Writing's purpose: supporting vocabulary use, not becoming a standalone writing course.

Writing tasks present the theme's Foundation vocabulary as a writing resource rather than a checklist. Students should use whichever words naturally help them express their ideas. Natural communication is the goal, not vocabulary coverage.

## 7. Vocabulary recycling

Each theme's finalized `docs/THEME_XX_VOCABULARY.md` already specifies which words are spiral reinforcements and from which theme. The passage-writing step for each theme treats that list as a requirement: those specific words must appear naturally in the passage at their assigned level — not arbitrary old vocabulary, but exactly the words already committed to in that theme's finalized plan.

## 8. AI usage without dependency

Support visibility decreases as level increases, mirroring `docs/AI_TALK_ACTIVITY_DESIGN.md` §2: Foundation shows Ask AI prominently (open by default), Standard has it available but collapsed by default, Challenge makes it available on request only. Comprehension and writing prompts stay answerable through genuine reading and thinking first; AI is a support for when a student is stuck, never a required first step. Writing feedback praises before correcting and invites revision rather than supplying corrected text outright (per `docs/READING_WRITING_EXPERIENCE_DESIGN.md`).

## 9. Authenticity

Passages read like something a person would actually write — a personal essay or reflective piece with real narrative stakes — never a vocabulary-delivery vehicle with stilted "target word" placement.

## 10. Connection to AI Talk

AI Talk does not begin as an independent conversation — it begins from the reading passage itself. The opener asks about the passage directly, for example:

- Do you agree with the author's opinion?
- What would you do if you were the person in the passage?
- Which idea impressed you most?
- Which part was difficult to understand?
- How does this topic relate to your own experience?

The conversation then expands naturally into the student's own ideas, exactly as `docs/AI_TALK_ACTIVITY_DESIGN.md` already describes for openers ("referencing something concrete the student already engaged with") — this section gives that principle its concrete question shapes.

## 11. The full learning progression

**Vocabulary → Reading → Notice Language → Comprehension → Writing → AI Talk**

Vocabulary is encountered repeatedly across this progression in increasingly personal contexts: studied in isolation (Vocabulary activity), met in authentic context (Reading), noticed in use (Notice Language), tested for understanding (Comprehension), produced by the student (Writing), and finally used spontaneously in conversation grounded in the same passage (AI Talk).

Within the Reading & Writing activity itself, this maps onto the approved chapter-style flow in `docs/READING_WRITING_EXPERIENCE_DESIGN.md`: **Mission → Reading → Notice Language → Think → Write → Improve → Reflect → Continue.**
