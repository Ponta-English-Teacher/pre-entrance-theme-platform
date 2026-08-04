# Vocabulary Philosophy

Status: **Approved design specification.** This document governs all future vocabulary development for the Pre-Entrance Theme Platform, for any person or AI assistant working on the project. The canonical theme list is `docs/CURRICULUM_MAP.md`; production status is tracked in `docs/CONTENT_PROGRESS.md`. This document defines *how* vocabulary is chosen and organized — it does not itself list words.

## 1. Purpose

Vocabulary is the foundation of this curriculum, not one activity among three equals. It is developed first — before a single Reading & Writing passage or AI Talk conversation is built — because both of those activities depend on a stable, already-decided set of words to reinforce. Building them first would mean each one inventing its own vocabulary ad hoc, with no shared backbone between activities or themes — exactly the kind of drift this project has already suffered from and is now working to eliminate. The fixed development order (Vocabulary → Reading & Writing → AI Talk, per `docs/CONTENT_PROGRESS.md`) exists specifically so that Reading & Writing and AI Talk are built *to serve* a completed vocabulary curriculum, never the reverse.

## 2. Curriculum Philosophy

This project is not producing ten independent vocabulary lists, one per theme. It is producing **one coherent vocabulary curriculum**, and the ten themes in `docs/CURRICULUM_MAP.md` are the ten places that single curriculum is encountered, not ten separate starting points.

Every theme introduces some genuinely new vocabulary suited to its own subject, while also reinforcing vocabulary already introduced in earlier themes. A word's *home theme* is the first place it is formally introduced; every later theme where it naturally recurs is reinforcement, not a duplicate introduction. When developing any single theme's vocabulary, the entire curriculum must be considered first — never that theme in isolation.

## 3. Progression

Three levels, treated as **one continuous progression across the entire curriculum**, not three separate ceilings repeated per theme.

**Foundation does not mean "easy."** It is not the simplest words that fit a theme, and it is not defined by whether a word can be said naturally in casual conversation. Foundation vocabulary is the set of indispensable concepts students need to understand the theme — chosen for conceptual necessity, not for ease of production.

Our target learners are admitted university students, with approximately Eiken Grade 2 ability. Their receptive vocabulary — what they can understand in reading and listening — is considerably larger than their productive vocabulary — what they can readily produce themselves in speech or writing. Foundation vocabulary may therefore include words students are expected primarily to *recognize* in reading and listening, not necessarily produce fluently in conversation. Whether a word is indispensable to the theme matters more than whether a student would naturally say it about themselves.

**Reading Only** should contain words already assumed to be familiar to this population — even when they are central to the topic (e.g. *hope, safe, study, exam, friend*). Thematic centrality alone is never a reason to promote an already-known word into target vocabulary.

- **Foundation** — the indispensable concepts for the theme.
- **Standard** — extends naturally toward more sophisticated discussion of the theme, approximately CEFR B1.
- **Challenge** — approaches CEFR B2, encouraging reflection and abstraction.

A student progressing through the same level from Theme 1 to Theme 10 should feel one gradual, coherent climb in vocabulary sophistication — not ten independent bands that each reset to the same starting point. Because the curriculum accumulates, the same named level is allowed to feel slightly more demanding by Theme 10 than it did at Theme 1.

**Scope of this clarification**: this corrected understanding of Foundation applies going forward, beginning with Theme 6, the same way the multi-theme spiral principle in §5 was scoped to begin with Theme 2. Themes 1–5 are frozen and are not reinterpreted retroactively — they represent the design decisions made at that stage of the project.

## 4. Vocabulary Selection Principles

Every candidate word, for every theme and every level, must be checked against these four questions before it is included:

1. **Is it essential?** — Not merely interesting or thematically decorative, but genuinely needed to express the ideas this theme is about.
2. **Does it naturally belong to this theme?** — It should arise from the theme's actual subject matter, not be forced in to fill a quota.
3. **Has it already appeared elsewhere in the curriculum?** — If so, prefer reinforcing the existing word in this theme's new context over introducing a near-synonym as if it were new.
4. **Will students actually use it in Reading & Writing and AI Talk?** — A word that only looks good on a list, but has no natural place in a passage a student reads or a conversation a student has, fails this test regardless of how thematically appropriate it seems.

A word earns its place in the curriculum because it helps a student communicate a meaningful idea — never simply because it fits the topic.

## 5. Spiral Vocabulary Development

One of the core principles of this curriculum is spiral vocabulary development.

Vocabulary is not expected to appear in only one theme. Instead, important words should naturally recur across multiple themes in different contexts.

For each important vocabulary item, consider two questions:

1. In which theme should this word first become target vocabulary?
2. In which later themes should this word naturally reappear to reinforce and deepen understanding?

The first question determines the word's introduction point (Foundation, Standard, or Challenge). The second question helps maintain a coherent curriculum across all themes.

When a word is reinforced in a later theme, it should normally appear at the same level or a higher level than its original introduction — not at a lower level. Reinforcement deepens a word's use; it should not appear to reset its difficulty.

Do not reject a vocabulary item simply because it also fits another theme. Recurring vocabulary is an intentional design feature, not a weakness.

Because this platform includes an AI Tutor, repeated encounters with important vocabulary are pedagogically valuable. The AI Tutor can help students connect previous learning with new contexts, allowing vocabulary knowledge to deepen over time rather than treating each word as something learned only once.

This principle applies to future curriculum development beginning with Theme 2. Theme 1 remains frozen as our reference implementation and will not be revised retroactively.

## 6. Spiral Learning

Vocabulary must be **intentionally recycled**, not merely reused when convenient. Later themes should actively bring back earlier words in new, richer contexts, rather than treating every theme as a fresh opportunity to introduce entirely new vocabulary.

Retention — a word genuinely staying with a student over time — is a stronger measure of success than the total number of distinct words the curriculum contains. When choosing between introducing a new word and reinforcing an existing one in a new context, **prefer reinforcement**.

## 7. Lexical Sets

Vocabulary should be organized into meaningful semantic groups — lexical sets — never as a single flat, unordered word list. **Lexical sets are decided individually for each theme, based on that theme's own subject matter — there is no fixed, universal set of categories reused across all ten themes.** For example, Theme 1 (Knowing Myself) is not one undifferentiated list of ten words; it is organized into sets such as:

- Identity
- Personality
- Interests
- Goals

These four categories belong to Theme 1 specifically. A different theme will reasonably define an entirely different set of categories suited to its own content — see `docs/VOCABULARY_ARCHITECTURE.md` §6.

Grouping by meaning, rather than alphabetically or by part of speech, helps students form the mental connections that actually support retention, and lets later themes clearly identify which lexical set a reinforced word belongs to when it resurfaces.

## 8. Relationship to Other Activities

- **Vocabulary supports Reading & Writing** — every passage is written so its target vocabulary appears naturally within the text, and its writing task genuinely invites students to use those words themselves.
- **Reading & Writing reinforce Vocabulary** — encountering a target word in real context, then producing it in the student's own writing, is what turns a memorized word into a usable one.
- **AI Talk provides the further reinforcement** — it lets students use the same theme's vocabulary in a live, natural conversation, the most demanding and most valuable form of retention practice.

Together, these three activities form **one integrated learning cycle** built around a shared vocabulary core. No activity introduces its own vocabulary independently of this curriculum.

## 9. Long-Term Goal

The objective of this vocabulary curriculum is **not** to maximize the number of words students are exposed to. The objective is to build a coherent lexical curriculum that students remember, reuse, and apply with genuine confidence — across themes, across levels, and across all three learning activities.
