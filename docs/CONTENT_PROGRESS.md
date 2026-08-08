# Pre-Entrance Theme Platform
## Content Progress Tracker

This document tracks the development status of every theme's content through the fixed production order: **Vocabulary → Reading & Writing → AI Talk**.

The canonical list of themes is defined in `docs/CURRICULUM_MAP.md` — this document only tracks production status against that list. It does not redefine, add, or remove themes.

**Status legend**: ✅ Complete (frozen) · 🔶 In Progress · ⬜ Not Started

**Curriculum**: ✅ Complete — `docs/CURRICULUM_MAP.md`

**Architecture note (2026-08-09)**: the table below uses the current two-level architecture (Foundation / Advanced) — see `docs/CURRICULUM_MAP.md` and `docs/VOCABULARY_ARCHITECTURE.md` for the two-level model. It previously used a three-level Foundation/Standard/Challenge schema; that schema is obsolete and has been retired from this table.

**What "✅ Complete" means for a Vocabulary column** (Foundation / Advanced) — a theme's vocabulary at that level is marked Complete only when all of the following are true:

- Word count falls within the tolerance range for that level (`docs/VOCABULARY_ARCHITECTURE.md` §5: Foundation 8–12, Advanced 6–10 new words).
- Every word has been checked against the four selection questions in `docs/VOCABULARY_PHILOSOPHY.md` §4.
- Words are organized into theme-specific lexical sets, not a flat list (`docs/VOCABULARY_PHILOSOPHY.md` §7).
- Every entry follows the standard structure in `docs/VOCABULARY_ARCHITECTURE.md` §7.
- Reinforcement of words already introduced in earlier themes has been considered and included wherever it naturally applies (`docs/VOCABULARY_ARCHITECTURE.md` §4) — active starting Theme 2, per `docs/VOCABULARY_PHILOSOPHY.md` §3/§5.

This does **not** require that later themes' reinforcement of this theme's new words already be planned — that is each later theme's own responsibility when it is built, not a precondition for marking the current theme done.

---

| Theme | Foundation Vocabulary | Advanced Vocabulary | Foundation Reading & Writing | Advanced Reading & Writing | AI Talk |
|---|---|---|---|---|---|
| 1. Knowing Myself | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2. What Does It Mean to Be a University Student? | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3. Designing My Future | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 4. Living Together | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 5. Facts or Fake? | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 6. Peace and War | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 7. Caring for Our Planet | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 8. Living with AI | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 9. Learning from History | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| 10. Science in Everyday Life | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

**Theme 1 (Knowing Myself) — ✅ Complete, approved and frozen.** Rebuilt from scratch under the concept-first redevelopment workflow (see `docs/CURRICULUM_MAP.md` history), not the old vocabulary-first order this document originally described. Full Foundation + Advanced vocabulary, reading passages, writing tasks, and AI Talk openers are implemented and live. This is the platform's reference implementation for architecture, UI, and interaction patterns — see `docs/THEME_EXPERIENCE_TEMPLATE.md`'s status block.

**Theme 2 (What Does It Mean to Be a University Student?) — ✅ Complete, approved and frozen 2026-08-09.** Manuscript frozen in `docs/THEME_02_MANUSCRIPT.md`; full Foundation + Advanced vocabulary (with spiral reinforcement from Theme 1), reading passages, writing tasks, and AI Talk openers implemented and live. This is the platform's reference implementation for how a theme's *content* should be structured — see `docs/THEME_EXPERIENCE_TEMPLATE.md`'s status block. The old `docs/THEME_02_READING_WRITING.md` and `docs/THEME_02_VOCABULARY.md` are superseded pre-redevelopment drafts, kept only as historical reference.

**Themes 3–10**: not yet started. Old per-theme planning docs (`docs/THEME_03_*.md` through `THEME_10_*.md`, if present) predate the concept-first redevelopment workflow and the two-level architecture — treat them as reference material only, not a baseline to revise, per the full-rebuild-not-revision policy each theme follows when its turn comes.

**Next step**: Theme 3 (Designing My Future) is the next active development target. Per the standing policy in `docs/THEME_EXPERIENCE_TEMPLATE.md`, no platform/architecture work is expected — only new educational content, authored through the same manuscript-first process used for Theme 2.
