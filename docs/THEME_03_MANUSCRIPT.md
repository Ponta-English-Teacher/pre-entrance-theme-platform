# Theme 3 — Designing My Future — Manuscript

Status: **Frozen.** Educational Goal, Essential Question, Foundation Reading Passage, Advanced Reading Passage, and vocabulary approved 2026-08-09, as the author's canonical manuscript for Theme 3 — superseding all earlier drafts of this theme. This holds the same status Theme 1's and Theme 2's manuscripts hold — see `docs/THEME_02_MANUSCRIPT.md` for precedent. Implementation (Vocabulary, Reading, Writing, AI Talk) is derived from this document; do not rewrite the manuscript itself as part of implementation work.

**Update (2026-08-09): the full Theme 3 implementation — not just this manuscript — is now approved and frozen**, the platform's third reference implementation (the content template — see `docs/THEME_EXPERIENCE_TEMPLATE.md`'s status block and `docs/CONTENT_PROGRESS.md`). Do not redesign or modify Theme 3 in future work unless explicitly requested.

The educational focus is deliberately **not** career-choice advice — it is helping students understand that designing a future begins with understanding oneself, and that self-understanding develops gradually through ordinary experience rather than through a single correct decision about a destination.

---

## Educational Goal

Help students understand that designing a future is not primarily about choosing a career. It begins with understanding oneself. People gradually discover themselves through experience, by recognizing their preferences, tendencies, strengths, potential, and even what does not suit them. Designing a future is therefore an ongoing process of self-understanding rather than searching for one perfect answer.

## Essential Question

Is designing a future mainly about choosing a destination, or about understanding yourself?

---

## Foundation Vocabulary (8 words)

discover, preference, tendency, potential, reveal, suit, pursue, continuous

All eight appear directly in the Foundation passage (including natural inflections — "discovering," "noticed," "choosing" as forms of the underlying words).

## Advanced Vocabulary (8 words)

construct, competence, assumption, anxiety, purpose, passion, predetermined, interaction

Five of the eight appear directly in the passage (competence, passion, predetermined, interaction) or via a same-family form (assumption ← "assumes"). Three — **construct**, **anxiety**, **purpose** — do not appear verbatim (the passage uses "shaped," "worry," and career/life/destination language instead), but were deliberately kept per the author's explicit instruction: target vocabulary should represent the manuscript's educational concepts, not merely its literal wording. Their example sentences use the passage's own ideas naturally rather than quoting text that doesn't exist.

**interaction** is a deliberate spiral reinforcement from Theme 1 Advanced (`km-s-05`, "the interaction of nature and nurture"), implemented as its own separate entry (`df-s-08`) with Theme 3-specific examples and themeNote — the same pattern Theme 2 used for "challenge" and "develop" reinforcing Theme 1 Foundation words.

---

## Foundation Reading Passage (196 words)

Many people think that designing a future begins by deciding what they want to become. This idea seems reasonable because having a clear destination makes decisions easier. However, there may be another way to think about the future. Before deciding where we want to go, we may first need to understand ourselves.

Self-understanding rarely appears all at once. It develops gradually through experience. A new subject may reveal a preference. Working with other people may reveal a tendency. A difficult task may reveal a strength or a potential that had never been noticed before. These experiences help us understand not only what we enjoy, but also how we naturally respond to different situations.

Experience also teaches us what does not suit us. Many people see changing direction as a failure, but it can also be a form of learning. Knowing what to leave behind is just as important as knowing what to pursue. Both help us understand ourselves more clearly.

Designing a future, therefore, is not simply choosing a destination. It is a continuous process of discovering who we are. As our understanding of ourselves grows, decisions about the future become more thoughtful and more meaningful.

---

## Advanced Reading Passage (385 words)

People often believe that designing a future begins with making an important decision. Questions such as "What career should I choose?" or "What kind of life do I want to live?" seem to come first. This way of thinking assumes that the destination already exists, waiting to be identified, and that success depends on finding the correct answer as early as possible. As a result, many young people worry that they are falling behind if they cannot see a clear direction.

There is another way to understand the same process. Instead of asking people to discover a future that already exists, it suggests that a future is gradually shaped through experience. People rarely understand themselves completely before they begin to act. Rather, action itself becomes the source of self-understanding. New experiences reveal abilities that had never been tested. Difficult situations expose strengths and weaknesses that could not have been predicted. Even an experience that seems disappointing at the time may later become valuable because it changes the way a person understands both themselves and the world.

This perspective also changes the meaning of career development. A career is often imagined as a sequence of correct decisions leading toward a predetermined destination. In reality, however, careers are usually developed through continuous adjustment. Opportunities appear unexpectedly. Interests change. New skills are acquired. People often discover that work they never considered eventually becomes meaningful because they have developed competence through sustained effort. In many cases, enjoyment does not come before effort. Instead, effort leads to competence, and competence gradually produces satisfaction. What people later describe as a passion may therefore be the result of long-term engagement rather than its starting point.

None of this means that people should ignore their preferences or natural tendencies. On the contrary, understanding ourselves remains essential. However, self-understanding should not be treated as a single discovery that solves every future decision. It develops continuously through the interaction between our personal characteristics and the experiences we accumulate throughout life.

Designing a future, therefore, is not simply a matter of choosing the correct destination. It is a lifelong process of understanding ourselves more deeply while continuing to learn from experience. The destination is important, but it is not the beginning. A clearer understanding of ourselves is what gradually allows the destination itself to become clearer.

---

## Why Advanced isn't just "Foundation with harder words"

Foundation stays concrete and personal — a new subject, working with others, a difficult task, and the everyday self-understanding they reveal. Advanced takes a genuinely different angle: it reframes career development itself, arguing that a career is not a sequence of correct decisions toward a predetermined destination but something built through continuous adjustment — the same way Theme 1 Advanced took a different angle (nature vs. nurture) and Theme 2 Advanced took a different angle (externally-imposed structure vs. self-generated structure) rather than restating Foundation's message in harder vocabulary.

## Revision history

1. First full manuscript and vocabulary (frozen 2026-08-09): six key ideas — designing a future is not knowing in advance; the anxiety of not already knowing; gradual self-discovery; preferences/tendencies/strengths/potential as things revealed rather than sought; choosing against something as equally valuable as choosing for it; the Effort → Competence → Enjoyment reversal.
2. Advanced vocabulary reconsidered: "sustainable" and a reinforced "reflect" replaced with "purpose" and "passion," both more central to the passage's own argument.
3. Author supplied a complete rewrite of both passages, shifting the frame from "discovery vs. construction of a future" to "choosing a destination vs. understanding yourself," and reframing Advanced around career development specifically. Editorial pass proposed (raised abstraction, removed absolute statements and anecdotal framing) but not adopted — the author's own rewritten text is what was implemented.
4. Author supplied final Foundation and Advanced vocabulary against the new passages: discover/preference/tendency/potential/reveal/suit/pursue/continuous (Foundation) and construct/competence/assumption/anxiety/purpose/passion/predetermined/interaction (Advanced). Three Advanced words (construct, anxiety, purpose) do not appear verbatim in the new passage; kept per the author's explicit ruling that vocabulary should track the manuscript's educational concepts, not its literal wording — see the Advanced Vocabulary section above.
5. Full implementation against this manuscript: `masterVocabulary.ts`, `themeVocabSets.ts` (unchanged — same 16 ids), both reading lessons (Foundation 4 paragraphs, Advanced 5 paragraphs), Mission Check, Writing, and AI Talk openers rebuilt to match. Verified: `tsc --noEmit` clean, all vocabulary ids cross-referenced correctly, zero console/page/server errors across all 9 Theme 3 routes (Playwright smoke test).
