# Theme Experience Template

Status: **The official design specification for the platform's learning
experience.** This document describes the platform we intend to build —
every theme, every level, going forward — not merely a record of what Theme
1 happens to contain today. Theme 1 ("Knowing Myself," Foundation) is the
reference implementation used to discover and validate these decisions, and
is cited throughout as a concrete example, but the specification itself is
platform-wide.

No application code was changed to produce this revision — specification
only.

Three status markers are used throughout:

- **Implemented** — exists and works in the live application today.
- **Approved, not yet implemented** — decided, but not yet built or wired in.
- **Future idea** — worth pursuing, not yet formally approved as a
  commitment.

A consolidated view of every item, sorted into these three tiers, is the
final section of this document (§16 — Status & Roadmap). Read that section
before assuming anything described here already exists.

---

## 1. Platform Architecture

```
Theme
├── Foundation
└── Advanced
```

The platform has **two learning levels per theme**, not three. This is a
deliberate simplification from an earlier three-level design
(Foundation / Standard / Challenge) and applies to every theme, current or
future. Nothing in this document should be read as implying a third tier
exists or is planned.

**Why two levels, not three:**

- Level is a **difficulty choice, not an ability label** — a student picks
  the level that fits *this theme* for *them*, independently each time. Two
  well-differentiated choices serve that decision better than three, which
  tends to fragment into marginal differences rather than genuinely distinct
  experiences.
- The real lever between levels is **depth of thinking**, not a ladder of
  raw difficulty (see §2, §7). Two tiers — guided vs. independent — map
  cleanly onto that idea. A third tier does not add a third *kind* of
  thinking; it mostly adds more vocabulary and length, which is exactly the
  outcome this platform is trying to avoid (see the Advanced principle
  below).
- It halves the ongoing authoring burden per theme (one Advanced tier to
  write and maintain instead of two), which matters directly for a
  ten-theme curriculum meant to stay coherent as a whole, not ten
  independent efforts.

**Implemented** (see §16): the codebase's `Level` type, level-selection UI,
routing, and progress tracking now match the two-level architecture above
(`foundation` | `advanced`) — migrated 2026-08-04, including a migration for
any `standard`/`challenge` values already saved in a returning student's
browser storage and legacy URLs containing those level names.

---

## 2. Educational Philosophy

This section is the foundation every other design decision in this document
answers to. When a future design question doesn't have an obvious answer,
it should be resolved by asking which choice these principles imply — not
by precedent or convenience alone.

- **The goal is not simply to teach English.** English is the medium through
  which incoming students are prepared academically, linguistically, and
  personally for university — not the destination itself. A design choice
  that optimizes for language drilling at the expense of genuine thinking or
  engagement is optimizing for the wrong thing.
- **Students should gradually become independent learners.** Every form of
  support this platform offers — AI assistance, Japanese scaffolding,
  sentence starters, toolboxes — should be something a student increasingly
  needs less of over time, not a permanent crutch. Support visibility should
  visibly decrease as level increases (see §7).
- **Every activity has one clear educational purpose.** No activity should
  quietly try to do another activity's job. When two features solve the
  same problem, that's a signal one of them shouldn't exist (see §9, §13 —
  this is exactly how the platform's old six-option "Ask AI" menu was found
  to overlap the Selection Assistant and was retired).
- **AI supports learning but never replaces thinking.** Across every AI
  surface on this platform — the Selection Assistant, the Writing Tutor, AI
  Talk — the AI's job is to scaffold the student's own thinking and
  expression, never to think or write on their behalf. Corrections and
  suggestions are offered as options the student can accept or reject, not
  as silent replacements.
- **Reading develops understanding** — comprehension of both the passage
  and its vocabulary in context, and noticing how the language itself works.
- **Writing develops expression and revision.** The point is not merely
  producing correct English — it's learning to express an idea, receive
  feedback on it, and revise. Revision is treated as real learning, not
  remediation.
- **AI Talk develops conversational fluency and comfort speaking English.**
  Its primary objective is not tutoring students about the reading passage
  — it's helping students become genuinely comfortable having natural
  conversations in English. The theme provides a starting point for
  conversation, not the learning objective itself (§10).
- **Advanced means deeper thinking, not merely harder English.** The same
  core ideas explored with more analysis, evaluation, and independence —
  not simply longer sentences or rarer vocabulary (expanded in §7).
- **Simplified Reading changes language difficulty only, never the ideas.**
  Every idea, every paragraph, and every target word present in the
  Original passage must also survive into the Simplified version. It is
  language support, not a different, easier story.

---

## 3. The Four-Activity Sequence

```
Vocabulary Preview → Reading → Writing → AI Talk
```

This is the platform's standard learning sequence for every theme, replacing
an earlier three-activity model (Vocabulary, a combined Reading & Writing,
and AI Talk). The sequence is a **recommendation the Activity List should
visually communicate**, not a hard lock — no activity is disabled or gated
behind completing the previous one, consistent with the platform's
established "never force" posture. It corrects a specific, real problem
found during Theme 1's review: an activity list that claimed "complete in
any order" while AI Talk's actual content depended on Reading — and now also
Writing — having happened first.

That dependency is about how the conversation *begins*, not what it's
*for* — see §10 for why AI Talk's ongoing purpose is deliberately broader
than the passage it opens from.

## 4. Purpose of Each Activity

| Activity | Purpose |
|---|---|
| **Vocabulary Preview** | Prepares students for Reading by studying today's target words *before* meeting them in context. Remains a full, separate, revisitable activity (dictionary-style study + practice games) — not folded into Reading — because it also serves as ongoing reinforcement a student can return to, not only a one-time pre-reading gate. |
| **Reading** | Where students meet the target vocabulary in authentic context, check their understanding of both the words and the passage, and notice how the language itself works. Ends after Comprehension Check — it does not contain Writing. |
| **Writing** | Where students produce original language connected to the theme, supported by a prominent toolbox, and receive formative feedback with real room to revise. |
| **AI Talk** | Where students build genuine comfort and fluency having natural conversations in English. The reading and writing the student just did give the conversation a reason to begin, but the goal is conversational competence, not comprehension checking — see §10 for the full philosophy. |

---

## 5. Stable Experience Template

### A. Permanent template decisions

These stay identical across every theme and level whenever possible. A
student moving from one theme to another should feel no discontinuity in
*how* the platform works — only in *what* it's about.

- **Card shell**: white background, `rounded-3xl` or `rounded-2xl`, thin
  `border-slate-200`/`border-slate-100`, `shadow-sm`. No large single-color
  section backgrounds in the Writing experience (see the open inconsistency
  noted below).
- **Primary accent**: indigo, used to guide attention (buttons, highlights,
  hover states) — not to identify a section by color.
- **Click-to-insert pattern**: any word, phrase, or sentence starter that
  inserts text into a draft shows a visible hover state, a `focus-visible`
  ring for keyboard users, a brief per-item "✓ Inserted!" confirmation that
  clears itself, a pointer cursor, and a subtle active-press effect.
- **Word Bank card shape**: the example phrase is the visually dominant
  element (serif, 18px, the target word bolded in context); the word and its
  Japanese gloss are a smaller supporting tag beneath it, never the reverse.
- **Discoverability hints**: any non-obvious interaction gets an explicit,
  bilingual, low-key callout near the top of the section it applies to.
- **Comprehension Check's three-task shape** (Understanding / Supporting
  Evidence / Vocabulary in Context): requires a genuine response before
  anything is revealed; wrong answers can be retried without the answer
  being handed over. This is the platform's proven model for real
  interactivity and the reference point for redesigning any section that
  currently reveals its content passively (see §16 — Notice Language).
- **Completion pattern**: each activity's "Complete" button is always
  clickable. If criteria aren't met, an inline note explains exactly what's
  missing — never a silent failure. Completion never depends on whether an
  AI call was made, succeeded, or was read.
- **Server-side TTS only**, via the Selection Assistant (§12).

**One open inconsistency, not yet resolved**: Writing's visual language
(neutral cards, indigo-only accent) was deliberately redesigned this way.
Reading's per-section pastel tints (violet Mission, sky Before You Read,
amber Reading, yellow Notice Language, emerald Comprehension Check) have not
been revisited and still follow the older, multi-color-per-section
convention. These two activities currently look like two different design
systems next to each other — reconciling them is listed in §16, not decided
here.

### B. Theme-specific content

Only these things should ever change between themes: the reading passage(s),
the vocabulary set, the writing prompts/topics, the comprehension questions,
the vocabulary examples, and the AI Talk topics/openers. Nothing about *how*
an activity is structured, styled, or interacted with should vary by theme.

---

## 6. Content Fields That Vary

| Varies by | Fields |
|---|---|
| **Theme** | Educational objective, essential questions, core educational message, reading concept, Foundation vocabulary, Advanced vocabulary, Foundation passage, Advanced passage, Notice Language selections, Vocabulary Check questions, Mission Check tasks, Writing topics (plural — see §9), Writing Toolbox content (starters/word bank/expressions), AI Talk opener(s) and topics |
| **Foundation vs. Advanced** | Vocabulary is cumulative (Advanced = Foundation + additional words, never a reset). **The passage is not cumulative**: each level has its own complete, standalone manuscript. Advanced explores the same broad theme through its own essential question — it does not append an extension paragraph to Foundation's passage, and is not a parallel alternative story either; it is a separate piece of writing that happens to share a theme. Comprehension task *type*, not just difficulty, shifts — see §7. |
| **Original vs. Simplified** | Wording and sentence complexity only. Every idea, every paragraph, and every target word present in Original must also be present in Simplified. |

---

## 7. Foundation vs. Advanced

Both levels share the same architecture — the same four activities, the same
Reading structure, the same Writing structure. Nothing about *which
components exist* changes between levels. What changes is how much guidance
is visible and what kind of thinking each task asks for.

**Foundation:**
- More guidance
- More language support (Japanese offered readily, sentence starters
  prominent)
- Confidence building — tasks that let a student succeed and see progress
- Structured writing — a clearer scaffold, shorter target length
- Simpler language

**Advanced:**
- Less scaffolding — support still available, but on request rather than
  open by default
- Richer ideas — the theme's essential questions engaged more directly, not
  just its surface content
- Authentic language — closer to how a fluent speaker would actually write
  or speak
- More independent writing — more topic choice, less guided structure
- Deeper discussion — see §10 for AI Talk's own Foundation/Advanced
  distinction specifically
- More critical thinking — comprehension and writing tasks ask for
  evaluation, inference, or connecting to a bigger question, not just
  literal understanding

**Advanced is not simply "longer" or "more difficult."** A Foundation and an
Advanced version of the same theme should feel like two genuinely different
depths of engagement with the same idea — not the same task with harder
vocabulary swapped in. Concretely: an Advanced comprehension task should ask
for inference or evaluation where a Foundation task asked for literal
recall; an Advanced writing prompt should invite the student's own
independent stance where a Foundation prompt asked them to narrate an
experience; an Advanced AI Talk conversation should run longer and range
more freely where a Foundation conversation stayed shorter and closer to
modeled expressions (§10).

---

## 8. Required Reading Structure

Standard section order for every theme:

1. Mission
2. Before You Read
3. Original / Simplified (a toggle, not two separate pages)
4. Selection Assistant available throughout (§12)
5. Vocabulary Check — **approved, not yet implemented**; no display slot
   exists in the live Reading component yet.
6. Notice Language — implemented, but still the older passive-reveal
   version (answers shown immediately). Narrowing its scope (dropping
   target-vocabulary duplication with Vocabulary Preview/Check) and
   requiring an active response before revealing anything are both
   **approved, not yet implemented** (§16).
7. Comprehension Check (Mission Check) — implemented and working;
   bilingual support currently covers explainer/hint text only, not full
   bilingual question/option text (**approved, not yet implemented**).

Reading ends here. No Writing, no Review, no Continue screen inside Reading
— those live in Writing (§9).

---

## 9. Writing Experience

**Already implemented:**
- Writing as its own independent activity (own route, own completion
  tracking, separate from Reading's own completion).
- Bilingual instructions (prompt + Japanese translation).
- Draft area (the existing Writing Tutor textarea).
- Writing Toolbox, clearly visible and deliberately prominent — its own
  card, a discoverability hint, example-first Word Bank cards, block-style
  Sentence Starters and Useful Expressions.
- Click-to-insert sentence starters, vocabulary examples, and useful
  expressions.
- AI correction (existing Writing Tutor feedback: corrections, natural
  alternatives, an improved version, offered as options rather than
  replacements).
- The Continue-to-AI-Talk bridge screen.

**Approved, not yet implemented (planned):**
- Multiple writing topics with an explicit topic-selection step — Writing
  currently has one fixed prompt per theme/level.
- An explicit "How can I say this better?" coaching step, distinct from the
  correction pass.
- Explicit accept/reject interaction on individual suggestions.
- A staged revision cycle and a distinct "final version" step (revision
  tracking exists internally in the Writing Tutor today, but there's no
  dedicated revision-cycle UI around it yet).

**Future ideas (not yet formally approved):**
- Whether topic selection should be free-form (student writes their own
  topic) in addition to a curated menu.
- Whether "final version" should produce something durably saved to a
  student's portfolio, beyond a completion marker.

---

## 10. AI Talk Experience

Detailed technical architecture (turn limits, speech generation, safety
guardrails) is governed separately by `AI_TALK_ACTIVITY_DESIGN.md`. This
section governs AI Talk's *educational philosophy* — its purpose, the AI's
role, and what a successful conversation feels like — which the technical
implementation should serve.

### Philosophy

The primary objective of AI Talk is **not** to tutor students about the
reading passage. Its primary objective is to develop students' conversational
English. The current theme provides the conversation's topic — it is not the
learning objective. The learning objective is helping students become more
comfortable having natural conversations in English.

### The role of the AI

The AI behaves primarily as a **friendly conversation partner**. It is not
an examiner. It is not a reading tutor. It is not continuously checking
whether the student understood the passage correctly. Instead, it naturally
keeps the conversation going, the way a genuinely curious conversation
partner would.

### Conversational English

One of AI Talk's most important educational goals is exposing students to
natural spoken English — the discourse markers and conversational cues
students rarely encounter in written material. The AI should naturally
model expressions such as:

- "That's interesting."
- "Really?"
- "I see."
- "That makes sense."
- "I've never thought about it that way."
- "What happened next?"
- "Can you tell me more?"
- "Why do you think that?"
- "What do you mean?"
- "Let me ask you something."
- "So, if I understand you correctly…"

Students should repeatedly encounter these cues across a conversation, so
this language is *acquired through repeated natural exposure*, not taught
explicitly.

### Conversation style

The AI should:
- React naturally
- Show curiosity
- Ask follow-up questions
- Encourage students to keep talking
- Occasionally share brief conversational reactions
- Keep the discussion flowing naturally

It should **not** repeatedly praise students with expressions such as
"Excellent!", "Very good!", or "Perfect!" unless genuinely warranted. The
interaction should feel like talking with a supportive person, not taking an
oral examination.

### Theme relationship

The current theme provides the reason to begin the conversation. Once it
starts, the conversation should naturally follow the student's own
interests, staying only loosely connected to the theme. The objective is
meaningful communication, not repeated comprehension checking.

### Foundation vs. Advanced

**Foundation AI Talk:**
- Shorter turns
- More conversational support
- More modeled expressions
- Confidence building
- Easier follow-up questions

**Advanced AI Talk:**
- Longer conversations
- Richer conversational expressions
- More spontaneous discussion
- Deeper opinions
- More natural back-and-forth interaction

The difference is conversational depth, not simply more difficult English —
consistent with §7's general principle.

### Success criterion

After finishing AI Talk, a student should feel:

> "I just had a real conversation in English."

not:

> "I answered another set of questions."

---

## 11. Typography and Accessibility Rules

- No essential learning text below 14px, anywhere.
- Text a student is expected to actively read and use while writing
  (Sentence Starters, Useful Expressions and their Japanese gloss, Toolbox
  instruction/subtitle, example sentences) is **16px minimum**, with an
  **explicit** line-height — never left unspecified or inherited.
- One deliberate, documented exception: inside a Word Bank card, the target
  word and its Japanese gloss sit at 14–15px, specifically to stay visually
  secondary to the 18px example sentence above them. This is a considered
  hierarchy choice, not an oversight, and should be preserved wherever this
  pattern is reused — not "fixed" to 16px.
- Section/category labels (eyebrow text like "WORD BANK") sit at 14px,
  medium-to-bold weight, with clear contrast (e.g. `slate-600` or
  equivalent) — never a pale, low-contrast color for label text a student
  is meant to actually read. Purely decorative metadata (like a reused level
  badge) is exempt.
- Japanese glosses must remain clearly readable at whatever tier they sit
  in — Japanese script loses legibility faster than Latin script at very
  small sizes, so err upward when in doubt.
- Guiding principle: *if a student is expected to read it while learning, it
  must never be styled like fine print.*

## 12. TTS Rules

- **Server-side TTS only.** Every dynamically generated or dynamically
  selected piece of audio goes through a dedicated server endpoint — never
  the browser's `SpeechSynthesis` API, not even as a fallback. On failure,
  show a clear inline error and stop; do not substitute browser speech.
- **Fixed, pre-generated audio** remains the correct mechanism for
  known-in-advance content (the reading passage itself, if recorded in
  advance) — this rule governs the *dynamic* text case, not that system.
- **The Selection Assistant provides exactly three actions**: 🇯🇵 Translate,
  🔊 How to Read (server TTS on whatever text is selected — a word, phrase,
  sentence, or whole paragraph), 💬 Easy English. There is no separate
  "Meaning" action; Translate and Easy English together cover that need.
- **No fixed per-paragraph Play buttons in the new experience.** "How to
  Read" on selected text is strictly more flexible. Themes not yet migrated
  to this template may still use the older per-paragraph Play button — that
  is expected during the transition, not an inconsistency to fix urgently.
- **Vocabulary Preview interaction rule (frozen 2026-08-09).** Inside the
  Vocabulary Preview's word card (`VocabDictionaryModal.tsx`), any
  educational text is learning material unless it is an explicit UI
  control, and all educational text participates in the Selection
  Assistant by default: Headword, Meaning/Simple English definition,
  Examples, Common Collocations, Word Family, and any future educational
  section (Word Roots, Synonyms/Antonyms, or anything added later). Only
  genuine UI controls — audio playback, Save to Glossary, Close,
  navigation (e.g. Derivatives' click-to-open-another-word chips) —
  behave as buttons. In short: **educational content → selectable →
  Selection Assistant; UI controls → clickable → perform actions.** This
  is the standing rule for every future vocabulary enhancement, not only
  the sections that exist today.

---

## 13. UI Principles

Lessons learned during Theme 1's redesign, intended to govern every future
UI decision on this platform, not only Reading and Writing.

- **One feature, one purpose.** Each control should do one clearly distinct
  job. This is how the platform's old six-option "Ask AI" menu was found to
  substantially duplicate the Selection Assistant and was retired rather
  than maintained alongside it.
- **Remove redundant controls.** A feature earns its place by doing
  something nothing else already does — not by having existed first.
- **Discoverability is essential.** Never rely on trial and error. If an
  interaction isn't self-evident (e.g. "these words are clickable and
  insert into your writing"), say so explicitly, in both languages, right
  where the interaction happens.
- **Learning text must never look like fine print.** Typography is one of
  the ways a student learns what matters — treating something as visually
  optional treats its content as optional too.
- **Typography is part of learning support, not decoration.** Font size,
  weight, and color are pedagogical choices about what needs careful
  reading versus what's supporting metadata — not just visual styling.
- **Use calm visual hierarchy.** One primary accent color, used to guide
  attention, not a different color per section. The eye should move
  predictably from topic → task → support material.
- **Consistency across activities.** The same interaction (e.g.
  click-to-insert) should look and behave identically everywhere it
  appears — a student shouldn't have to relearn a pattern between Reading
  and Writing.
- **White space improves readability**, especially for students reading in
  a second language — generous spacing is a legibility tool, not empty
  decoration.
- **Interaction should feel obvious without explanation.** If a feature
  needs a tutorial to be usable, the feature needs to be redesigned, not
  documented more thoroughly.

---

## 14. Adapting the Template Across Themes and Levels

- **Foundation and Advanced share the same architecture** — identical
  activities, identical Reading and Writing structure. Only guidance level
  and task depth change (§7, §10).
- **Advanced means deeper thinking, not merely longer or harder English**
  (§2, §7, §10).
- **Simplified changes language difficulty only, not ideas** (§2, §6).
- **Teaching materials must derive from the approved manuscript.** The
  manuscript (Educational Objective → Reading Passage, authored by the
  human editor/author) is the one-way source of truth; derived materials
  (Notice Language, Vocabulary Check, Mission Check, Writing topics, AI Talk
  opener, vocabulary examples/collocations/theme notes) adapt to it and
  never the reverse. If a derived component reveals a possible problem in
  the manuscript, that gets reported as an observation — never silently
  patched around, and never used to justify editing the manuscript
  directly.

## 15. Migration Procedure

Converting another theme or level to this template must guarantee all four
of the following, in this order of priority:

1. The template stays consistent — no theme gets a one-off variation of the
   shared structure.
2. Only content changes — passages, vocabulary, prompts, questions,
   examples, and AI Talk topics; never the components or interaction
   patterns.
3. Unmigrated themes remain completely untouched until their own migration.
4. The student experience is consistent across the whole platform once
   migration is complete.

**Procedure:**

1. **Author the manuscript** for the target theme/level through the
   approved authoring process (Theme → Objective → Essential Questions →
   Core Message → Reading Concept → Foundation Vocabulary → Advanced
   Vocabulary → Reading Passage), reviewed through the concept and
   story-integrity phases of the editorial workflow before any derived
   content is built.
2. **Before writing any vocabulary data**, check for cross-theme id
   references. Any vocabulary id already referenced by another theme's
   vocabulary set or another lesson's word bank must be left completely
   untouched — this is exactly how one theme's dependency on another
   theme's older vocabulary ids was found and protected during Theme 1's
   migration.
3. **Author derived teaching materials** against the approved manuscript:
   Simplified Reading, Vocabulary Check, Notice Language, Mission Check,
   Writing topics + Toolbox content, AI Talk opener(s) and topics.
4. **Switch the theme/level to the new experience** via the platform's
   existing content-gating mechanism — the theme's Reading data is marked
   to use the new components instead of the legacy ones; nothing else needs
   to change to make this take effect.
5. **Before reusing the shared Reading/Writing/Toolbox components as-is**,
   check them for anything hardcoded to a specific theme (copy, assumptions
   about passage length or paragraph count, etc.) — treat this as a
   checklist item, not an assumption, until it has been formally audited
   (see §16).
6. **Confirm activity visibility updates automatically** — the Activity
   List already shows Writing only for themes/levels using the new
   experience; no manual flag should be needed per theme.
7. **Run the project's type check.**
8. **Verify isolation** — confirm every other, unmigrated theme/level still
   renders through the original components unchanged, and still shows the
   original three-activity list.
9. **Walk the new theme's full sequence** — Vocabulary Preview → Reading →
   Writing → AI Talk — end to end before considering the migration done.

**Already-global, no per-theme migration needed**: the Selection Assistant's
three-action set and the server-side-only TTS policy already apply to every
theme, since that component is a single, shared, non-forked part of the
application.

---

## 16. Status & Roadmap

### Implemented

- The four-activity sequence (Vocabulary Preview / Reading / Writing / AI
  Talk) as independent activities, for Theme 1 Foundation.
- Reading's structure: Mission, Before You Read, Original/Simplified
  toggle, Selection Assistant, Notice Language (passive form), Comprehension
  Check.
- Writing as a standalone activity: prompt, draft area, the redesigned
  Writing Toolbox, click-to-insert support, AI correction, the
  Continue-to-AI-Talk bridge.
- Server-side TTS via the Selection Assistant's three actions — already
  global, applies to every theme.
- The typography and accessibility rules in §11, applied to Theme 1's
  Reading and Writing pages.
- The content-gating mechanism that lets a theme/level opt into the new
  experience without affecting any other theme.
- The two-level architecture (§1) in the codebase itself — the `Level`
  type, level-selection UI, routing, and progress tracking are Foundation/
  Advanced only, with a migration for any `standard`/`challenge` values
  already saved in a returning student's browser storage or present in
  legacy URLs.
- The Vocabulary Preview interaction rule (§12), for Meaning, Examples,
  Common Collocations, and Word Family — manually verified 2026-08-09.

### Approved, not yet implemented

- Vocabulary Check as a Reading section.
- Notice Language's narrowed scope and active-response redesign.
- Mission Check's full bilingual question/option text (currently
  explainer/hint only).
- Writing's multiple-topic selection menu.
- Writing's explicit "How can I say this better?" coaching step and
  accept/reject interaction.
- Writing's staged revision cycle and a distinct final-version step.
- Review's redesign into genuine reflection, rather than the current
  vocabulary-list/usage tracker.
- The Continue screen's two buttons made genuinely equal in visual weight
  (currently styled as primary vs. secondary).
- AI Talk's system prompt and behavior audited and updated against the
  conversational-fluency-first philosophy in §10 — not yet verified against
  the live implementation.
- AI Talk continuing from the student's Writing — approved in principle,
  not yet implemented.
- Reconciling Reading's visual language with Writing's neutral/indigo
  system (§5A).
- Migrating any other theme, or Theme 1 Advanced, to this template.
- A formal audit of the shared Reading/Writing/Toolbox components for
  anything hardcoded to Theme 1 specifically, before broad reuse.
- The Vocabulary Preview interaction rule (§12) applied to the Headword —
  the one known gap as of 2026-08-09. Not a simple copy of the pattern
  used elsewhere: the header row also carries the desktop drag-to-move-
  the-card handler, which currently claims any mousedown there except on
  a `<button>`, so the headword needs to be excluded from that handler
  (the same way buttons already are) before it can be wrapped safely.

### Ideas for future versions

- Cross-theme spiral vocabulary reinforcement, redesigned once all ten
  themes have been individually rebuilt under this template.
- Fixed cumulative vocabulary count targets for the two-level system.
- Free-form (student-authored) writing topics, in addition to a curated
  menu.
- A durable, portfolio-visible "final version" of a student's writing,
  beyond a completion marker.
- Retiring the legacy query-parameter Reading route once every theme has
  migrated off the passage-list screen it was originally built for.

---

## Out of scope for this document

This specification governs the student-facing experience structure and its
visual/typography/TTS rules. It does not redefine the manuscript authoring
process, the vocabulary curriculum's own content rules, the ten-theme
curriculum itself, or AI Talk's technical architecture (turn limits, speech
generation, safety guardrails — see `AI_TALK_ACTIVITY_DESIGN.md`) — those are
governed by their own dedicated documents. It also does not commit to a
timeline for resolving any item in §16.
