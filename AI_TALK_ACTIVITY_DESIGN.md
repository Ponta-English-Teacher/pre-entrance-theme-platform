# AI Talk — Activity Design

Status: **Version 1 decisions locked in.** Implementation underway per the milestone plan below.

**Naming note**: this activity is called **AI Talk** in the product, the activity grid, and `ActivityType` (`'ai-talk'`). It is one of three distinct AI roles in this platform — the other two are the **AI Tutor** (an embedded assistant inside Reading & Writing, not an activity) and **Pronunciation & Delivery** (a future independent activity, reserved under the `speaking` type). Earlier milestones used the working name "AI Partner," and the internal implementation still does (`src/lib/ai/aiPartner/*`, `src/components/ai-partner/*`, `/api/ai-partner*`) — that internal naming is unchanged by this rename; only the user-facing activity name and this document's title were updated.

The purpose of this activity is to let students use English naturally, in a low-pressure conversation connected to the current theme — not a chatbot demo, not a speaking test, not a grammar drill, not a fixed-question interview.

---

## 1. Student flow

**What students see first**

Not a bare text box. An intro screen, matching the framing pattern already established in the Reading lesson (Welcome → Mission before any content appears): the theme title, one short warm line explaining the point of the activity ("Let's talk about who you're becoming — there's no right or wrong answer here"), and a single "Start Conversation" action.

**How the conversation begins**

The AI partner sends the first message — the student never faces a blank input first. The opener is drawn from a small pool of theme-and-level-specific starters (authored content, not generated live), referencing something concrete the student already engaged with (the reading passage's example, the mission) — not a cold "How are you today?"

**How the conversation develops**

Turn by turn, free text in both directions, grounded in the current theme, level, and target vocabulary (see §5 — not the student's Writing Tutor submission in V1). The student can drift into related tangents naturally; the AI follows rather than yanking the topic back on script.

**How it ends**

Student-controlled. "Finish Conversation" is available at all times. As the student's turn count approaches the level's target (§6), the AI naturally offers a low-pressure wind-down rather than the student having to guess when it's "enough." Ending produces a brief, warm closing screen — not a scorecard.

---

## 2. Level differences

| | Foundation | Standard | Challenge |
|---|---|---|---|
| AI turn length | Shorter, simplest vocabulary/grammar | Slightly longer, more natural idiom | Longer where it earns its length; richer vocabulary |
| Question style | Concrete, close to the reading/personal experience | A bit more open-ended/opinion-based | Invites reasoning ("why do you think that"), may gently offer an alternative view to respond to |
| Support visibility | Vocabulary/help panel open by default | Available, collapsed by default | Available on request only |
| Japanese support | Freely offered, one tap away | Available but not pushed | Minimal, on request only |
| Target vocabulary | Foundation set only | Foundation + Standard (cumulative) | All three tiers |
| **Completion target** | **6 student turns** | **8 student turns** | **10 student turns** |
| **Hard maximum** | **15 student turns (all levels)** | | |

---

## 3. AI partner behavior

**Tone**: warm, curious, patient — a partner, not an examiner. Content before form, always.

**Length of responses**: short, 1–3 sentences as the norm — enforced both by prompt instruction and by not asking the model for anything longer. No automatically generated long explanations.

**How often it asks questions**: not every turn. Roughly two turns in three carry a question; the rest are reactions or light comments.

**Short or unclear answers**: a gentle, specific nudge, never a repeat of the same question, never flagged as a problem.

**Avoiding repetitive/artificial phrasing**: full conversation history is passed into every request so the model can see what it's already said, plus an explicit instruction to vary phrasing and conversational moves. The response shape stays deliberately light (see §API below) rather than a rich fixed-field schema — one exchange at a time, nothing more.

**Identity**: the partner is **unnamed** — no fictional name, no avatar, no fixed personality beyond "warm, encouraging, curious, natural." It does not fabricate personal anecdotes, and it doesn't hide being an AI if asked directly.

---

## 4. Language support

**Type or speak (student input)**: **typing only in Version 1.** No student voice input, no realtime speech-to-speech. Text remains primary — the AI's text reply always appears first, immediately; audio is a separate, optional, on-request enhancement layered on top (see "Partner speech" below), never a gate on the conversation continuing.

**Partner speech (output)**: each AI turn gets a small Play button, **not autoplay**. Pressing it requests generated speech for *that specific reply* from a dedicated server-side endpoint (§ Speech architecture below) — audio is generated only when asked for, never eagerly for replies the student hasn't chosen to hear. The conversation is fully usable in text-only mode from end to end; a student who never presses Play has an identical experience to one who does, minus the audio. Audio failure never interrupts the conversation — see the fallback behavior below.

**Vocabulary support**: a compact, collapsible reference panel showing the current theme's target words with Japanese glosses, reusing the existing vocabulary data — on demand, not force-fed.

**Japanese support**: **contextual and student-requested only.** The conversation itself stays in English; support around it (explaining the AI's last turn, a response-idea hint, a vocabulary check) is Japanese-primary and appears only when the student asks for it, reusing the exact contextual-help pattern already built for Reading.

**Correction**: implicit by default, through natural **recasting** — the AI's next reply uses the correct form without pointing anything out. Explicit correction is **opt-in only**, via a per-message "check this" affordance the student has to actively choose; it is never automatic and never interrupts the flow.

---

## 4a. Speech architecture (AI Partner replies — distinct from Reading's passage audio)

This is a genuinely different problem from Reading's passage audio (see `READING_PASSAGE_AUDIO_DESIGN.md`): every reply is generated live, so nothing can be pre-rendered once and reused across students. The architecture has to control cost and latency for *on-demand, per-reply* generation instead.

**Separate endpoint**: `POST /api/ai-partner/speech`, kept fully separate from `/api/ai-partner` (text turns) and `/api/ai-partner/summary` — one job per endpoint, matching the pattern already used everywhere else in this app. The API key never leaves the server; the browser only ever receives audio bytes back from a Route Handler, exactly like every other AI call in this project.

**Response shape**: a direct audio response (the Route Handler synthesizes the clip and returns it with `Content-Type: audio/mpeg`), not a stream and not a URL to a stored file.
- **Not streaming**: replies are 1–3 sentences — a few seconds of audio. The complexity of chunked/streamed playback (MediaSource API on the client, partial-buffer handling) isn't earned by clips this short; it would be solving a latency problem that likely doesn't materially exist at this length.
- **Not permanently stored**: nothing is written to disk or a database. The audio exists only as an HTTP response body and then in the browser's memory for that session — satisfying "do not store AI Partner audio permanently in V1" by simply never writing it anywhere server-side, rather than writing-then-deleting.
- **Client-side session cache**: once a reply's audio has been fetched, the resulting blob is kept in the component's own memory (keyed by turn) for the rest of that session. Pressing Play again on the same reply replays the cached blob — no second call to the endpoint. This alone satisfies "avoid regenerating the same reply repeatedly," with no server-side cache/store needed at all.

**Cost control**: with the already-approved completion targets (Foundation 6 / Standard 8 / Challenge 10, hard max 15), a session has at most 15 partner replies — so at most 15 possible speech generations even in the worst case of a student playing every single one, which realistically won't happen since Play is opt-in per message, not automatic. As a simple additional safeguard, a per-session speech-generation counter (distinct from the conversation-turn cap) disables further *new* generations past 15 — it never actually constrains a student who wants to hear every reply once, it only guards against a pathological/bugged case of repeated new generation requests.

**Fallback on speech failure**: **decided: text-only, not browser TTS.** The entire premise of building real generated speech here is that "the naturalness of the partner's voice is part of the learning experience"; falling back to a robotic browser voice on failure would quietly contradict that premise rather than honor it. On failure, the Play button simply resets (a small, non-alarming "audio unavailable" state) and the text conversation continues completely unaffected.

---

## 5. Connection to the theme

Every request includes the theme's name/description, the current level's target vocabulary, and the reading passage's core content (so the AI recognizes the "Aya" example, the mission, the takeaway).

**Version 1 does not automatically read or import the student's Writing Tutor submission.** The conversation is grounded in theme + level + vocabulary only. A future version may add an explicit, student-chosen "Use my writing as a conversation starter" option — opt-in, not automatic, so the coupling between activities is a deliberate student choice rather than a silent default.

**Topic freedom**: generous within the theme's spirit; gentle steering back if the student drifts entirely away, never a hard refusal.

---

## 6. Completion and progress

**Completion rule**: a student turn count target per level — **Foundation 6, Standard 8, Challenge 10** — with a **hard maximum of 15 student turns at every level**. "Finish Conversation" is always available; if a student finishes before reaching their level's target, the session still ends gracefully, but the activity is only marked complete (`markActivityComplete`) once the target is met. Reaching 15 turns ends the conversation automatically (input disabled, a warm closing message, summary generated) — a hard technical stop, not just a suggestion.

**What is saved — a lightweight session summary only, not the full transcript:**
- theme
- level
- completion date
- number of student turns
- main topics discussed
- useful vocabulary or expressions (surfaced during the conversation)
- an optional student reflection

The transcript itself is visible on-screen for the duration of the session and is **not persisted** once the session ends. The summary above is generated by a dedicated, one-time summarization call when the student finishes (see §API), not assembled by client-side heuristics.

**Teacher visibility**: not implemented in Version 1 — no teacher dashboard, no review tooling. The saved data shape above is intentionally simple and structured (not free-text transcript dumps) specifically so teacher-facing visibility could be layered on top later without a data migration.

**Portfolio**: Version 1 shows only a completion marker, matching Vocabulary and Reading's current minimal treatment.

---

## 7. Safety and boundaries

The system prompt carries firm, explicit guardrails from the start:

- Redirect away from romantic/sexual content, self-harm, violence, illegal activity, and medical/legal advice — gently, without shaming, toward a safe and still theme-appropriate angle.
- For anything reading as genuine distress, respond with care and encourage the student to talk to a trusted teacher or counselor — never attempt to be a substitute for one.
- No false claims of being human if asked.
- No taking sides on political/religious hot-button topics.
- Stay in the conversational-partner role — gently decline attempts to repurpose it as a general homework-answering tool for unrelated subjects.

Teacher-facing review/flagging is a Version 2 concern — Version 1 is safe by design (system prompt), not safe by monitoring.

---

## 8. Interface concept

No chat bubbles, no avatars, no messaging-app look. The same textbook visual language already established for Reading:

- A clean, continuous **transcript** — muted speaker labels ("YOU" / "PARTNER") above each turn, generous line spacing, thin hairline rules between turns instead of bubble containers.
- The actual English conversation text in the same **serif** treatment used for the reading passage and quoted feedback elsewhere in the app. UI chrome stays sans-serif.
- A compact, collapsible **support panel** (vocabulary reference + contextual help) sits apart from the transcript.
- A plain, bordered notebook-style input box — not a rounded chat-pill.
- "Finish Conversation" as a plain, always-visible action, matching Reading's "Complete Lesson" pattern.
- A visible, unobtrusive turn counter (e.g. "Turn 4 of 6") so the student always knows where they are relative to the target — supports the completion rule in §6 without needing a progress bar or gamified meter.
- A small, quiet Play icon next to each **partner** turn only (students don't need to hear their own typed text read back) — never autoplaying, styled as understated as the contextual-help control, not a prominent media-player widget.

---

## Version 1 — final scope

**In scope:**
- Typing only. No voice.
- Real AI backend for the core conversation (see §API/architecture below).
- One consistent, unnamed partner tone. No persona, name, or avatar.
- Theme-grounded opening from a small authored pool per theme+level.
- Recasting as the default correction mechanism; explicit correction strictly opt-in.
- Contextual help reusing the existing Reading pattern (vocabulary, Japanese explanation, response-idea hints) — mocked, not a second real-AI cost center (see architecture notes).
- On-request partner speech via a dedicated `/api/ai-partner/speech` endpoint (§4a) — not autoplay, not stored permanently, capped per session.
- Completion targets: Foundation 6 / Standard 8 / Challenge 10 student turns; hard cap 15 at every level.
- Lightweight session summary only (theme, level, date, turn count, topics, useful language, optional reflection) — no full transcript persistence.
- Completion flag via the existing `markActivityComplete` mechanism; portfolio shows a completion marker only.
- Firm safety guardrails in the system prompt.
- Textbook-style transcript UI — no chat bubbles, no messaging-app visual language.

**Explicitly Version 2+:**
- Voice input/output (STT/TTS).
- Named/selectable partner personas.
- Full transcript persistence and a "read your past conversation" / portfolio conversation-log view.
- Teacher-facing review/flagging.
- Student-chosen "use my writing as a conversation starter."
- Adaptive difficulty based on in-conversation performance.

---

## Sample student journey — "Knowing Myself," Foundation

1. Student opens the theme's activity grid, clicks **AI Talk** (now a real card).
2. Intro screen: *"Let's talk about who you're becoming — there's no right or wrong answer here."* One button: **Start Conversation**.
3. AI opens: *"Hi! I read that Aya felt nervous but tried something new anyway. Has something like that ever happened to you?"*
4. Student types a short, imperfect reply: *"Yes. I join English speech contest. I very nervous."*
5. AI responds warmly, recasting naturally: *"That sounds like a big step! How did you feel after you joined the speech contest?"*
6. Student taps the help control on the AI's last turn, sees a Japanese-primary response-idea hint and a vocabulary reminder for "confidence." Curious about the pronunciation, they also tap the small Play icon on that same turn and hear it spoken aloud — text was already there and unaffected either way.
7. Conversation continues; a small "Turn 5 of 6" counter is visible throughout.
8. At turn 6, the AI offers a natural close: *"This was really nice to hear about — want to keep talking, or shall we finish here?"*
9. Student clicks **Finish Conversation**. A one-time summarization call runs; a brief, warm closing line appears (not a report card); the session summary (topics, useful language) is saved; the activity is marked complete; the student returns to the activity grid with the card now marked done.

---

## Resolved decisions (superseding the earlier open questions)

1. **Persona** — unnamed, no avatar, no fixed personality. Decided.
2. **Transcript storage** — lightweight summary only, not the full transcript. Decided.
3. **Grounding in Writing Tutor submissions** — not automatic in V1; a future opt-in choice. Decided.
4. **Minimum-turns threshold** — Foundation 6 / Standard 8 / Challenge 10, hard cap 15. Decided.
5. **Teacher visibility** — not built in V1; data shape kept simple enough to add later. Decided.
6. **Cost/rate posture** — real AI backend, 1–3 sentence replies, one exchange at a time, 15-turn hard cap enforced. Decided.
7. **Partner speech** — on-request only (no autoplay), direct (non-streamed) audio response, client-side session-only caching, no permanent storage, per-session generation cap, text-only fallback on failure (not browser TTS). Decided.
8. **TTS provider** — OpenAI's TTS endpoint, for both Reading and AI Partner. Decided.

---

**Reading Passage Audio (see `READING_PASSAGE_AUDIO_DESIGN.md`) is a prerequisite milestone, completed and reviewed before AI Partner Milestone 1 begins.**

**Implementation plan follows in this same conversation, pending your approval before any code is written.**
