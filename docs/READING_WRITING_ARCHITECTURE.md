# Reading & Writing Architecture

Status: **Frozen — the permanent production framework for all ten themes.** Do not redesign unless a significant practical problem is discovered during implementation.

Revised 2026-08-05 to reflect the approved two-level curriculum architecture (Foundation / Advanced — the earlier three-level Foundation/Standard/Challenge model is obsolete). This revision replaces §2, §3, §4, §6, and §8 below with the two-level shape; it does not change any approved manuscript.

This document governs *how long, how many, and what shape* Reading & Writing materials take, mirroring the relationship between `docs/VOCABULARY_PHILOSOPHY.md` and `docs/VOCABULARY_ARCHITECTURE.md`. `docs/READING_WRITING_EXPERIENCE_DESIGN.md` governs the student-facing UX and instructional philosophy (the Mission → Reading → Notice Language → Think → Write → Improve → Reflect → Continue flow, Ask AI's context-aware tutor role, writing-feedback philosophy, completion criteria); this document governs the production blueprint content writers follow for every theme.

---

## 1. Purpose

Reading & Writing is the bridge between Vocabulary (isolated words and meanings) and AI Talk (spontaneous conversational use). It is where a student first meets each theme's target vocabulary in authentic, connected context, notices how that language actually works, practices comprehension at increasing cognitive depth, and produces original language using that vocabulary — moving from "study" to "practiced use" before AI Talk asks for "spontaneous use."

## 2. Passage structure

**Two levels — Foundation and Advanced — each with its own complete, standalone passage.** Advanced is not an extension paragraph appended to Foundation's passage, and the two levels do not share passage text. Target learners are one population (Eiken Grade 2 baseline) choosing a difficulty level per theme, not two groups of different raw reading ability (`docs/PROJECT_VISION.md`: levels are "difficulty choices, not ability labels") — but for Reading specifically, that difficulty choice is expressed as two separate manuscripts, not a shared core with bolted-on extensions.

Advanced explores the **same broad theme** as Foundation, but through:
- a **new essential question** that reopens or deepens what Foundation concluded, rather than restating it in harder words;
- **richer, more natural vocabulary and sentence variety**, appropriate to CEFR B1–B2;
- **deeper thinking** — more inference, comparison of competing ideas, and interpretation, not just more difficult recall.

**Worked example — Theme 1, Knowing Myself:**
- Foundation: *"Will Personality Change Over Time?"* — personality is built gradually through experience.
- Advanced: *"Nature or Nurture? Is personality mainly the product of nature or nurture?"* — a genuinely different question that takes the "nature" side seriously as a real counterweight, before arriving at a more sophisticated interaction-based conclusion. It does not simply reword Foundation's passage.

## 3. Passage length

| Level | Length |
|---|---|
| Foundation | 180–220 words |
| Advanced | 500–650 words |

Foundation's range is unchanged. Advanced's range reflects the approved Theme 1 precedent (`docs/THEME_01_ADVANCED_READING_PASSAGE.md`, 611 words) — a genuinely longer, richer standalone piece, not an incremental extension of Foundation's passage. Reading still exists to support vocabulary learning and connected thinking, not to become an extensive-reading course; even at Advanced length, students should be willing to reread the passage multiple times.

## 4. Comprehension questions

| Level | Count | Types |
|---|---|---|
| Foundation | 3 | 2 literal comprehension, 1 vocabulary-in-context |
| Advanced | 3 | 1 main-idea/inference (synthesized across paragraphs, not literally quotable), 1 supporting-evidence task designed to require comparing competing evidence, 1 vocabulary-in-context |

Both levels use the same three-task Mission Check shape (main question + supporting-evidence selection + vocabulary-in-context) — the progression in cognitive demand comes from how each task is *written*, not from adding more of them. At Advanced, per the approved Theme 1 pattern:
- the main question should require inference and synthesis (e.g. asking what the passage's overall stance is, when that stance is never stated as one quotable sentence), including a distractor that reflects a plausible misreading of the evidence;
- the supporting-evidence options should be drawn from more than one side of the passage's argument, so that answering correctly requires genuinely comparing competing evidence, not just locating a matching quote;
- the vocabulary-in-context task should focus on one of that level's official target words, ideally one whose meaning could plausibly be misread out of context.

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

As a loose tendency, not a rule: simpler noticing tasks (target vocabulary, recycled vocabulary) suit Foundation more often; structural and rhetorical noticing (main idea, tone/purpose, paragraph organization) suit Advanced more often. The passage itself, not the level alone, should decide the selection. Non-gating — like the pre-reading survey, it supports the activity but is never a completion requirement.

## 6. Writing task progression

| Level | Task | Length |
|---|---|---|
| Foundation | Answer a question | 2–3 sentences |
| Advanced | Explain your opinion | 80–120 words |

The progression is **Answer → Explain** — a change in cognitive demand, not simply length. Kept proportionate to Reading & Writing's purpose: supporting vocabulary use, not becoming a standalone writing course. (Advanced's task and length carry forward the old "Standard" tier's spec, consistent with Advanced being that tier renamed rather than a merge with the deleted Challenge tier — see the two-level migration precedent already applied to AI Talk's turn targets and tone.) This row is forward guidance for when a given theme's Advanced Writing task is actually authored — Theme 1 Advanced's has not been written yet.

Writing tasks present that level's own target vocabulary as a writing resource rather than a checklist. Students should use whichever words naturally help them express their ideas. Natural communication is the goal, not vocabulary coverage.

## 7. Vocabulary recycling

Each theme's finalized `docs/THEME_XX_VOCABULARY.md` already specifies which words are spiral reinforcements and from which theme. The passage-writing step for each theme treats that list as a requirement: those specific words must appear naturally in the passage at their assigned level — not arbitrary old vocabulary, but exactly the words already committed to in that theme's finalized plan.

## 8. AI usage without dependency

Support visibility decreases as level increases, mirroring `docs/AI_TALK_ACTIVITY_DESIGN.md` §2: Foundation shows Ask AI prominently (open by default); Advanced has it available but collapsed by default. Comprehension and writing prompts stay answerable through genuine reading and thinking first; AI is a support for when a student is stuck, never a required first step. Writing feedback praises before correcting and invites revision rather than supplying corrected text outright (per `docs/READING_WRITING_EXPERIENCE_DESIGN.md`).

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
