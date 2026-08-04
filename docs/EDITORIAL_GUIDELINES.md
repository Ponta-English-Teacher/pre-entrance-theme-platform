# Editorial Guidelines — Foundation Curriculum

Status: living document. Established through the Theme 1 and Theme 2
native-English editorial reviews. Every principle below was derived from
a genuine issue actually found in reviewed content — nothing here is
speculative or aspirational.

Standard for all principles: **"Would an educated native speaker
naturally write this sentence in a professionally published
English-learning textbook?"** — not "is this grammatical?"

---

## 1. Pronoun clarity

**Avoid ambiguous pronouns, especially where two nouns in the prior
sentence could both be the antecedent.**

A native reader resolves ambiguous pronouns instantly from world
knowledge; a Foundation-level EFL reader may not yet have the fluency to
do that automatically. If a pronoun could plausibly point to more than
one noun in the preceding sentence, reword to remove the ambiguity —
often by combining the two sentences or repeating the noun.

> Found in: Theme 1 Reading, paragraph 2 ("She chose it..." — "it" could
> mean the presentation or the hobby).

## 2. Omitted objects and unnecessary inference

**Avoid omitted objects when they reduce clarity, and prefer explicit
wording over wording that requires unnecessary inference.**

A sentence can be fully grammatical while still requiring a reader to
supply missing information the text never states. Where an omission
would force early-stage learners to guess or infer a logical link the
passage doesn't spell out, make the connection explicit instead.

> Found in: Theme 10 Mission Check (an unstated logical bridge between a
> hypothesis and the experiment that tests it) — flagged in the
> Foundation Curriculum Educational Review, not yet corrected.

## 3. Natural, authentic collocations

**Use natural native collocations. Vocabulary example sentences must
model authentic collocations a student could safely reuse.**

A vocabulary example sentence's job is to show the word being used the
way a native speaker actually uses it, so a student can copy the pattern
safely. A grammatically valid but non-standard pairing (e.g. a
preposition a native speaker wouldn't choose) teaches the student to
reproduce an error.

> Found in: Theme 2 vocabulary entry `us-f-04` ("independent"), second
> example — originally "independent with my own schedule," not a
> standard collocation.

## 4. Every vocabulary example must contain its target word

**A vocabulary entry's example sentences must actually contain the word
being taught (or an unambiguous inflection of it), in both examples.**

This was discovered as a *self-correction* during the Theme 2 revision
pass: an early fix to Principle 3's issue above accidentally removed the
word "independent" entirely from its own example sentence while fixing
the collocation. A revision that fixes one problem must not silently
introduce this one — always re-check that the target word survived the
edit.

> Found in: Theme 2 vocabulary entry `us-f-04`, introduced and then
> caught during the second-pass verification of the Theme 2 revision
> itself.

## 5. AI Talk must stay strictly within what the reading established

**AI Talk must never introduce information, actions, or outcomes not
supported by the reading passage.**

An AI Talk opener references the passage the student just read. If it
states something as fact that the passage only implies or leaves open
(e.g. claiming a character "joined" something the passage only shows
them starting to do), a student who checks back against the passage will
find a mismatch — and since this is presented as something an AI
partner "read," any inaccuracy undermines trust in the feature.

> Found in: Theme 2 AI Talk opener — originally stated Sora "joined"
> the photography club; the passage only shows her introducing herself
> to the group.

## 6. Writing prompts must naturally lead students into writing

**A writing prompt should be answerable by essentially every Foundation
student without requiring an experience they likely haven't had, or
should explicitly provide a fallback for students who haven't had it.**

This principle comes from the broader educational review rather than a
pure English-sentence issue, but it governs prompt *wording*: prompts
that already generalize past a specific reading scenario, or that
explicitly say "if not, describe..." / "or would like to know...", work
better than prompts that assume every reader shares the character's
exact situation.

> Found in: Foundation Curriculum Educational Review — inconsistent
> across themes; several (Themes 3, 5, 6, 8, 9, 10) already do this well,
> others do not yet.

## 7. AI Help must answer the actual writing task

**AI Help text must describe and respond to what the specific writing
prompt is actually asking — not a generic or assumed task type.**

Generic, template-based help text is only acceptable if it happens to be
true for every prompt it's shown against. Where a template assumes a
task type (e.g. an opinion/agree-disagree question) that the actual
prompts never use, the help actively misleads rather than assists —
this is worse than no help at all, since it tells the student something
false about their own assignment.

> Found in: Foundation Curriculum Educational Review — the mock AI Help
> system's "Question meaning" and "Answer check" options assume every
> prompt is an agree/disagree question; none of the ten Foundation
> writing prompts are.

## 8. Consistency between a passage and its own supporting text is a
   signal worth checking

**When revising a sentence, check whether the lesson's own other
materials (the plainEnglish paraphrase, vocabulary themeNotes, Mission
Check phrasing) already express the same idea more naturally — that's
strong evidence the awkward version is the outlier, not a legitimate
stylistic choice.**

This isn't a rule about how to *write* a sentence — it's a method for
*finding* problems. Twice now, a paraphrase or a themeNote elsewhere in
the same lesson independently arrived at cleaner phrasing for the same
idea a passage sentence expressed awkwardly, which was the deciding
evidence for flagging the issue.

> Found in: Theme 2 Reading paragraph 2 ("tell her every step to
> take"), corroborated by both its own plainEnglish paraphrase and
> vocabulary entry `us-f-04`'s themeNote.

---

## Out of scope for this document

Per the reviews that produced it, editorial guidelines are strictly
about English-sentence quality — not software, UI, implementation, or
educational philosophy in general (only where an English sentence itself
is the direct cause of a philosophical/instructional problem, as in
Principles 6 and 7 above). Broader curriculum-design findings belong in
the educational review process, not here.
