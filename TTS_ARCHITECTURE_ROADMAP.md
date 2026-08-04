# TTS Architecture Roadmap

Status: decisions recorded, no implementation yet beyond what already
exists (Theme 1 Reading MP3s, AI Talk's on-demand TTS). This document is
the source of truth for TTS timing and architecture going forward —
supersedes informal notes in `READING_MODULE_HANDOFF.md` on this topic.

## Educational principle

Browser-based speech synthesis (`window.speechSynthesis`) is not
acceptable as the platform's long-term, production-quality audio
solution. Voice and pronunciation quality vary across OS/browser and are
not something this project controls — for fixed educational content in
particular, pronunciation *is* content, not a cosmetic detail. This
principle does not change; only the **timing** of when the project
commits engineering effort to eliminating browser TTS has been revised
(see below).

## Long-term design policy (unchanged, deferred)

- **Fixed content** (Reading passages, Vocabulary words/examples, Grammar
  explanations, model answers, other authored instructional content) →
  pre-generated, stored, high-quality MP3, served statically.
- **Dynamic content** (AI Talk, Selection Assistant, Writing Tutor
  feedback, future AI-generated explanations) → server-side on-demand
  high-quality TTS, generated fresh per request.
- Browser TTS is never the final production method for either category —
  neither as primary playback nor as a silent fallback. In the finished
  product, if high-quality audio can't be generated or played, the UI
  shows an appropriate "audio unavailable" state instead.

The full architecture review (component reuse, shared config, migration
phases, risks) done for this policy remains valid design work and will be
used as the basis for implementation once that phase begins. It is not
reproduced here in full; this document records the **current-phase
policy**, which is what governs engineering work today.

---

## Temporary Development Policy (current phase)

Foundation content is built; Standard and Challenge content still need to
be developed, and existing content may continue to change during review.
Generating high-quality MP3 audio for all fixed content now would be
premature — content still in flux means audio would likely need
regenerating later, at real cost, for no benefit to any current user.

Effective now, during curriculum development:

- **Reading** may continue using browser-based TTS as the fallback
  wherever generated MP3 audio is not available (i.e., every lesson
  except Theme 1 today).
- **Vocabulary** may continue using browser-based TTS as its sole
  playback method.
- **Theme 1's existing generated Reading MP3 files remain in place** and
  continue to be used as-is — no regression, no removal.
- **AI Talk** continues using its existing high-quality, server-side
  OpenAI TTS (already fully compliant with the long-term policy — no
  change here).
- Do **not** generate additional large batches of fixed-content MP3
  files during this phase.

This is a scoping/timing decision, not a reversal of the educational
principle above — it accepts a known, temporary gap in exchange for not
paying twice to regenerate audio for content that hasn't stabilized yet.

---

## Final Production Policy (trigger: Foundation + Standard + Challenge complete, reviewed, and approved)

Once all three curriculum tiers are complete, reviewed, and approved:

- Generate high-quality pre-recorded MP3 audio for all fixed educational
  content.
- Reading passages use paragraph-level generated MP3 audio, for every
  theme (not just Theme 1).
- Vocabulary and other fixed instructional content are then reviewed for
  generated-audio coverage and brought up to the same standard.
- Dynamic AI content continues using high-quality server-side TTS, as it
  already does.
- Browser TTS is retired as a production-quality solution — it should not
  be considered acceptable for the finished product in either role
  (primary or fallback).

---

## Future Infrastructure

The incremental, content-hash-based audio-generation workflow proposed in
the earlier architecture review (compute a hash per content item, skip
regenerating anything unchanged, commit a manifest, support scoped
`--type`/`--lesson` filters) remains the right approach for the eventual
generation pass — it avoids paying to regenerate the entire catalog every
time one passage or word changes.

**This is deferred, not scheduled now.** It should be built when the
curriculum is close to finalization — i.e., shortly before the Final
Production Policy phase begins — not during active content development,
where most of what it would track is still churning anyway.

---

## What this changes about current code

Nothing, as of this document. No code, playback component, or TTS
implementation was modified to record this decision. This document exists
so that the existing browser-TTS fallbacks in Reading and Vocabulary are
understood as an accepted, deliberate, *temporary* state — not an
oversight — until the Final Production Policy phase begins.
