# Theme 1 Reading & Writing Plan
## Knowing Myself — Foundation

Status: **Approved — design complete, not yet implemented in code.** Revises the pre-existing passage (not a replacement) to match the finalized Foundation vocabulary and the frozen `docs/READING_WRITING_ARCHITECTURE.md`. Comprehension and Writing are new content built to support this revised passage.

---

## 1. Reading Passage (217 words)

**Paragraph 1**
Many people think they should already know their own personality by
the time they finish high school. In truth, who you are is not
something you discover all at once — it grows slowly, through small
experiences and quiet moments of thinking about yourself. Every new
challenge you try adds something important to the picture.

**Paragraph 2**
For example, Aya used to feel too shy to speak in English class. One
day, she agreed to give a short presentation about one of her hobbies.
She chose it because she was genuinely interested in sharing something
she loved. Her voice shook at first, but she finished, and her
classmates clapped for her. That small moment of courage gave her real
confidence, and she noticed a new strength in herself.

**Paragraph 3**
This is how personality is built — not in one dramatic moment, but
through many small choices to try, share, and grow. After that day,
Aya started raising her hand more often in class, just to see what
would happen. She began to imagine a bigger goal for herself: maybe
one day she could compete in a real speech contest. It still felt like
a distant dream, but every small step made it feel a little closer.
She didn't have every answer yet — she was still learning, one small
moment at a time.

**Takeaway Sentence** (for the existing `takeaway` field, replacing "Small challenges can help you discover who you are becoming."):

> "This is how personality is built — not in one dramatic moment, but through many small choices to try, share, and grow."

## 2. Vocabulary coverage

All ten frozen Foundation words appear naturally: personality (P1,
P3), confident (P3), shy (P2), strength (P2), interested (P2), hobby
(P2), important (P1), learn (P3), goal (P3), dream (P3).

## 3. Notice Language (4 activities selected for this passage)

- Find today's target vocabulary.
- Notice useful expressions/collocations ("feel too shy," "gave her
  real confidence," "a new strength in herself," "keep learning").
- Identify the sentence expressing the main idea (P1, sentence 2).
- Notice the discourse contrast between "Many people think..." and
  "In truth..." (P1, sentences 1–2).

Not selected: "find recycled vocabulary from previous themes" — not
applicable, since Theme 1 is the curriculum's starting point.

## 4. Comprehension (3 tasks)

**Task 1 — Choose the Answer**
*Question*: According to the passage, how does personality grow?
- A. It appears all at once, in one dramatic moment.
- B. It grows slowly, through many small experiences and choices. ✅
- C. It only changes when something bad happens.

**Task 2 — Supporting Evidence**
*Prompt*: Which paragraph best shows an example of personality growing
through small experiences?
- Paragraph 1 (general claim, no example)
- Paragraph 2 (Aya's specific story) ✅
- Paragraph 3 (the conclusion)

**Task 3 — Vocabulary in Context**
*Question*: In "she noticed a new strength in herself," what does
"strength" mean?
- A. How much weight she can lift.
- B. A good quality or ability she has. ✅
- C. A type of exercise.

**Implementation note**: the existing `MissionCheck` data structure
supports Tasks 1 and 2 directly. Task 3 (vocabulary-in-context) is a
required part of Foundation comprehension, not optional, and will need
a small structural addition to that data model at implementation time.
Japanese support text (`explainerJa`/`hintJa` equivalents) is deferred
to implementation.

## 5. Writing Task

**Prompt**: "Has trying something new or difficult ever changed how
you feel about yourself? What happened?"

**Length**: 2–3 sentences (minimum 2).

**Optional sentence starters**:
- "One time, I..."
- "At first I felt shy / nervous, but..."
- "After that, I felt more..."

**Useful Vocabulary for This Theme**: personality, confident, shy,
strength, interested, hobby, important, learn, goal, dream. These are
the words students have learned this theme. Use whichever ones
naturally help you express your ideas — you are not expected to use
every word. The goal is natural communication, not vocabulary
coverage.

**Why this fits Foundation**: asks the student to narrate what
happened and how they felt, not to justify an opinion — matching the
"Answer" tier's cognitive demand.

**Connection to the reading**: mirrors Aya's own arc (shy → tried
something → felt more confident), using her story as a scaffold for
the student's own.

**Connection to AI Talk**: this prompt closely previews AI Talk's
existing Theme 1 Foundation opener ("Has trying something small like
that ever changed how you feel about yourself?") — the writing task
rehearses the answer AI Talk will later ask the student to elaborate
on conversationally.
