# Vocabulary Architecture

Status: **Approved blueprint.** This document describes the structural shape of the vocabulary curriculum — sizes, distribution, growth, reinforcement, and entry format. It governs *how much* and *in what shape*; `docs/VOCABULARY_PHILOSOPHY.md` governs *why* and *by what criteria*. Both sit beneath `docs/CURRICULUM_MAP.md` (the theme list) and are tracked against `docs/CONTENT_PROGRESS.md`.

---

# 1. Overall Goals

Recommended cumulative mastery targets, counted across the **whole curriculum** (all 10 themes together), not per theme:

| Level | Cumulative target vocabulary |
|---|---|
| End of Foundation | **≈100 words** |
| End of Advanced | **≈180 words** (100 carried over + 80 new) |

**Justification**

These are the platform's own deliberately curated core vocabulary — not a claim about a student's total English vocabulary, which is already far larger from years of prior school English before this platform is ever opened. The goal here is a small, high-priority set of indispensable concepts, not a claim to deliver broad vocabulary coverage. Per `docs/VOCABULARY_PHILOSOPHY.md` §3, "mastery" here doesn't mean every word is produced fluently — some Foundation words are meant to be recognized in reading and listening rather than actively produced, since target learners' receptive vocabulary already exceeds their productive vocabulary.

`docs/VOCABULARY_PHILOSOPHY.md` §9 is explicit that the objective is retention, not word count. A compact ~100-word Foundation core, fully reinforced through ten themes, produces more usable English than a list ten times the size seen once per theme and forgotten. This also matches realistic scope for a supplementary pre-entrance program (roughly a semester's worth of study), not an immersion course.

The step size shrinks from Foundation to Advanced (100 → +80): growth at the higher level should come increasingly from deepening the use of *already-known* words — collocations, register, nuance — rather than from raw new-word volume. This directly reflects the "prefer reinforcement" principle in `docs/VOCABULARY_PHILOSOPHY.md` §6.

---

# 2. Distribution

Recommended **new** words introduced per theme, per level:

| Level | New words per theme (target) | × 10 themes |
|---|---|---|
| Foundation | ~10 | 100 |
| Advanced | ~8 | 80 |

Theme 1 (Knowing Myself) currently has 8 Foundation / 8 Advanced words in `src/data/vocabulary/themeVocabSets.ts` — both within this section's tolerance ranges (§5), though Foundation sits slightly under the ~10 target. This document recommends the ~10/~8 shape as the target to plan toward for the remaining themes, not a claim that every theme (including Theme 1) hits it exactly.

Note that "new words per theme" and "words a student encounters in that theme" are not the same number — a theme's Reading & Writing and AI Talk material will also naturally re-surface reinforced words from earlier themes (see §4). The counts above are only the *newly introduced* items counted toward the cumulative totals in §1.

---

# 3. Vocabulary Growth

Vocabulary accumulates across the curriculum; no theme restarts from zero. Each theme adds its new words on top of everything already introduced, and earlier words remain part of the "known" set students are expected to keep using.

Expected cumulative progression (Foundation shown; Advanced accumulates the same way on top of it):

| Theme | New (Foundation) | Cumulative (Foundation) |
|---|---|---|
| 1. Knowing Myself | 10 | 10 |
| 2. What Does It Mean to Be a University Student? | 10 | 20 |
| 3. Designing My Future | 10 | 30 |
| 4. Living Together | 10 | 40 |
| 5. Facts or Fake? | 10 | 50 |
| 6. Peace and War | 10 | 60 |
| 7. Caring for Our Planet | 10 | 70 |
| 8. Living with AI | 10 | 80 |
| 9. Learning from History | 10 | 90 |
| 10. Science in Everyday Life | 10 | 100 |

The same shape applies at Advanced (cumulative total climbs from 100 to 180 across the ten themes, +8 each). By Theme 10, a Foundation-level student has met the full ~100-word core; an Advanced-level student has met the full ~180-word core, built entirely from words introduced no later than the theme in which they first appeared.

---

# 4. Spiral Reinforcement

This is an educational principle to aim for, not a rigid mathematical requirement — reinforcement should shape how vocabulary is planned, but it will not resolve to a clean formula for every word in every theme, especially near the end of the curriculum.

- **Whenever possible**, a newly introduced word should reappear in later themes — ideally at least twice, spaced roughly 2–3 themes apart so retrieval requires genuine recall rather than short-term repetition. Treat this as something to plan toward, not a pass/fail test applied word by word.
- **Near the end of the curriculum, this naturally becomes impossible to satisfy in full** — a word introduced in Theme 9 has only one later theme available to reinforce it, and a word introduced in Theme 10 has none at all. Rather than forcing the rule where it cannot apply, the last two or three themes should lean more heavily toward reinforcing earlier vocabulary and introduce fewer brand-new words — the tolerance ranges in §5 already allow a theme to sit below its average new-word count for exactly this reason.
- Within a theme's Reading & Writing and AI Talk material, aim for a healthy mix rather than a precise ratio — roughly a quarter to a third of the vocabulary encountered being reinforcement of earlier words is a useful sense of scale, not a number to hit exactly. A theme that is entirely new vocabulary, or one with almost nothing new, is worth a second look.
- Reinforcement means genuine re-use in a new context (a different sentence, a different angle on the word), not a bare repeat of the exact example sentence from its home theme.

---

# 5. Theme Balance

The per-theme targets in §2 (10/8 new words) are **averages to plan around, not rigid quotas**. Some themes will naturally support more vocabulary than others — for example, a more concept-dense theme (e.g. Living with AI, Facts or Fake?) may justify a slightly larger new-word set than a more narrative theme (e.g. Knowing Myself).

Recommended tolerance range per theme:

- Foundation: 8–12 new words
- Advanced: 6–10 new words

Individual themes may sit above or below the average, provided the curriculum-wide cumulative totals in §1 stay close to their targets by Theme 10. A theme should never be padded with words that don't satisfy `docs/VOCABULARY_PHILOSOPHY.md` §4's selection questions just to hit an exact per-theme number — theme balance serves the curriculum total, not the reverse.

---

# 6. Lexical Categories

Every theme's vocabulary unit should organize its words into meaningful semantic groups, not one flat list — but this is a **per-theme design decision, not a universal template**. There is no fixed set of categories reused across all ten themes; each theme's lexical sets are chosen individually, based on that theme's own subject matter, exactly as described in `docs/VOCABULARY_PHILOSOPHY.md` §7 (which shows Theme 1's own categories — Identity, Personality, Interests, Goals — as an example specific to that theme, not a pattern the other nine themes must follow).

When a theme's own categories happen to include vocabulary needed to *analyze or argue about* the theme in a sophisticated way — not merely to understand its core concepts — that vocabulary belongs primarily to **Advanced**. This is not a difficulty distinction: per `docs/VOCABULARY_PHILOSOPHY.md` §3, Foundation may include conceptually demanding words students are expected to recognize rather than produce. What stays reserved for Advanced is vocabulary needed to reason and write about the theme analytically, not vocabulary that is merely abstract or academic-sounding.

What matters, regardless of which categories a given theme chooses, is that its words are grouped by meaning rather than left as an unordered list.

---

# 7. Vocabulary Entry Structure

Standard fields for every vocabulary item:

- **Word**
- **Part of Speech**
- **CEFR** (e.g. A2, B1)
- **Japanese Meaning**
- **Core Meaning** (a plain-English definition, distinct from the Japanese gloss)
- **Example Sentence**
- **Related Words**
- **Notes** (why this word matters in this specific theme)

**Compatibility with the current implementation**: the existing `VocabEntry` type (`src/data/vocabulary/masterVocabulary.ts`) already implements most of this structure, under these names — `japanese` → Japanese Meaning, `coreMeaning` → Core Meaning, `examples` → Example Sentence, `relatedWords` → Related Words, `themeNote` → Notes. Two things worth carrying forward that aren't in the list above but already exist and earn their place:

- `collocations` — natural phrase-level patterns, which directly serve the "will students actually use it" selection question.
- `themes: string[]` — a word can belong to more than one theme, which is exactly the mechanism spiral reinforcement (§4) needs: a reinforced word is the *same* entry appearing under a later theme's set, not a duplicate.

The one genuinely new addition this document recommends is an explicit **CEFR** field per word (e.g. `"A2"`), which does not exist in the schema today. Adding it makes the progression described in §1 and §3 verifiable at the level of individual words, not only as aggregate list counts.

---

This document is the blueprint for the vocabulary curriculum. Foundation Vocabulary for Theme 1 should begin only after this document, `docs/VOCABULARY_PHILOSOPHY.md`, and `docs/CURRICULUM_MAP.md` are all in place — which they now are.
