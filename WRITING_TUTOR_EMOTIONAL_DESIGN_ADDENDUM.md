# Writing Tutor — Emotional Design Addendum

Status: design addendum to `WRITING_TUTOR_SPECIFICATION.md`. No code. Focused entirely on the student's felt experience, not software architecture. Examples continue to use the existing "Who Am I Becoming?" lesson (Knowing Myself / Foundation) for concreteness.

This document exists because a technically correct Writing Tutor can still make a student feel judged. Every design choice below optimizes for one outcome: **the student feels more confident about writing in English after using this tool than before.**

---

## 1. Student Experience — the emotional arc

The intended arc across one feedback pass is:

**curiosity → validation → gentle noticing → inspiration → pride → closure**

— never *dread → judgment → shame → relief-that-it's-over*.

**After submitting the draft.**
Feeling: mild anticipation, not anxiety — the feeling of handing a note to a teacher who already likes you, not turning in an exam. The loading state itself should carry this: "先生があなたの文章を読んでいます..." reads as someone genuinely reading, not a system "evaluating." Nothing about this moment should look like a progress bar toward a score.

**After reading the Overall Feedback.**
Feeling: relief and validation — "my idea was understood." This is the single most important emotional beat in the whole flow. Before the student learns anything is imperfect, they must first feel *heard*. If this beat fails, everything after it lands as criticism regardless of how gently it's worded.

**After seeing Corrections.**
Feeling: mild, contained curiosity — "oh, I see" — not exposure or embarrassment. A correction should feel like a small, specific, forgettable-if-needed detail, never a verdict on ability. This is why corrections stay capped in number and collapsed-by-default (per the main spec) — a student should never scroll through a list long enough to start feeling globally criticized.

**After reading Natural English alternatives.**
Feeling: interest, almost like a gift — "oh, that's a nice way to say it too." This must never read as "you were wrong and here's the right way." It is enrichment, entirely optional, framed as something a curious learner gets to see, not something a corrected student must accept.

**After reading the Improved Version.**
Feeling: inspiration, not deflation. The student should feel "I can see where this could go," not "my version got replaced." This only works if the improved version visibly still sounds like *a student who thinks like they do* — not a native-speaker rewrite in a register they'd never reach. If the improved version feels unreachable, it produces the opposite of inspiration.

**After revising.**
Feeling: pride and agency. The act of revising is itself a small accomplishment and should be treated as one — the tutor's response to a second draft must open by noticing what changed, before anything else. This is the single biggest emotional payoff moment in the whole design, and it is also the moment MPG's stateless "Check Again" completely missed.

**After finishing the activity.**
Feeling: closure and quiet pride — not "relief that it's over," but "I can see I got better at this, in this one sitting." This is what the Before/After Reflection (§7) exists to produce directly and explicitly, rather than leaving it to chance.

---

## 2. Conversation Design

Feedback should read as one continuous, warm voice talking *to* the student — not a report with section headers. The tiers in the main spec (§3) are a *visual/scannable* organization; the actual copy inside should flow as connected speech, with transitions doing the work section headers would otherwise do.

**Example full flow** (Knowing Myself / Foundation, "Do you agree with the author? Why or why not?"):

> **Greeting / opening**
> 読ませてもらいました!
>
> **→ into Overall Feedback (no header, just continues)**
> あなたが「小さな挑戦が自信につながる」という考えに賛成している理由が、とてもよく伝わってきました。アヤの例を自分の経験と結びつけようとしているところが素敵ですね。
>
> **→ transition into Task Achievement**
> 賛成か反対かもはっきり書けていて、理由も1つ示せています。もう少し具体的な経験を1文加えると、さらに説得力が増しますよ。
>
> **→ transition into Corrections (soft, not "here are your errors")**
> ここでちょっとだけ、気になったところをお伝えしますね。「very important thing」の部分、"a very important thing" のように "a" を入れるとより自然になります。
>
> **→ transition into Natural English**
> ちなみに、同じ気持ちを表すのに、こんな言い方もよく使われます:「That's why I believe confidence really matters.」— これは正解・不正解ではなく、もう一つの自然な表現の例です。
>
> **→ transition into Improved Version**
> 参考までに、書き直しの一例も置いておきますね(これが唯一の正解ではありません):「I agree with the author because trying new things, even small ones, helped me become more confident, just like Aya in the reading.」
>
> **→ transition into Vocabulary Feedback**
> あ、そういえば — 今日の単語「confidence」と「reflect」、しっかり使えていましたね!よければ「character」や「share」も試してみると、表現がもっと広がりますよ。
>
> **→ transition into Today's Tip**
> 今日のコツとして一つ:理由を伝えるときは "because" のあとに主語と動詞を続けます(例: because I tried something new)。あなたの文でもこの形が使えていたので、これからも意識してみましょう。
>
> **→ revision invitation (warm invite, not a demand)**
> ここまでの内容をもとに、書き直してみますか?「自分で直す」「AIと一緒に直す」「次に進む」から選べます。書き直すことも、それ自体が立派な学習ですよ。

No line in this flow says "error," "wrong," "incorrect," or names a score. The only structural markers are the natural conversational transitions ("ちなみに," "参考までに," "あ、そういえば") — the same devices a real supportive teacher uses when moving between topics in a one-on-one conversation.

---

## 3. Adaptive Feedback

Feedback depth should track the **shape** of the writing, not scale linearly with length — a long draft should never produce a proportionally long list of corrections, or it stops feeling like a conversation and starts feeling like an audit.

**One sentence** (a minimal, valid response to the prompt):
Feedback stays light: Overall Feedback + Task Achievement only, at most 1 correction if genuinely needed, 1 vocabulary note. The Improved Version tier is often skipped entirely here — rewriting a single sentence into "an improved version" of itself can feel like erasing the only thing the student wrote, so it's used only if it adds something the student couldn't otherwise see.

**Three sentences** (the platform's typical target, e.g. this lesson's 2–3 sentence prompt):
The full 8-category flow applies as designed in the main spec, at normal depth: up to 2 corrections, 1–2 natural alternatives, one improved version, standard vocabulary/tip notes.

**One paragraph** (a longer, multi-idea response):
Feedback shifts from sentence-level nitpicking to *idea-level* commentary — Task Achievement comments on how the ideas connect and flow as a whole, not on every sentence individually. Corrections keep a hard ceiling (never more than ~2–3 regardless of paragraph length) — the tutor should pick the two or three most useful corrections, not the two or three most reachable, even if a stricter read could find more. The Improved Version, for a full paragraph, may revise only the single most impactful sentence rather than rewriting the whole thing, since rewriting an entire paragraph stops feeling like "one possible version" and starts feeling like a replacement.

**The general rule**: praise and understanding can scale up with more writing (there is genuinely more to appreciate), but the *editing* layer (corrections + alternatives) has a soft ceiling regardless of input length. This is the concrete operational form of "avoid overwhelming the student" — it's not just a vibe, it's a cap the tutor's response schema should enforce (e.g., "never populate more than 3 correction items, choose the most useful ones").

---

## 4. When NOT to Correct

The tutor must treat "nothing needs fixing" as a complete, legitimate, even ideal outcome — never manufacture a correction just to have content for the Corrections tier.

**Situations where correcting would be wrong:**
- **Acceptable alternative expressions** — the student's phrasing is different from how a teacher might say it, but equally correct and natural. (MPG's own example, adapted: a student writes "I want to become someone who helps others" instead of a more "expected" phrasing — both are fine; the second is not a correction of the first.)
- **Stylistic preference** — sentence length, word order, or directness that reflects personal voice rather than an error. A short, blunt sentence is not automatically "less developed" than a longer, hedged one.
- **Already-natural English that merely isn't the most sophisticated phrasing possible** — sophistication is not the goal; naturalness is. A simple, correct sentence should never be corrected toward complexity for its own sake.
- **Minor informality appropriate to a personal-opinion task** — this is not academic writing; a conversational register is often exactly right.

**The explicit permitted response, and when to use it:**
> "これはもう十分に自然な英語です。" ("This is already very natural English.")

This should be a real, frequently-used output — not a fallback the system avoids because it "found nothing to say." When a student's writing is genuinely clean, the single best feedback is a short, genuine acknowledgment and nothing else. A tutor that always finds *something* to correct will eventually be experienced as fundamentally uncharitable, even when individually each note is gentle.

---

## 5. Progressive Revision

The tutor must remember the previous draft and its feedback, and the design goal is explicit: **praise the delta, don't repeat the checklist.**

**On a revised submission, the tutor should:**
1. **Notice what changed first**, before anything else — especially anything the previous pass flagged. "前回お伝えした "a" の抜けている部分、直せていますね!" ("You fixed the missing 'a' from before!") is the opening line, not an afterthought.
2. **Notice unprompted improvements too** — if the student added a new idea, a new target word, or a clearer opening that wasn't previously flagged at all, that gets praised on its own merits, not silently absorbed. Growth the tutor didn't ask for is still growth.
3. **If a previously flagged issue is still unfixed**, never repeat the identical sentence a second time — that reads as nagging. Reframe it once, from a different angle (a fresh example, a slightly different explanation), rather than restating the same correction verbatim. If it remains unfixed a third time, the tutor should treat it as a minor, low-priority note rather than something to keep surfacing — persistence has diminishing educational value and rising anxiety cost.
4. **Track a lightweight growth log per revision** internally (e.g., "Draft 1 → Draft 2: fixed article usage, added 'reflect'") — this feeds directly into the Before/After Reflection in §7 and, later, into any portfolio feature.
5. **Know when to say "this is ready."** After a few revision cycles (roughly 3+), if the writing is solid, the tutor should shift tone from "here's what to refine" to actively inviting closure: "ここまでとても良く書けています。もう十分ですので、次に進んでも大丈夫ですよ!" This protects against an anxious, perfectionist student stuck in an endless correction-seeking loop — the tutor's job includes knowing when to stop offering more.

---

## 6. "Why?" Learning Mode

Pressing "Why?" opens a small, self-contained teaching moment — not just an explanation, a complete micro-lesson with a natural exit.

**Structure of every "Why?" response:**
1. **The rule, in plain Japanese**, written for an A2–B1 high school student — no linguistic terminology, no "morphosyntax," no jargon a student would need to look up.
2. **A second example, different from their own sentence** — this is important: repeating their exact correction doesn't teach a transferable pattern, but a *fresh* example lets the student recognize the same rule applied somewhere new, which is what actually builds pattern recognition rather than memorizing one fix.
3. **A gentle invitation to try it themselves** — not a quiz, not mandatory, just an open door: "今度、自分の文でも試してみてくださいね" ("Try using this yourself next time"), sometimes paired with a tiny related prompt they can apply immediately in their current revision if they want to.

**Example** (for the "a very important thing" correction above):
> なぜこの直しが必要なの?
> "thing" は数えられる名詞(可算名詞)なので、単数で使うときは "a" や "an" のような冠詞が必ず必要になります。
>
> 例えばもう一つ:「Reading is an important skill.」の "an important skill" も同じ形ですね。
>
> 今度、自分の文で何か一つの名詞について話すときは、"a" や "an" が要らないか、確認してみてくださいね。

The exit is always forward-looking ("try this next time"), never backward-scolding ("you should have known this").

---

## 7. Before / After Reflection

At the end of the activity — after the student chooses "Continue" — the tutor presents a short, warm comparison of the first draft and the final draft. This is a **growth narrative, not a diff report.**

**Design principles:**
- Show the first and final draft together (stacked or side-by-side), but the accompanying commentary is qualitative and specific, never a score or percentage ("you improved from 60% to 85%" is explicitly disallowed — it reintroduces grading, which contradicts the entire philosophy).
- Call out **concrete, specific wins**: a correction that got fixed, a new target word that got added, an idea that became clearer or more detailed — pulled directly from the growth log built during revision (§5), not invented after the fact.
- Connect back to the lesson's takeaway/mission, so the reflection feels like part of the lesson's story, not a bolted-on report screen.
- End on the student, not the tool — the closing line should be about what *they* did, not what the tutor provided.

**Example closing reflection:**
> 最初の文章から、ここまでよく書き直しましたね!
>
> 最初は "confidence" だけを使っていましたが、書き直したあとは "reflect" や "character" も使えるようになっていました。冠詞の抜けも自分で直せましたし、意見の理由もより具体的になっています。
>
> 今日のテーマは「小さな挑戦が自信につながる」でしたが、あなた自身も、この文章を書き直す中で、まさにそれを実践していましたね。よくがんばりました!

This closing moment is the single place in the whole experience where the tutor explicitly tells the student they grew — it should never be skipped, rushed, or replaced with a generic "Well done!"

---

**This addendum completes the educational design. Combined with `WRITING_TUTOR_SPECIFICATION.md`, it is the full blueprint. Implementation may begin once you confirm.**
