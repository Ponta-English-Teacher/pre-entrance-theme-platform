import type { Level } from '@/types';

export interface ReadingParagraph {
  id: string;
  english: string;
  japanese: string;
  /** Simplified paraphrase, used by the "explain in easier English" help option. */
  plainEnglish: string;
  /** A light comprehension question, used by the "ask me a question" help option. */
  checkQuestion: string;
  /** Pre-generated narration audio (see scripts/generate-reading-audio.ts). Absent means no
   *  generated audio exists yet — the read-aloud help option falls back to browser TTS. */
  audioUrl?: string;
}

export interface SurveyOption {
  id: string;
  label: string;
}

export interface PreReadingSurvey {
  question: string;
  options: SurveyOption[];
}

export interface MissionCheckOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface EvidenceOption {
  id: string;
  label: string;
  paragraphId: string;
  correct: boolean;
}

/** Task 3 — Vocabulary in Context, per docs/READING_WRITING_ARCHITECTURE.md §4.
 *  A single fixed-shape task for Foundation; Advanced's richer task-type mix
 *  (inference, critical thinking) is out of scope until that level is built. */
export interface VocabInContextTask {
  quote: string;
  question: string;
  options: MissionCheckOption[];
}

export interface MissionCheck {
  question: string;
  /** Simpler restatement, for "what does this question mean?" */
  explainer: string;
  /** Japanese version of explainer, shown by the AI helper so non-fluent students can actually use it. */
  explainerJa: string;
  hint: string;
  /** Japanese version of hint, shown by the AI helper so non-fluent students can actually use it. */
  hintJa: string;
  options: MissionCheckOption[];
  /** Which paragraph the answer is grounded in, for "which paragraph should I reread?" */
  answerParagraphId: string;
  evidencePrompt: string;
  evidenceOptions: EvidenceOption[];
  vocabInContext: VocabInContextTask;
}

/** Notice Language toolbox activity types, per docs/READING_WRITING_ARCHITECTURE.md §5.
 *  Non-gating — presentational "notice this" content, never scored. */
export type NoticeLanguageActivityType =
  | 'target-vocab'
  | 'recycled-vocab'
  | 'expressions'
  | 'grammar-pattern'
  | 'discourse-marker'
  | 'main-idea'
  | 'reference-words'
  | 'paragraph-organization'
  | 'tone-purpose';

export interface NoticeLanguageActivity {
  type: NoticeLanguageActivityType;
  prompt: string;
  /** Specific items being pointed at (words, phrases, a quoted sentence) — rendered as chips/quotes. */
  items?: string[];
  /** A short explanatory note, for activity types that need more than a list of items (e.g. tone/purpose). */
  note?: string;
}

export interface WordBankEntry {
  vocabId: string;
  examplePhrase: string;
}

export interface UsefulExpression {
  phrase: string;
  japanese: string;
}

export interface WritingTask {
  prompt: string;
  promptJapanese: string;
  minSentences: number;
  /** Advisory only — never gates completion (minSentences remains the only
   *  completion requirement, per THEME_EXPERIENCE_TEMPLATE.md §9). Shown
   *  alongside a live word count so students can see how their draft
   *  compares to the target mentioned in the prompt text (e.g. "Aim for
   *  about 80–120 words."). Omit when the prompt gives no word-count
   *  guidance — the live word count still displays without a target. */
  recommendedWordRange?: [number, number];
  sentenceStarters?: string[];
  wordBank: WordBankEntry[];
  usefulExpressions: UsefulExpression[];
}

export interface ReadingLesson {
  id: string;
  themeId: string;
  level: Level;
  title: string;
  titleJapanese: string;
  estimatedMinutes: number;
  /** Routes this lesson to ReadingLessonViewV2 instead of the original
   *  ReadingLessonView (see src/app/reading/page.tsx). Absent/undefined means
   *  the original component — every theme except Theme 1 Foundation, during
   *  this prototype stage. Deliberately a version marker, not a boolean, so a
   *  future v3 fork doesn't need another field. */
  experienceVersion?: number;
  welcome: string;
  mission: string;
  preReadingSurvey: PreReadingSurvey;
  paragraphs: ReadingParagraph[];
  /** Ids into MASTER_VOCABULARY — the target words this lesson recycles from Vocabulary. */
  targetVocabIds: string[];
  /** 2-4 activities selected per docs/READING_WRITING_ARCHITECTURE.md §5 — a flexible toolbox, not a fixed checklist. */
  noticeLanguage: NoticeLanguageActivity[];
  missionCheck: MissionCheck;
  /** The `writing` field is always required so this object type-checks even
   *  before Writing content exists — but it must never be shown to students
   *  as if it were real. Set `writingReady: false` while `writing` still
   *  holds placeholder content; WritingActivity.tsx then shows the same
   *  graceful "coming soon" state it already shows when no lesson exists at
   *  all, instead of rendering the placeholder prompt. Absent/undefined
   *  means ready — every existing lesson's writing content is real. */
  writingReady?: boolean;
  writing: WritingTask;
  takeaway: string;
}

export const MASTER_READINGS: ReadingLesson[] = [

  // ── Knowing Myself — Foundation ──────────────────────────────────────────
  // Approved Version 1 lesson data (AI draft → teacher review → approved here).

  {
    id: 'km-f-reading-01',
    themeId: 'knowing-myself',
    level: 'foundation',
    title: 'Will Personality Change Over Time?',
    titleJapanese: '性格は時間とともに変わるのだろうか？',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will think about a big question: is personality something we are born with, or something we build through experience?',
    mission: 'As you read, notice the reasons the author gives for why personality can change. Think about which reason feels most true for you.',

    preReadingSurvey: {
      question: 'Which statement is closest to your opinion?',
      options: [
        { id: 'born', label: 'Personality is decided when we are born.' },
        { id: 'grows', label: 'Personality changes as we grow and gain experience.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    // Foundation manuscript rebuilt 2026-08-03 (author: Hitoshi + ChatGPT). No
    // generated audio exists yet for this passage — audioUrl intentionally
    // omitted below; ParagraphPlayButton falls back to browser TTS.
    paragraphs: [
      {
        id: 'km-f-reading-01-p1',
        english:
          'Will personality change over time? Some people think our personality is decided when we are born. Others believe it changes as we grow. What do you think?',
        japanese:
          '性格は時間とともに変わるのだろうか？　性格は生まれたときに決まっていると考える人もいます。一方で、成長するにつれて変わると信じる人もいます。あなたはどう思いますか？',
        plainEnglish:
          'Does personality change over time? Some people think we are born with our personality, and it stays the same forever. Other people think personality changes as we grow up. What do you think?',
        checkQuestion: 'According to this paragraph, what are the two different opinions about personality?',
      },
      {
        id: 'km-f-reading-01-p2',
        english:
          'Many people have different answers to this question. Today, many psychologists believe that both nature and experience are important. Although some parts of our personality may come from birth, our experiences also help shape who we are.',
        japanese:
          'この問いに対して、人々の答えはさまざまです。今日、多くの心理学者は、生まれつきの性質と経験の両方が重要だと考えています。性格の一部は生まれつきのものかもしれませんが、私たちの経験も、私たちがどんな人間であるかを形作る助けとなります。',
        plainEnglish:
          'People do not agree on the answer. Today, many experts who study the mind think two things matter: how we are born, and our experience. Some parts of our personality may come from birth. But our experiences also help make us who we are.',
        checkQuestion: 'According to this paragraph, what do many psychologists believe is important for personality?',
      },
      {
        id: 'km-f-reading-01-p3',
        english:
          'Every day, we learn from school, family, friends, and many other experiences. Sometimes we face difficult challenges. When we overcome them, we become more confident and discover new strengths. These changes are usually small, but many small experiences together can make a big difference.',
        japanese:
          '私たちは毎日、学校、家族、友人、そのほか多くの経験から学んでいます。時には難しい挑戦に直面することもあります。それを乗り越えたとき、私たちはより自信を持てるようになり、新しい強みを発見します。こうした変化はふつう小さなものですが、小さな経験が積み重なることで、大きな違いを生み出すことがあります。',
        plainEnglish:
          'Every day, we learn things from school, family, friends, and other people. Sometimes we face hard challenges. When we get through them, we feel more confident, and we find new strengths in ourselves. These changes are usually small. But many small experiences together can make a big difference.',
        checkQuestion: 'According to this paragraph, what happens when we overcome a difficult challenge?',
      },
      {
        id: 'km-f-reading-01-p4',
        english:
          'Instead of asking, "What kind of person am I?", it may be better to ask, "What kind of person am I becoming?" As we reflect on our experiences and continue to develop, we continue to build our personality. Our values also grow through these experiences and help shape the person we become.',
        japanese:
          '「自分はどんな人間なのか？」と問うのではなく、「自分はどんな人間になりつつあるのか？」と問うほうがよいかもしれません。経験を振り返り、成長し続けることで、私たちは性格を築き続けています。価値観もまた、こうした経験を通して育ち、私たちがなる人間を形作る助けとなります。',
        plainEnglish:
          'Instead of asking, "What kind of person am I?", maybe it is better to ask, "What kind of person am I becoming?" When we reflect on our experiences and keep trying to develop, we keep building our personality. Our values also grow through these experiences, and they help make us who we become.',
        checkQuestion: 'According to this final paragraph, what question does the author suggest asking instead of "What kind of person am I?"',
      },
    ],

    targetVocabIds: [
      'km-f-01', // personality
      'km-f-06', // experience
      'km-f-07', // challenge
      'km-f-02', // confidence
      'km-f-04', // strength
      'km-f-08', // develop
      'km-f-10', // reflect
      'km-f-11', // value
    ],

    // Not created in this pass — see the reported limitation. Empty array
    // renders the section container with no cards, rather than leaving stale
    // content from the old passage.
    noticeLanguage: [],

    missionCheck: {
      question: 'According to the passage, what do today\'s psychologists believe about personality?',
      explainer: 'In simple words — do experts think personality comes only from birth, or from something else too?',
      explainerJa: '簡単に言うと、専門家は性格が生まれつきだけで決まると考えているのか、それとも他の何かも関係すると考えているのか、という質問です。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Personality comes only from how we are born.', correct: false },
        { id: 'b', label: 'Both how we are born and our experiences are important.', correct: true },
        { id: 'c', label: 'Personality never changes after we are born.', correct: false },
      ],
      answerParagraphId: 'km-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading best shows that small experiences can change our personality?',
      evidenceOptions: [
        { id: 'e1', label: 'Will personality change over time?', paragraphId: 'km-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'These changes are usually small, but many small experiences together can make a big difference.', paragraphId: 'km-f-reading-01-p3', correct: true },
        { id: 'e3', label: 'Our values also grow through these experiences and help shape the person we become.', paragraphId: 'km-f-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'our experiences also help shape who we are',
        question: 'What does "shape" mean here?',
        options: [
          { id: 'a', label: 'To give something a certain form, or make it become a certain way.', correct: true },
          { id: 'b', label: 'A round or square object.', correct: false },
          { id: 'c', label: 'To break something into pieces.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Think about a challenge or new experience that helped you grow. What happened, and how did it change you? (If nothing comes to mind, write about a challenge you would like to try someday, and why.)',
      promptJapanese: 'あなたが成長するきっかけになった、難しいことや新しい経験について考えてみましょう。何が起きて、それはあなたをどう変えましたか？（思いつかない場合は、いつか挑戦してみたいことと、その理由を書いてください。）',
      minSentences: 2,
      sentenceStarters: ['One challenge I faced was', 'At first, I felt', 'After that experience, I', 'This experience taught me', 'In the future, I would like to try'],
      wordBank: [
        { vocabId: 'km-f-01', examplePhrase: 'My personality is...' },
        { vocabId: 'km-f-06', examplePhrase: 'This experience helped me...' },
        { vocabId: 'km-f-07', examplePhrase: 'It was a big challenge for me.' },
        { vocabId: 'km-f-02', examplePhrase: 'I felt more confident after...' },
        { vocabId: 'km-f-04', examplePhrase: 'I found a new strength in myself.' },
        { vocabId: 'km-f-08', examplePhrase: 'I want to keep developing as a person.' },
        { vocabId: 'km-f-10', examplePhrase: 'When I reflect on it now...' },
        { vocabId: 'km-f-11', examplePhrase: 'This experience changed my values.' },
      ],
      usefulExpressions: [
        { phrase: 'face a challenge', japanese: '挑戦に立ち向かう' },
        { phrase: 'overcome a challenge', japanese: '困難を乗り越える' },
        { phrase: 'discover a new strength', japanese: '新しい強みを見つける' },
        { phrase: 'made a big difference', japanese: '大きな違いを生んだ' },
        { phrase: 'help shape who I am', japanese: '自分がどんな人かを形作る' },
      ],
    },

    takeaway: 'Instead of asking, "What kind of person am I?", it may be better to ask, "What kind of person am I becoming?"',
  },

  // ── Knowing Myself — Advanced ─────────────────────────────────────────────
  // Built 2026-08-05 from the frozen manuscript, docs/THEME_01_ADVANCED_READING_PASSAGE.md
  // ("Nature or Nurture?"). Paragraph `english` fields are verbatim copies of that
  // manuscript — do not edit the wording here without updating the source doc first.
  // Writing task approved and added the same day.

  {
    id: 'km-s-reading-01',
    themeId: 'knowing-myself',
    level: 'advanced',
    title: 'Nature or Nurture: Where Does Personality Really Come From?',
    titleJapanese: '生まれか、育ちか——性格は本当はどこから来るのか？',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore one of psychology\'s oldest debates: is personality mainly something we are born with, or something shaped by our experiences? By the end, you may find the real answer is more interesting than simply choosing a side.',
    mission: 'As you read, notice the evidence given for both nature and nurture, and pay attention to how the passage moves from two competing sides toward a more complex conclusion. Think about which parts of your own personality feel inherited, and which feel learned.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'nature', label: 'Personality mainly comes from genetics — the qualities we are born with.' },
        { id: 'nurture', label: 'Personality mainly comes from environment and experience.' },
        { id: 'both', label: 'Personality comes from an interaction between both.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    // Verbatim from docs/THEME_01_ADVANCED_READING_PASSAGE.md — approved final
    // manuscript, frozen 2026-08-05. No generated audio exists yet for this
    // passage — audioUrl intentionally omitted, matching Foundation's pattern.
    paragraphs: [
      {
        id: 'km-s-reading-01-p1',
        english:
          'Some people are outgoing and confident, while others are quiet and cautious. Some enjoy taking risks, while others prefer stability and routine, and still others fall somewhere between the two. These differences appear early in life, often before a child even starts school, and tend to stay remarkably stable as we grow older. For many years, psychologists have tried to answer a simple but difficult question: are such differences mainly the result of nature, the qualities we are born with, or nurture, the experiences that shape us afterward? Both ideas are supported by real evidence, and neither fully explains personality on its own. Increasingly, however, modern psychology suggests that personality develops not from one source or the other, but from the ongoing interaction between them.',
        japanese:
          '外向的で自信に満ちた人もいれば、物静かで慎重な人もいます。リスクを取ることを好む人もいれば、安定した決まった生活を好む人もいて、そのどちらでもない人もいます。こうした違いは人生のごく早い時期——多くの場合、子供が学校に通い始める前——にすでに現れ、成長してからもかなり安定して変わらない傾向があります。長年にわたり、心理学者たちはある単純ながらも難しい問いに答えようとしてきました。こうした違いは、主に生まれつきの性質（nature）によるものなのか、それとも、その後の経験によって形作られるもの（nurture）なのか、という問いです。どちらの考え方にも実際の証拠があり、どちらか一方だけでは性格を完全に説明することはできません。しかし、現代心理学ではますます、性格はどちらか一方からではなく、両者の絶え間ない相互作用（interaction）から生まれると考えられるようになっています。',
        plainEnglish:
          'Some people are friendly and confident. Other people are quiet and careful. Some people like taking risks. Other people like a safe, steady life. These differences show up very early, often before a child starts school. They usually stay the same as people grow older. For a long time, psychologists have asked a simple but hard question: do these differences come mainly from nature — the qualities we are born with — or from nurture — the things that happen to us later? Both ideas have real evidence behind them. Neither one explains personality completely by itself. More and more, modern psychology says that personality comes from both nature and nurture working together, not from just one of them.',
        checkQuestion: 'According to this paragraph, what question have psychologists tried to answer for many years?',
      },
      {
        id: 'km-s-reading-01-p2',
        english:
          'Some researchers argue that inherited characteristics have a far greater influence on personality than many people once believed. Even very young infants show clear differences in temperament — some are naturally calm, others easily startled — before most of their later experiences have had a chance to shape them. One of the strongest pieces of evidence for this view comes from studies of identical twins. Even when such twins are raised apart, in different families and sometimes different countries, they often grow up to develop surprisingly similar personalities, interests, and habits, discovering when they finally meet as adults that they share far more than they ever expected. Two people who never shared a childhood can still laugh in the same way or worry about the same small things. These findings suggest that the qualities we inherit from our parents play a real and lasting role in shaping who we become.',
        japanese:
          '一部の研究者は、生まれつき受け継いだ特徴が、かつて多くの人が考えていたよりもはるかに大きく性格に影響していると主張します。ごく幼い乳児でさえ、気質（temperament）にはっきりとした違いが見られます——生まれつき落ち着いている子もいれば、すぐに驚いてしまう子もいます——それは、その後の経験がその子に影響を与える機会をほとんど持つ前のことです。この見方を支える最も強力な証拠のひとつは、一卵性双生児を対象にした研究から得られています。そうした双子が、別々の家庭で、時には異なる国で育てられた場合でも、大人になって成長すると、驚くほど似た性格や興味、習慣を持つようになることが多く、ついに再会したときには、予想していたよりもずっと多くのものを分かち合っていたことに気づくのです。子供時代を一度も共に過ごしたことのない二人が、同じように笑ったり、同じような小さなことを心配したりすることもあります。こうした発見は、私たちが親から受け継ぐ（inherit）性質が、私たちがどんな人間になるかを形作るうえで、本当に、そして長く続く役割を果たしていることを示唆しています。',
        plainEnglish:
          'Some researchers say that the characteristics we inherit have a much bigger effect on personality than people once thought. Even very young babies show clear differences in temperament. Some babies are naturally calm. Other babies are easily surprised. This happens before their environment has had much time to affect them. One of the strongest pieces of evidence for this idea comes from studies of identical twins. Even when these twins grow up apart, in different families and sometimes different countries, they often develop very similar personalities, interests, and habits. When they finally meet as adults, they discover they share much more than they expected. Two people who never grew up together can still laugh the same way or worry about the same small things. This suggests that the qualities we inherit from our parents play a real, lasting part in who we become.',
        checkQuestion: 'According to this paragraph, what does the study of identical twins raised apart suggest about personality?',
      },
      {
        id: 'km-s-reading-01-p3',
        english:
          'Other researchers, however, emphasize the importance of nurture. They argue that personality continues to develop throughout life through family relationships, education, friendships, work, and countless smaller experiences that accumulate over time. Although each person is born with certain tendencies, the environment can strengthen, weaken, or even change the way those tendencies are expressed. A child who is naturally shy, for example, may become noticeably more confident after years of encouragement from teachers, friends, and family who gently invite her to participate rather than allowing her to withdraw. This kind of change is not limited to childhood: an employee who once avoided speaking up in meetings may, after years of steady practice and support from colleagues, gradually build the resilience to lead a difficult project herself, driven by a motivation that grew stronger with each small success. From this perspective, personality is not fixed at birth, and neither are our aspirations. Both continue to grow, sometimes quietly and sometimes dramatically, as we learn, adapt, and respond to the world around us.',
        japanese:
          'しかし、他の研究者たちは、育ち（nurture）の重要性を強調します。彼らは、性格は家族関係、教育、友人関係、仕事、そしてその他数えきれないほどの小さな経験が積み重なることを通じて、人生を通してずっと発達し続けると主張します。人はそれぞれ、生まれつきある種の傾向を持って生まれますが、環境はその傾向をより強めたり、弱めたり、あるいは表れ方そのものを変えたりすることができます。例えば、生まれつき内気な子供は、参加するようにと優しく誘い続けてくれる先生や友人、家族からの励ましを何年も受けることで、目に見えて自信を持てるようになることがあります。こうした変化は子供時代だけに限られたものではありません。かつて会議で発言することを避けていた社員が、何年もの地道な練習と同僚からの支えを経て、少しずつ、難しいプロジェクトを自ら率いるだけの回復力（resilience）を築き、小さな成功を重ねるたびに強くなっていくやる気（motivation）に後押しされていく、ということもあるのです。この見方からすれば、性格は生まれたときに固定されているわけではなく、私たちの志（aspirations）もまた同じです。そのどちらも、私たちが学び、適応し、周りの世界に反応していく中で、時には静かに、時には劇的に、成長し続けるのです。',
        plainEnglish:
          'Other researchers, though, focus on how important nurture is. They say that personality keeps developing throughout our whole lives, through family relationships, education, friendships, work, and countless smaller experiences that add up over time. Every person is born with certain tendencies, but the environment can make those tendencies stronger, weaker, or even change how they show up. For example, a child who is naturally shy might become much more confident after years of encouragement from teachers, friends, and family who keep gently asking her to join in, instead of letting her stay quiet. This kind of change is not only something that happens in childhood. An employee who used to avoid speaking up in meetings might, after years of practice and support from co-workers, slowly build the resilience to lead a difficult project herself — helped by a motivation that becomes stronger with every small success. From this point of view, personality is not fixed when we are born, and neither are our dreams for the future. Both keep growing, sometimes slowly and sometimes suddenly, as we learn, adjust, and respond to the world around us.',
        checkQuestion: 'According to this paragraph, how can a naturally shy child become more confident?',
      },
      {
        id: 'km-s-reading-01-p4',
        english:
          'Taken together, these findings suggest a different way of thinking about personality. Inherited characteristics may provide a starting point — a certain temperament, a natural tendency — but the environment plays an important role in how those characteristics develop over time. In other words, nature and nurture do not compete — they work together, and neither one alone explains who someone becomes. Understanding this relationship can make us more patient with people whose starting point was simply different from our own, and more honest about our own. We cannot choose the qualities we were born with, and there is little value in wishing they were different. But we can choose, in large part, how we respond to our experiences, and whether we allow them to help us grow. The question worth asking, then, is not whether nature or nurture matters more, but this: which parts of who you are did you inherit, and which have you built through everything you have lived and learned so far?',
        japanese:
          'これらの発見を総合すると、性格についての異なる考え方が見えてきます。生まれつき受け継いだ特徴は、ある種の気質、生まれつきの傾向という出発点を与えてくれるかもしれませんが、その特徴が実際にどのように発達していくかについては、環境が重要な役割を果たします。言い換えれば、生まれ（nature）と育ち（nurture）は互いに競い合っているのではなく、共に働き合っており、そのどちらか一方だけでは、ある人がどのような人間になるのかを説明することはできません。この関係を理解することは、私たちが、自分とは違う出発点を持つ人々に対してより寛容になり、また自分自身についてもより正直になる助けとなります。私たちは、自分が生まれ持った性質を選ぶことはできませんし、それが違っていればよかったと願うことにあまり意味はありません。しかし私たちは、自分の経験にどう反応するか、そして、その経験を自分の成長の助けとするかどうかを、大部分において選ぶことができます。だとすれば、本当に問うべき問いは、もはや生まれと育ちのどちらがより重要かということではなく、次のことなのかもしれません——あなたという人間のどの部分を、あなたは受け継いだのでしょうか。そして、これまで生きてきて、学んできたすべてを通して、あなたはどの部分を自ら築いてきたのでしょうか。',
        plainEnglish:
          'Taken all together, these findings point to a different way of thinking about personality. Inherited characteristics may give us a starting point — a certain temperament, a natural tendency — but the environment plays an important part in how those characteristics actually develop over time. In other words, nature and nurture do not compete with each other. They work together, and neither one by itself can explain who a person becomes. Understanding this can help us be more patient with people who started from a different place than we did, and more honest about ourselves too. We cannot choose the qualities we were born with, and there is little point in wishing they were different. But we can choose, in large part, how we respond to our experiences, and whether we let those experiences help us grow. So maybe the real question is no longer whether nature or nurture matters more. Maybe it is this: which parts of who you are did you inherit — and which parts have you built through everything you have lived and learned so far?',
        checkQuestion: 'According to this final paragraph, what does understanding the relationship between nature and nurture help us do?',
      },
    ],

    targetVocabIds: [
      'km-s-01', // nature
      'km-s-02', // nurture
      'km-s-03', // temperament
      'km-s-04', // inherit
      'km-s-05', // interaction
      'km-s-06', // aspiration
      'km-s-07', // motivation
      'km-s-08', // resilience
    ],

    // Deferred, matching Theme 1 Foundation's own current state — see that
    // entry's comment. Not part of this task's scope.
    noticeLanguage: [],

    // Mission Check's three fixed slots are deliberately designed so that,
    // together, they cover all seven comprehension dimensions requested for
    // this level: Task 1 (main question) tests main idea + interpretation of
    // the passage's scientific stance + inference (the passage never states
    // its conclusion as one quotable line — the correct option requires
    // synthesizing paragraphs 2-4 and rejecting a plausible misreading of the
    // twin-study evidence). Task 2 (supporting evidence) tests evidence
    // selection *and* comparison, since its distractors are drawn from the
    // nature paragraph, the nurture paragraph, and the synthesis paragraph,
    // requiring genuine discrimination between the two arguments rather than
    // simple quote-matching. Task 3 (vocabulary in context) tests the word
    // "interaction" — one of the eight official target words — in a context
    // where its meaning is easy to misread as "conversation."
    missionCheck: {
      question: 'Based on the passage as a whole, which statement would the author most likely agree with?',
      explainer: 'In simple words — after reading the whole passage, which idea does the author seem to actually believe is true?',
      explainerJa: '簡単に言うと、文章全体を読んだ後、筆者は実際にはどの考えが正しいと思っているようか、という質問です。',
      hint: 'Look especially at paragraph 4, but think about how paragraphs 2 and 3 work together too.',
      hintJa: '特に第4段落に注目してください。ただし、第2段落と第3段落がどのように関係し合っているかも考えてみましょう。',
      options: [
        { id: 'a', label: 'Personality is decided entirely before birth, and experience can only make small adjustments to it.', correct: false },
        { id: 'b', label: 'Nature provides a starting point, but experience plays a real role in how that starting point actually develops.', correct: true },
        { id: 'c', label: 'The studies of identical twins prove that environment has almost no real effect on personality.', correct: false },
      ],
      answerParagraphId: 'km-s-reading-01-p4',
      evidencePrompt: 'Which quotation from the passage best shows evidence specifically supporting the nurture side of the debate?',
      evidenceOptions: [
        {
          id: 'e1',
          label: 'Even very young infants show clear differences in temperament — some are naturally calm, others easily startled — before most of their later experiences have had a chance to shape them.',
          paragraphId: 'km-s-reading-01-p2',
          correct: false,
        },
        {
          id: 'e2',
          label: 'an employee who once avoided speaking up in meetings may, after years of steady practice and support from colleagues, gradually build the resilience to lead a difficult project herself',
          paragraphId: 'km-s-reading-01-p3',
          correct: true,
        },
        {
          id: 'e3',
          label: 'In other words, nature and nurture do not compete — they work together, and neither one alone explains who someone becomes.',
          paragraphId: 'km-s-reading-01-p4',
          correct: false,
        },
      ],
      vocabInContext: {
        quote: 'personality develops not from one source or the other, but from the ongoing interaction between them',
        question: 'What does "interaction" mean in this sentence?',
        options: [
          { id: 'a', label: 'The way two things affect each other and work together, rather than acting separately.', correct: true },
          { id: 'b', label: 'A short conversation between two people.', correct: false },
          { id: 'c', label: 'A single, one-time event that changes something permanently.', correct: false },
        ],
      },
    },

    // Advanced Writing — revised 2026-08-05 to align with docs/WRITING_PHILOSOPHY.md
    // (the permanent Writing philosophy, frozen the same day). The reading's
    // nature/nurture framework is used here only as a lens for the student to
    // examine their own personality — never as something to evaluate or
    // summarize. Per docs/READING_WRITING_ARCHITECTURE.md §6, Advanced's task
    // tier is "Explain your opinion" (80–120 words); the schema only gates on
    // minSentences, so 5 sentences approximates that target while the prompt
    // itself states the word range explicitly.
    writing: {
      prompt:
        'Think about your own personality. Which qualities do you think you were born with? Which qualities have you developed through your experiences? Is there anything about yourself that you would still like to change? Explain your ideas with reasons or examples. Aim for about 80–120 words.',
      promptJapanese:
        '自分自身の性格について考えてみましょう。生まれつき持っていると思う資質はどれですか？経験を通して身につけてきた資質はどれですか？自分自身について、まだ変えたいと思うところはありますか？理由や例を挙げながら、自分の考えを説明してください。目安は80〜120語です。',
      minSentences: 5,
      recommendedWordRange: [80, 120],
      sentenceStarters: [
        'I think I was born with',
        'Through my experiences, I have developed',
        'For example,',
        'One thing I would still like to change is',
        'This is because',
      ],
      wordBank: [
        { vocabId: 'km-s-01', examplePhrase: 'I think my curiosity is part of my nature — I\'ve been asking questions since I was very small.' },
        { vocabId: 'km-s-02', examplePhrase: 'Through nurture, years of practice helped me become more confident than I used to be.' },
        { vocabId: 'km-s-03', examplePhrase: 'My temperament has always been calm, even when I was very young.' },
        { vocabId: 'km-s-04', examplePhrase: 'I think I inherited my sense of humor from my father.' },
        { vocabId: 'km-s-05', examplePhrase: 'In the end, I think it\'s an interaction between what I was born with and what I\'ve experienced.' },
        { vocabId: 'km-s-06', examplePhrase: 'One of my aspirations is to become more outgoing than I am now.' },
        { vocabId: 'km-s-07', examplePhrase: 'My motivation to keep improving comes mostly from my own experiences, not from being told to.' },
        { vocabId: 'km-s-08', examplePhrase: 'I built my resilience by facing real difficulties, not because I was simply born that way.' },
      ],
      usefulExpressions: [
        { phrase: 'in my opinion', japanese: '私の意見では' },
        { phrase: 'from my own experience', japanese: '自分自身の経験から' },
        { phrase: 'one of my strengths is', japanese: '私の長所の一つは' },
        { phrase: 'over time, I have become', japanese: '時間とともに、私は～になった' },
        { phrase: 'I would like to become someone who', japanese: '～な人になりたい' },
      ],
    },

    takeaway: 'The question worth asking, then, is not whether nature or nurture matters more, but this: which parts of who you are did you inherit, and which have you built through everything you have lived and learned so far?',
  },

  // ── What Does It Mean to Be a University Student? — Foundation ─────────────
  // Rebuilt 2026-08-07 from the frozen manuscript (docs/THEME_02_MANUSCRIPT.md),
  // replacing the old pre-redevelopment "Sora" narrative entirely, per the
  // full-rebuild-not-revision policy. The Advanced entry below is a genuinely
  // separate manuscript, not an extension of this one (READING_WRITING_
  // ARCHITECTURE.md §2).

  {
    id: 'us-f-reading-01',
    themeId: 'university-student',
    level: 'foundation',
    title: 'What Does It Mean to Be a University Student?',
    titleJapanese: '大学生になるということ',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will think about what it really means to become a university student — not the practical details, but the shift toward real independence and responsibility.',
    mission: 'As you read, notice what actually changes once nobody is checking on you anymore. Think about what kind of responsibility you feel ready for.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own feeling about starting university?',
      options: [
        { id: 'ready', label: 'I feel ready to manage things on my own.' },
        { id: 'nervous', label: 'I feel a little nervous about having so much freedom.' },
        { id: 'unsure', label: "I'm not sure yet." },
      ],
    },

    // Foundation manuscript frozen 2026-08-07 (author: Hitoshi + ChatGPT), via
    // Claude first draft, revised together. English fields are verbatim from
    // the frozen manuscript — do not edit the wording here without revising
    // the source manuscript first.
    paragraphs: [
      {
        id: 'us-f-reading-01-p1',
        english:
          'What does it really mean to be a university student? At first, the answer seems simple: go to class, do your assignments, and pass your exams. But very quickly, new students notice something bigger — no one is watching over them anymore.',
        japanese:
          '大学生になるとは、本当はどういうことなのでしょうか？　最初は、答えは単純に思えます——授業に出て、課題をやり、試験に合格すること。しかし、すぐに新入生たちは、もっと大きな何かに気づきます——もう誰も自分を見張っていないということです。',
        plainEnglish:
          'What does it really mean to be a university student? At first, it seems simple: go to class, do your work, and pass your tests. But new students quickly notice something bigger — nobody is watching them anymore.',
        checkQuestion: 'According to this paragraph, what do new students notice very quickly?',
      },
      {
        id: 'us-f-reading-01-p2',
        english:
          'In high school, teachers checked attendance every morning and reminded students about deadlines. At university, no one calls your name or reminds you when a submission is due. You have to manage your own schedule, remember your own deadlines, and decide, every day, whether to actually show up.',
        japanese:
          '高校では、先生が毎朝出席を確認し、締め切りについて生徒に知らせてくれました。大学では、誰もあなたの名前を呼びませんし、提出物の締め切りを教えてくれる人もいません。あなたは自分のスケジュールを自分で管理し、自分で締め切りを覚え、そして毎日、実際に授業に出るかどうかを自分で決めなければなりません。',
        plainEnglish:
          'In high school, teachers checked attendance every morning and reminded students about deadlines. At university, no one calls your name or reminds you when something is due. You have to manage your own schedule, remember your own deadlines, and decide every day whether to actually go to class.',
        checkQuestion: 'According to this paragraph, what did teachers do in high school that no one does at university?',
      },
      {
        id: 'us-f-reading-01-p3',
        english:
          'This freedom can feel like a real challenge at first. Missing one class does not feel serious in the moment — but a semester built on small choices like that adds up fast. Being independent does not mean nobody cares what you do. It means you are the one who has to care.',
        japanese:
          'この自由は、最初は本当に難しく感じられることがあります。一回授業を休んでも、その瞬間には大したことに感じないかもしれません——しかし、そうした小さな選択の積み重ねでできた一学期は、あっという間に大きな差になります。自立しているということは、誰もあなたのすることを気にかけていないという意味ではありません。それは、あなた自身が気にかけなければならない人になる、という意味です。',
        plainEnglish:
          'This freedom can feel really difficult at first. Missing one class does not feel like a big deal at the time — but a whole semester made of small choices like that adds up quickly. Being independent does not mean nobody cares what you do. It means you are the person who has to care.',
        checkQuestion: "According to this paragraph, what does 'being independent' actually mean?",
      },
      {
        id: 'us-f-reading-01-p4',
        english:
          'This is what real responsibility looks like — not one big moment, but many small choices, every week, that nobody else will make for you. Being independent like this is not always easy, but it opens doors that never existed before: new choices, new challenges, and real chances to grow. Students who learn to manage this responsibility early do not just survive university — they develop into someone stronger, more capable, and ready for whatever comes next.',
        japanese:
          'これが、本当の責任というものの姿です——一つの大きな瞬間ではなく、誰も代わりにやってくれない、毎週の数えきれない小さな選択の積み重ねです。このように自立することは、いつも簡単というわけではありませんが、これまで存在しなかった扉を開いてくれます——新しい選択、新しい挑戦、そして本当に成長できるチャンスです。早いうちにこの責任をうまく管理できるようになった学生は、ただ大学生活を乗り切るだけではありません——彼らはより強く、より力のある、そしてこれから何が来ても対応できる人へと成長していきます。',
        plainEnglish:
          'This is what real responsibility looks like — not one big moment, but many small choices every week that nobody else will make for you. Becoming independent like this is not always easy, but it opens doors that did not exist before: new choices, new challenges, and real chances to grow. Students who learn to manage this responsibility early do not just get through university — they grow into someone stronger, more capable, and ready for whatever comes next.',
        checkQuestion: 'According to this final paragraph, what happens to students who learn to manage this responsibility early?',
      },
    ],

    targetVocabIds: [
      'us-f-03', // assignment
      'us-f-01', // attendance
      'us-f-02', // submission
      'us-f-06', // manage
      'us-f-08', // challenge
      'us-f-04', // independent
      'us-f-05', // responsibility
      'us-f-09', // develop
    ],

    // Deferred, matching Theme 1's own current state — see that entry's
    // comment. Not part of this task's scope.
    noticeLanguage: [],

    missionCheck: {
      question: 'According to the passage, what changes when a student goes from high school to university?',
      explainer: 'In simple words — what is different about attendance and deadlines at university compared to high school?',
      explainerJa: '簡単に言うと、大学では出席や締め切りについて、高校と比べて何が違うのか、という質問です。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Teachers still check attendance and remind students about deadlines, just like in high school.', correct: false },
        { id: 'b', label: 'No one checks attendance or reminds students about deadlines — students must manage this themselves.', correct: true },
        { id: 'c', label: 'Attendance and deadlines no longer matter at university.', correct: false },
      ],
      answerParagraphId: 'us-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading best shows that being independent does not mean nobody cares?',
      evidenceOptions: [
        { id: 'e1', label: 'No one calls your name or reminds you when a submission is due.', paragraphId: 'us-f-reading-01-p2', correct: false },
        { id: 'e2', label: 'Being independent does not mean nobody cares what you do. It means you are the one who has to care.', paragraphId: 'us-f-reading-01-p3', correct: true },
        { id: 'e3', label: 'They begin to develop into someone stronger, more capable, and ready for whatever comes next.', paragraphId: 'us-f-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'a semester built on small choices like that adds up fast',
        question: 'What does "adds up" mean here?',
        options: [
          { id: 'a', label: 'Small things gradually combine to create a bigger result.', correct: true },
          { id: 'b', label: 'To calculate a math problem correctly.', correct: false },
          { id: 'c', label: 'To become suddenly very expensive.', correct: false },
        ],
      },
    },

    // Foundation Writing — per docs/WRITING_PHILOSOPHY.md, a short personal
    // "Answer a question" task (READING_WRITING_ARCHITECTURE.md §6), not a
    // comprehension check on the passage.
    writing: {
      prompt: 'Think about starting university. What is one small responsibility you will need to manage on your own for the first time? How do you feel about it?',
      promptJapanese: '大学生活が始まったら、あなたが自分自身で管理しなければならない小さな責任は何だと思いますか？それについてどう感じますか？',
      minSentences: 2,
      sentenceStarters: ['One responsibility I will have is', 'At first, I think I will feel', 'To manage this well, I will', 'I am looking forward to'],
      wordBank: [
        { vocabId: 'us-f-01', examplePhrase: 'I know my attendance will matter more than I expect.' },
        { vocabId: 'us-f-02', examplePhrase: 'I want to remember every submission deadline.' },
        { vocabId: 'us-f-03', examplePhrase: 'I plan to start each assignment early.' },
        { vocabId: 'us-f-04', examplePhrase: 'I am ready to become more independent.' },
        { vocabId: 'us-f-05', examplePhrase: "I'm ready for more responsibility." },
        { vocabId: 'us-f-06', examplePhrase: 'I want to manage my own schedule well.' },
        { vocabId: 'us-f-08', examplePhrase: 'This will be a real challenge for me.' },
        { vocabId: 'us-f-09', examplePhrase: 'I hope to develop good habits early.' },
      ],
      usefulExpressions: [
        { phrase: 'I am ready to...', japanese: '私は...する準備ができています' },
        { phrase: 'This will be a challenge, but...', japanese: 'これは挑戦になると思いますが、...' },
        { phrase: 'One thing I want to manage well is...', japanese: 'うまく管理したいことの一つは...です' },
        { phrase: 'I hope to develop...', japanese: '私は...を身につけたいです' },
        { phrase: 'I am looking forward to...', japanese: '私は...を楽しみにしています' },
      ],
    },

    takeaway: 'Being independent like this is not always easy, but it opens doors that never existed before: new choices, new challenges, and real chances to grow.',
  },

  // ── What Does It Mean to Be a University Student? — Advanced ────────────────
  // Built 2026-08-07 from the frozen manuscript (docs/THEME_02_MANUSCRIPT.md).
  // Genuinely separate manuscript from Foundation, not an extension of it
  // (READING_WRITING_ARCHITECTURE.md §2) — Foundation stays concrete/daily
  // (attendance, one missed class); Advanced explores the psychological shift
  // from externally-imposed structure to self-generated structure.

  {
    id: 'us-s-reading-01',
    themeId: 'university-student',
    level: 'advanced',
    title: 'What Does Independence Actually Require?',
    titleJapanese: '自立には、本当は何が必要なのか？',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore a question that looks simple on the surface but isn\'t: what does it actually mean to become independent? By the end, you may find that independence has less to do with freedom, and more to do with a responsibility you have to build for yourself.',
    mission: 'As you read, notice how the passage redefines self-discipline, initiative, and commitment. Think about which of these you already practice, and which you will need to build for the first time.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'freedom', label: 'Independence mainly means having more freedom and fewer people checking on you.' },
        { id: 'structure', label: 'Independence mainly means building your own structure and discipline.' },
        { id: 'both', label: 'Independence comes from both freedom and self-built structure together.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    // Advanced manuscript frozen 2026-08-07 (author: Hitoshi + ChatGPT), via
    // Claude first draft, revised together over three rounds (positive
    // Foundation ending, trimmed Advanced opening, "obedient" reworded,
    // added closing line). English fields are verbatim from the frozen
    // manuscript — do not edit the wording here without revising the source
    // manuscript first.
    paragraphs: [
      {
        id: 'us-s-reading-01-p1',
        english:
          'For most students, the first weeks of university feel like an unusual kind of freedom. Nobody checks whether you attended a lecture. Nobody reminds you, the night before, that an essay is due tomorrow. It is easy to mistake this for simplicity — as if independence just means fewer people telling you what to do. In reality, something far more demanding is happening underneath the surface: the structure that used to be provided for you now has to be built by you, and almost nobody warns incoming students how difficult that quietly becomes. A student can walk past an empty lecture hall and not realize until weeks later what that missed hour actually cost them.',
        japanese:
          'ほとんどの学生にとって、大学生活最初の数週間は、これまでにない自由のように感じられます。誰も、あなたが講義に出席したかどうかを確認しません。誰も、前の晩に「明日レポートの締め切りだよ」と教えてくれません。これを「単純なこと」——自立とは単に、あれこれ指示してくる人が少なくなることだ——と勘違いするのは簡単です。しかし実際には、その表面の下でずっと厳しいことが起きています。かつて誰かが用意してくれていた「構造」を、これからは自分自身で築かなければならないのです。そして、それがどれほど静かに難しくなっていくかを、新入生に前もって警告してくれる人は、ほとんどいません。ある学生は、誰もいない講義室の前を通り過ぎても、その時は何も感じないかもしれません。しかし、その一時間を逃したことが実際に何を意味していたのか、本当に気づくのは、何週間も後のことなのです。',
        plainEnglish:
          'For most students, the first weeks of university feel like a strange kind of freedom. Nobody checks whether you went to a lecture. Nobody reminds you the night before that an essay is due tomorrow. It is easy to think this is simple — as if independence just means fewer people telling you what to do. But really, something much harder is happening underneath. The structure that used to be given to you now has to be built by you, and almost nobody warns new students how hard that quietly becomes. A student can walk past an empty lecture hall and not understand until weeks later what that one missed hour actually cost them.',
        checkQuestion: 'According to this paragraph, what mistake do students often make about what independence means?',
      },
      {
        id: 'us-s-reading-01-p2',
        english:
          'In high school, most students never had to invent their own sense of priority, because priorities arrived ready-made. A teacher decided which assignment mattered this week; a fixed timetable decided which subject came next; a strict deadline, enforced by someone else, decided when the work actually had to be finished. Students who performed well under this system succeeded because they were skilled at following a structure someone else had already designed, not because they had learned to build one themselves. University quietly removes that designer without replacing them. Suddenly, a student has to decide, alone, which task deserves attention first, which deadline is genuinely urgent, and which can reasonably wait — decisions that used to belong to someone else, made by someone who is no longer in the room.',
        japanese:
          '高校では、ほとんどの生徒は、自分自身で「何を優先するか」を考え出す必要がありませんでした。優先順位はすでに出来上がった形で与えられていたからです。今週どの課題が重要かは先生が決め、次にどの科目をやるかは決まった時間割が決め、実際にいつまでに仕上げなければならないかは、誰か他の人が課す厳格な締め切りが決めていました。このシステムのもとでうまくやれていた生徒たちが成功していたのは、他の誰かがすでにデザインした構造にうまく従うことに長けていたからであり、自分自身でその構造を築くことを学んでいたからではありません。大学は、その「デザインしてくれる人」を、代わりを用意しないまま静かに取り去ってしまいます。突然、学生は一人で決めなければならなくなります——どの課題に真っ先に取り組むべきか、どの締め切りが本当に緊急なのか、そしてどれなら待っても大丈夫なのか。それはかつて他の誰かのものだった決定であり、その人はもうこの部屋にはいないのです。',
        plainEnglish:
          'In high school, most students never had to figure out their own sense of priority, because priorities were already decided for them. A teacher decided which assignment mattered this week; a fixed timetable decided which subject came next; a strict deadline, enforced by someone else, decided when the work really had to be finished. Students who did well under this system succeeded because they were good at following a structure someone else had already made, not because they had learned to build one themselves. University quietly takes that person away without replacing them. Suddenly, a student has to decide alone which task matters most, which deadline is really urgent, and which one can wait — decisions that used to belong to someone else, someone who is no longer there.',
        checkQuestion: 'According to this paragraph, why did students who performed well in high school actually succeed?',
      },
      {
        id: 'us-s-reading-01-p3',
        english:
          'This is where self-discipline becomes something different from what it used to mean. Real self-discipline is not simply obeying a rule that already exists; it is the ability to create a rule for yourself, and then keep it, even when no one would notice if you didn\'t. A student with genuine initiative does not wait to be told to start researching a topic, review lecture notes, or ask a professor a clarifying question — they act before being asked, because they have already decided the work matters. This kind of commitment is tested most severely not in the first exciting weeks of a semester, when everything still feels new, but months later, when the initial motivation has faded and the only thing left keeping a student working is the promise they quietly made to themselves, with no one else there to enforce it. Two students can sit in the same lecture, hear the same instructions, and walk away with completely different futures — not because one is more talented, but because one quietly decided to act on what they heard, and the other quietly decided to wait.',
        japanese:
          'ここで、自己規律（self-discipline）は、これまでとは違う意味を持つようになります。本当の自己規律とは、単にすでにあるルールに従うことではありません。自分自身のためのルールを作り出し、たとえ従わなくても誰も気づかないような場面でも、それを守り続ける力のことです。本当の自発性（initiative）を持つ学生は、テーマについて調べ始めるように、講義ノートを見直すように、あるいは教授に確認の質問をするようにと言われるのを待ちません——すでに自分でその作業が重要だと決めているからこそ、言われる前に行動するのです。この種の関わり続ける力（commitment）が最も厳しく試されるのは、すべてがまだ新しく感じられる学期の最初のわくわくする数週間ではなく、何か月も後——最初のやる気が薄れ、学生を働かせ続けている唯一のものが、自分自身に静かに立てた約束だけになり、それを強制する人が他に誰もいないときです。二人の学生が同じ講義に座り、同じ説明を聞いても、まったく異なる未来を歩んでいくことがあります——それは一方がより才能があるからではなく、一方は聞いたことについて静かに行動することを選び、もう一方は静かに待つことを選んだからなのです。',
        plainEnglish:
          'This is where self-discipline starts to mean something different. Real self-discipline is not just obeying a rule that already exists; it is the ability to make a rule for yourself, and then keep it, even when no one would notice if you didn\'t. A student with real initiative does not wait to be told to start researching a topic, look over lecture notes, or ask a professor a question — they act before being asked, because they have already decided the work matters. This kind of commitment is tested most, not in the exciting first weeks of a semester when everything feels new, but months later, when the first burst of motivation has faded and the only thing keeping a student working is a promise they quietly made to themselves, with no one else there to enforce it. Two students can sit in the same lecture, hear the same instructions, and end up with completely different futures — not because one is more talented, but because one quietly chose to act on what they heard, and the other quietly chose to wait.',
        checkQuestion: "According to this paragraph, when is a student's commitment actually tested the most?",
      },
      {
        id: 'us-s-reading-01-p4',
        english:
          'Seen this way, becoming a university student is less about gaining freedom and more about relocating responsibility — from an external system into the individual. A student has genuinely adapted to university life not when supervision disappears, but when it no longer needs to exist, because self-discipline has already taken its place. Independence, then, is not the absence of structure; it is the quiet, ongoing work of building that structure yourself, one priority and one deadline at a time, long after anyone else has stopped checking. Independence is not the moment no one is watching anymore. It is the moment you finally are.',
        japanese:
          'このように見ると、大学生になるということは、自由を手に入れることよりも、むしろ責任を——外部のシステムから、個人自身の中へと——移し替えることに近いのです。ある学生が本当に大学生活に適応した（adapt）と言えるのは、監督がなくなったときではなく、自己規律（self-discipline）がすでにその代わりを果たしているために、監督そのものがもはや必要なくなったときです。つまり自立（independence）とは、構造がないことではありません。それは、他の誰もが確認するのをやめてしまってからも、一つひとつの優先事項（priority）と締め切り（deadline）に向き合いながら、その構造を自分自身で築き続ける、静かで終わりのない仕事なのです。自立とは、もう誰も見ていない瞬間のことではありません。それは、あなたがついに、自分自身を見ている瞬間のことなのです。',
        plainEnglish:
          'Seen this way, becoming a university student is less about gaining freedom and more about moving responsibility — from an outside system into the person themselves. A student has really adapted to university life not when supervision disappears, but when it no longer needs to exist, because self-discipline has already taken its place. Independence, then, is not the absence of structure; it is the quiet, ongoing work of building that structure yourself, one priority and one deadline at a time, long after anyone else has stopped checking. Independence is not the moment no one is watching anymore. It is the moment you finally are.',
        checkQuestion: "According to this final paragraph, when has a student truly 'adapted' to university life?",
      },
    ],

    targetVocabIds: [
      'us-s-01', // independence
      'us-s-06', // priority
      'us-s-07', // deadline
      'us-s-02', // self-discipline
      'us-s-03', // initiative
      'us-s-04', // commitment
      'us-f-05', // responsibility (reinforced from Foundation)
      'us-s-05', // adapt
    ],

    noticeLanguage: [],

    // Mission Check's three fixed slots, mirroring Theme 1 Advanced's
    // pattern: the main question requires synthesis across paragraphs (never
    // one quotable line), the evidence task draws distractors from more than
    // one side of the passage, and vocabulary-in-context targets one official
    // target word whose meaning could plausibly be misread out of context.
    missionCheck: {
      question: 'Based on the passage as a whole, which statement would the author most likely agree with?',
      explainer: 'In simple words — after reading the whole passage, what does the author actually think "becoming independent" really means?',
      explainerJa: '簡単に言うと、文章全体を読んだ後、筆者は「自立する」ということが本当は何を意味すると考えているか、という質問です。',
      hint: 'Look especially at paragraph 4, but think about how paragraphs 2 and 3 work together too.',
      hintJa: '特に第4段落に注目してください。ただし、第2段落と第3段落がどのように関係し合っているかも考えてみましょう。',
      options: [
        { id: 'a', label: 'University students have more freedom than high school students because fewer people check on them.', correct: false },
        { id: 'b', label: 'Independence means relocating responsibility from an external system into the individual, not simply having less supervision.', correct: true },
        { id: 'c', label: 'Self-discipline matters only in the first few weeks of a new semester.', correct: false },
      ],
      answerParagraphId: 'us-s-reading-01-p4',
      evidencePrompt: 'Which quotation from the passage best shows evidence that self-discipline is different from simply following rules?',
      evidenceOptions: [
        { id: 'e1', label: 'Nobody checks whether you attended a lecture. Nobody reminds you, the night before, that an essay is due tomorrow.', paragraphId: 'us-s-reading-01-p1', correct: false },
        { id: 'e2', label: 'Real self-discipline is not simply obeying a rule that already exists; it is the ability to create a rule for yourself, and then keep it.', paragraphId: 'us-s-reading-01-p3', correct: true },
        { id: 'e3', label: 'Independence, then, is not the absence of structure; it is the quiet, ongoing work of building that structure yourself.', paragraphId: 'us-s-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'This kind of commitment is tested most severely not in the first exciting weeks of a semester, but months later.',
        question: 'What does "commitment" mean in this sentence?',
        options: [
          { id: 'a', label: 'Continuing to do something over time, even after the initial motivation has faded.', correct: true },
          { id: 'b', label: 'A formal written agreement between two people.', correct: false },
          { id: 'c', label: 'A single decision made at one specific moment.', correct: false },
        ],
      },
    },

    // Advanced Writing — per docs/WRITING_PHILOSOPHY.md, "Explain your
    // opinion" (READING_WRITING_ARCHITECTURE.md §6, 80–120 words); the
    // reading's structure-you-build-yourself framework is used only as a
    // lens for the student to examine their own habits, never as something
    // to evaluate or summarize.
    writing: {
      prompt:
        'Think about the shift this passage describes — from having structure given to you, to building it yourself. Which of your own habits already show self-discipline or initiative? Which do you think you will need to develop once nobody is checking on you? Explain your ideas with reasons or examples. Aim for about 80–120 words.',
      promptJapanese:
        'この文章が描いている変化——誰かに与えられていた構造から、自分自身でそれを築くことへの変化——について考えてみましょう。あなたの習慣の中で、すでに自己規律や自発性を示しているものはどれですか？誰にも確認されなくなったときのために、これから身につける必要があると思うものはどれですか？理由や例を挙げながら、自分の考えを説明してください。目安は80〜120語です。',
      minSentences: 5,
      recommendedWordRange: [80, 120],
      sentenceStarters: ['One habit that already shows self-discipline is', 'I have taken initiative before by', 'One priority I will need to manage is', 'This is something I will need to develop because', 'I think real independence means'],
      wordBank: [
        { vocabId: 'us-s-01', examplePhrase: 'To me, real independence means building my own structure, not just having freedom from rules.' },
        { vocabId: 'us-s-02', examplePhrase: 'I already have some self-discipline when it comes to studying for exams.' },
        { vocabId: 'us-s-03', examplePhrase: 'I want to take more initiative instead of waiting to be told what to do.' },
        { vocabId: 'us-s-04', examplePhrase: 'My commitment is usually strongest right at the start, and I want to change that.' },
        { vocabId: 'us-s-05', examplePhrase: 'I think I will adapt quickly once I get used to managing my own time.' },
        { vocabId: 'us-s-06', examplePhrase: 'Learning to set my own priorities will probably be the hardest part.' },
        { vocabId: 'us-s-07', examplePhrase: 'I want to treat every deadline as something I chose, not something forced on me.' },
        { vocabId: 'us-f-05', examplePhrase: 'In the end, I think independence and responsibility are really the same thing.' },
      ],
      usefulExpressions: [
        { phrase: 'To me, real independence means', japanese: '私にとって、本当の自立とは' },
        { phrase: 'I already show self-discipline when', japanese: '私はすでに...のときに自己規律を示しています' },
        { phrase: 'One thing I will need to develop is', japanese: '私が身につける必要があることの一つは' },
        { phrase: 'Unlike in high school,', japanese: '高校とは違って' },
        { phrase: 'In the long run,', japanese: '長い目で見れば' },
      ],
    },

    takeaway: 'Independence is not the moment no one is watching anymore. It is the moment you finally are.',
  },

  // ── Designing My Future — Foundation ────────────────────────────────────────
  // Rebuilt 2026-08-09 from the author's canonical manuscript ("Many people
  // think that designing a future begins by deciding what they want to
  // become..."). English fields are verbatim from that manuscript — do not
  // edit the wording here without revising the source manuscript first.

  {
    id: 'df-f-reading-01',
    themeId: 'designing-my-future',
    level: 'foundation',
    title: 'Designing My Future',
    titleJapanese: '未来を描く',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will think about a different way to understand how a future takes shape — not by choosing a destination first, but by gradually coming to understand yourself.',
    mission: 'As you read, notice the different kinds of experience the passage says can reveal something about you. Think about a subject, a group experience, or a difficult task that has already told you something about yourself.',

    preReadingSurvey: {
      question: 'Which statement is closest to how you feel about designing your future?',
      options: [
        { id: 'destination', label: 'I think it mainly means choosing a clear destination as early as possible.' },
        { id: 'self-understanding', label: 'I think it mainly means understanding myself, and the destination comes later.' },
        { id: 'unsure', label: "I'm not sure yet." },
      ],
    },

    paragraphs: [
      {
        id: 'df-f-reading-01-p1',
        english:
          'Many people think that designing a future begins by deciding what they want to become. This idea seems reasonable because having a clear destination makes decisions easier. However, there may be another way to think about the future. Before deciding where we want to go, we may first need to understand ourselves.',
        japanese:
          '多くの人は、将来を思い描くことは、自分が何になりたいかを決めることから始まると考えています。この考え方は、はっきりとした目的地があれば決断がしやすくなるため、もっともらしく思えます。しかし、将来について考える別の方法があるかもしれません。どこへ向かいたいかを決める前に、まず自分自身を理解する必要があるのかもしれません。',
        plainEnglish:
          'Many people think that designing a future starts with deciding what they want to become. This idea seems reasonable because having a clear destination makes decisions easier. But there may be another way to think about the future. Before deciding where we want to go, we may first need to understand ourselves.',
        checkQuestion: 'According to this paragraph, what does this passage suggest we may need to do before deciding where we want to go?',
      },
      {
        id: 'df-f-reading-01-p2',
        english:
          'Self-understanding rarely appears all at once. It develops gradually through experience. A new subject may reveal a preference. Working with other people may reveal a tendency. A difficult task may reveal a strength or a potential that had never been noticed before. These experiences help us understand not only what we enjoy, but also how we naturally respond to different situations.',
        japanese:
          '自己理解は、めったに一度にすべて現れるものではありません。それは経験を通して、少しずつ育っていきます。新しい科目が、好みに気づかせてくれるかもしれません。他の人と一緒に取り組むことが、傾向を明らかにしてくれるかもしれません。難しい課題が、それまで気づかれていなかった強みや可能性を明らかにしてくれるかもしれません。こうした経験は、自分が何を楽しいと感じるかだけでなく、さまざまな状況にどう自然に反応するかを理解する助けにもなります。',
        plainEnglish:
          'Self-understanding rarely appears all at once. It develops gradually through experience. A new subject might show you a preference. Working with other people might show you a tendency. A difficult task might show you a strength or a potential you never noticed before. These experiences help us understand not only what we enjoy, but also how we naturally respond to different situations.',
        checkQuestion: 'According to this paragraph, what three kinds of experience — a subject, working with others, a difficult task — can each reveal about a person?',
      },
      {
        id: 'df-f-reading-01-p3',
        english:
          'Experience also teaches us what does not suit us. Many people see changing direction as a failure, but it can also be a form of learning. Knowing what to leave behind is just as important as knowing what to pursue. Both help us understand ourselves more clearly.',
        japanese:
          '経験はまた、自分に合わないことも教えてくれます。多くの人は方向を変えることを失敗だと考えますが、それは学びの一つの形でもあり得ます。何を追い求めるべきかを知ることと同じくらい、何を手放すべきかを知ることも大切です。そのどちらもが、自分自身をより明確に理解する助けになります。',
        plainEnglish:
          'Experience also teaches us what does not suit us. Many people see changing direction as a failure, but it can also be a kind of learning. Knowing what to leave behind is just as important as knowing what to pursue. Both help us understand ourselves more clearly.',
        checkQuestion: 'According to this paragraph, why might changing direction not actually be a failure?',
      },
      {
        id: 'df-f-reading-01-p4',
        english:
          'Designing a future, therefore, is not simply choosing a destination. It is a continuous process of discovering who we are. As our understanding of ourselves grows, decisions about the future become more thoughtful and more meaningful.',
        japanese:
          'したがって、将来を思い描くということは、単に目的地を選ぶことではありません。それは、自分が何者であるかを発見し続ける、継続的な過程です。自分自身への理解が深まるにつれて、将来についての決断は、より思慮深く、より意味のあるものになっていきます。',
        plainEnglish:
          'So designing a future is not simply about choosing a destination. It is a continuous process of discovering who we are. As our understanding of ourselves grows, decisions about the future become more thoughtful and more meaningful.',
        checkQuestion: 'According to this final paragraph, what is designing a future actually described as, instead of simply choosing a destination?',
      },
    ],

    targetVocabIds: [
      'df-f-01', // discover
      'df-f-02', // preference
      'df-f-03', // tendency
      'df-f-04', // potential
      'df-f-05', // reveal
      'df-f-06', // suit
      'df-f-07', // pursue
      'df-f-08', // continuous
    ],

    // Deferred, matching Theme 1 and Theme 2's own current state — not part
    // of this task's scope.
    noticeLanguage: [],

    missionCheck: {
      question: 'According to the passage, how does self-understanding usually develop?',
      explainer: 'In simple words — does the passage say self-understanding appears all at once, or gradually through experience?',
      explainerJa: '簡単に言うと、この文章は自己理解が一度にすべて現れると言っているのか、それとも経験を通して少しずつ現れると言っているのか、という質問です。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Self-understanding usually appears all at once, in a single clear moment.', correct: false },
        { id: 'b', label: 'Self-understanding rarely appears all at once — it develops gradually through experience.', correct: true },
        { id: 'c', label: 'Self-understanding only develops after a person has already chosen a career.', correct: false },
      ],
      answerParagraphId: 'df-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading best shows that changing direction is not necessarily a failure?',
      evidenceOptions: [
        { id: 'e1', label: 'A difficult task may reveal a strength or a potential that had never been noticed before.', paragraphId: 'df-f-reading-01-p2', correct: false },
        { id: 'e2', label: 'Many people see changing direction as a failure, but it can also be a form of learning.', paragraphId: 'df-f-reading-01-p3', correct: true },
        { id: 'e3', label: 'It is a continuous process of discovering who we are.', paragraphId: 'df-f-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'Working with other people may reveal a tendency.',
        question: 'What does "tendency" mean here?',
        options: [
          { id: 'a', label: 'A pattern in how someone naturally thinks, acts, or reacts.', correct: true },
          { id: 'b', label: 'A strict rule that a group must follow.', correct: false },
          { id: 'c', label: 'A single mistake that happens only once.', correct: false },
        ],
      },
    },

    // Foundation Writing — per docs/WRITING_PHILOSOPHY.md, a short personal
    // "Answer a question" task (READING_WRITING_ARCHITECTURE.md §6).
    writing: {
      prompt: "Think about a subject, a group experience, or a difficult task you have had. What did it reveal about you — a preference, a tendency, or a potential you didn't expect? Explain what happened and what you noticed about yourself.",
      promptJapanese: 'あなたが経験した科目や、他の人と一緒に取り組んだこと、あるいは難しい課題について考えてみましょう。それは、あなたについて何を明らかにしてくれましたか——好み、傾向、それとも予想していなかった可能性でしょうか。何が起きたか、そして自分自身について何に気づいたかを説明してください。',
      minSentences: 2,
      sentenceStarters: ['I discovered that I', 'It revealed a tendency to', 'I noticed a potential I', 'I realized that I want to pursue'],
      wordBank: [
        { vocabId: 'df-f-01', examplePhrase: 'I discovered that I actually enjoy explaining things to other people.' },
        { vocabId: 'df-f-02', examplePhrase: 'It showed me a clear preference for working with my hands.' },
        { vocabId: 'df-f-03', examplePhrase: 'Working in a group revealed a tendency in myself to ask questions first.' },
        { vocabId: 'df-f-04', examplePhrase: "The teacher told me I had potential I hadn't noticed." },
        { vocabId: 'df-f-05', examplePhrase: "The experience revealed something I didn't expect about myself." },
        { vocabId: 'df-f-06', examplePhrase: "In the end, that subject just didn't suit me." },
        { vocabId: 'df-f-07', examplePhrase: 'It helped me realize what I actually want to pursue.' },
        { vocabId: 'df-f-08', examplePhrase: "I'm starting to see this as a continuous process, not a one-time decision." },
      ],
      usefulExpressions: [
        { phrase: 'It revealed that I...', japanese: 'それは私が...ということを明らかにしてくれました' },
        { phrase: 'I noticed a tendency to...', japanese: '私は...する傾向があることに気づきました' },
        { phrase: 'This experience taught me that...', japanese: 'この経験は、私に...ということを教えてくれました' },
        { phrase: "I didn't expect to discover...", japanese: '私は...を発見するとは思っていませんでした' },
        { phrase: 'For now, I just want to keep paying attention to...', japanese: '今のところ、私はただ...に注意を払い続けたいです' },
      ],
    },

    takeaway: 'As our understanding of ourselves grows, decisions about the future become more thoughtful and more meaningful.',
  },

  // ── Designing My Future — Advanced ──────────────────────────────────────────
  // Rebuilt 2026-08-09 from the same canonical manuscript's Advanced passage
  // ("People often believe that designing a future begins with making an
  // important decision..."). Genuinely separate manuscript from Foundation,
  // not an extension of it (READING_WRITING_ARCHITECTURE.md §2) — Foundation
  // stays concrete/personal (a subject, working with others, a difficult
  // task); Advanced reframes career development itself: not a sequence of
  // correct decisions toward a predetermined destination, but something
  // built through continuous adjustment and accumulated experience.

  {
    id: 'df-s-reading-01',
    themeId: 'designing-my-future',
    level: 'advanced',
    title: 'Choosing a Destination, or Understanding Yourself?',
    titleJapanese: '目的地を選ぶこと、それとも自分自身を理解すること？',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore two different accounts of how a future actually takes shape — one where a destination already exists and simply needs to be found, and another where self-understanding is built gradually through action and experience.',
    mission: 'As you read, notice how the passage complicates the idea that a future begins with a decision, and reframes career development as something built through continuous adjustment rather than a fixed sequence of correct choices.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'destination', label: 'A future mainly begins with an important decision about a destination.' },
        { id: 'experience', label: 'A future mainly develops through action and experience, without a fixed destination in mind.' },
        { id: 'both', label: 'Both matter about equally — an initial direction and ongoing experience.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'df-s-reading-01-p1',
        english:
          'People often believe that designing a future begins with making an important decision. Questions such as "What career should I choose?" or "What kind of life do I want to live?" seem to come first. This way of thinking assumes that the destination already exists, waiting to be identified, and that success depends on finding the correct answer as early as possible. As a result, many young people worry that they are falling behind if they cannot see a clear direction.',
        japanese:
          '人々はしばしば、将来を思い描くことは重要な決断をすることから始まると考えています。「どんな職業を選ぶべきか」「どんな人生を送りたいか」といった問いが、まず最初に来るように思えます。この考え方は、目的地がすでに存在していて、それが特定されるのを待っているのだと想定しており、成功はできるだけ早く正しい答えを見つけられるかどうかにかかっている、と考えます。その結果、多くの若者は、はっきりとした方向性が見えないと、自分は遅れているのではないかと不安になります。',
        plainEnglish:
          'People often believe that designing a future starts with making an important decision. Questions like "What career should I choose?" or "What kind of life do I want to live?" seem to come first. This way of thinking assumes that the destination already exists, just waiting to be identified, and that success depends on finding the correct answer as early as possible. As a result, many young people worry that they\'re falling behind if they can\'t see a clear direction.',
        checkQuestion: "According to this paragraph, what does the 'destination already exists' way of thinking assume success depends on?",
      },
      {
        id: 'df-s-reading-01-p2',
        english:
          'There is another way to understand the same process. Instead of asking people to discover a future that already exists, it suggests that a future is gradually shaped through experience. People rarely understand themselves completely before they begin to act. Rather, action itself becomes the source of self-understanding. New experiences reveal abilities that had never been tested. Difficult situations expose strengths and weaknesses that could not have been predicted. Even an experience that seems disappointing at the time may later become valuable because it changes the way a person understands both themselves and the world.',
        japanese:
          '同じ過程を理解する、別の方法もあります。すでに存在している将来を発見するよう人々に求めるのではなく、この見方は、将来は経験を通して少しずつ形づくられていくのだと考えます。人は、行動を始める前に自分自身を完全に理解していることは、めったにありません。むしろ、行動そのものが自己理解の源になります。新しい経験は、それまで試されたことのなかった能力を明らかにします。難しい状況は、予測できなかった強みや弱みを露わにします。その時は残念に思える経験でさえ、後になって価値あるものになることがあります。それが、自分自身と世界の両方を理解する仕方を変えてくれるからです。',
        plainEnglish:
          'There is another way to understand the same process. Instead of asking people to discover a future that already exists, this view suggests that a future is gradually shaped through experience. People rarely understand themselves completely before they start acting. Instead, action itself becomes the source of self-understanding. New experiences reveal abilities that had never been tested. Difficult situations expose strengths and weaknesses that couldn\'t have been predicted. Even an experience that seems disappointing at the time may later become valuable, because it changes how a person understands both themselves and the world.',
        checkQuestion: "According to this paragraph, what becomes 'the source of self-understanding,' according to this alternative view?",
      },
      {
        id: 'df-s-reading-01-p3',
        english:
          'This perspective also changes the meaning of career development. A career is often imagined as a sequence of correct decisions leading toward a predetermined destination. In reality, however, careers are usually developed through continuous adjustment. Opportunities appear unexpectedly. Interests change. New skills are acquired. People often discover that work they never considered eventually becomes meaningful because they have developed competence through sustained effort. In many cases, enjoyment does not come before effort. Instead, effort leads to competence, and competence gradually produces satisfaction. What people later describe as a passion may therefore be the result of long-term engagement rather than its starting point.',
        japanese:
          'この見方は、キャリア形成の意味も変えることになります。キャリアは、あらかじめ決められた目的地に向かう、正しい決断の連続として思い描かれがちです。しかし実際には、キャリアはたいてい、継続的な調整を通して形づくられていきます。機会は予期せぬ形で現れます。興味は変化します。新しいスキルが身についていきます。人はしばしば、以前は考えもしなかった仕事が、やがて意味のあるものになっていくことに気づきます。それは、持続的な努力を通して能力を身につけてきたからです。多くの場合、楽しさは努力より先には来ません。むしろ、努力が能力につながり、能力が少しずつ満足感を生み出します。人が後になって「情熱」と呼ぶものは、そのため、出発点ではなく、長期にわたる関わりの結果であるのかもしれません。',
        plainEnglish:
          'This perspective also changes what career development actually means. A career is often imagined as a sequence of correct decisions leading toward a destination that was fixed from the start. In reality, though, careers are usually developed through continuous adjustment. Opportunities appear unexpectedly. Interests change. New skills are gained. People often discover that work they never considered eventually becomes meaningful, because they\'ve developed competence through sustained effort. In many cases, enjoyment doesn\'t come before effort. Instead, effort leads to competence, and competence gradually produces satisfaction. What people later call a passion may actually be the result of long-term engagement, rather than its starting point.',
        checkQuestion: 'According to this paragraph, what is the actual order of effort, competence, and enjoyment, in real career development?',
      },
      {
        id: 'df-s-reading-01-p4',
        english:
          'None of this means that people should ignore their preferences or natural tendencies. On the contrary, understanding ourselves remains essential. However, self-understanding should not be treated as a single discovery that solves every future decision. It develops continuously through the interaction between our personal characteristics and the experiences we accumulate throughout life.',
        japanese:
          'これは、人が自分の好みや生まれ持った傾向を無視すべきだという意味ではまったくありません。それどころか、自分自身を理解することは、依然として欠かせないことです。しかし、自己理解は、将来のあらゆる決断を一度に解決してくれる単一の発見として扱われるべきではありません。それは、私たちの個人的な特性と、人生を通して積み重ねていく経験との相互作用を通して、絶えず発達し続けるものなのです。',
        plainEnglish:
          "None of this means people should ignore their preferences or natural tendencies. On the contrary, understanding ourselves remains essential. But self-understanding shouldn't be treated as a single discovery that solves every future decision at once. It develops continuously, through the interaction between our personal characteristics and the experiences we build up throughout life.",
        checkQuestion: 'According to this paragraph, through what does self-understanding develop continuously?',
      },
      {
        id: 'df-s-reading-01-p5',
        english:
          'Designing a future, therefore, is not simply a matter of choosing the correct destination. It is a lifelong process of understanding ourselves more deeply while continuing to learn from experience. The destination is important, but it is not the beginning. A clearer understanding of ourselves is what gradually allows the destination itself to become clearer.',
        japanese:
          'したがって、将来を思い描くということは、単に正しい目的地を選ぶことではありません。それは、経験から学び続けながら、自分自身をより深く理解していく、生涯にわたる過程です。目的地は重要ですが、それは出発点ではありません。自分自身についての理解が明確になっていくことこそが、目的地そのものを少しずつ明確にしていくのです。',
        plainEnglish:
          'So designing a future is not simply about choosing the correct destination. It is a lifelong process of understanding ourselves more deeply while continuing to learn from experience. The destination matters, but it is not the starting point. A clearer understanding of ourselves is what gradually makes the destination itself become clearer.',
        checkQuestion: 'According to this final paragraph, what gradually allows the destination itself to become clearer?',
      },
    ],

    targetVocabIds: [
      'df-s-01', // construct
      'df-s-02', // competence
      'df-s-03', // assumption
      'df-s-04', // anxiety
      'df-s-05', // purpose
      'df-s-06', // passion
      'df-s-07', // predetermined
      'df-s-08', // interaction (spiral reinforcement from Theme 1 Advanced)
    ],

    noticeLanguage: [],

    // Mission Check's three fixed slots, mirroring Theme 2 Advanced's
    // pattern: the main question requires synthesis across paragraphs, the
    // evidence task draws distractors from more than one side of the
    // passage, and vocabulary-in-context targets one official target word.
    missionCheck: {
      question: 'Based on the passage as a whole, which statement would the author most likely agree with?',
      explainer: 'In simple words — after reading the whole passage, does the author think designing a future mainly means finding a fixed destination, or continuously understanding yourself through experience?',
      explainerJa: '簡単に言うと、文章全体を読んだ後、筆者は将来を思い描くということが、主に決まった目的地を見つけることだと考えているのか、それとも経験を通して自分自身を理解し続けることだと考えているのか、という質問です。',
      hint: 'Look especially at paragraph 5, but think about how paragraphs 2 and 3 support it.',
      hintJa: '特に第5段落に注目してください。ただし、第2段落と第3段落がそれをどう支えているかも考えてみましょう。',
      options: [
        { id: 'a', label: 'A future is mainly a fixed destination that exists in advance and simply needs to be identified.', correct: false },
        { id: 'b', label: 'A clearer understanding of ourselves is what gradually allows the destination itself to become clearer, not the other way around.', correct: true },
        { id: 'c', label: 'Career development follows a predetermined sequence of correct decisions.', correct: false },
      ],
      answerParagraphId: 'df-s-reading-01-p5',
      evidencePrompt: 'Which quotation from the passage best shows evidence that enjoyment usually comes after effort, not before it?',
      evidenceOptions: [
        { id: 'e1', label: 'This way of thinking assumes that the destination already exists, waiting to be identified.', paragraphId: 'df-s-reading-01-p1', correct: false },
        { id: 'e2', label: 'Effort leads to competence, and competence gradually produces satisfaction.', paragraphId: 'df-s-reading-01-p3', correct: true },
        { id: 'e3', label: 'It develops continuously through the interaction between our personal characteristics and the experiences we accumulate throughout life.', paragraphId: 'df-s-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'A career is often imagined as a sequence of correct decisions leading toward a predetermined destination.',
        question: 'What does "predetermined" mean in this sentence?',
        options: [
          { id: 'a', label: 'Decided or fixed in advance, before anything has actually happened.', correct: true },
          { id: 'b', label: 'Chosen freely and changed often over time.', correct: false },
          { id: 'c', label: 'Discovered gradually through years of experience.', correct: false },
        ],
      },
    },

    // Advanced Writing — per docs/WRITING_PHILOSOPHY.md, "Explain your
    // opinion" (READING_WRITING_ARCHITECTURE.md §6, 80–120 words); the
    // reading's destination-versus-self-understanding framework is used
    // only as a lens for the student to examine their own experience, never
    // as something to evaluate or summarize.
    writing: {
      prompt:
        'This passage presents two views: that a future begins with finding an already-existing destination, or that it develops gradually through action, adjustment, and accumulated experience. Which view feels closer to your own experience so far? Explain your ideas with reasons or examples. Aim for about 80–120 words.',
      promptJapanese:
        'この文章では、将来についての二つの見方が示されています——将来はすでに存在している目的地を見つけることから始まるという見方と、行動や調整、積み重ねた経験を通して少しずつ発達していくという見方です。あなた自身のこれまでの経験には、どちらの見方が近いと感じますか。理由や例を挙げながら、自分の考えを説明してください。目安は80〜120語です。',
      minSentences: 5,
      recommendedWordRange: [80, 120],
      sentenceStarters: ['I think my own experience is closer to', 'One assumption I used to have was', 'Through continuous adjustment, I have', 'This connects to my own experience because', 'In the end, I believe'],
      wordBank: [
        { vocabId: 'df-s-01', examplePhrase: 'I think I construct my sense of direction through effort, more than I discover it all at once.' },
        { vocabId: 'df-s-02', examplePhrase: 'Once I built real competence in something, I actually started to enjoy it more.' },
        { vocabId: 'df-s-03', examplePhrase: 'I used to share the assumption that a destination has to be clear from the beginning.' },
        { vocabId: 'df-s-04', examplePhrase: 'Some of my anxiety about the future comes from expecting a single correct destination.' },
        { vocabId: 'df-s-05', examplePhrase: "I don't think I've found my purpose yet, and I'm starting to think that's fine." },
        { vocabId: 'df-s-06', examplePhrase: "For me, passion usually arrives after I've already put in real effort." },
        { vocabId: 'df-s-07', examplePhrase: "I no longer think of my future as predetermined — it feels more like something I'm building." },
        { vocabId: 'df-s-08', examplePhrase: "I think my future depends on the interaction between what I'm naturally like and what I actually experience." },
      ],
      usefulExpressions: [
        { phrase: 'I think my own experience is closer to...', japanese: '私自身の経験はより...に近いと思います' },
        { phrase: 'This connects to my own experience because...', japanese: 'これは、...という理由で私自身の経験とつながっています' },
        { phrase: 'Unlike the passage suggests,', japanese: '文章が示唆していることとは違って' },
        { phrase: 'In the end, I believe...', japanese: '最終的に、私は...だと思います' },
        { phrase: 'One thing I have noticed about myself is...', japanese: '私が自分自身について気づいたことの一つは...です' },
      ],
    },

    takeaway: 'A clearer understanding of ourselves is what gradually allows the destination itself to become clearer.',
  },

  // ── Living Together — Foundation ────────────────────────────────────────────
  // Ported from docs/THEME_04_READING_WRITING.md (approved design).

  {
    id: 'lt-f-reading-01',
    themeId: 'living-together',
    level: 'foundation',
    title: 'Sharing a Small Space',
    titleJapanese: '小さな空間を分かち合う',
    estimatedMinutes: 15,
    welcome: 'Today, you will read about two roommates who did not agree on almost anything — and how they learned to get along.',
    mission: 'As you read, notice how Mio and her roommate handle their disagreement. At the end, think about what helps you get along with people who are different from you.',

    preReadingSurvey: {
      question: 'When you disagree with someone, what do you usually do first?',
      options: [
        { id: 'talk', label: 'Talk about it honestly.' },
        { id: 'avoid', label: 'Try to avoid the topic.' },
        { id: 'depends', label: 'It depends on the person.' },
      ],
    },

    paragraphs: [
      {
        id: 'lt-f-reading-01-p1',
        english:
          'Mio and her new roommate did not agree on almost anything. Mio liked a quiet room for studying, while her roommate liked to invite friends over and talk late into the night. By the end of their first week together, they had already argued about it more than once, and neither one knew how to bring it up calmly.',
        japanese:
          'ミオと新しいルームメイトは、ほとんど何に対しても意見が合いませんでした。ミオは勉強のために静かな部屋を好みましたが、ルームメイトは友達を呼んで夜遅くまで話すのが好きでした。最初の週が終わる頃には、二人はすでに何度もそのことでぶつかっており、どちらもそれを穏やかに切り出す方法が分かりませんでした。',
        plainEnglish:
          'Mio and her new roommate liked very different things. Mio wanted quiet time to study, but her roommate liked having friends over late at night. By the end of the first week, they had already argued about it, and neither knew how to talk about it calmly.',
        checkQuestion: "According to this paragraph, what was the main problem between Mio and her roommate?",
      },
      {
        id: 'lt-f-reading-01-p2',
        english:
          'One evening, Mio decided to talk honestly with her roommate instead of staying upset. She explained that she needed quiet time to focus, and her roommate explained that she felt lonely without company. Neither of them was wrong — they simply had different needs. They agreed to try something new: quiet hours in the evening, and a shared night out once a week.',
        japanese:
          'ある晩、ミオは不満をため込む代わりに、ルームメイトと率直に話すことにしました。彼女は集中するために静かな時間が必要だと説明し、ルームメイトは一人でいると寂しく感じると説明しました。どちらも間違っていたわけではなく、ただ必要としているものが違っただけでした。二人は新しいことを試してみることにしました——夜は静かにする時間を作り、週に一度は一緒に出かける時間を作ることにしたのです。',
        plainEnglish:
          "One evening, Mio decided to talk honestly with her roommate instead of feeling upset. Mio needed quiet time, and her roommate felt lonely without company. Neither was wrong — they just had different needs. They agreed to try quiet hours in the evening, plus one shared night out each week.",
        checkQuestion: 'What did Mio and her roommate agree to try?',
      },
      {
        id: 'lt-f-reading-01-p3',
        english:
          "It was not always easy, and they still disagreed sometimes about small things. But they learned to respect each other's differences, like good neighbors sharing the same small space. Slowly, they began to trust each other more, and their relationship grew closer. By the end of the semester, Mio realized that getting along with someone did not mean always agreeing — it meant being kind, showing respect, and trying to see things from the other person's side.",
        japanese:
          'いつも簡単だったわけではなく、二人はその後も小さなことで意見が合わないことがありました。それでも、二人はまるで同じ狭い空間を共有する良き隣人のように、お互いの違いを尊重することを学んでいきました。少しずつ、お互いを信頼するようになり、二人の関係はより親密になっていきました。学期の終わりまでに、ミオは、誰かとうまくやっていくということは、いつも意見が一致することではないと気づきました——それは、優しくあること、相手を尊重すること、そして相手の立場から物事を見ようとすることなのだと。',
        plainEnglish:
          "It wasn't always easy, and they still disagreed about small things sometimes. But they learned to respect each other's differences, like good neighbors sharing the same space. Slowly, they trusted each other more and grew closer. By the end of the semester, Mio realized that getting along doesn't mean always agreeing — it means being kind, respectful, and willing to see the other person's side.",
        checkQuestion: 'According to this paragraph, what did Mio realize about getting along with someone?',
      },
    ],

    targetVocabIds: ['lt-f-01', 'lt-f-02', 'lt-f-03', 'lt-f-04', 'lt-f-05', 'lt-f-06', 'lt-f-07', 'lt-f-08', 'lt-f-09', 'lt-f-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['relationship', 'trust', 'close', 'neighbor', 'kind', 'respect', 'agree', 'disagree', 'get along', 'share'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['bring it up calmly', 'quiet hours', 'getting along with someone'],
      },
      {
        type: 'reference-words',
        prompt: 'Notice the reference word "each other\'s" in paragraph 3 — it refers back to both Mio and her roommate together.',
        items: ["they learned to respect each other's differences"],
      },
      {
        type: 'tone-purpose',
        prompt: 'Consider the author\'s tone.',
        note: 'Both roommates\' needs are presented as equally valid ("Neither of them was wrong") — the passage models fair-minded conflict-handling rather than taking one side.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, how did Mio and her roommate finally solve their problem?',
      explainer: 'In simple words: how did Mio and her roommate finally deal with their problem?',
      explainerJa: 'この質問は、「ミオとルームメイトは、最終的にどうやって問題に対処したのか」を聞いています。',
      hint: 'Look at what happens in paragraph 2, when Mio talks honestly with her roommate.',
      hintJa: '第2段落で、ミオがルームメイトと率直に話す場面に注目してみましょう。',
      options: [
        { id: 'a', label: 'They stopped spending time together so they would not argue.', correct: false },
        { id: 'b', label: 'They talked honestly about their different needs and found a compromise.', correct: true },
        { id: 'c', label: "Mio's roommate agreed to always do things Mio's way.", correct: false },
      ],
      answerParagraphId: 'lt-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading shows the specific moment when Mio and her roommate found a solution together?',
      evidenceOptions: [
        { id: 'e1', label: 'By the end of their first week together, they had already argued about it more than once.', paragraphId: 'lt-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'They agreed to try something new: quiet hours in the evening, and a shared night out once a week.', paragraphId: 'lt-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'Slowly, they began to trust each other more, and their relationship grew closer.', paragraphId: 'lt-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'their relationship grew closer',
        question: 'What does "closer" mean here?',
        options: [
          { id: 'a', label: 'Physically nearer in distance, like standing close together.', correct: false },
          { id: 'b', label: 'More emotionally connected to each other.', correct: true },
          { id: 'c', label: 'Having less free time available.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Think about someone you get along well with. What helps your relationship? Or, if you disagree with someone sometimes, what helps you solve the problem?',
      promptJapanese: 'うまくやっていける人のことを思い浮かべてください。その関係を支えているものは何ですか。あるいは、時々意見が合わない人がいる場合、その問題を解決するのに役立っていることは何ですか。',
      minSentences: 2,
      sentenceStarters: ['I get along well with...', 'Sometimes we disagree, but...', 'I think it is important to...'],
      wordBank: [
        { vocabId: 'lt-f-01', examplePhrase: 'I have a close relationship with...' },
        { vocabId: 'lt-f-06', examplePhrase: 'I respect that...' },
        { vocabId: 'lt-f-07', examplePhrase: 'We agree that...' },
        { vocabId: 'lt-f-08', examplePhrase: 'Sometimes we disagree about...' },
        { vocabId: 'lt-f-09', examplePhrase: 'We get along because...' },
        { vocabId: 'lt-f-05', examplePhrase: 'Being kind helps us...' },
      ],
      usefulExpressions: [
        { phrase: 'I get along well with...', japanese: '私は...とうまくやっています' },
        { phrase: 'Sometimes we disagree, but...', japanese: '時々意見が合いませんが、...' },
        { phrase: 'I think it is important to...', japanese: '私は...することが大切だと思います' },
        { phrase: 'What helps us is...', japanese: '私たちを助けているのは...です' },
      ],
    },

    takeaway: "Getting along with someone doesn't mean always agreeing — it means being kind enough to listen.",
  },

  // ── Facts or Fake? — Foundation ─────────────────────────────────────────────
  // Ported from docs/THEME_05_READING_WRITING.md (approved design).

  {
    id: 'ff-f-reading-01',
    themeId: 'facts-or-fake',
    level: 'foundation',
    title: 'A Second Look',
    titleJapanese: 'もう一度確かめる',
    estimatedMinutes: 15,
    welcome: 'Today, you will read about a student who almost believed something that was not true — and what he learned from it.',
    mission: 'As you read, notice what Haruto does before deciding whether to trust the message. At the end, think about how you decide what to believe online.',

    preReadingSurvey: {
      question: 'When you see surprising information online, what do you usually do?',
      options: [
        { id: 'check', label: 'I check where it came from.' },
        { id: 'believe', label: 'I usually just believe it.' },
        { id: 'ignore', label: 'I usually ignore it.' },
      ],
    },

    paragraphs: [
      {
        id: 'ff-f-reading-01-p1',
        english:
          '"Drinking cold water right after a meal causes cancer." Haruto saw the message in a group chat one evening, shared by a friend with three exclamation points. It sounded serious, and it was already getting dozens of replies. Part of him wanted to believe it immediately and share it with his family before checking whether it was true.',
        japanese:
          '「食後すぐに冷たい水を飲むとがんになる。」ハルトはある晩、友人が三つの感嘆符をつけて共有したグループチャットでこのメッセージを目にしました。それは深刻そうに聞こえ、すでに何十件もの返信がついていました。彼の心の一部は、それが本当かどうか確かめる前に、すぐにそれを信じて家族と共有したいと思っていました。',
        plainEnglish:
          'Haruto saw a scary-sounding message in a group chat, shared by a friend with lots of exclamation points. It already had many replies. Part of him wanted to believe it and share it with his family right away, without checking if it was true.',
        checkQuestion: 'According to this paragraph, what did part of Haruto want to do before checking the message?',
      },
      {
        id: 'ff-f-reading-01-p2',
        english:
          'Instead of sharing it right away, Haruto decided to check where the claim came from. He searched for the source and found that no real doctor or hospital had ever said this. The message was not true — it was just something someone had made up and passed along. Haruto felt a little embarrassed that he had almost believed it so quickly.',
        japanese:
          'すぐに共有する代わりに、ハルトはその主張がどこから来たのかを確かめることにしました。彼は情報源を調べ、本物の医師や病院がこのようなことを言ったことは一度もないと分かりました。そのメッセージは真実ではなく、誰かが作り上げて広めただけのものでした。ハルトは、自分がそれをそんなに早く信じかけたことに少し恥ずかしさを感じました。',
        plainEnglish:
          "Instead of sharing it right away, Haruto checked where the message came from. He searched and found that no real doctor or hospital had ever said this. It wasn't true — someone had just made it up. Haruto felt a little embarrassed that he almost believed it.",
        checkQuestion: 'What did Haruto discover when he checked the source of the message?',
      },
      {
        id: 'ff-f-reading-01-p3',
        english:
          "After that, Haruto started asking one simple question before believing anything online: is this a fact, or just someone's opinion dressed up to look real? He learned to doubt messages that sounded too dramatic, and to trust sources that were honest about where their information came from. Not everything online is fake, but it is always worth a second look before you believe it and pass it on to someone else.",
        japanese:
          'それ以来、ハルトはオンラインで何かを信じる前に、一つのシンプルな質問をするようになりました——これは事実だろうか、それとも本物らしく見せかけた誰かの意見だろうか。彼は、大げさに聞こえるメッセージを疑うことを学び、情報がどこから来たのかについて正直な情報源を信頼することを学びました。オンラインのすべてが偽物というわけではありませんが、信じて誰かに伝える前に、もう一度よく確かめる価値は常にあるのです。',
        plainEnglish:
          "After that, Haruto started asking one question before believing anything online: is this a fact, or just an opinion dressed up to look real? He learned to doubt dramatic-sounding messages and trust sources that were honest about where their information came from. Not everything online is fake, but it's always worth checking before you believe and share it.",
        checkQuestion: 'According to this paragraph, what question did Haruto start asking before believing something online?',
      },
    ],

    targetVocabIds: ['ff-f-01', 'ff-f-02', 'ff-f-03', 'ff-f-04', 'ff-f-05', 'ff-f-06', 'ff-f-07', 'lt-f-02', 'ff-f-08', 'ff-f-09'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['true', 'fake', 'believe', 'doubt', 'honest', 'source', 'check', 'trust', 'fact', 'opinion'],
      },
      {
        type: 'recycled-vocab',
        prompt: 'Find recycled vocabulary from a previous theme — trust reappears from Theme 4, now applied to information instead of people.',
        items: ['trust'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['dressed up to look real', 'worth a second look', 'passed along'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's purpose.",
        note: 'The passage opens with the false claim itself, in quotation marks, before any context — mirroring how misinformation actually reaches people, before anyone has a chance to check it.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, what did Haruto do before deciding whether to trust the message?',
      explainer: 'In simple words: what did Haruto do before he decided whether to believe the message?',
      explainerJa: 'この質問は、「ハルトはそのメッセージを信じるかどうか決める前に、何をしたか」を聞いています。',
      hint: 'Look at what happens in paragraph 2, when Haruto searches for the source.',
      hintJa: '第2段落で、ハルトが情報源を調べる場面に注目してみましょう。',
      options: [
        { id: 'a', label: 'He asked all his friends if they had also seen it.', correct: false },
        { id: 'b', label: 'He checked where the claim came from and looked for its source.', correct: true },
        { id: 'c', label: 'He shared it with his family right away, just to be safe.', correct: false },
      ],
      answerParagraphId: 'ff-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading shows Haruto actually checking the information before believing it?',
      evidenceOptions: [
        { id: 'e1', label: 'Part of him wanted to believe it immediately and share it with his family before checking whether it was true.', paragraphId: 'ff-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'He searched for the source and found that no real doctor or hospital had ever said this.', paragraphId: 'ff-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'He learned to doubt messages that sounded too dramatic, and to trust sources that were honest about where their information came from.', paragraphId: 'ff-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'Haruto decided to check where the claim came from',
        question: 'What does "check" mean here?',
        options: [
          { id: 'a', label: 'To make a small mark like a ✓ on paper.', correct: false },
          { id: 'b', label: 'To look into something carefully to see if it is true.', correct: true },
          { id: 'c', label: 'To ask a restaurant for the bill.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Haruto almost believed a message that was not true. Have you ever seen information online that turned out to be false? What happened? If not, what would you do to check if something is true before you believe it?',
      promptJapanese: 'ハルトは真実ではないメッセージを信じかけました。あなたは、後で嘘だと分かった情報をオンラインで見たことがありますか。何が起きましたか。もしなければ、何かを信じる前に、それが本当かどうかを確かめるためにどうしますか。',
      minSentences: 2,
      sentenceStarters: ['One time, I saw...', 'I checked by...', 'Before I believe something, I...'],
      wordBank: [
        { vocabId: 'ff-f-07', examplePhrase: 'I checked by...' },
        { vocabId: 'ff-f-04', examplePhrase: 'At first I doubted it, but...' },
        { vocabId: 'lt-f-02', examplePhrase: 'I trust sources that...' },
        { vocabId: 'ff-f-01', examplePhrase: 'It turned out to be true.' },
        { vocabId: 'ff-f-08', examplePhrase: 'It was just an opinion, not a fact.' },
        { vocabId: 'ff-f-03', examplePhrase: 'I almost believed it because...' },
      ],
      usefulExpressions: [
        { phrase: 'One time, I saw...', japanese: 'ある時、私は...を見ました' },
        { phrase: 'I checked by...', japanese: '私は...することで確認しました' },
        { phrase: 'Before I believe something, I...', japanese: '何かを信じる前に、私は...' },
        { phrase: 'It turned out that...', japanese: '結局...ということが分かりました' },
      ],
    },

    takeaway: 'Not everything online is fake, but it is always worth a second look before you believe it.',
  },

  // ── Peace and War — Foundation ───────────────────────────────────────────────
  // Ported from docs/THEME_06_READING_WRITING.md (approved design).

  {
    id: 'pw-f-reading-01',
    themeId: 'peace-and-war',
    level: 'foundation',
    title: 'Grandma, What Was It Like?',
    titleJapanese: 'おばあちゃん、それはどんな感じだったの？',
    estimatedMinutes: 15,
    welcome: "Today, you will read about a student who finally asked her grandmother about the war she lived through.",
    mission: 'As you read, notice what Yuna learns about her grandmother\'s experience. At the end, think about a story from your own family history.',

    preReadingSurvey: {
      question: 'Have you ever asked an older family member about something difficult they lived through?',
      options: [
        { id: 'yes', label: 'Yes, I have asked before.' },
        { id: 'no', label: "No, but I'd like to." },
        { id: 'unsure', label: "I'm not sure I would know how to ask." },
      ],
    },

    paragraphs: [
      {
        id: 'pw-f-reading-01-p1',
        english:
          'Yuna had heard her grandmother mention the war before, but she had never really asked about it. One quiet afternoon, while they were drinking tea together, she finally did: "Grandma, what was it like?" Her grandmother paused for a long moment, looking out the window, before she began to speak.',
        japanese:
          'ユナは以前から祖母が戦争について口にするのを聞いたことがありましたが、それについてきちんと尋ねたことは一度もありませんでした。ある静かな午後、二人でお茶を飲んでいるときに、ユナはついに尋ねました。「おばあちゃん、それはどんな感じだったの?」祖母は長い間、窓の外を見つめながら黙り込み、それから話し始めました。',
        plainEnglish:
          'Yuna had heard her grandmother mention the war before, but never really asked about it. One afternoon, over tea, she finally asked what it was like. Her grandmother paused for a long time, looking out the window, before she began to speak.',
        checkQuestion: 'According to this paragraph, what did Yuna finally ask her grandmother?',
      },
      {
        id: 'pw-f-reading-01-p2',
        english:
          'When she was young, her grandmother said, her family had to leave their home because of the fighting nearby. They became refugees for almost a year, moving from place to place with only what they could carry, never quite feeling safe. As a civilian, she was never a soldier, but the war still changed everything about her daily life, from what she ate to where she slept.',
        japanese:
          '祖母が若かった頃、近くでの戦闘のために家族は家を離れなければならなかったと祖母は話しました。彼らはほぼ一年もの間、避難民として、持てるものだけを持ってあちこちを移動し、決して本当の安心を感じることはありませんでした。民間人として、祖母は兵士になったことは一度もありませんでしたが、それでも戦争は、何を食べるかから、どこで眠るかまで、日常生活のすべてを変えてしまいました。',
        plainEnglish:
          "When she was young, her grandmother's family had to leave home because of nearby fighting. They became refugees for almost a year, carrying only what they could, never feeling truly safe. She was a civilian, never a soldier, but the war changed her entire daily life.",
        checkQuestion: 'According to this paragraph, how did the war affect Yuna\'s grandmother\'s daily life, even though she was never a soldier?',
      },
      {
        id: 'pw-f-reading-01-p3',
        english:
          'Her grandmother said that the war created many victims, even among people who never fought. When the fighting finally ended and the two sides signed a peace treaty, her family could return home. Now, she wanted Yuna to know this piece of family history — not as something sad to carry, but as a legacy of surviving something very hard and choosing peace afterward.',
        japanese:
          '祖母は、戦争は戦わなかった人々の間にも多くの犠牲者を生んだと話しました。戦闘がついに終わり、両者が和平条約に署名すると、家族は家に戻ることができました。今、祖母はユナにこの家族の歴史を知ってほしいと思っていました——それは悲しみとして背負うものではなく、とても辛いことを乗り越え、その後に平和を選んだ証として。',
        plainEnglish:
          'Her grandmother said the war created many victims, even people who never fought. When the fighting ended and both sides signed a peace treaty, the family could return home. She wanted Yuna to know this family history — not as something sad, but as proof of surviving something hard and choosing peace afterward.',
        checkQuestion: "According to this paragraph, how did the war finally end for Yuna's grandmother's family?",
      },
    ],

    targetVocabIds: ['pw-f-01', 'pw-f-02', 'pw-f-03', 'pw-f-04', 'pw-f-05', 'pw-f-06', 'pw-f-07', 'pw-f-08'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['peace', 'war', 'victim', 'refugee', 'civilian', 'treaty', 'history', 'legacy'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['paused for a long moment', 'never quite feeling safe'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'This is a frame narrative: a question (paragraph 1) leads to a personal account (paragraph 2), which leads to reflection (paragraph 3).',
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's purpose.",
        note: "Telling this through a grandmother's own words, rather than a general historical description, personalizes history rather than presenting it as distant or abstract.",
      },
    ],

    missionCheck: {
      question: "According to the passage, why did Yuna's grandmother and her family have to leave their home?",
      explainer: "In simple words: why did Yuna's grandmother's family have to leave home?",
      explainerJa: 'この質問は、「なぜユナの祖母の家族は家を離れなければならなかったのか」を聞いています。',
      hint: 'Look at what happens at the beginning of paragraph 2.',
      hintJa: '第2段落の始まりの部分に注目してみましょう。',
      options: [
        { id: 'a', label: 'They wanted to visit a different city for a vacation.', correct: false },
        { id: 'b', label: 'Fighting nearby made it unsafe for them to stay.', correct: true },
        { id: 'c', label: 'Yuna\'s grandmother decided to become a soldier.', correct: false },
      ],
      answerParagraphId: 'pw-f-reading-01-p2',
      evidencePrompt: "Which idea from the reading explains what daily life was like for Yuna's grandmother during the war?",
      evidenceOptions: [
        { id: 'e1', label: 'Her grandmother paused for a long moment, looking out the window, before she began to speak.', paragraphId: 'pw-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'They became refugees for almost a year, moving from place to place with only what they could carry, never quite feeling safe.', paragraphId: 'pw-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'When the fighting finally ended and the two sides signed a peace treaty, her family could return home.', paragraphId: 'pw-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'a legacy of surviving something very hard',
        question: 'What does "legacy" mean here?',
        options: [
          { id: 'a', label: 'Money or property left to someone after a person dies.', correct: false },
          { id: 'b', label: 'Something meaningful passed down from the past that still matters now.', correct: true },
          { id: 'c', label: 'A type of official government document.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Yuna learned something important by asking her grandmother about the past. Is there a story or lesson from an older family member that you know, or would like to ask about? What is it, or what would you like to know?',
      promptJapanese: 'ユナは祖母に過去について尋ねることで、大切なことを学びました。あなたには、知っている家族の年上の人からの物語や教訓、あるいは尋ねてみたいことがありますか。それは何ですか、あるいは何を知りたいですか。',
      minSentences: 2,
      sentenceStarters: ['My grandmother/grandfather once told me...', 'I would like to ask about...', 'One important lesson in my family is...'],
      wordBank: [
        { vocabId: 'pw-f-07', examplePhrase: 'One important part of my family history is...' },
        { vocabId: 'pw-f-08', examplePhrase: 'It felt like a legacy of...' },
        { vocabId: 'pw-f-01', examplePhrase: 'My family found peace when...' },
      ],
      usefulExpressions: [
        { phrase: 'My grandmother/grandfather once told me...', japanese: '私の祖母/祖父はかつて私に...と話してくれました' },
        { phrase: 'I would like to ask about...', japanese: '私は...について尋ねてみたいです' },
        { phrase: 'One important lesson in my family is...', japanese: '私の家族にとって大切な教訓の一つは...です' },
      ],
    },

    takeaway: 'The war created many victims, even among people who never fought.',
  },

  // ── Caring for Our Planet — Foundation ──────────────────────────────────────
  // Ported from docs/THEME_07_READING_WRITING.md (approved design).

  {
    id: 'cp-f-reading-01',
    themeId: 'caring-for-our-planet',
    level: 'foundation',
    title: 'The Beach She Used to Know',
    titleJapanese: '彼女が知っていた頃の海岸',
    estimatedMinutes: 15,
    welcome: 'Today, you will read about a student who noticed her favorite beach was changing — and decided to do something small about it.',
    mission: 'As you read, notice what Aoi learns about why the beach is changing. At the end, think about one small environmental habit of your own.',

    preReadingSurvey: {
      question: 'Have you ever noticed a place you know well change over time?',
      options: [
        { id: 'yes', label: 'Yes, I have noticed a change.' },
        { id: 'no', label: 'Not that I can think of.' },
        { id: 'unsure', label: "I'm not sure I've paid attention." },
      ],
    },

    paragraphs: [
      {
        id: 'cp-f-reading-01-p1',
        english:
          'Aoi had been visiting the same beach with her family every summer since she was five years old. This year, she noticed something different: less sand, more plastic bottles, and far fewer of the small crabs she used to chase as a child.',
        japanese:
          'アオイは五歳の頃から、毎年夏に家族と同じ海岸を訪れていました。今年、彼女は何かが違うことに気づきました——砂は少なくなり、プラスチックのボトルは増え、子どもの頃に追いかけていた小さなカニの数もずっと減っていたのです。',
        plainEnglish:
          'Aoi had visited the same beach with her family every summer since she was five. This year, she noticed changes: less sand, more plastic bottles, and far fewer of the small crabs she used to chase as a child.',
        checkQuestion: 'According to this paragraph, what three changes did Aoi notice at the beach this year?',
      },
      {
        id: 'cp-f-reading-01-p2',
        english:
          'She asked her uncle, who had lived near the beach his whole life, what had happened. He explained that pollution from nearby towns was affecting the local environment, and that the ecosystem — all the plants and animals connected to this one small beach — was slowly changing because of it. He also explained that a warmer climate was affecting the whole coastline.',
        japanese:
          '彼女は、その海岸の近くにずっと住んでいた叔父に、何が起きたのか尋ねました。叔父は、近くの町からの汚染が地域の環境に影響を与えており、この小さな海岸とつながっているすべての植物や動物からなる生態系が、それによって少しずつ変化していると説明しました。また、温暖化する気候が海岸線全体に影響を与えていることも説明してくれました。',
        plainEnglish:
          "Aoi asked her uncle, who had lived near the beach his whole life, what had happened. He explained that pollution from nearby towns was affecting the environment, and that the ecosystem — all the plants and animals connected to the beach — was slowly changing. A warmer climate was affecting the whole coastline too.",
        checkQuestion: "According to this paragraph, what two things did Aoi's uncle say were affecting the beach?",
      },
      {
        id: 'cp-f-reading-01-p3',
        english:
          'Aoi did not know how to fix something so big, but she decided to start small. She began carrying a reusable bottle instead of buying new plastic ones, and she joined a weekend group that collected trash from the beach. She learned that even one species, like the crabs she loved, depended on people using resources like water and plastic more carefully. It was not a perfect solution, but it was something she could actually do.',
        japanese:
          'アオイは、これほど大きな問題をどう解決すればいいのか分かりませんでしたが、小さなことから始めることにしました。彼女は新しいプラスチックボトルを買う代わりに繰り返し使えるボトルを持ち歩くようになり、海岸のゴミを集める週末のグループにも参加しました。彼女は、大好きなカニのような一つの種でさえ、人々が水やプラスチックのような資源をより注意深く使うことにかかっていると学びました。完璧な解決策ではありませんでしたが、それは彼女が実際に行動できることでした。',
        plainEnglish:
          "Aoi didn't know how to fix something so big, but she decided to start small. She began carrying a reusable bottle and joined a weekend beach cleanup group. She learned that even one species, like the crabs she loved, depended on people using resources like water and plastic more carefully. It wasn't a perfect solution, but it was something she could actually do.",
        checkQuestion: 'According to this paragraph, what two small actions did Aoi start doing?',
      },
    ],

    targetVocabIds: ['cp-f-01', 'cp-f-02', 'cp-f-03', 'cp-f-04', 'cp-f-05', 'cp-f-06'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['environment', 'species', 'ecosystem', 'climate', 'pollution', 'resource'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['start small', 'not a perfect solution'],
      },
      {
        type: 'discourse-marker',
        prompt: 'Notice how "ecosystem" is defined right inside the sentence that introduces it, using a dash-set-off phrase.',
        items: ['the ecosystem — all the plants and animals connected to this one small beach — was slowly changing'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'Paragraph 1 is observation, paragraph 2 explains the cause, and paragraph 3 shows Aoi\'s personal response and action.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, why did Aoi notice a change at the beach this year?',
      explainer: 'In simple words: what three changes did Aoi see at the beach this year?',
      explainerJa: 'この質問は、「アオイが今年、海岸で気づいた変化とは何か」を聞いています。',
      hint: 'Look at what happens at the end of paragraph 1.',
      hintJa: '第1段落の終わりの部分に注目してみましょう。',
      options: [
        { id: 'a', label: 'She had never visited the beach before this year.', correct: false },
        { id: 'b', label: 'She saw less sand, more plastic, and fewer crabs than before.', correct: true },
        { id: 'c', label: 'Her uncle told her the beach had closed permanently.', correct: false },
      ],
      answerParagraphId: 'cp-f-reading-01-p1',
      evidencePrompt: 'Which idea from the reading explains the reasons behind the changes Aoi noticed at the beach?',
      evidenceOptions: [
        { id: 'e1', label: 'This year, she noticed something different: less sand, more plastic bottles, and far fewer of the small crabs she used to chase as a child.', paragraphId: 'cp-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'He explained that pollution from nearby towns was affecting the local environment, and that the ecosystem... was slowly changing because of it.', paragraphId: 'cp-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'She began carrying a reusable bottle instead of buying new plastic ones, and she joined a weekend group that collected trash from the beach.', paragraphId: 'cp-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'people using resources like water and plastic more carefully',
        question: 'What does "resources" mean here?',
        options: [
          { id: 'a', label: 'Money that a person saves in a bank.', correct: false },
          { id: 'b', label: 'Natural materials, like water, that people use in daily life.', correct: true },
          { id: 'c', label: 'Special skills that a person has learned.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Aoi decided to start small by carrying a reusable bottle and joining a beach cleanup. Is there a small environmental habit you already have, or one you would like to start? What is it?',
      promptJapanese: 'アオイは、繰り返し使えるボトルを持ち歩き、海岸清掃に参加することで、小さなことから始めることにしました。あなたにはすでに行っている小さな環境への習慣がありますか、それともこれから始めてみたい習慣がありますか。それは何ですか。',
      minSentences: 2,
      sentenceStarters: ['I already try to...', 'One small thing I could do is...', 'I noticed that...'],
      wordBank: [
        { vocabId: 'cp-f-01', examplePhrase: 'I try to help the environment by...' },
        { vocabId: 'cp-f-06', examplePhrase: 'I try to use resources like water more carefully.' },
        { vocabId: 'cp-f-05', examplePhrase: 'I noticed pollution when...' },
        { vocabId: 'cp-f-02', examplePhrase: 'One species I care about is...' },
      ],
      usefulExpressions: [
        { phrase: 'I already try to...', japanese: '私はすでに...するようにしています' },
        { phrase: 'One small thing I could do is...', japanese: '私にできる小さなことの一つは...です' },
        { phrase: 'I noticed that...', japanese: '私は...ということに気づきました' },
        { phrase: 'It is not perfect, but...', japanese: '完璧ではありませんが、...' },
      ],
    },

    takeaway: 'It was not a perfect solution, but it was something she could actually do.',
  },

  // ── Living with AI — Foundation ──────────────────────────────────────────────
  // Ported from docs/THEME_08_READING_WRITING.md (approved design).

  {
    id: 'la-f-reading-01',
    themeId: 'living-with-ai',
    level: 'foundation',
    title: 'Whose Thinking Is It?',
    titleJapanese: 'それは誰の考えなのか',
    estimatedMinutes: 15,
    welcome: 'Today, you will read about a student who used AI to help with an essay — and what he learned about where the thinking has to come from.',
    mission: 'As you read, notice how Kenta changes the way he uses AI. At the end, think about how you make sure your own thinking stays part of your work.',

    preReadingSurvey: {
      question: 'When you use AI for schoolwork, how do you usually check its ideas?',
      options: [
        { id: 'always', label: 'I always check carefully.' },
        { id: 'sometimes', label: 'I check sometimes.' },
        { id: 'rarely', label: "I don't use AI for schoolwork." },
      ],
    },

    paragraphs: [
      {
        id: 'la-f-reading-01-p1',
        english:
          'Kenta typed his essay question into an AI tool and watched as a full paragraph appeared in seconds. It was so convenient — no searching, no staring at a blank page — that he almost forgot to think about whether it was actually good. His goal had been to finish quickly, and this felt like exactly what he needed.',
        japanese:
          'ケンタはAIツールに作文の質問を入力すると、数秒で段落全体が現れるのを見ました。それはとても便利で——調べる必要も、白紙のページを見つめる必要もなく——彼はそれが本当に良いものかどうか考えることをほとんど忘れてしまうほどでした。彼の目標は早く終わらせることであり、これはまさに彼が必要としていたもののように感じられました。',
        plainEnglish:
          'Kenta typed his essay question into an AI tool, and a full paragraph appeared in seconds. It was so convenient that he almost forgot to think about whether it was actually good. He just wanted to finish quickly, and this seemed perfect for that.',
        checkQuestion: 'According to this paragraph, what did Kenta almost forget to do?',
      },
      {
        id: 'la-f-reading-01-p2',
        english:
          'But when his teacher asked him to explain his own opinion out loud the next day, Kenta realized he could not remember why the essay said what it said. He had not checked whether the ideas were even true — he had simply copied them. This kind of technology could save time, but automation could not do his thinking for him. Taking responsibility for his own work suddenly felt much harder than it should have.',
        japanese:
          'しかし翌日、先生が自分の意見を声に出して説明するように求めると、ケンタはなぜその作文がそのような内容になっているのか思い出せないことに気づきました。彼はそのアイデアが本当かどうか確認しておらず、ただそれをそのままコピーしただけでした。この種のテクノロジーは時間を節約してくれるかもしれませんが、オートメーションが彼の代わりに考えてくれるわけではありませんでした。自分の課題に責任を持つことが、突然、そうあるべき以上に難しく感じられました。',
        plainEnglish:
          "But when his teacher asked him to explain his own opinion out loud the next day, Kenta couldn't remember why the essay said what it said. He hadn't checked if the ideas were true — he had just copied them. Technology could save time, but automation couldn't think for him. Taking responsibility for his own work suddenly felt hard.",
        checkQuestion: 'What did Kenta realize he had not done before turning in his essay?',
      },
      {
        id: 'la-f-reading-01-p3',
        english:
          'After that, Kenta decided to use AI differently. He still asked it for ideas sometimes, curious about how its algorithm could suggest angles he had not considered, but now he always checked those ideas carefully and wrote the final essay in his own words. AI could help him start, he realized, but the thinking — and the responsibility for it — still had to be his.',
        japanese:
          'それ以来、ケンタはAIの使い方を変えることにしました。時々はまだアイデアを求めることもあり、そのアルゴリズムが考えもしなかった視点を提案してくれることに興味を持っていましたが、今では必ずそのアイデアを注意深く確認し、最終的な作文は自分自身の言葉で書くようにしていました。AIは始めるための助けにはなるが、考えること——そしてその責任——は、やはり自分自身のものでなければならないと、彼は気づいたのです。',
        plainEnglish:
          "After that, Kenta decided to use AI differently. He still asked it for ideas sometimes, curious about how its algorithm could suggest angles he hadn't considered, but now he always checked those ideas carefully and wrote the final essay in his own words. AI could help him start, but the thinking — and the responsibility for it — still had to be his.",
        checkQuestion: 'According to this paragraph, how did Kenta change the way he used AI?',
      },
    ],

    targetVocabIds: ['la-f-01', 'la-f-02', 'la-f-03', 'la-f-04', 'la-f-05'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['AI', 'technology', 'automation', 'convenience', 'algorithm'],
      },
      {
        type: 'recycled-vocab',
        prompt: 'Find recycled vocabulary from previous themes — goal, responsibility, checked, and true all reappear here in a new context.',
        items: ['goal', 'responsibility', 'checked', 'true'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['staring at a blank page', 'do his thinking for him'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's tone.",
        note: "The passage shows both AI's usefulness (suggesting angles Kenta hadn't considered) and its limits (it can't take responsibility for his thinking) — avoiding both the extreme that AI is dangerous and the extreme that AI solves everything.",
      },
    ],

    missionCheck: {
      question: 'According to the passage, why did Kenta struggle when his teacher asked him to explain his opinion?',
      explainer: 'In simple words: why did Kenta have trouble explaining his own opinion in class?',
      explainerJa: 'この質問は、「なぜケンタは授業で自分の意見をうまく説明できなかったのか」を聞いています。',
      hint: 'Look at what happens at the start of paragraph 2.',
      hintJa: '第2段落の始まりの部分に注目してみましょう。',
      options: [
        { id: 'a', label: 'He had forgotten to bring his notebook to class.', correct: false },
        { id: 'b', label: "He had copied the AI's ideas without checking or truly understanding them.", correct: true },
        { id: 'c', label: 'His teacher had asked a question about a different topic.', correct: false },
      ],
      answerParagraphId: 'la-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading shows Kenta changing how he uses AI after his experience in class?',
      evidenceOptions: [
        { id: 'e1', label: 'It was so convenient — no searching, no staring at a blank page — that he almost forgot to think about whether it was actually good.', paragraphId: 'la-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'Taking responsibility for his own work suddenly felt much harder than it should have.', paragraphId: 'la-f-reading-01-p2', correct: false },
        { id: 'e3', label: 'Now he always checked those ideas carefully and wrote the final essay in his own words.', paragraphId: 'la-f-reading-01-p3', correct: true },
      ],
      vocabInContext: {
        quote: 'curious about how its algorithm could suggest angles',
        question: 'What does "algorithm" mean here?',
        options: [
          { id: 'a', label: 'A robot that can talk and think like a human.', correct: false },
          { id: 'b', label: 'A set of steps or rules a computer program follows to do something.', correct: true },
          { id: 'c', label: 'A company that makes computers and phones.', correct: false },
        ],
      },
    },

    writing: {
      prompt: "Kenta learned that AI could help him start, but the thinking had to be his. If you use AI to help with schoolwork, what is one thing you would do to make sure your ideas are really your own? If you don't use AI, describe one way you make sure your ideas are original when you write.",
      promptJapanese: 'ケンタは、AIは始めるための助けになるが、考えることは自分自身のものでなければならないと学びました。もしあなたが学校の課題でAIを使うなら、自分の考えが本当に自分自身のものであることを確かめるために、どんなことをしますか。もしAIを使わないなら、書くときにアイデアがオリジナルであることを確かめる方法を一つ説明してください。',
      minSentences: 2,
      sentenceStarters: ['If I use AI, I would...', 'One way to make sure my thinking is my own is...', 'I always try to...'],
      wordBank: [
        { vocabId: 'la-f-01', examplePhrase: 'If I use AI, I would...' },
        { vocabId: 'la-f-05', examplePhrase: "I'm curious how the algorithm..." },
        { vocabId: 'la-f-02', examplePhrase: 'This technology helps me...' },
        { vocabId: 'la-f-03', examplePhrase: 'Automation can save time, but...' },
      ],
      usefulExpressions: [
        { phrase: 'If I use AI, I would...', japanese: 'もしAIを使うなら、私は...するでしょう' },
        { phrase: 'One way to make sure my thinking is my own is...', japanese: '自分の考えが自分自身のものであることを確かめる一つの方法は...です' },
        { phrase: 'I always try to...', japanese: '私はいつも...するようにしています' },
      ],
    },

    takeaway: 'AI could help him start, but the thinking — and the responsibility for it — still had to be his.',
  },

  // ── Learning from History — Foundation ───────────────────────────────────────
  // Ported from docs/THEME_09_READING_WRITING.md (approved design).

  {
    id: 'lh-f-reading-01',
    themeId: 'learning-from-history',
    level: 'foundation',
    title: 'The Photograph in the Drawer',
    titleJapanese: '引き出しの中の写真',
    estimatedMinutes: 15,
    welcome: 'Today, you will read about a student who found an old family photograph — and discovered a piece of history that was also her own story.',
    mission: 'As you read, notice what Rin learns about her family through one old photograph. At the end, think about an object or story from your own family\'s past.',

    preReadingSurvey: {
      question: 'Do you know a story or object from your own family\'s past?',
      options: [
        { id: 'yes', label: 'Yes, I know one.' },
        { id: 'no', label: 'Not really — I\'d like to learn one.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'lh-f-reading-01-p1',
        english:
          'Rin found an old photograph tucked inside her grandmother\'s desk drawer — a young woman standing proudly in front of a small shop that no longer existed. "Who is this?" Rin asked. Her grandmother smiled and explained that the woman was Rin\'s own ancestor, who had run that little shop during a very different era, long before either of them was born.',
        japanese:
          'リンは、祖母の机の引き出しの中にしまわれていた古い写真を見つけました——もう存在しない小さな店の前に誇らしげに立つ若い女性の写真でした。「これは誰?」とリンは尋ねました。祖母は微笑んで、その女性はリン自身の祖先であり、二人が生まれるずっと前、まったく違う時代にその小さな店を営んでいたのだと説明しました。',
        plainEnglish:
          'Rin found an old photograph in her grandmother\'s desk drawer — a young woman standing in front of a small shop that no longer existed. Rin asked who it was. Her grandmother explained that the woman was Rin\'s own ancestor, who ran that shop in a very different era, long before either of them was born.',
        checkQuestion: 'According to this paragraph, who was the woman in the old photograph?',
      },
      {
        id: 'lh-f-reading-01-p2',
        english:
          'The shop had closed suddenly after one event: a fire that swept through the neighborhood one winter night. That single event changed the whole family\'s history — without the shop, Rin\'s ancestors had to find new work and move to a different part of the city. One cause, her grandmother said, had led to so many effects, some of which were still shaping the family even now.',
        japanese:
          'その店は、ある冬の夜に近所を襲った火事という一つの出来事の後、突然閉店してしまいました。その一つの出来事が、家族全体の歴史を変えてしまいました——店を失ったことで、リンの祖先たちは新しい仕事を見つけ、街の別の場所へ引っ越さなければなりませんでした。祖母によれば、一つの原因が、今もなお家族に影響を与え続けている、実に多くの結果を生んだのだそうです。',
        plainEnglish:
          'The shop closed suddenly after one event: a fire that swept through the neighborhood one winter night. That single event changed the whole family\'s history — without the shop, Rin\'s ancestors had to find new work and move to a different part of the city. One cause led to many effects, some still shaping the family today.',
        checkQuestion: 'According to this paragraph, what event caused the shop to close?',
      },
      {
        id: 'lh-f-reading-01-p3',
        english:
          'Rin looked at the photograph again, seeing it differently now. It was not just an old picture — it was a small piece of her family\'s legacy, one event from long ago still quietly shaping her life today. History, she realized, was not only something written in books; it was also her own story, waiting to be noticed.',
        japanese:
          'リンはもう一度その写真を見つめ、今度は違って見えることに気づきました。それは単なる古い写真ではなく、家族の遺産の小さな一部——ずっと昔の一つの出来事が、今も静かに彼女の人生を形作り続けている証だったのです。歴史とは、本の中だけに書かれているものではなく、自分自身の物語でもあり、気づかれるのを待っているものなのだと、リンは気づきました。',
        plainEnglish:
          'Rin looked at the photograph again, and it seemed different now. It wasn\'t just an old picture — it was a small piece of her family\'s legacy, one event from long ago still quietly shaping her life today. She realized history wasn\'t only something written in books; it was also her own story, waiting to be noticed.',
        checkQuestion: 'According to this paragraph, what did Rin realize history really was?',
      },
    ],

    targetVocabIds: ['pw-f-07', 'pw-f-08', 'lh-f-01', 'lh-f-02', 'lh-f-03', 'lh-f-04', 'lh-f-05'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['history', 'legacy', 'event', 'era', 'cause', 'effect', 'ancestor'],
      },
      {
        type: 'recycled-vocab',
        prompt: 'Find recycled vocabulary from a previous theme — history and legacy both reappear from Theme 6, now becoming this theme\'s own central focus.',
        items: ['history', 'legacy'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['tucked inside', 'swept through the neighborhood', 'waiting to be noticed'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'This is a frame narrative built around a discovered object (an old photograph): a present-day question opens into a past event, and closes with personal reflection.',
      },
    ],

    missionCheck: {
      question: "According to the passage, why did Rin's ancestor's shop close?",
      explainer: "In simple words: what caused Rin's ancestor's shop to close?",
      explainerJa: 'この質問は、「リンの祖先の店が閉店した原因は何だったのか」を聞いています。',
      hint: 'Look at what happens at the start of paragraph 2.',
      hintJa: '第2段落の始まりの部分に注目してみましょう。',
      options: [
        { id: 'a', label: "Rin's ancestor decided to retire early.", correct: false },
        { id: 'b', label: 'A fire swept through the neighborhood one winter night.', correct: true },
        { id: 'c', label: 'The city asked the family to move to a new location.', correct: false },
      ],
      answerParagraphId: 'lh-f-reading-01-p2',
      evidencePrompt: 'Which idea from the reading explains what happened to the family after the shop closed?',
      evidenceOptions: [
        { id: 'e1', label: "Her grandmother smiled and explained that the woman was Rin's own ancestor, who had run that little shop during a very different era.", paragraphId: 'lh-f-reading-01-p1', correct: false },
        { id: 'e2', label: "Without the shop, Rin's ancestors had to find new work and move to a different part of the city.", paragraphId: 'lh-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'It was not just an old picture — it was a small piece of her family\'s legacy.', paragraphId: 'lh-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: "it was a small piece of her family's legacy",
        question: 'What does "legacy" mean here?',
        options: [
          { id: 'a', label: 'A type of old photograph.', correct: false },
          { id: 'b', label: 'Something from the past that is passed down and still matters today.', correct: true },
          { id: 'c', label: 'A store that sells family photos.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Rin learned something important by looking at an old family photograph. Is there an old photo, object, or story in your family that is special to you? What is it, or what would you like to know about it?',
      promptJapanese: 'リンは古い家族の写真を見ることで、大切なことを学びました。あなたの家族に、あなたにとって特別な古い写真や物、あるいは物語はありますか。それは何ですか、あるいはそれについて何を知りたいですか。',
      minSentences: 2,
      sentenceStarters: ['One old photo in my family...', 'I would like to know...', 'This is important because...'],
      wordBank: [
        { vocabId: 'pw-f-07', examplePhrase: 'One part of my family history is...' },
        { vocabId: 'pw-f-08', examplePhrase: 'It felt like a legacy of...' },
        { vocabId: 'lh-f-05', examplePhrase: 'My ancestor once...' },
        { vocabId: 'lh-f-01', examplePhrase: 'One event that shaped my family was...' },
      ],
      usefulExpressions: [
        { phrase: 'One old photo in my family...', japanese: '私の家族にある一枚の古い写真は...' },
        { phrase: 'I would like to know...', japanese: '私は...を知りたいです' },
        { phrase: 'This is important because...', japanese: 'これが大切なのは...だからです' },
      ],
    },

    takeaway: 'History was not only something written in books; it was also her own story, waiting to be noticed.',
  },

  // ── Science in Everyday Life — Foundation ────────────────────────────────────
  // Ported from docs/THEME_10_READING_WRITING.md (approved design).

  {
    id: 'se-f-reading-01',
    themeId: 'science-in-everyday-life',
    level: 'foundation',
    title: 'The Mystery of the Wet Can',
    titleJapanese: '濡れた缶のなぞ',
    estimatedMinutes: 15,
    welcome: 'Today, you will read about a student who got curious about something very ordinary — a wet can of juice — and investigated it like a scientist.',
    mission: 'As you read, notice how Yuto tests his idea about the water on the can. At the end, think about something in your own everyday life you\'re curious about.',

    preReadingSurvey: {
      question: 'Is there something in everyday life you\'ve wondered "why does this happen"?',
      options: [
        { id: 'yes', label: 'Yes, definitely.' },
        { id: 'no', label: "Not that I've noticed." },
        { id: 'maybe', label: 'Maybe, but I never looked into it.' },
      ],
    },

    paragraphs: [
      {
        id: 'se-f-reading-01-p1',
        english:
          'Yuto pulled a cold can of juice from the fridge on a hot afternoon, and within a minute, the outside was covered in tiny drops of water. The can was sealed — nothing could be leaking out. He became curious: where was all that water coming from? He turned the can over, checking for a crack, but found nothing.',
        japanese:
          'ユトは暑い午後、冷蔵庫から冷たいジュースの缶を取り出しました。すると一分もしないうちに、缶の外側には小さな水滴がびっしりとつきました。缶は密閉されていて、何かが漏れているはずはありませんでした。彼は好奇心を感じました——あの水はいったいどこから来たのだろう?彼はひびが入っていないか確かめようと缶をひっくり返してみましたが、何も見つかりませんでした。',
        plainEnglish:
          'Yuto took a cold can of juice from the fridge on a hot afternoon. Within a minute, the outside was covered in tiny drops of water. The can was sealed, so nothing could be leaking. He wondered where the water was coming from, and checked the can for a crack, but found none.',
        checkQuestion: 'According to this paragraph, what did Yuto notice about the can, and what did he check for?',
      },
      {
        id: 'se-f-reading-01-p2',
        english:
          'At first, he guessed it might be a tiny hole in the can — a simple hypothesis, but one he could test. He grabbed a dry glass, filled it with ice, and set it beside the can as a small experiment. Within minutes, the glass was just as wet as the can, even though it had never touched any liquid outside.',
        japanese:
          '最初、彼は缶に小さな穴が開いているのではないかと考えました——単純な仮説でしたが、確かめることができるものでした。彼は乾いたグラスを用意し、氷を入れて、缶の隣に置いてみました。これは小さな実験でした。数分後には、外の液体に一度も触れていないはずのグラスも、缶と同じくらい濡れていました。',
        plainEnglish:
          'At first, Yuto guessed there might be a tiny hole in the can — a simple hypothesis he could test. He filled a dry glass with ice and placed it next to the can as a small experiment. Within minutes, the glass was just as wet as the can, even though it had never touched any liquid.',
        checkQuestion: 'What experiment did Yuto set up to test his hypothesis?',
      },
      {
        id: 'se-f-reading-01-p3',
        english:
          "His hypothesis was wrong — the water wasn't leaking from inside at all. Through careful observation, Yuto realized the water was coming from the warm air itself: when warm air touched something cold, it cooled down and turned into tiny drops of liquid. It was a small, everyday phenomenon, but knowing the science behind it made an ordinary summer afternoon feel a little more interesting.",
        japanese:
          '彼の仮説は間違っていました——水は缶の内部から漏れていたわけではなかったのです。注意深く観察した結果、ユトはその水が暖かい空気そのものから来ていることに気づきました。暖かい空気が冷たいものに触れると、冷やされて小さな水滴に変わるのです。それはささやかな、日常的な現象でしたが、その裏にある科学を知ることで、ありふれた夏の午後が少しだけ面白く感じられるようになりました。',
        plainEnglish:
          "His hypothesis was wrong — the water wasn't leaking from inside the can. Through careful observation, Yuto realized the water was coming from the warm air itself: when warm air touches something cold, it cools down and turns into tiny drops. It was a small, everyday phenomenon, but knowing the science behind it made an ordinary afternoon feel more interesting.",
        checkQuestion: 'According to this paragraph, where did the water on the can actually come from?',
      },
    ],

    targetVocabIds: ['se-f-01', 'se-f-02', 'se-f-03', 'se-f-04', 'se-f-05', 'se-f-06'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['science', 'observation', 'hypothesis', 'phenomenon', 'experiment', 'curiosity'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['checking for a crack', 'set it beside the can', 'cooled down'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'The passage models the scientific method concretely: an observed puzzle (paragraph 1) → a hypothesis and a test (paragraph 2) → a corrected conclusion through observation (paragraph 3).',
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's purpose.",
        note: 'The passage shows a wrong first hypothesis being revised through testing, modeling that being wrong is a normal, productive part of scientific thinking rather than a failure.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, what did Yuto discover about the water on the outside of the can?',
      explainer: 'In simple words: where did Yuto discover the water on the can was really coming from?',
      explainerJa: 'この質問は、「缶についていた水は、実際にはどこから来ていたのか」を聞いています。',
      hint: 'Look at what happens in paragraph 3, when Yuto makes his observation.',
      hintJa: '第3段落で、ユトが観察をする場面に注目してみましょう。',
      options: [
        { id: 'a', label: 'The can had a tiny hole that was leaking juice.', correct: false },
        { id: 'b', label: 'The water came from the warm air, not from inside the can.', correct: true },
        { id: 'c', label: 'Someone had spilled water on the can earlier.', correct: false },
      ],
      answerParagraphId: 'se-f-reading-01-p3',
      evidencePrompt: 'Which idea from the reading shows Yuto testing his first hypothesis with an experiment?',
      evidenceOptions: [
        { id: 'e1', label: 'He turned the can over, checking for a crack, but found nothing.', paragraphId: 'se-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'He grabbed a dry glass, filled it with ice, and set it beside the can as a small experiment.', paragraphId: 'se-f-reading-01-p2', correct: true },
        { id: 'e3', label: "His hypothesis was wrong — the water wasn't leaking from inside at all.", paragraphId: 'se-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'a simple hypothesis, but one he could test',
        question: 'What does "hypothesis" mean here?',
        options: [
          { id: 'a', label: 'A fact that has already been proven true.', correct: false },
          { id: 'b', label: 'A first guess or possible explanation that can be tested.', correct: true },
          { id: 'c', label: 'A tool used to measure temperature.', correct: false },
        ],
      },
    },

    writing: {
      prompt: "Yuto's curiosity about a simple wet can led him to think and test like a scientist. Is there something in your everyday life that makes you wonder \"why does this happen?\" What is it? If nothing comes to mind right now, describe one everyday thing you would like to understand better.",
      promptJapanese: 'ユトは、水滴がついた缶へのちょっとした好奇心から、科学者のように考え、確かめてみることになりました。あなたの日常生活の中で、「なぜこうなるのだろう?」と思うことはありますか。それは何ですか。もし今すぐ思いつかない場合は、もっとよく理解したい日常的なことを一つ描いてみましょう。',
      minSentences: 2,
      sentenceStarters: ["I've always wondered why...", "One everyday thing I'm curious about is...", 'I would like to understand...'],
      wordBank: [
        { vocabId: 'se-f-06', examplePhrase: "I've always been curious about..." },
        { vocabId: 'se-f-03', examplePhrase: 'My hypothesis is...' },
        { vocabId: 'se-f-05', examplePhrase: 'I could test this with a small experiment.' },
        { vocabId: 'se-f-02', examplePhrase: 'Through observation, I noticed...' },
      ],
      usefulExpressions: [
        { phrase: "I've always wondered why...", japanese: '私はずっと...なのか不思議に思っていました' },
        { phrase: "One everyday thing I'm curious about is...", japanese: '私が興味を持っている日常的なことの一つは...です' },
        { phrase: 'I would like to understand...', japanese: '私は...を理解したいです' },
      ],
    },

    takeaway: 'Science begins with curiosity about ordinary things.',
  },

];

export function getReadingById(id: string): ReadingLesson | undefined {
  return MASTER_READINGS.find(r => r.id === id);
}

export function getReadingsByTheme(themeId: string, level: Level): ReadingLesson[] {
  return MASTER_READINGS.filter(r => r.themeId === themeId && r.level === level);
}
