# Reading & Writing — Experience Design

Status: **Approved — frozen as the implementation specification for Reading & Writing.** Amended once to add the Notice Language stage (see §1, §3); governed alongside `docs/READING_WRITING_ARCHITECTURE.md`, which holds the production blueprint (passage length, question counts, writing-task targets) this document's UX and philosophy sit on top of. This document describes Reading & Writing as the educational center of the platform, per the confirmed architecture:

- Vocabulary
- **Reading & Writing** (embedded AI Tutor — "Ask AI")
- AI Talk
- Pronunciation & Delivery (future)

Grounded in the actual current implementation (`ReadingLessonView.tsx`, `ContextualHelpButton.tsx`, `aiAssistant.ts`, `WritingTutor.tsx`), not a rewrite from scratch — this proposes evolving what exists, and is explicit about which parts are new versus already built and working.

---

## 1. Complete student journey

**Revised per feedback**: this is not a wizard and should never be presented as one. No numbered steps, no "Step 2 of 6," no progress-bar framing anywhere in the UI. The lesson is one continuous page that reads like a chapter in a textbook — it flows from one named section into the next the way a chapter moves from one idea to the next, not the way a checklist moves from one task to the next. (This also means the "quiet step tracker" idea from an earlier draft of this proposal is retracted — see §8.)

The chapter reads through these natural sections, each a place the student arrives at by scrolling, not by "completing" the one before it:

- **Mission** — the theme framing, the day's mission, and the pre-reading survey (existing content, unified under one opening beat: here's what we're exploring today, and what's your own starting opinion on it).
- **Reading** — the passage itself, with Ask AI available throughout (existing, see §2–4).
- **Notice Language** — a short, non-gating stage between Reading and Think: 2–4 activities drawn from a flexible toolbox (target vocabulary, recycled vocabulary, useful expressions, discourse markers, main idea, reference words, paragraph organization, author's tone), selected per theme to match that theme's actual passage rather than a fixed checklist. See `docs/READING_WRITING_ARCHITECTURE.md` §5.
- **Think** — comprehension: the Mission Check question and its supporting evidence (existing content, reframed as the natural "now that you've read it, what do you think it means" beat rather than a quiz section).
- **Write** — the writing prompt and the student's own draft (existing).
- **Improve** — AI feedback on that draft, and the invitation to revise (existing content, plus the revision nudge from §5).
- **Reflect** — new (§5): a brief, ungraded moment to think about one's own learning, not the work itself.
- **Continue** — the closing beat: not a button that silently exits, but a genuine ending that bridges into AI Talk (§6).

No section is locked behind the one before it, and none is labeled with a number — a student can scroll ahead, reread, or jump back exactly as they would flip pages in a book. Entry is direct (no intro gate) — the existing Welcome line and Mission banner already orient the student the moment the page loads.

---

## 2. Wireframe (text only)

Single continuous vertical page, matching the current textbook-style layout. Section headings are named, not numbered — a chapter-style heading (thin rule either side, quiet caption above the title), never a "Step N" eyebrow or a progress bar. Ask AI stays anchored per-paragraph/per-section (as already built) rather than becoming a floating global widget — a floating "always-on" chat icon would clash with the textbook visual language already established across this app.

```
┌─────────────────────────────────────────────────────────┐
│  ← Exit                                                  │
│  Who Am I Becoming?                                      │
│  私はどんな人になっていくのだろう？                          │
└─────────────────────────────────────────────────────────┘

  ─────────────────────  Mission  ─────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │ Today, you will think about the kind of person...        │
  │ ┃ YOUR MISSION                                           │
  │ ┃ As you read, find what the author believes...          │
  │                                                           │
  │ Which statement is closest to your opinion?              │
  │  [ People are born confident ]                           │
  │  [ Confidence can be learned ]                            │
  │  [ I'm not sure ]                                         │
  └─────────────────────────────────────────────────────────┘

  ─────────────────────  Reading  ─────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │  ①  Many people think they should already know...        │
  │                                        [💡 Ask AI ▾]     │  ← existing popover; audio Play/Restart
  │                                                           │     lives INSIDE this popover (already
  │  ②  For example, Aya used to feel too shy...             │     approved in Milestone 0 — unchanged)
  │                                        [💡 Ask AI ▾]     │
  │  ③  This is how character is built...                    │
  │                                        [💡 Ask AI ▾]     │
  └─────────────────────────────────────────────────────────┘

  ─────────────────────  Think  ─────────────────────
  ┌───────────────────────────┬─────────────────────────────┐
  │ Choose the Answer          │ Supporting Evidence          │
  │  [💡 Ask AI ▾]              │                              │
  │  (question + options)      │  (evidence paragraph choice) │
  └───────────────────────────┴─────────────────────────────┘

  ─────────────────────  Write  ─────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │ Writing Prompt                            [💡 Ask AI ▾]  │
  │ Do you agree with the author?                            │
  │ ┌───────────────────────────────────────────────────┐   │
  │ │ [ student's draft textarea ]                        │   │
  │ └───────────────────────────────────────────────────┘   │
  │ [ Get Feedback ]                                          │
  └─────────────────────────────────────────────────────────┘

  ─────────────────────  Improve  ─────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │ 📝 Teacher's Comments                    ← AI feedback,   │
  │  Overall Feedback / Task Achievement /     appears here   │
  │  Corrections / Natural English /           after submit   │
  │  Improved Version / Vocabulary / Tip                       │
  │                                                           │
  │  ↳ "Want to try revising with this in mind?"              │
  │         [ Revise My Answer ]                               │
  │                                                           │
  │ ─── Word Bank & Useful Expressions ───                    │
  │                                                           │
  │ Today's words in the reading   [confidence] [identity]…  │
  │ Words you used            ✓ confidence  3 / 10           │
  │ ▓▓▓▓▓▓░░░░░░░░░░░░░                                       │
  │ "Every small step brings you a little closer..."         │  ← takeaway quote
  └─────────────────────────────────────────────────────────┘

  ─────────────────────  Reflect  ─────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │ Before you go, a moment to think about your learning —   │
  │ this isn't graded, just for you.                          │
  │                                                           │
  │  Which part was most interesting?                        │
  │  [ quick-pick chips: Reading / Think / Write / Ask AI ]   │
  │                                                           │
  │  What was most difficult?           (optional, freeform)  │
  │  ┌─────────────────────────────────────────────────┐    │
  │  └─────────────────────────────────────────────────┘    │
  │                                                           │
  │  Which sentence in your writing are you happiest with?    │
  │  ┌─────────────────────────────────────────────────┐    │
  │  └─────────────────────────────────────────────────┘    │
  └─────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │              [   Complete Lesson   ]                     │  ← only marks complete if gated (§7)
  └─────────────────────────────────────────────────────────┘

  ─────────────────────  Continue  ─────────────────────
  ↓ on completion, replaces the page with —

  ┌─────────────────────────────────────────────────────────┐
  │                         ✓                                 │
  │            You've thought about this topic.               │
  │              Now let's talk about it.                     │
  │                                                            │
  │   [ Continue to AI Talk ]     [ Back to Activities ]       │
  └─────────────────────────────────────────────────────────┘
```

---

## 3. Component placement

| Component | Placement |
|---|---|
| Reading passage | The **Reading** section, one continuous printed page, serif text (existing, unchanged) |
| Audio player | Inside the Ask AI popover per paragraph — **not** a separate always-visible icon (this was explicitly decided in Milestone 0 and should stay that way) |
| Vocabulary support | Two places, both existing: the Ask AI "difficult words" option per paragraph/question, and the Word Bank in **Improve** |
| Ask AI (embedded AI Tutor) | Per-section, inline, wherever context exists to be helpful: paragraph margin (Reading), question header (Think), writing prompt header (Write) — existing pattern, kept |
| Notice Language | The new **Notice Language** section, between Reading and Think — 2–4 toolbox activities selected per theme (`docs/READING_WRITING_ARCHITECTURE.md` §5) |
| Comprehension questions | The **Think** section (existing content, renamed framing) |
| Writing question | The **Write** section, above the draft textarea (existing) |
| Writing feedback | The **Improve** section, directly below the Get Feedback button, same page, no navigation away (existing) |
| Reflection | The new **Reflect** section, after Improve and before the Complete button (§5) |
| Completion button | Bottom of page, after Reflect (existing position; behavior changes per §7) |
| Transition to AI Talk | The **Continue** section — a closing screen replacing the page content after a successful completion (§6) |

---

## 4. Ask AI as a context-aware tutor

**Always available, everywhere in the lesson.** It should never be gated behind "finish this section first" — a student stuck on paragraph 1 needs help exactly then, not after unlocking it. This is already true today and should stay true.

**Revised framing**: Ask AI should not be described as a tool that "remembers previous questions" — that undersells it and frames memory as the point. The actual design goal is that it's a **context-aware tutor**: something sitting beside the student through the whole lesson that already knows everything relevant, so the student never has to explain themselves before asking a question. Concretely, every time Ask AI is invoked, it should already know:

- **The current lesson** — theme, level, mission, the full reading passage.
- **The current paragraph or section** — exactly what's on screen where the student clicked Ask AI, not the lesson in the abstract.
- **Today's vocabulary** — the target word list for this theme and level.
- **The student's writing** — their draft as it currently stands, if they've started one, even if they're asking a question from the Reading section, not the Write section.
- **Previous questions in the current lesson** — not as a standalone feature, but as one more thing a context-aware tutor naturally has: it doesn't re-explain something it already explained, and it can connect a new question to an earlier one ("like we saw in paragraph 2...").

The student should never have to say "I'm looking at paragraph 3" or "remember, I asked about this earlier" — Ask AI already knows. This is a stronger, more complete list of context than any single call passes today (`HelpContext` currently carries only the specific paragraph/question/draft relevant to *that one button*, not the whole lesson state), and achieving it for real — open-ended questions, not just a fixed menu — requires promoting Ask AI from the current rule-based `aiAssistant.ts` mock to a real LLM-backed endpoint, reusing the same OpenAI infrastructure already built for Writing Tutor and AI Talk. This remains the single biggest lever in §8.

Session memory specifically (the "previous questions" ingredient) should be **session-only** — cleared when the lesson ends, matching the no-permanent-transcript principle already established for AI Talk. Nothing new to persist long-term.

---

## 5. AI writing feedback — growth over correction

The current `WritingTutor` already gets most of this right, and the design should keep its existing spine rather than rebuild it:
- React to the student's *idea* before commenting on their English (already true — `overallFeedbackJa` is explicitly barred from mentioning language quality).
- Praise before correcting (already true).
- Corrections show only what changed, not the whole phrase re-struck-through (already true, and the exact bug we fixed two milestones ago).
- Natural alternatives are offered as options, never implied fixes (already true).
- Revisions are acknowledged by name — what specifically got better (already true via `revisionDeltaJa`), not just re-graded from zero.

What's missing is the **active nudge toward revising**. Today, feedback appears and the loop quietly ends — the button just says "Get Feedback Again," which requires the student to already have decided to retry. Proposed addition, in the **Improve** section: after feedback renders, a small, warm, optional prompt — *"Want to try revising with this in mind?"* — with a single button that scrolls back to the draft and focuses it. This turns feedback from something the student *reads* into something they *act on*, which is the actual mechanism by which feedback improves writing. Not mandatory, never blocking — a nudge, not a gate, consistent with this app's existing "never force" posture, and (per §7) never a requirement for completion either.

One more idea, offered lightly rather than as a strong recommendation (since the current single-pass design was deliberately tuned for exactly this purpose): a light, optional pre-writing scaffold — an Ask AI "idea hint" offered *before* the student starts typing, not only reactively after a draft exists. This already exists as one of the seven writing-help options (`idea`) — the only change would be surfacing it more proactively the first time a student opens the writing box with an empty draft, rather than waiting for them to think to ask.

### 5.5 The Reflect section

New, sitting between Improve and Continue. Its purpose is explicitly **metacognition, not assessment** — a moment for the student to think about their own learning, not to be evaluated on it. It should feel like closing a journal entry, not submitting a form.

- **Not graded, not reviewed, not sent anywhere** — no teacher dashboard exists in this platform yet, and Reflect shouldn't be the reason one gets built. Answers are for the student's own benefit in the moment.
- **Entirely optional** — skippable, and never a condition for completion (§7).
- **Light-touch prompts**, mixing quick-pick and freeform so it takes under a minute:
  - *Which part was most interesting?* — a few quick-pick chips (Reading / Think / Write / Ask AI), not a text box, so it costs one tap.
  - *What was most difficult?* — short optional freeform text.
  - *Which sentence in your writing are you happiest with?* — short optional freeform text, deliberately about pride rather than difficulty, so the section doesn't read as entirely deficit-focused.
- **Storage**: saved locally the same way the pre-reading survey and Mission Check answers already are, so it persists if the student revisits the lesson — but purely as a courtesy to the student, not as data flowing anywhere else (no AI reads it, no teacher sees it, no future feature currently planned depends on it).

---

## 6. Transition into AI Talk — the Continue section

This is the intentional bridge between the two activities, not a courtesy link at the bottom of a finished task. The **Continue** section's entire content is built around one line:

> **You've thought about this topic.**
> **Now let's talk about it.**

This framing does real work: "you've thought about this topic" retroactively names everything the student just did (reading, thinking, writing) as *thinking* — a single coherent activity, not three separate exercises — and "now let's talk about it" reframes AI Talk not as a new, unrelated activity to start, but as the next natural thing to do with thinking you've already done. It's the difference between "go do another activity" and "say some of that out loud."

Concretely:

- The closing screen (see wireframe, §2) replaces the "Complete Lesson" button's current behavior of silently routing back to the grid. Instead, it stays on the same page, in the same visual language, and presents the line above as the headline, with **"Continue to AI Talk"** as the natural next beat and "Back to Activities" always available as an equal, non-judged alternative — a student who isn't in the mood to talk should never feel the closing screen is steering them.
- "Continue to AI Talk" should link to the **existing AI Talk intro screen** (`/themes/[slug]/[level]/ai-talk`), not skip straight into the live conversation — the intro's own "Ready to talk about it?" framing is itself part of the continuity, echoing the same invitation from a second angle rather than a redundant extra click.
- AI Talk's own opener already references the same reading passage (the Aya example) — so a student arriving from this closing screen hears an opener that clearly continues the exact story and mission they just finished, not a cold restart. This content continuity already exists in the current AI Talk data; the Continue section is what makes the *path* between the two feel connected, not just the content.
- **Explicitly out of scope for now**: auto-passing the student's actual Writing Tutor submission (or their Reflect answers) into the AI Talk conversation. `AI_TALK_ACTIVITY_DESIGN.md` already decided this is a deliberate, opt-in, student-chosen action for a future version, not an automatic default — this proposal doesn't reopen that decision, only the CTA/bridge between the two activities.

---

## 7. Recommended completion criteria

Today: none. The button always marks the lesson complete, whether or not the student engaged with anything. For an activity meant to be the platform's educational center, that's too permissive.

**Revised principle**: completion must depend only on things the *student* did, never on anything the *AI* did. Receiving AI feedback, viewing it, or acting on a revision nudge are all valuable, but none of them belong in the completion gate — a slow or unavailable AI response should never be able to block a student from finishing their own lesson, and "did you read the feedback" isn't something this platform should be in the business of policing.

**Required to mark complete — all student actions:**
- **Reading completed** — the student has reached the end of the Reading section. Operationally, this is the one place this proposal introduces a small new signal rather than reusing existing data: a simple "last paragraph became visible" scroll marker, not a heavier "did you actually read every word" measure. Flagging this explicitly since it's the one genuinely new piece of tracking here.
- **Questions answered** — the Think section's comprehension question and evidence question have both been answered. Already tracked today (`missionCheckAnswer` / `evidenceChoice`) — no new data needed.
- **Writing submitted** — the student has submitted a draft meeting the lesson's minimum-sentence requirement. The *submission* itself is the student action that counts here — whether the AI feedback call succeeds, fails, or is ever opened is irrelevant to this criterion.

**Not required, and never gating:**
- Viewing or reading the AI feedback in Improve.
- Acting on the revision nudge.
- Completing the Reflect section — reflection is explicitly non-assessment (§5.5) and must stay entirely optional, never a condition for finishing.

**Behavior**: the "Complete Lesson" button stays **always clickable** — never a hard gate that frustrates a student who wants to leave. If a criterion isn't met yet, clicking it shows a small inline note (e.g. "Answer the Think questions and submit your writing to complete this lesson") instead of silently marking it done. This mirrors AI Talk's exact pattern: always available, quietly conditional on genuine engagement — the difference here is that the condition is 100% observable student behavior, with no dependency on the AI having responded at all.

---

## 8. Suggestions for a more modern AI learning experience

Ranked roughly by impact:

1. **Upgrade Ask AI from mock to real, with full context awareness** (§4). This is the highest-leverage change — it's the difference between "a helper with 19 preset buttons" and "a tutor that already knows the lesson, the paragraph, the vocabulary, and your writing, and can actually answer what you ask." Reuses infrastructure already built for Writing Tutor/AI Talk, so it's an extension, not a new architecture.
2. **Consolidate Ask AI's three separate option menus into one consistent interaction pattern.** Keep the per-section anchoring (§3), but the current menus (7 options for paragraphs, 5 for Think, 7 for Write) evolved independently and don't feel like one coherent tool. A shared visual/interaction pattern — plus, once real-AI-backed, a free-text input alongside the quick-pick buttons — would feel far more like a single "Ask AI" rather than three lookalike widgets.
3. **A revision nudge after feedback** (§5) — turns a read-only feedback panel into an active loop.
4. **The Continue section itself** (§6) is a modern-experience improvement in its own right — most platforms treat each activity as an island; ending one activity by warmly pointing at the next, grounded in what was just learned, is what makes the platform feel like one continuous tutor rather than a stack of separate tools.
5. **A soft "welcome back" cue on return**, phrased by *section name*, not step number — e.g. "Pick up where you left off in Write?" Progress is already saved to localStorage, but a student who leaves mid-lesson and comes back currently gets no acknowledgment of where they left off. This closes that gap without adding any new data model (the data already exists) and without reintroducing step-counting.

**Retracted from an earlier draft of this proposal**: a numbered "Step 2 of 5" progress tracker in the page header. This directly contradicted the chapter-not-wizard framing (§1) and has been dropped — the section names themselves (Mission, Reading, Notice Language, Think, Write, Improve, Reflect, Continue), styled as chapter headings, are the only orientation cue this design uses.

---

## Explicitly not proposed here

- No numbered steps, wizard framing, or progress bar anywhere — the lesson reads as named, flowing chapter sections (§1), never a checklist.
- No change to the "textbook, not dashboard" visual language — every addition above (chapter headings, closing screen, revision nudge, Reflect section) is proposed in that same visual idiom (serif for English content, hairline rules, `border-l-4` accent notes), not a new design system.
- No change to where Reading passage audio lives (stays inside the Ask AI popover, per the Milestone 0 decision).
- No auto-import of Writing Tutor content or Reflect answers into AI Talk (stays a future, opt-in idea per the existing AI Talk design doc).
- No grading, scoring, or review of the Reflect section by anyone — student, teacher, or AI (§5.5).
- No completion criterion that depends on the AI having responded, succeeded, or been read (§7).
- No teacher-facing dashboard, analytics, or review tooling — out of scope for this proposal, matching the platform's Version 1 posture everywhere else.

---

**This is a design proposal only. No code has been written. Awaiting review and approval before any implementation begins.**
