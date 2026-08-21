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
  // Rebuilt against docs/THEME_04_MANUSCRIPT.md (frozen) — supersedes the old
  // Mio/roommate placeholder entirely. english/plainEnglish below are the
  // manuscript's Foundation Original/Simplified renderings verbatim.

  {
    id: 'lt-f-reading-01',
    themeId: 'living-together',
    level: 'foundation',
    title: 'Living Together',
    titleJapanese: '共に生きる',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will read about what actually makes a community strong.',
    mission: 'As you read, think about whether a community\'s strength comes from people being similar, or from how they handle being different.',

    preReadingSurvey: {
      question: 'What do you think makes a community strong?',
      options: [
        { id: 'similar', label: 'People who are similar and agree easily.' },
        { id: 'different', label: 'People who stay connected even when they are different.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'lt-f-reading-01-p1',
        english:
          'People naturally feel most comfortable around others who are similar to them. They often share the same interests, experiences, or ways of thinking. As a result, many people assume that a strong community is built on agreement.',
        japanese:
          '人は自然と、自分と似ている人と一緒にいると最も心地よく感じるものです。彼らはしばしば同じ興味や経験、考え方を共有しています。そのため、多くの人は、強いコミュニティとは意見が一致することから作られるものだと考えています。',
        plainEnglish:
          'People naturally feel most comfortable with others who are similar to them. They often like the same things, or think in similar ways. Because of this, many people think a strong community comes from agreement.',
        checkQuestion: 'According to this paragraph, why do many people believe a strong community depends on agreement?',
      },
      {
        id: 'lt-f-reading-01-p2',
        english:
          'However, no real community is made up of identical people. Every family, school, workplace, and neighborhood includes people with different personalities, ideas, and backgrounds. If everyone were the same, living together might be easier, but communities would have fewer opportunities to learn and grow.',
        japanese:
          'しかし、実際には、全く同じ人ばかりで作られているコミュニティは存在しません。どの家族も、学校も、職場も、近所も、異なる性格、考え方、背景を持つ人々を含んでいます。もし全員が同じであれば、共に生きることはより簡単かもしれませんが、コミュニティが学び、成長する機会は少なくなるでしょう。',
        plainEnglish:
          'However, no real community is made up of exactly the same kind of people. Every family, school, workplace, and neighborhood has people with different personalities, ideas, and backgrounds. If everyone were the same, living together might be easier. But communities would have fewer chances to learn and grow.',
        checkQuestion: 'According to this paragraph, why does no real community include only identical people?',
      },
      {
        id: 'lt-f-reading-01-p3',
        english:
          'Living together does not mean that people always agree. Differences often lead to disagreement, but that does not always damage a community. When people respect one another, cooperate to solve problems, and accept different opinions, trust can gradually develop. These relationships help people feel they belong to the same community even when they do not think in the same way.',
        japanese:
          '共に生きるということは、人々が常に意見が一致するという意味ではありません。違いはしばしば意見の対立を生みますが、それが必ずしもコミュニティを傷つけるわけではありません。人々が互いを尊重し、問題を解決するために協力し、異なる意見を受け入れるとき、信頼は少しずつ育っていきます。こうした関係は、たとえ考え方が同じでなくても、人々が同じコミュニティに属していると感じる助けとなります。',
        plainEnglish:
          'Living together does not mean people always agree. Differences often lead to disagreement, but that does not always hurt a community. When people respect each other, cooperate to solve problems, and accept different opinions, trust can slowly grow. These relationships help people feel they belong to the same community, even when they do not think in the same way.',
        checkQuestion: 'According to this paragraph, what helps trust develop between people who are different?',
      },
      {
        id: 'lt-f-reading-01-p4',
        english:
          'Perhaps the strength of a community is not measured by how little disagreement it has, but by how well people continue living and working together despite their differences. Harmony is not created because everyone is the same. It is created when different people choose to build trust and continue cooperating.',
        japanese:
          'コミュニティの強さは、意見の対立がどれだけ少ないかで測られるのではなく、違いがあっても人々がどれだけうまく共に生き、働き続けられるかによって測られるのかもしれません。調和は、全員が同じだから生まれるのではありません。異なる人々が信頼を築き、協力し続けることを選ぶときに生まれるのです。',
        plainEnglish:
          'Perhaps the strength of a community is not shown by how little disagreement it has. It is shown by how well people keep living and working together, even with their differences. Harmony is not created because everyone is the same. It is created when different people choose to build trust and keep cooperating.',
        checkQuestion: 'According to this final paragraph, where does harmony actually come from?',
      },
    ],

    targetVocabIds: ['lt-f-01', 'lt-f-02', 'lt-f-03', 'lt-f-04', 'lt-f-05', 'lt-f-06', 'lt-f-07', 'lt-f-08', 'lt-f-09', 'lt-f-10', 'lt-f-11'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['community', 'trust', 'respect', 'belong', 'cooperate', 'accept', 'similar', 'different', 'agree', 'disagree', 'harmony'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['build trust', 'keep working together', 'different opinions'],
      },
      {
        type: 'tone-purpose',
        prompt: 'Consider the author\'s tone.',
        note: 'The passage takes the comfort of being around similar people seriously before showing why it isn\'t, by itself, what makes a community strong.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, why do many people assume that a strong community depends on agreement?',
      explainer: 'In simple words — why do people often think a community needs everyone to agree?',
      explainerJa: '簡単に言うと、なぜ人々はコミュニティには全員の意見が一致する必要があると考えがちなのか、という質問です。',
      hint: 'Look at paragraph 1.',
      hintJa: '第1段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Because people who are similar often think in similar ways and agree more easily.', correct: true },
        { id: 'b', label: 'Because agreement is the only way a community can function.', correct: false },
        { id: 'c', label: 'Because disagreement always destroys a community.', correct: false },
      ],
      answerParagraphId: 'lt-f-reading-01-p1',
      evidencePrompt: 'Which idea from the reading best shows that disagreement does not always harm a community?',
      evidenceOptions: [
        { id: 'e1', label: 'No real community is made up of exactly the same kind of people.', paragraphId: 'lt-f-reading-01-p2', correct: false },
        { id: 'e2', label: 'Differences often lead to disagreement, but that does not always hurt a community.', paragraphId: 'lt-f-reading-01-p3', correct: true },
        { id: 'e3', label: 'Harmony is not created because everyone is the same.', paragraphId: 'lt-f-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'Harmony is not created because everyone is the same.',
        question: 'What does "harmony" mean in this passage?',
        options: [
          { id: 'a', label: 'A situation where everyone agrees about everything.', correct: false },
          { id: 'b', label: 'A peaceful connection between people, even when they are different.', correct: true },
          { id: 'c', label: 'A type of music that sounds pleasant.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Think of a time you were part of a group with people who were different from you in some way — different interests, ideas, or habits. What helped the group keep working or getting along together?',
      promptJapanese: 'あなたと何らかの点で違う人たち——興味、考え方、習慣が違う人たち——と一緒のグループにいたときのことを考えてみましょう。そのグループがうまく続いたり、仲良くやっていけたりした理由は何でしたか。',
      minSentences: 2,
      sentenceStarters: ['One group I was part of...', 'We were different because...', 'What helped us continue was...'],
      wordBank: [
        { vocabId: 'lt-f-01', examplePhrase: 'Our community was...' },
        { vocabId: 'lt-f-06', examplePhrase: 'We respected each other by...' },
        { vocabId: 'lt-f-04', examplePhrase: 'We cooperated by...' },
        { vocabId: 'lt-f-05', examplePhrase: 'It helped that we accepted...' },
        { vocabId: 'lt-f-10', examplePhrase: 'We were different because...' },
        { vocabId: 'lt-f-02', examplePhrase: 'Over time, we built trust by...' },
      ],
      usefulExpressions: [
        { phrase: 'One group I was part of...', japanese: '私が所属していたグループの一つは...' },
        { phrase: 'We were different because...', japanese: '私たちが違っていたのは...という点でした' },
        { phrase: 'What helped us continue was...', japanese: '私たちが続けられた理由は...でした' },
      ],
    },

    takeaway: 'Harmony does not come from everyone being the same. It comes from different people choosing to stay connected and keep cooperating.',
  },

  // ── Living Together — Advanced ──────────────────────────────────────────────
  // New for this theme — the old placeholder had no Advanced content at all.
  // english/plainEnglish below are the manuscript's Advanced Original/
  // Simplified renderings verbatim.

  {
    id: 'lt-s-reading-01',
    themeId: 'living-together',
    level: 'advanced',
    title: 'Living Together',
    titleJapanese: '共に生きる',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore a deeper question about what actually makes a community strong.',
    mission: 'As you read, notice how the passage treats both similarity and real difference fairly before reaching its own conclusion.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'similarity', label: 'A community is strongest when its members are similar and agree easily.' },
        { id: 'difference', label: 'A community is strongest when it has worked through real differences.' },
        { id: 'both', label: 'Both matter, depending on the situation.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'lt-s-reading-01-p1',
        english:
          'A community is more than a group of people who happen to share the same place. It forms when people build relationships over time. Some communities are made up of people with similar backgrounds or experiences, while others bring together people who are quite different. No matter how they begin, every community must find a way to live and work together.',
        japanese:
          'コミュニティとは、単にたまたま同じ場所を共有している人々の集まり以上のものです。それは、人々が時間をかけて関係を築いていく中で形成されます。似たような背景や経験を持つ人々によって作られるコミュニティもあれば、かなり異なる人々を結びつけるコミュニティもあります。どのように始まったとしても、あらゆるコミュニティは、共に生き、働いていく方法を見つけなければなりません。',
        plainEnglish:
          'A community is more than a group of people who share the same place. It forms when people build relationships over time. Some communities are made up of people with similar backgrounds or experiences. Others bring together people who are quite different. No matter how they begin, every community must find a way to live and work together.',
        checkQuestion: 'According to this paragraph, what must every community find a way to do, no matter how it begins?',
      },
      {
        id: 'lt-s-reading-01-p2',
        english:
          'A common assumption is that a successful community depends on agreement. If people think in similar ways, they may agree more often and face less conflict. At first, this seems to make life easier. However, communities cannot avoid change forever. New ideas, new people, and new situations naturally create differences that sometimes lead to disagreement.',
        japanese:
          '成功するコミュニティは意見の一致に支えられているというのは、よくある思い込みです。人々が似たような考え方をしていれば、より頻繁に意見が一致し、対立も少なくなるかもしれません。一見すると、これは生活を楽にするように思えます。しかし、コミュニティはいつまでも変化を避け続けることはできません。新しい考え、新しい人々、新しい状況は、自然と違いを生み出し、それが時に意見の対立につながります。',
        plainEnglish:
          'A common assumption is that a successful community depends on agreement. If people think in similar ways, they may agree more often and face less conflict. At first, this seems to make life easier. But communities cannot avoid change forever. New ideas, new people, and new situations naturally create differences. Sometimes these differences lead to disagreement.',
        checkQuestion: 'According to this paragraph, why can communities not rely on agreement forever?',
      },
      {
        id: 'lt-s-reading-01-p3',
        english:
          'For this reason, a lasting community requires more than agreement. People need respect for different opinions, empathy to understand another person\'s perspective, and a willingness to accept that not everyone will think in the same way. They also need to cooperate, finding solutions that let people keep working together despite their differences. Sometimes this means learning to accommodate another person\'s needs without giving up one\'s own values.',
        japanese:
          'そのため、長続きするコミュニティには、意見の一致以上のものが必要です。人々には、異なる意見への尊重、相手の視点を理解するための共感、そして誰もが同じように考えるわけではないと受け入れる心構えが必要です。また、違いがあっても人々が共に働き続けられるような解決策を見つけるために、協力することも必要です。時にはそれは、自分自身の価値観を手放すことなく、相手のニーズに配慮することを学ぶという意味でもあります。',
        plainEnglish:
          'For this reason, a lasting community needs more than agreement. People need respect for different opinions. They need empathy to understand another person\'s perspective. They need to accept that not everyone will think in the same way. They also need to cooperate and find ways to keep working together despite their differences. Sometimes this means learning to accommodate another person\'s needs without giving up one\'s own values.',
        checkQuestion: 'According to this paragraph, what does a lasting community need beyond agreement?',
      },
      {
        id: 'lt-s-reading-01-p4',
        english:
          'Over time, these experiences gradually build trust. People begin to feel they belong because they know they are accepted, even when they are different from others. In this way, diversity does not simply become a challenge to overcome. It becomes one of the reasons a community grows stronger. Communities that practice tolerance and keep working together after disagreement often develop greater resilience than those that have never faced difficulties. Perhaps true harmony is not the absence of differences, but the ability to remain connected despite them.',
        japanese:
          '時間が経つにつれて、こうした経験は少しずつ信頼を築いていきます。人々は、たとえ他の人と違っていても、自分が受け入れられていると分かっているからこそ、自分がその一員であると感じ始めます。このようにして、多様性は単に乗り越えるべき課題ではなくなります。それは、コミュニティがより強くなる理由の一つになるのです。寛容さを実践し、対立の後も共に働き続けるコミュニティは、困難に一度も直面したことのないコミュニティよりも、しばしばより大きな回復力を身につけます。本当の調和とは、違いが存在しないことではなく、違いがあってもつながり続けられる力のことなのかもしれません。',
        plainEnglish:
          'Over time, these experiences slowly build trust. People begin to feel they belong because they know they are accepted, even when they are different from others. In this way, diversity does not simply become a challenge to overcome. It becomes one of the reasons a community grows stronger. Communities that practice tolerance and keep working together after disagreement often develop greater resilience than communities that have never faced problems. Perhaps true harmony does not mean having no differences. It means staying connected even with them.',
        checkQuestion: 'According to this final paragraph, what might true harmony actually mean?',
      },
    ],

    targetVocabIds: ['lt-s-01', 'lt-s-02', 'lt-s-03', 'lt-s-04', 'lt-s-05', 'lt-s-06', 'lt-s-07', 'lt-s-08'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['diversity', 'tolerance', 'empathy', 'perspective', 'conflict', 'resilience', 'accommodate', 'assumption'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['build trust', 'keep working together', 'a common assumption'],
      },
      {
        type: 'tone-purpose',
        prompt: 'Consider the author\'s tone.',
        note: 'The passage gives real, sympathetic weight to the comfort of similarity (Paragraph 2) before it argues past it — it never dismisses that comfort, even while showing its limits.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, what does a lasting community need once it can no longer rely on simple agreement?',
      explainer: 'In simple words — once people can\'t just agree all the time, what does a community actually need to stay strong?',
      explainerJa: '簡単に言うと、いつも意見が一致するわけにはいかなくなったとき、コミュニティが強くあり続けるために本当に必要なものは何か、という質問です。',
      hint: 'Look at paragraph 3.',
      hintJa: '第3段落を見てみましょう。',
      options: [
        { id: 'a', label: 'It must remove members who cause conflict.', correct: false },
        { id: 'b', label: 'It needs respect, empathy, acceptance, and cooperation to keep working together despite real differences.', correct: true },
        { id: 'c', label: 'It must wait for disagreement to disappear naturally.', correct: false },
      ],
      answerParagraphId: 'lt-s-reading-01-p3',
      evidencePrompt: 'Which part of the passage most directly explains why communities cannot rely on agreement forever?',
      evidenceOptions: [
        { id: 'e1', label: 'A community is more than a group of people who share the same place.', paragraphId: 'lt-s-reading-01-p1', correct: false },
        { id: 'e2', label: 'Communities cannot avoid change forever. New ideas, new people, and new situations naturally create differences.', paragraphId: 'lt-s-reading-01-p2', correct: true },
        { id: 'e3', label: 'Diversity does not simply become a challenge to overcome.', paragraphId: 'lt-s-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'A common assumption is that a successful community depends on agreement.',
        question: 'What does "assumption" mean here?',
        options: [
          { id: 'a', label: 'A fact that has already been proven true.', correct: false },
          { id: 'b', label: 'A belief people accept as true without questioning it.', correct: true },
          { id: 'c', label: 'A rule that a community must follow.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Communities are often described as harmonious when people rarely disagree. But another possibility is that a community\'s real strength comes from working through disagreement rather than avoiding it. Think of a community, team, or group you know — from your own life, school, work, or observation. Does its strength come more from similarity, or from how it has handled real differences? Explain your view with a specific example.',
      promptJapanese: 'コミュニティは、人々があまり意見の対立をしないとき「調和がとれている」と表現されることがよくあります。しかし、コミュニティの本当の強さは、対立を避けることではなく、対立を乗り越えて働くことから生まれるという考え方もあります。あなたが知っているコミュニティ、チーム、グループ——自分自身の生活、学校、職場、あるいは見聞きしたものの中から——を思い浮かべてください。その強さは、似ていることから来ていますか、それとも実際の違いにどう対応してきたかから来ていますか。具体例を挙げて、あなたの考えを説明してください。',
      minSentences: 3,
      recommendedWordRange: [80, 120],
      wordBank: [
        { vocabId: 'lt-s-01', examplePhrase: 'Our diversity actually helped us...' },
        { vocabId: 'lt-s-02', examplePhrase: 'We practiced tolerance by...' },
        { vocabId: 'lt-s-03', examplePhrase: 'It took empathy to understand...' },
        { vocabId: 'lt-s-05', examplePhrase: 'The conflict actually helped us...' },
        { vocabId: 'lt-s-06', examplePhrase: 'Our resilience grew after...' },
        { vocabId: 'lt-s-07', examplePhrase: 'We learned to accommodate...' },
      ],
      usefulExpressions: [
        { phrase: 'In my experience,', japanese: '私の経験では、' },
        { phrase: 'What made the difference was...', japanese: '違いを生んだのは...でした' },
        { phrase: 'Looking back, I think...', japanese: '振り返ってみると、私は...だと思います' },
      ],
    },

    takeaway: 'Perhaps true harmony is not the absence of differences, but the ability to remain connected despite them.',
  },

  // ── Facts or Fake? — Foundation ─────────────────────────────────────────────
  // Rebuilt against docs/THEME_05_MANUSCRIPT.md (frozen) — supersedes the old
  // Haruto/"drinking cold water" placeholder entirely. english/plainEnglish
  // below are the manuscript's Foundation Original/Simplified verbatim.

  {
    id: 'ff-f-reading-01',
    themeId: 'facts-or-fake',
    level: 'foundation',
    title: 'Facts or Fake?',
    titleJapanese: '情報を見きわめる',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will read about how to tell trustworthy information from information that only looks trustworthy.',
    mission: 'As you read, think about whether trustworthy information is mainly about how convincing it looks, or about whether it can actually be verified.',

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
          'Every day, people receive information from many different sources. They may answer a telephone call, read a message online, watch a short video, see an advertisement, or ask an AI for information. Much of this information is useful, but not all of it is equally reliable. Sometimes false information can look surprisingly authentic.',
        japanese:
          '人は毎日、さまざまな情報源から情報を受け取っています。電話に出たり、オンラインでメッセージを読んだり、短い動画を見たり、広告を目にしたり、AIに情報を尋ねたりすることもあるでしょう。こうした情報の多くは役に立ちますが、そのすべてが同じように信頼できるわけではありません。時には、誤った情報が驚くほど本物らしく見えることもあります。',
        plainEnglish:
          'Every day, people get information from many different sources. They may answer a phone call, read a message online, watch a short video, see an advertisement, or ask an AI for information. Much of this information is useful, but not all of it is equally reliable. Sometimes false information can look very real.',
        checkQuestion: 'According to this paragraph, what does the passage say about how reliable everyday information is?',
      },
      {
        id: 'ff-f-reading-01-p2',
        english:
          'Because information is easy to create and share, appearance is not always a good guide to truth. A confident voice, a professional-looking website, or an impressive picture does not guarantee that a claim is supported by evidence. Before trusting important information, people need to examine where it came from and whether it can be verified.',
        japanese:
          '情報は簡単に作られ、共有されるため、見た目だけでは真実かどうかを正しく判断できるとは限りません。自信に満ちた話し方や、プロフェッショナルに見えるウェブサイト、印象的な写真があるからといって、その主張が証拠によって裏付けられているとは限らないのです。重要な情報を信頼する前に、人はそれがどこから来たのか、そして確認できるかどうかを詳しく調べる必要があります。',
        plainEnglish:
          'Because information is easy to create and share, how something looks is not always a good sign of the truth. A confident voice, a professional-looking website, or an impressive picture does not mean that a claim is supported by evidence. Before trusting important information, people need to examine where it came from and whether it can be verified.',
        checkQuestion: 'According to this paragraph, what should people do before trusting important information?',
      },
      {
        id: 'ff-f-reading-01-p3',
        english:
          'Making good decisions requires more than simply finding information. It requires asking questions. Is the source reliable? Is this fact or opinion? Is there enough evidence? Looking carefully before accepting information helps people avoid being misled.',
        japanese:
          '良い決断をするには、単に情報を見つけるだけでは十分ではありません。それには、問いを立てることが必要です。その情報源は信頼できるだろうか。これは事実だろうか、それとも意見だろうか。十分な証拠はあるだろうか。情報を受け入れる前に注意深く見ることは、人が誤解させられることを防ぐ助けになります。',
        plainEnglish:
          'Making good decisions needs more than just finding information. It means asking questions. Is the source reliable? Is this fact or opinion? Is there enough evidence? Looking carefully before accepting information helps people avoid being misled.',
        checkQuestion: 'According to this paragraph, what questions help people avoid being misled?',
      },
      {
        id: 'ff-f-reading-01-p4',
        english:
          'Perhaps the most valuable habit is not knowing every answer but developing the ability to examine information carefully. In a world where authentic and misleading information often look similar, careful thinking has become more important than ever.',
        japanese:
          'おそらく最も価値のある習慣とは、すべての答えを知っていることではなく、情報を注意深く詳しく調べる力を身につけることです。本物の情報と誤解を招く情報がしばしば似たように見える世界では、注意深く考えることがこれまで以上に重要になっています。',
        plainEnglish:
          'Perhaps the most valuable habit is not knowing every answer, but learning how to examine information carefully. In a world where real and misleading information often look the same, careful thinking has become more important than ever.',
        checkQuestion: 'According to this final paragraph, what does the passage say is the most valuable habit?',
      },
    ],

    targetVocabIds: ['ff-f-01', 'ff-f-02', 'ff-f-03', 'ff-f-04', 'ff-f-05', 'ff-f-06', 'ff-f-07', 'lt-f-02', 'ff-f-08', 'ff-f-09'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['claim', 'source', 'evidence', 'fact', 'opinion', 'trust', 'examine', 'verify', 'reliable', 'misleading'],
      },
      {
        type: 'recycled-vocab',
        prompt: 'Find recycled vocabulary from a previous theme — trust reappears from Theme 4, now applied to information instead of people.',
        items: ['trust'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['supported by evidence', 'examine where it came from', 'avoid being misled'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's tone.",
        note: 'The passage never claims most information is false — it argues that appearance alone can\'t tell you which is which, which is a narrower, more defensible claim than "don\'t trust anything."',
      },
    ],

    missionCheck: {
      question: 'According to the passage, why is a confident voice or a professional-looking website not enough to trust information?',
      explainer: 'In simple words: why isn\'t looking confident or professional enough to make information trustworthy?',
      explainerJa: 'この質問は、「自信に満ちた話し方やプロフェッショナルに見えることだけでは、なぜ情報を信頼するのに十分ではないのか」を聞いています。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Because appearance does not guarantee that a claim is supported by evidence.', correct: true },
        { id: 'b', label: 'Because professional-looking websites are usually more likely to lie.', correct: false },
        { id: 'c', label: 'Because only handwritten information can be trusted.', correct: false },
      ],
      answerParagraphId: 'ff-f-reading-01-p2',
      evidencePrompt: 'Which sentence best shows that looking trustworthy is not the same as being trustworthy?',
      evidenceOptions: [
        { id: 'e1', label: 'Every day, people receive information from many different sources.', paragraphId: 'ff-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'A confident voice, a professional-looking website, or an impressive picture does not guarantee that a claim is supported by evidence.', paragraphId: 'ff-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'Perhaps the most valuable habit is not knowing every answer but developing the ability to examine information carefully.', paragraphId: 'ff-f-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'not all of it is equally reliable',
        question: 'What does "reliable" mean here?',
        options: [
          { id: 'a', label: 'Interesting or entertaining.', correct: false },
          { id: 'b', label: 'Trustworthy and consistently accurate.', correct: true },
          { id: 'c', label: 'Easy to find online.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Have you ever posted or shared something online that later turned out to be untrue? Or have you ever seen information online that was not true? Describe what happened. How did you realize the information was incorrect?',
      promptJapanese: 'あなたは、後で真実ではないと分かったことをオンラインで投稿したり共有したりしたことがありますか。あるいは、真実ではない情報をオンラインで見たことがありますか。何が起きたか説明してください。その情報が間違っていると、どうやって気づきましたか。',
      minSentences: 2,
      sentenceStarters: ['One time, I...', 'I later found out that...', 'I realized it was not true when...'],
      wordBank: [
        { vocabId: 'ff-f-01', examplePhrase: 'The claim I shared turned out to be...' },
        { vocabId: 'ff-f-06', examplePhrase: 'When I checked the source, I found...' },
        { vocabId: 'ff-f-02', examplePhrase: 'There was no real evidence for it, so...' },
        { vocabId: 'ff-f-04', examplePhrase: "I hadn't verified it before I shared it." },
        { vocabId: 'ff-f-05', examplePhrase: "It didn't come from a reliable source." },
        { vocabId: 'ff-f-07', examplePhrase: 'I realized the information was misleading when...' },
      ],
      usefulExpressions: [
        { phrase: 'One time, I...', japanese: 'ある時、私は...' },
        { phrase: 'I later found out that...', japanese: '後になって、私は...ということが分かりました' },
        { phrase: 'I realized it was not true when...', japanese: '...のとき、それが真実ではないと気づきました' },
      ],
    },

    takeaway: 'In a world where authentic and misleading information often look similar, careful thinking — not knowing every answer — is the more valuable habit.',
  },

  // ── Facts or Fake? — Advanced ────────────────────────────────────────────────
  // Rebuilt 2026-08-14 against the manuscript's revised Advanced Reading —
  // supersedes the earlier "AI makes fakes easier" version. english/
  // plainEnglish below are the manuscript's current Advanced Original/
  // Simplified renderings verbatim.

  {
    id: 'ff-s-reading-01',
    themeId: 'facts-or-fake',
    level: 'advanced',
    title: 'Facts or Fake?',
    titleJapanese: '情報を見きわめる',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore a deeper question about what actually makes information trustworthy.',
    mission: 'As you read, notice how the passage treats persuasion and widely shared information fairly, without assuming that everything convincing or repeated must be dishonest.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'looks', label: 'If information looks credible, it usually is credible.' },
        { id: 'verified', label: 'Information is only trustworthy once it has actually been verified.' },
        { id: 'both', label: 'Both matter, depending on the situation.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'ff-s-reading-01-p1',
        english:
          'Learning to examine a single claim carefully — checking its source, looking at the evidence, and separating fact from opinion — is a useful skill. But this skill matters for a bigger reason. Modern life is full of information that someone has tried hard to make believable, not just information that happens to be true or false by accident. Behind many of the claims a person sees every day, someone has worked to make that claim look credible, whether or not it actually is. Understanding this effort, not just checking each claim on its own, is what helps someone see information more clearly. Three areas make this especially clear: advertising, financial crime, and political or social influence.',
        japanese:
          '一つの主張を注意深く詳しく調べること——情報源を確認し、証拠を検討し、事実と意見を分けて考えること——は役に立つ技能です。しかし、この技能が重要なのには、もっと大きな理由があります。現代の生活は、誰かが信じてもらえるように懸命に努力して作った情報であふれています——単に偶然真実だったり誤りだったりする情報だけではありません。人が毎日目にする多くの主張の背後には、それが実際にそうであるかどうかにかかわらず、その主張を信頼できるように見せようと努力してきた誰かがいます。一つ一つの主張を確認するだけでなく、この努力を理解することが、情報をより深く見る助けとなります。これが特にはっきりと分かる分野が三つあります——広告、金融犯罪、そして政治的・社会的な影響力です。',
        plainEnglish:
          'Learning to examine a claim carefully — checking its source, looking at the evidence, and separating fact from opinion — is a useful skill. But this skill matters for a bigger reason. Modern life is full of information that someone has tried hard to make believable. It is not just information that happens to be true or false by accident. Behind many of the claims a person sees every day, someone has worked to make that claim look credible, whether or not it actually is. Understanding this effort, not just checking each claim alone, helps someone see information more clearly. Three areas make this especially clear: advertising, financial crime, and political or social influence.',
        checkQuestion: 'According to this paragraph, why does understanding the effort behind information matter more than just checking individual claims?',
      },
      {
        id: 'ff-s-reading-01-p2',
        english:
          'Advertising is a clear example. An advertisement rarely needs to prove that a product actually works. Repeating a message, connecting it with positive images, or simply showing that a product is already popular can be enough to make people trust it. This trust is not built on evidence — it is built on familiarity. A message heard often enough can start to feel credible even when nothing about it has actually been checked. This is one reason an exaggerated claim in an advertisement can still work: repetition makes it sound less suspicious, even if it has never actually been checked.',
        japanese:
          '広告はその分かりやすい例です。広告は、ある商品が実際に効果があることを証明する必要はほとんどありません。メッセージを繰り返したり、良いイメージと結びつけたり、あるいはその商品がすでに人気があることを示したりするだけで、人々にそれを信頼させるのに十分な場合があります。この信頼は証拠の上に築かれているのではなく、慣れ親しんでいることの上に築かれています。十分に何度も聞いたメッセージは、実際には何も確認されていなくても、信頼できるように感じられ始めることがあります。これが、広告の誇張された主張が今でも通用する理由の一つです——繰り返すことで、それが一度も確認されたことがなくても、疑わしく聞こえにくくなるのです。',
        plainEnglish:
          'Advertising is a clear example. An advertisement rarely needs to prove that a product really works. Repeating a message, connecting it with nice images, or showing that a product is already popular can be enough to make people trust it. This trust is not built on evidence. It is built on familiarity. A message heard often enough can start to feel credible, even when nobody has actually checked it. This is one reason an exaggerated claim in an advertisement can still work. Repetition makes it sound less suspicious, even if it has never been checked.',
        checkQuestion: 'According to this paragraph, why does an advertisement rarely need to prove that a product actually works?',
      },
      {
        id: 'ff-s-reading-01-p3',
        english:
          'Financial crime shows this problem even more clearly. People who lose money in a fake investment are often not careless. Many looked for information, found what seemed like real evidence, and made a careful decision based on it. The mistake was not that they trusted blindly — it was that the evidence itself had been manipulated. Fake documents, false numbers, and invented success stories can be made so that a normal check will not catch them. A financial scheme that would seem dubious to an expert can still pass an ordinary examination, which is exactly why it succeeds.',
        japanese:
          '金融犯罪は、この問題をさらにはっきりと示しています。偽の投資でお金を失う人々は、多くの場合、不注意だったわけではありません。多くの人は情報を探し、本物の証拠のように見えるものを見つけ、それに基づいて慎重に判断しました。彼らの間違いは、盲目的に信頼したことではなく、その証拠自体が操作されていたことでした。偽の書類、偽の数字、作り話の成功物語は、通常のチェックでは見抜けないように、意図的に作られることがあります。専門家には疑わしく見えるはずの金融スキームでも、通常の検討には十分通ってしまうことがあります——それこそが、それが成功する理由なのです。',
        plainEnglish:
          'Financial crime shows this problem even more clearly. People who lose money in a fake investment are often not careless. Many looked for information, found what seemed like real evidence, and made a careful decision based on it. Their mistake was not that they trusted blindly. It was that the evidence itself had been manipulated. Fake documents, false numbers, and invented success stories can be made so that a normal check will not catch them. A financial scheme that would seem dubious to an expert can still pass an ordinary check. This is exactly why it succeeds.',
        checkQuestion: 'According to this paragraph, why are people who lose money to fake investments often not simply careless?',
      },
      {
        id: 'ff-s-reading-01-p4',
        english:
          'Political and social influence often works differently again. Instead of making one false claim, it can work by choosing which true information gets repeated and which gets left out. This kind of bias does not require a single lie — it only requires choosing what people see and hear most often. This does not mean that repeated or widely shared information is always a form of manipulation. Often, many people simply reach the same true conclusion for good reasons. The difficulty is that repetition alone cannot tell us which situation we are in. When the same message is repeated by many different voices, it can start to feel true simply because it feels shared, even if no one involved has actually checked it. This is one reason misinformation spreads so easily in groups: a claim does not need real authenticity to feel authentic. It only needs to be repeated by enough people who all share the same assumption — that someone else must have already checked it.',
        japanese:
          '政治的・社会的な影響力は、また違ったやり方で働くことがよくあります。一つの嘘をつく代わりに、それはどの真実の情報を繰り返し、どれを省くかを選ぶことによって働くことがあります。この種の偏り（バイアス）には、一つの嘘は必要ありません——人々が最も頻繁に目にし耳にするものを選ぶだけでよいのです。だからといって、繰り返されたり広く共有されたりする情報が、常に操作の一種であるという意味ではありません。多くの場合、多くの人々は、正当な理由からたまたま同じ正しい結論に達しているだけです。難しいのは、繰り返しだけでは、私たちがどちらの状況にいるのかが分からないということです。同じメッセージが多くの異なる声によって繰り返されると、実際には誰もそれを確認していなくても、共有されているように感じられるというだけの理由で、真実のように感じられ始めることがあります。これが、誤情報が集団の中でこれほど簡単に広まる理由の一つです——ある主張は、本物らしく感じられるために、本物の真正性を必要としないのです。それはただ、十分な数の人々によって繰り返されればよいだけです——誰か他の人がすでに確認したはずだという、同じ思い込みを、みなが共有しているからです。',
        plainEnglish:
          'Political and social influence often works in a different way. Instead of making one false claim, it can work by choosing which true information gets repeated and which gets left out. This kind of bias does not need a single lie. It only needs someone to choose what people see and hear most often. This does not mean that repeated or widely shared information is always a form of manipulation. Often, many people simply reach the same true conclusion for good reasons. The problem is that repetition alone cannot tell us which situation we are in. When the same message is repeated by many different voices, it can start to feel true simply because it feels shared, even if no one has actually checked it. This is one reason misinformation spreads so easily in groups. A claim does not need real authenticity to feel authentic. It only needs to be repeated by enough people who all share the same assumption — that someone else must have already checked it.',
        checkQuestion: "According to this paragraph, why doesn't political and social influence always require telling a lie?",
      },
      {
        id: 'ff-s-reading-01-p5',
        english:
          'Advertising, financial crime, and political influence are different in almost every way, but together they show the same thing: information itself has become powerful in ways it was not before. It is no longer only a record of what is true — it can be built, chosen, and repeated specifically to create trust or credibility, whether or not it is deserved. Many other areas of modern life, from public health messages to everyday social media, show this same pattern. What connects them all is not any single lie, but the growing power of information to shape what people believe, whether or not they have good reason to. Perhaps the clearest lesson is not about any one claim, but about the world these examples describe: a world in which believing something and having good reason to believe it are no longer automatically the same thing.',
        japanese:
          '広告、金融犯罪、政治的な影響力は、ほとんどあらゆる点で異なっていますが、それらは共に同じことを示しています——情報そのものが、かつてなかったほどの力を持つようになったということです。それはもはや、単に何が真実であるかを記録するだけのものではありません——それがふさわしいかどうかにかかわらず、信頼や信頼性を生み出すために、作られ、選ばれ、繰り返されることがあるのです。公衆衛生に関するメッセージから日常のソーシャルメディアの投稿まで、現代生活の他の多くの分野も、この同じパターンを示しています。それらすべてに共通しているのは、一つの嘘ではなく、人々が信じるべき理由があるかどうかにかかわらず人々が何を信じるかを形作る、情報の増大する力です。おそらく最もはっきりとした教訓は、どれか一つの主張についてのものではなく、これらの例が描き出す世界についてのものです——何かを信じることと、それを信じるための十分な理由を持つことが、もはや自動的に同じことではなくなった世界についてなのです。',
        plainEnglish:
          'Advertising, financial crime, and political influence are different in almost every way. But together they show the same thing: information itself has become powerful in ways it was not before. It is no longer only a record of what is true. It can be built, chosen, and repeated to create trust or credibility, whether or not it is deserved. Many other areas of modern life, from public health messages to everyday social media, show this same pattern. What connects them all is not any single lie, but the growing power of information to shape what people believe, whether or not they have good reason to. Perhaps the clearest lesson is not about any one claim, but about the world these examples describe — a world where believing something and having good reason to believe it are no longer automatically the same thing.',
        checkQuestion: 'According to this final paragraph, what do advertising, financial crime, and political influence all show about information in modern society?',
      },
    ],

    targetVocabIds: ['ff-s-01', 'ff-s-02', 'ff-s-03', 'ff-s-04', 'ff-s-05', 'ff-s-06', 'ff-s-07', 'ff-s-08', 'ff-s-09', 'ff-s-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['dubious', 'authenticity', 'suspicious', 'blindly', 'credibility', 'manipulate', 'exaggerate', 'misinformation', 'assumption', 'bias'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['make that claim look credible', 'trusted blindly', 'a form of manipulation', 'the growing power of information'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's tone.",
        note: 'The passage is explicit that repetition and wide sharing are not automatically signs of manipulation — "Often, many people simply reach the same true conclusion for good reasons" — the same fairness-to-the-other-side move used throughout Theme 4, now applied across all three domains rather than to technology alone.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, why does an advertisement rarely need to prove that a product actually works?',
      explainer: 'In simple words: why can an advertisement make people trust a product without actually proving anything?',
      explainerJa: 'この質問は、「広告はなぜ、実際には何も証明しなくても、人々にその商品を信頼させることができるのか」を聞いています。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Because repetition and familiarity alone can be enough to make people trust it.', correct: true },
        { id: 'b', label: 'Because most products already have plenty of scientific evidence.', correct: false },
        { id: 'c', label: 'Because advertisements are required by law to be completely honest.', correct: false },
      ],
      answerParagraphId: 'ff-s-reading-01-p2',
      evidencePrompt: 'Which sentence best shows that people who are fooled by fake information are not necessarily careless?',
      evidenceOptions: [
        { id: 'e1', label: 'The mistake was not that they trusted blindly — it was that the evidence itself had been manipulated.', paragraphId: 'ff-s-reading-01-p3', correct: true },
        { id: 'e2', label: 'This kind of bias does not require a single lie — it only requires choosing what people see and hear most often.', paragraphId: 'ff-s-reading-01-p4', correct: false },
        { id: 'e3', label: 'Information itself has become powerful in ways it was not before.', paragraphId: 'ff-s-reading-01-p5', correct: false },
      ],
      vocabInContext: {
        quote: 'This kind of bias does not require a single lie — it only requires choosing what people see and hear most often.',
        question: 'What does "bias" mean here?',
        options: [
          { id: 'a', label: 'Choosing which true information to show or hide, in a way that favors one side.', correct: true },
          { id: 'b', label: 'Telling a lie about a specific fact.', correct: false },
          { id: 'c', label: 'A mistake made by accident.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'How can you avoid being fooled by fake news or misleading information online? Explain your ideas and give two or three practical ways people can decide whether information is trustworthy.',
      promptJapanese: 'フェイクニュースや誤解を招く情報にだまされないためには、どうすればよいでしょうか。あなたの考えを説明し、情報が信頼できるかどうかを判断するための、実践的な方法を2つか3つ挙げてください。',
      minSentences: 3,
      recommendedWordRange: [80, 120],
      wordBank: [
        { vocabId: 'ff-s-01', examplePhrase: 'A claim that seems dubious is worth double-checking before you share it.' },
        { vocabId: 'ff-s-03', examplePhrase: 'Being suspicious of a story is a good first step.' },
        { vocabId: 'ff-s-04', examplePhrase: 'One way to avoid being fooled is to stop accepting information blindly.' },
        { vocabId: 'ff-s-05', examplePhrase: "Checking a source's credibility only takes a few minutes." },
        { vocabId: 'ff-s-06', examplePhrase: 'Learning to recognize manipulated evidence is now essential.' },
        { vocabId: 'ff-s-08', examplePhrase: 'Slowing down before sharing is a simple defense against misinformation.' },
      ],
      usefulExpressions: [
        { phrase: 'One practical way is to...', japanese: '実践的な方法の一つは...することです' },
        { phrase: 'Before believing something, it helps to...', japanese: '何かを信じる前に、...することが役立ちます' },
        { phrase: 'Another way to protect yourself is...', japanese: 'もう一つ自分を守る方法は...です' },
      ],
    },

    takeaway: 'Believing something and having good reason to believe it are no longer automatically the same thing.',
  },

  // ── Peace and War — Foundation ───────────────────────────────────────────────
  // Rebuilt 2026-08-20 against docs/THEME_06_MANUSCRIPT.md — replaces the old
  // Yuna/grandmother narrative entirely with an expository Foundation piece
  // that establishes basic concepts, paired with a new Advanced reading
  // (below) that deepens "ending a war ≠ creating lasting peace."

  {
    id: 'pw-f-reading-01',
    themeId: 'peace-and-war',
    level: 'foundation',
    title: 'Peace and War',
    titleJapanese: '平和と戦争',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will read about what war and peace actually mean — and why peace is more than just the fighting stopping.',
    mission: 'As you read, notice how the passage builds from what war does to people, to how wars end, to what real peace actually requires.',

    preReadingSurvey: {
      question: 'Before you read, what do you think peace actually means?',
      options: [
        { id: 'no-fighting', label: 'Peace means there is no fighting.' },
        { id: 'trust', label: 'Peace means people trust and get along with each other.' },
        { id: 'both', label: 'Peace means both of these, and more.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'pw-f-reading-01-p1',
        english:
          'War and peace are often understood as opposites. War means fighting between countries or groups, while peace means that the fighting has stopped. However, both ideas are more complicated than these simple definitions. War changes people\'s lives in many ways, and peace requires more than simply putting down weapons.',
        japanese:
          '戦争と平和は、しばしば正反対のものとして理解されています。戦争とは国や集団の間の戦いを意味し、平和とはその戦いが終わったことを意味します。しかし、どちらの考え方も、こうした単純な定義よりもずっと複雑です。戦争は人々の生活を様々な形で変えてしまいますし、平和とは単に武器を置くこと以上のものを必要とします。',
        plainEnglish:
          'People often think war and peace are opposites. War means fighting between countries or groups. Peace means the fighting has stopped. But both ideas are more complicated than that. War changes people\'s lives in many ways. And peace means more than just putting down weapons.',
        checkQuestion: 'According to this paragraph, why are war and peace more complicated than simple opposite definitions?',
      },
      {
        id: 'pw-f-reading-01-p2',
        english:
          'During a war, soldiers take part in the fighting, but civilians are also deeply affected. People may lose their homes, jobs, family members, or access to food and education. Some become victims of violence, while others leave their homes and become refugees in search of safety. Even people who live far from the fighting may experience fear, economic problems, or major changes in their daily lives.',
        japanese:
          '戦争の間、兵士たちは戦闘に参加しますが、民間人も深刻な影響を受けます。人々は家、仕事、家族を失ったり、食料や教育を受ける機会を失ったりすることがあります。暴力の犠牲者になる人もいれば、家を離れ、安全を求めて難民になる人もいます。戦闘から遠く離れた場所に住んでいる人々でさえ、恐怖や経済的な問題、日常生活の大きな変化を経験することがあります。',
        plainEnglish:
          'During a war, soldiers fight, but civilians are affected too. People may lose their homes, jobs, or family members. They may not be able to get food or go to school. Some become victims of violence. Others leave home and become refugees, looking for safety. Even people who live far from the fighting may feel afraid, have money problems, or see big changes in daily life.',
        checkQuestion: 'According to this paragraph, how are civilians affected by war, even those far from the actual fighting?',
      },
      {
        id: 'pw-f-reading-01-p3',
        english:
          'Wars eventually end in different ways. Sometimes one side wins, while in other cases both sides agree to stop fighting. A ceasefire may stop the violence for a period of time, and negotiation can lead to an agreement or a treaty. These steps are important, but stopping a war does not immediately create peace. Homes and communities may need to be rebuilt, and people who have lost trust in one another may find it difficult to live together again.',
        japanese:
          '戦争は最終的に様々な形で終わります。一方が勝利することもあれば、両者が戦いをやめることに合意する場合もあります。停戦によって、一定期間、暴力が止まることがあり、交渉によって合意や条約が結ばれることもあります。こうした段階は重要ですが、戦争が終わったからといって、すぐに平和が生まれるわけではありません。家や地域社会は再建される必要があるかもしれませんし、互いへの信頼を失った人々は、再び一緒に暮らすことを難しく感じるかもしれません。',
        plainEnglish:
          'Wars end in different ways. Sometimes one side wins. Other times, both sides agree to stop fighting. A ceasefire can stop the violence for a while, and negotiation can lead to an agreement or a treaty. These steps matter, but stopping a war does not immediately create peace. Homes and communities may need to be rebuilt. And people who have lost trust in each other may find it hard to live together again.',
        checkQuestion: 'According to this paragraph, what can stop a war, and why isn\'t that the same as creating peace?',
      },
      {
        id: 'pw-f-reading-01-p4',
        english:
          'For this reason, peace means more than the absence of war. A peaceful society needs safety, cooperation, and ways to solve disagreements without violence. The legacy of a war may remain for many years, but people and communities can gradually rebuild their lives. Understanding both war and peace means understanding not only how fighting begins and ends, but also what happens to people before, during, and after it.',
        japanese:
          'こうした理由から、平和とは単に戦争がない状態以上のものを意味します。平和な社会には、安全、協力、そして暴力に頼らずに意見の対立を解決する方法が必要です。戦争の遺産は何年にもわたって残ることがありますが、人々や地域社会は少しずつ自分たちの生活を再建していくことができます。戦争と平和の両方を理解するということは、戦いがどのように始まり、どのように終わるかだけでなく、その前、最中、そして後に人々に何が起こるのかを理解することでもあるのです。',
        plainEnglish:
          'So peace means more than just having no war. A peaceful society needs safety, cooperation, and ways to solve disagreements without violence. The legacy of a war can remain for many years. But people and communities can slowly rebuild their lives. To understand war and peace, we need to understand not only how fighting starts and stops, but also what happens to people before, during, and after it.',
        checkQuestion: 'According to this paragraph, what does a peaceful society need beyond the absence of war?',
      },
    ],

    targetVocabIds: ['pw-f-01', 'pw-f-02', 'pw-f-03', 'pw-f-04', 'pw-f-05', 'pw-f-06', 'pw-f-08', 'pw-f-09', 'pw-f-10', 'pw-f-11'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['victim', 'refugee', 'civilian', 'trust', 'ceasefire', 'negotiation', 'treaty', 'cooperation', 'rebuild', 'legacy'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['putting down weapons', 'in search of safety', 'lost trust in one another'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'The passage moves from definition (paragraph 1) to human impact (paragraph 2) to how wars end (paragraph 3) to what peace actually requires (paragraph 4) — each paragraph builds toward the final redefinition of peace.',
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's purpose.",
        note: 'The passage stays deliberately general — no country, war, or side is ever named — so it teaches the underlying ideas rather than one specific history.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, besides soldiers, who else is deeply affected by a war?',
      explainer: 'In simple words: who else, besides soldiers, does the passage say a war affects?',
      explainerJa: 'この質問は、「兵士以外に、戦争によって深刻な影響を受けるのは誰か」を聞いています。',
      hint: 'Look at the beginning of paragraph 2.',
      hintJa: '第2段落の始まりに注目してみましょう。',
      options: [
        { id: 'a', label: 'Only people serving in the military.', correct: false },
        { id: 'b', label: 'Civilians are also deeply affected, even if they never fought.', correct: true },
        { id: 'c', label: "Only people living in the country's capital city.", correct: false },
      ],
      answerParagraphId: 'pw-f-reading-01-p2',
      evidencePrompt: 'Which sentence best shows that people far from the actual fighting can still be affected by a war?',
      evidenceOptions: [
        { id: 'e1', label: "War changes people's lives in many ways, and peace requires more than simply putting down weapons.", paragraphId: 'pw-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'Even people who live far from the fighting may experience fear, economic problems, or major changes in their daily lives.', paragraphId: 'pw-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'Homes and communities may need to be rebuilt, and people who have lost trust in one another may find it difficult to live together again.', paragraphId: 'pw-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'people who have lost trust in one another may find it difficult to live together again',
        question: 'What does "trust" mean here?',
        options: [
          { id: 'a', label: 'A legal agreement between countries.', correct: false },
          { id: 'b', label: 'A feeling of confidence that someone is honest or reliable.', correct: true },
          { id: 'c', label: 'A large amount of money saved for the future.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'What do you think people can do when they have a serious disagreement with someone? Write about your ideas or your own experience.',
      promptJapanese: '深刻な対立を抱えたとき、人はどうすればよいと思いますか。あなたの考え、またはあなた自身の経験について書いてください。',
      minSentences: 3,
      sentenceStarters: ['I think people can...', 'One time, I...', 'In my opinion, the most important thing is...'],
      wordBank: [
        { vocabId: 'pw-f-01', examplePhrase: 'It can take time to build trust again after...' },
        { vocabId: 'pw-f-09', examplePhrase: 'Sometimes negotiation helps two people find a solution.' },
        { vocabId: 'pw-f-10', examplePhrase: 'We had to cooperate to solve the problem.' },
        { vocabId: 'pw-f-11', examplePhrase: 'We slowly rebuilt our friendship.' },
      ],
      usefulExpressions: [
        { phrase: 'I think people can...', japanese: '人は...できると思います' },
        { phrase: 'One time, I...', japanese: 'あるとき、私は...' },
        { phrase: 'In my opinion, the most important thing is...', japanese: '私の意見では、最も大切なことは...です' },
      ],
    },

    takeaway: 'Peace means more than the fighting stopping — it also means rebuilding trust and community.',
  },

  // ── Peace and War — Advanced ─────────────────────────────────────────────────
  // New for this theme — the old placeholder had no Advanced content at all.
  // english/plainEnglish below are the manuscript's Advanced Original/
  // Simplified renderings verbatim (P3/P4 revised per educational review).

  {
    id: 'pw-s-reading-01',
    themeId: 'peace-and-war',
    level: 'advanced',
    title: 'Peace and War',
    titleJapanese: '平和と戦争',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: "Today, you will explore a deeper question: why doesn't ending a war automatically create lasting peace?",
    mission: 'As you read, notice how the passage separates political agreements, like treaties, from the slower, harder work of rebuilding trust between people.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'achieved', label: 'Once a war officially ends, peace has basically been achieved.' },
        { id: 'far-away', label: 'A war can officially end while real peace is still far away.' },
        { id: 'depends', label: 'It depends on how the war ended.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'pw-s-reading-01-p1',
        english:
          'A war can end on a particular day. The fighting stops, soldiers put down their weapons, and an agreement may be signed. It is tempting to think that peace begins at that moment. In reality, however, ending a war and building lasting peace are two different things. A ceasefire can stop violence, but it cannot immediately remove the reasons people fought or the distrust that developed during the conflict.',
        japanese:
          '戦争は、ある特定の日に終わることがあります。戦闘がやみ、兵士たちは武器を置き、合意文書に署名がなされるかもしれません。平和はその瞬間に始まると考えたくなります。しかし実際には、戦争を終わらせることと、長続きする平和を築くことは、まったく別のことです。停戦は暴力を止めることができますが、人々が戦った理由や、対立の中で生まれた不信感を、すぐに取り除くことはできません。',
        plainEnglish:
          'A war can end on one particular day. The fighting stops, soldiers put down their weapons, and both sides may sign an agreement. It is easy to think peace begins at that moment. But ending a war and building lasting peace are actually two different things. A ceasefire can stop the violence, but it cannot immediately remove the reasons people fought, or the distrust that grew during the conflict.',
        checkQuestion: 'According to this paragraph, why are ending a war and building lasting peace not the same thing?',
      },
      {
        id: 'pw-s-reading-01-p2',
        english:
          'One difficulty is that the two sides may understand the same conflict very differently. Each side may believe that its actions were necessary and that the other side was responsible for the war. People may also remember different events, losses, and injustices. For this reason, negotiation is not simply a matter of deciding who is right and who is wrong. It often requires both sides to understand another perspective and accept that no agreement will give everyone everything they want.',
        japanese:
          '難しさの一つは、両者が同じ対立をまったく異なる形で理解している場合があることです。それぞれの側が、自分たちの行動は必要だったのであり、戦争の責任は相手側にあると考えているかもしれません。人々はまた、それぞれ異なる出来事、損失、不正を記憶しているかもしれません。そのため、交渉とは単純にどちらが正しくどちらが間違っているかを決めることではありません。多くの場合、双方が互いの視点を理解し、どのような合意も全員の望みをすべて満たすわけではないと受け入れることが必要になります。',
        plainEnglish:
          'One difficulty is that the two sides often understand the same conflict very differently. Each side may believe its own actions were necessary, and that the other side caused the war. People on each side may also remember different events, losses, and injustices. Because of this, negotiation is not simply about deciding who is right and who is wrong. It usually requires both sides to understand another perspective, and to accept that no agreement will give everyone everything they want.',
        checkQuestion: 'According to this paragraph, why is negotiation not simply a matter of deciding who is right and who is wrong?',
      },
      {
        id: 'pw-s-reading-01-p3',
        english:
          'Another difficulty is the damage left behind by war. Civilians may have lost their homes or family members, refugees may be unable or unwilling to return, and communities may remain divided. A political agreement can solve one kind of problem without repairing another: a treaty can settle political questions, while distrust, fear, anger, displacement, and divided communities may remain. Even after physical damage has been repaired, painful memories may continue. These consequences can become part of the legacy passed from one generation to another.',
        japanese:
          'もう一つの難しさは、戦争が残す損害です。民間人は家や家族を失っているかもしれず、難民は戻ることができない、あるいは戻りたくないと感じているかもしれず、地域社会は分断されたままかもしれません。政治的な合意は、ある種の問題を解決しても、別の問題を修復するとは限りません。条約は政治的な問題を解決することができますが、不信感、恐怖、怒り、住む場所を失った状態、そして分断された地域社会は、そのまま残ることがあります。物理的な被害が修復された後でさえ、辛い記憶は続くことがあります。こうした結果は、ある世代から次の世代へと受け継がれる遺産の一部になることがあります。',
        plainEnglish:
          'Another difficulty is the damage left behind by war. Civilians may have lost their homes or family members. Refugees may be unable, or unwilling, to return. Communities may remain divided. A political agreement can solve one kind of problem without solving another: a treaty can settle political questions, while distrust, fear, anger, displacement, and divided communities may remain. Even after the physical damage has been repaired, painful memories can continue. These effects can become part of the legacy passed from one generation to the next.',
        checkQuestion: 'According to this paragraph, what is the difference between what a treaty can settle and what it cannot repair?',
      },
      {
        id: 'pw-s-reading-01-p4',
        english:
          'Lasting peace therefore often requires compromise and reconciliation as well as an end to violence. Diplomacy is the broader process through which negotiation, compromise, and agreements between former enemies can gradually take place, one difficult step at a time. Through this process, former enemies try to solve their disagreements and work toward reconciliation rather than a return to violence. This does not mean forgetting what happened or pretending that serious disagreements no longer exist. Reconciliation means finding a way for people who have experienced conflict to live together despite everything that came before. This process may take years or even generations, and sometimes it fails.',
        japanese:
          'そのため、長続きする平和には、暴力の終結だけでなく、妥協と和解もしばしば必要になります。外交とは、かつての敵同士の間で交渉や妥協、合意が、一歩ずつ困難を伴いながら少しずつ実現していく、より大きな過程のことです。この過程を通じて、かつての敵同士は暴力に戻るのではなく、意見の対立を解決し、和解に向けて努力しようとします。これは、起こったことを忘れることでも、深刻な対立がもう存在しないふりをすることでもありません。和解とは、対立を経験した人々が、それ以前に起きたすべてのことを抱えながらも、共に生きていく方法を見つけることを意味します。この過程には何年も、あるいは何世代もかかることがあり、時には失敗することもあります。',
        plainEnglish:
          'For this reason, lasting peace usually needs compromise and reconciliation, not only an end to violence. Diplomacy is the larger process that allows negotiation, compromise, and agreements between former enemies to happen gradually, one difficult step at a time. Through this process, former enemies try to solve their disagreements and work toward reconciliation instead of returning to violence. This does not mean forgetting what happened, or pretending serious disagreements no longer exist. Reconciliation means finding a way for people who have experienced conflict to live together despite everything that happened before. This process can take years, or even generations, and sometimes it fails.',
        checkQuestion: 'According to this paragraph, what is diplomacy, and what does reconciliation actually mean?',
      },
      {
        id: 'pw-s-reading-01-p5',
        english:
          'Perhaps this is why peace is better understood as a process than as a single event. A ceasefire may end the fighting, and a treaty may officially end a war, but neither can guarantee what happens afterward. Lasting peace depends on whether former enemies can gradually replace violence with negotiation, rebuild trust, and find ways to live with disagreements that may never completely disappear.',
        japanese:
          'おそらくこれが、平和が一つの出来事としてよりも、一つの過程として理解される方がふさわしい理由でしょう。停戦は戦闘を終わらせるかもしれず、条約は戦争を正式に終わらせるかもしれませんが、そのどちらも、その後に何が起こるかを保証することはできません。長続きする平和は、かつての敵同士が暴力を少しずつ交渉に置き換え、信頼を再建し、決して完全には消えないかもしれない対立と共に生きる方法を見つけられるかどうかにかかっています。',
        plainEnglish:
          'Perhaps this is why peace is better understood as a process, not a single event. A ceasefire may stop the fighting, and a treaty may officially end a war, but neither one can guarantee what happens next. Lasting peace depends on whether former enemies can gradually replace violence with negotiation, rebuild trust, and find ways to live with disagreements that may never completely go away.',
        checkQuestion: 'According to this final paragraph, why is peace better understood as a process than as a single event?',
      },
    ],

    targetVocabIds: ['pw-s-01', 'pw-s-02', 'pw-s-03', 'pw-s-04', 'pw-s-05', 'pw-s-06', 'pw-s-07', 'pw-s-08', 'pw-s-09', 'pw-s-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['conflict', 'perspective', 'injustice', 'consequence', 'diplomacy', 'compromise', 'reconciliation', 'distrust', 'lasting', 'guarantee'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['It is tempting to think that...', 'one difficult step at a time', 'peace is better understood as a process than as a single event'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's tone.",
        note: 'The passage is careful to describe both sides\' beliefs as sincerely held, without asserting that all wartime actions are equally justified — it separates "people see this differently" from "therefore no one is responsible."',
      },
    ],

    missionCheck: {
      question: "According to the passage, why can't a ceasefire alone create lasting peace?",
      explainer: 'In simple words: why is a ceasefire not enough by itself to create lasting peace?',
      explainerJa: 'この質問は、「なぜ停戦だけでは長続きする平和を生み出すのに十分ではないのか」を聞いています。',
      hint: 'Look at paragraph 1.',
      hintJa: '第1段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Because ceasefires are rarely written down.', correct: false },
        { id: 'b', label: 'Because a ceasefire can stop the violence but cannot remove the reasons people fought or the distrust between them.', correct: true },
        { id: 'c', label: 'Because most ceasefires are broken within a few days.', correct: false },
      ],
      answerParagraphId: 'pw-s-reading-01-p1',
      evidencePrompt: 'Which sentence best shows that a political agreement can solve one kind of problem while leaving another problem unresolved?',
      evidenceOptions: [
        { id: 'e1', label: 'For this reason, negotiation is not simply a matter of deciding who is right and who is wrong.', paragraphId: 'pw-s-reading-01-p2', correct: false },
        { id: 'e2', label: 'A political agreement can solve one kind of problem without repairing another: a treaty can settle political questions, while distrust, fear, anger, displacement, and divided communities may remain.', paragraphId: 'pw-s-reading-01-p3', correct: true },
        { id: 'e3', label: 'This does not mean forgetting what happened or pretending that serious disagreements no longer exist.', paragraphId: 'pw-s-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'peace is better understood as a process than as a single event',
        question: 'What is this sentence suggesting about how peace actually happens?',
        options: [
          { id: 'a', label: 'Peace happens instantly, the moment a treaty is signed.', correct: false },
          { id: 'b', label: 'Peace develops gradually, through many ongoing efforts, not all at once.', correct: true },
          { id: 'c', label: 'Peace and war are essentially the same thing.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Wars today are different from wars in the past. How do you think the way wars are fought has changed? What do you think about these changes?',
      promptJapanese: '今日の戦争は、過去の戦争とは異なります。戦争の戦われ方はどのように変化してきたと思いますか。また、そうした変化についてあなたはどう思いますか。',
      minSentences: 4,
      recommendedWordRange: [80, 120],
      wordBank: [
        { vocabId: 'pw-s-04', examplePhrase: 'This change could have serious consequences for...' },
        { vocabId: 'pw-s-10', examplePhrase: 'New technology cannot guarantee...' },
        { vocabId: 'pw-s-09', examplePhrase: 'It is hard to know what the lasting effects of this change will be.' },
      ],
      usefulExpressions: [
        { phrase: 'One change is that...', japanese: '一つの変化は...ということです' },
        { phrase: 'This could be good because..., but it could also be a problem because...', japanese: 'これは...という理由で良いかもしれませんが、...という理由で問題にもなり得ます' },
        { phrase: 'In my opinion,...', japanese: '私の意見では、...' },
      ],
    },

    takeaway: 'Peace is better understood as a process than as a single event.',
  },

  // ── Caring for Our Planet — Foundation ──────────────────────────────────────
  // Rebuilt 2026-08-20 against docs/THEME_07_MANUSCRIPT.md — replaces the old
  // Aoi/beach narrative entirely with an expository, global-scale Foundation
  // piece, paired with a new Advanced reading (below).

  {
    id: 'cp-f-reading-01',
    themeId: 'caring-for-our-planet',
    level: 'foundation',
    title: 'Caring for Our Planet',
    titleJapanese: '地球を守る',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will read about how pollution, climate, and ecosystems around the world are connected — and why the speed of today\'s climate change matters.',
    mission: "As you read, notice how the passage explains that Earth's climate has always changed naturally, but that today's problem is something different.",

    preReadingSurvey: {
      question: 'Before you read, which statement is closest to your own thinking?',
      options: [
        { id: 'new', label: 'Climate change is a new problem that never happened before.' },
        { id: 'not-concern', label: "Climate has always changed naturally, so today's warming isn't a special concern." },
        { id: 'still-serious', label: "Climate has always changed naturally, but today's warming is still a serious problem." },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'cp-f-reading-01-p1',
        english:
          'Environmental problems affect people and nature around the world. Pollution, climate change, and damage to ecosystems may seem like separate problems, but they are often connected. What happens in one part of the environment can affect many other parts.',
        japanese:
          '環境問題は、世界中の人々や自然に影響を与えます。汚染、気候変動、そして生態系への被害は、別々の問題のように見えるかもしれませんが、それらはしばしば互いに関連しています。環境のある一部で起きたことが、他の多くの部分に影響を与えることがあります。',
        plainEnglish:
          'Environmental problems affect people and nature all over the world. Pollution, climate change, and damage to ecosystems may seem like separate problems. But they are often connected. Something that happens in one part of the environment can affect many other parts.',
        checkQuestion: 'According to this paragraph, why can environmental problems that seem separate actually be connected?',
      },
      {
        id: 'cp-f-reading-01-p2',
        english:
          'Pollution comes from many sources. Cars and factories pollute the air, while chemicals, waste, and plastic can enter rivers and oceans. This pollution can damage habitats and affect the plants, animals, and people that depend on them.',
        japanese:
          '汚染は多くの原因から生じます。車や工場は大気を汚染し、化学物質やごみ、プラスチックは川や海に流れ込むことがあります。この汚染は生息地を損なうことがあり、それに依存している植物、動物、そして人々に影響を与えることがあります。',
        plainEnglish:
          'Pollution comes from many sources. Cars and factories pollute the air. Chemicals, waste, and plastic can enter rivers and oceans. This pollution can damage habitats. It can affect the plants, animals, and people that depend on them.',
        checkQuestion: 'According to this paragraph, what are two ways pollution can enter the environment?',
      },
      {
        id: 'cp-f-reading-01-p3',
        english:
          "Earth's climate has always changed. It is true that there have been warmer and colder periods in the past. However, the problem today is that the Earth is becoming warmer very quickly, mainly because of human activities. Burning coal, oil, and gas releases greenhouse gases into the atmosphere. When the climate changes quickly, plants, animals, and people have less time to adjust. Places where we grow food or build cities may also change. This is one reason why today's climate change is a serious global problem.",
        japanese:
          '地球の気候はこれまでも常に変化してきました。過去には、暖かい時期や寒い時期があったのは事実です。しかし今日の問題は、地球が非常に速いスピードで温暖化していることであり、その主な原因は人間の活動です。石炭、石油、ガスを燃やすことで、温室効果ガスが大気中に放出されます。気候が急速に変化すると、植物、動物、そして人々が適応する時間は少なくなります。私たちが食料を育てたり都市を築いたりする場所も変わるかもしれません。これが、今日の気候変動が深刻な地球規模の問題である理由の一つです。',
        plainEnglish:
          "Earth's climate has always changed. It is true that there were warmer and colder periods in the past. But the problem today is different: the Earth is becoming warmer very quickly, mainly because of human activities. Burning coal, oil, and gas puts greenhouse gases into the atmosphere. When the climate changes this quickly, plants, animals, and people have less time to adjust. Places where we grow food or build cities may also change. This is one reason why today's climate change is such a serious global problem.",
        checkQuestion: "According to this paragraph, what is the real concern about today's climate change, if climate has always changed naturally?",
      },
      {
        id: 'cp-f-reading-01-p4',
        english:
          'People depend on the environment for food, water, energy, and other natural resources. This means that environmental problems are not only problems for nature; they are also problems for people. Understanding how pollution, climate, ecosystems, and human life are connected is an important first step toward protecting our planet.',
        japanese:
          '人々は、食料、水、エネルギー、そのほかの天然資源を環境に依存しています。つまり、環境問題は自然だけの問題ではなく、人々にとっての問題でもあるのです。汚染、気候、生態系、そして人間の生活がどのようにつながっているかを理解することは、私たちの地球を守るための重要な第一歩です。',
        plainEnglish:
          'People depend on the environment for food, water, energy, and other natural resources. This means environmental problems are not only problems for nature. They are also problems for people. Understanding how pollution, climate, ecosystems, and human life are all connected is an important first step toward protecting our planet.',
        checkQuestion: 'According to this paragraph, why are environmental problems also problems for people, not just for nature?',
      },
    ],

    targetVocabIds: ['cp-f-01', 'cp-f-02', 'cp-f-03', 'cp-f-04', 'cp-f-05', 'cp-f-06', 'cp-f-07', 'cp-f-08', 'cp-f-09', 'cp-f-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['environment', 'damage', 'ecosystem', 'climate', 'pollution', 'resource', 'atmosphere', 'greenhouse gas', 'habitat', 'adjust'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['may seem like separate problems, but...', 'less time to adjust'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's purpose.",
        note: "The passage makes a careful, deliberate distinction — Earth's climate has always changed naturally, and that fact does not make today's rapid warming less serious. The concern is the speed of change, not the mere fact that change is happening.",
      },
    ],

    missionCheck: {
      question: "According to the passage, what is the real concern about today's climate change?",
      explainer: 'In simple words: why is today\'s climate change a serious problem, if climate has always changed before?',
      explainerJa: 'この質問は、「気候はこれまでも変化してきたのに、なぜ今日の気候変動は深刻な問題なのか」を聞いています。',
      hint: 'Look at paragraph 3.',
      hintJa: '第3段落を見てみましょう。',
      options: [
        { id: 'a', label: 'That the climate is changing at all, which has never happened before.', correct: false },
        { id: 'b', label: 'That the Earth is warming much faster than in the past, giving less time to adjust.', correct: true },
        { id: 'c', label: 'That scientists cannot agree on whether the climate is changing.', correct: false },
      ],
      answerParagraphId: 'cp-f-reading-01-p3',
      evidencePrompt: 'Which sentence best shows that environmental problems are not only problems for nature, but also for people?',
      evidenceOptions: [
        { id: 'e1', label: 'Pollution, climate change, and damage to ecosystems may seem like separate problems, but they are often connected.', paragraphId: 'cp-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'This pollution can damage habitats and affect the plants, animals, and people that depend on them.', paragraphId: 'cp-f-reading-01-p2', correct: false },
        { id: 'e3', label: 'People depend on the environment for food, water, energy, and other natural resources. This means that environmental problems are not only problems for nature; they are also problems for people.', paragraphId: 'cp-f-reading-01-p4', correct: true },
      ],
      vocabInContext: {
        quote: 'plants, animals, and people have less time to adjust',
        question: 'What does "adjust" mean here?',
        options: [
          { id: 'a', label: 'To completely stop changing.', correct: false },
          { id: 'b', label: 'To change gradually in response to new conditions.', correct: true },
          { id: 'c', label: 'To move to a new location.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Have you noticed any environmental changes in a place you know well? What is one thing you think people — including you — can do about environmental problems?',
      promptJapanese: 'あなたがよく知っている場所で、何か環境の変化に気づいたことはありますか。環境問題について、人々——あなた自身を含め——にできることは何だと思いますか。',
      minSentences: 3,
      sentenceStarters: ['I have noticed...', 'One thing I think people can do is...', 'I already try to...'],
      wordBank: [
        { vocabId: 'cp-f-01', examplePhrase: "It's important to protect the environment by..." },
        { vocabId: 'cp-f-05', examplePhrase: 'I noticed pollution when...' },
        { vocabId: 'cp-f-06', examplePhrase: 'We can use resources like water more carefully.' },
        { vocabId: 'cp-f-02', examplePhrase: 'Even small actions can help reduce damage to nature.' },
      ],
      usefulExpressions: [
        { phrase: 'I have noticed...', japanese: '私は...ということに気づきました' },
        { phrase: 'One thing I think people can do is...', japanese: '人々にできることの一つは...だと思います' },
        { phrase: 'I already try to...', japanese: '私はすでに...するようにしています' },
      ],
    },

    takeaway: "Climate has always changed naturally — but the speed of today's warming is what makes it a serious problem.",
  },

  // ── Caring for Our Planet — Advanced ─────────────────────────────────────────
  // New for this theme — the old placeholder had no Advanced content at all.
  // english/plainEnglish below are the manuscript's Advanced Original/
  // Simplified renderings verbatim.

  {
    id: 'cp-s-reading-01',
    themeId: 'caring-for-our-planet',
    level: 'advanced',
    title: 'Caring for Our Planet',
    titleJapanese: '地球を守る',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore a deeper question: even when we understand environmental problems scientifically, why is solving them internationally so difficult?',
    mission: 'As you read, notice how the passage separates what science can tell us from what science alone cannot decide — questions of responsibility and fairness.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own opinion?',
      options: [
        { id: 'equal', label: 'Every country should reduce emissions by the same amount.' },
        { id: 'historical', label: 'Countries that caused more of the problem should do more to fix it.' },
        { id: 'complicated', label: "It's complicated — historical responsibility and current needs both matter." },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'cp-s-reading-01-p1',
        english:
          'Environmental problems do not stop at national borders. In other words, their effects can go beyond the country where they begin. Air and water pollution can move from one country to another, plastic waste can travel through the oceans, and greenhouse gases released in one country can affect the global climate. This means that many environmental problems cannot be solved by one country alone. International cooperation is necessary, but agreeing on what each country should do is not easy.',
        japanese:
          '環境問題は国境で止まりません。つまり、その影響は問題が始まった国を越えて広がることがあるのです。大気や水の汚染は一つの国から別の国へと移動することがあり、プラスチックごみは海を渡って運ばれることがあり、ある国で排出された温室効果ガスは地球全体の気候に影響を与えることがあります。これは、多くの環境問題が一つの国だけでは解決できないことを意味します。国際協力が必要ですが、それぞれの国が何をすべきかについて合意することは簡単ではありません。',
        plainEnglish:
          'Environmental problems do not stop at national borders. In other words, their effects can reach beyond the country where they start. Air and water pollution can move from one country to another. Plastic waste can travel through the oceans. Greenhouse gases released in one country can affect the whole world\'s climate. This means many environmental problems cannot be solved by just one country. International cooperation is necessary, but agreeing on what each country should do is not easy.',
        checkQuestion: "According to this paragraph, why can't environmental problems always be solved by one country alone?",
      },
      {
        id: 'cp-s-reading-01-p2',
        english:
          "One reason is that countries have not contributed equally to today's environmental problems. Many wealthy countries used large amounts of coal, oil, and other natural resources while developing their economies. Other countries developed later and have contributed less in the past. They may therefore argue that countries that contributed more to the problem should take more responsibility for solving it. This raises a difficult question of fairness: should every country be expected to do the same amount?",
        japanese:
          'その理由の一つは、今日の環境問題に対して各国が平等に関わってきたわけではないということです。多くの裕福な国々は、経済を発展させる過程で、石炭、石油、そのほかの天然資源を大量に使用してきました。他の国々はより遅れて発展し、これまでのところ、それほど多くの原因を作ってきませんでした。そのため、より多くこの問題の原因を作った国が、より多くの責任を負うべきだと主張する人もいます。これは公平性についての難しい問題を提起します——すべての国が同じ量を求められるべきなのでしょうか。',
        plainEnglish:
          "One reason is that countries have not contributed equally to today's environmental problems. Many wealthy countries used large amounts of coal, oil, and other natural resources while their economies were growing. Other countries developed later and have contributed less so far. So some people argue that countries that contributed more to the problem should take more responsibility for solving it. This raises a difficult question of fairness: should every country be expected to do the same amount?",
        checkQuestion: 'According to this paragraph, why do some countries argue that they should take on more responsibility than others?',
      },
      {
        id: 'cp-s-reading-01-p3',
        english:
          'Economic development makes the problem even more complicated. Developing countries need energy, transportation, factories, and jobs to improve people\'s lives. Asking them to greatly reduce their use of fossil fuels may slow their economic growth. At the same time, if every country continues to increase its use of fossil fuels, global warming will become more serious. Environmental protection and economic development can therefore come into conflict, and different countries may have different priorities.',
        japanese:
          '経済発展は、この問題をさらに複雑にします。発展途上国は、人々の生活を向上させるために、エネルギー、交通機関、工場、そして雇用を必要としています。化石燃料の使用を大幅に減らすよう求めることは、彼らの経済成長を遅らせるかもしれません。同時に、すべての国が化石燃料の使用を増やし続ければ、地球温暖化はより深刻になるでしょう。そのため、環境保護と経済発展は対立することがあり、国によって優先順位が異なることもあります。',
        plainEnglish:
          "Economic development makes the problem even more complicated. Developing countries need energy, transportation, factories, and jobs to improve people's lives. Asking them to greatly cut their use of fossil fuels could slow their economic growth. But if every country keeps increasing its use of fossil fuels, global warming will become more serious. So environmental protection and economic development can come into conflict, and different countries can have different priorities.",
        checkQuestion: 'According to this paragraph, why can environmental protection and economic development come into conflict?',
      },
      {
        id: 'cp-s-reading-01-p4',
        english:
          'International agreements are one way to deal with this problem. Countries can agree to reduce emissions, develop cleaner energy, protect natural resources, or provide financial support to countries that need it. However, an agreement does not guarantee that every country will reach its goals. Governments may change, economic conditions may change, and countries may disagree about how quickly they should act or how the costs should be shared.',
        japanese:
          '国際協定は、この問題に取り組む一つの方法です。各国は、排出量を削減すること、よりクリーンなエネルギーを開発すること、天然資源を保護すること、あるいは必要としている国々に資金援助を行うことに合意することができます。しかし、協定を結んだからといって、すべての国が目標を達成することが保証されるわけではありません。政府は変わることがあり、経済状況も変わることがあり、そして各国は、どれくらいの速さで行動すべきか、あるいは費用をどのように分担すべきかについて意見が対立することもあります。',
        plainEnglish:
          'International agreements are one way to deal with this problem. Countries can agree to reduce emissions, develop cleaner energy, protect natural resources, or give financial support to countries that need it. But an agreement does not guarantee that every country will reach its goals. Governments can change, economic conditions can change, and countries can disagree about how fast they should act or how the costs should be shared.',
        checkQuestion: "According to this paragraph, why doesn't an international agreement guarantee that every country will reach its goals?",
      },
      {
        id: 'cp-s-reading-01-p5',
        english:
          'Protecting the global environment is therefore not only a scientific problem. Science can help us understand what is happening to the planet, but it cannot decide how responsibility and costs should be shared among countries. These are also economic, political, and ethical questions. The environment is shared by everyone, but countries have different histories, needs, and interests. Finding a solution therefore requires not only new technology, but also cooperation and difficult decisions about what is fair.',
        japanese:
          'したがって、地球環境を守ることは、単なる科学の問題ではありません。科学は、地球に何が起きているのかを理解する助けにはなりますが、責任や費用が国々の間でどのように分担されるべきかを決めることはできません。これらは、経済的、政治的、そして倫理的な問題でもあるのです。環境はすべての人々によって共有されていますが、国々にはそれぞれ異なる歴史、ニーズ、そして利害があります。したがって解決策を見つけるには、新しい技術だけでなく、協力と、何が公平であるかについての難しい決断も必要なのです。',
        plainEnglish:
          'So protecting the global environment is not only a scientific problem. Science can help us understand what is happening to the planet. But science cannot decide how responsibility and costs should be shared among countries. These are also economic, political, and ethical questions. The environment is shared by everyone, but countries have different histories, needs, and interests. Finding a solution needs not only new technology, but also cooperation and difficult decisions about what is fair.',
        checkQuestion: 'According to this final paragraph, why is protecting the environment not only a scientific problem?',
      },
    ],

    targetVocabIds: ['cp-s-01', 'cp-s-02', 'cp-s-03', 'cp-s-04', 'cp-s-05', 'cp-s-06', 'cp-s-07', 'cp-s-08', 'cp-s-09', 'cp-s-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['contribute', 'wealthy', 'developing countries', 'fossil fuel', 'emissions', 'fairness', 'responsibility', 'priority', 'ethical', 'border'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['do not stop at national borders', 'come into conflict', 'not only a scientific problem'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's tone.",
        note: "The passage presents the historical-responsibility argument (paragraph 2) and developing countries' growth needs (paragraph 3) with equal sympathy, framing both as legitimate positions rather than declaring one side right.",
      },
    ],

    missionCheck: {
      question: 'According to the passage, why do some people argue that wealthy countries should take on more responsibility for solving environmental problems?',
      explainer: 'In simple words: why do some people think wealthy countries should do more to fix environmental problems?',
      explainerJa: 'この質問は、「なぜ裕福な国々がより多くの責任を負うべきだと考える人がいるのか」を聞いています。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Because wealthy countries have more money to spend on anything.', correct: false },
        { id: 'b', label: 'Because wealthy countries contributed more to the problem while developing their economies in the past.', correct: true },
        { id: 'c', label: 'Because wealthy countries have more scientists studying the environment.', correct: false },
      ],
      answerParagraphId: 'cp-s-reading-01-p2',
      evidencePrompt: 'Which sentence best shows that solving this problem is not simply a matter of every country reducing fossil fuel use equally?',
      evidenceOptions: [
        { id: 'e1', label: 'International cooperation is necessary, but agreeing on what each country should do is not easy.', paragraphId: 'cp-s-reading-01-p1', correct: false },
        { id: 'e2', label: "Developing countries need energy, transportation, factories, and jobs to improve people's lives. Asking them to greatly reduce their use of fossil fuels may slow their economic growth.", paragraphId: 'cp-s-reading-01-p3', correct: true },
        { id: 'e3', label: 'Governments may change, economic conditions may change, and countries may disagree about how quickly they should act or how the costs should be shared.', paragraphId: 'cp-s-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'Science can help us understand what is happening to the planet, but it cannot decide how responsibility and costs should be shared among countries.',
        question: 'What is this sentence suggesting about the limits of science in solving this problem?',
        options: [
          { id: 'a', label: 'Science is not useful for understanding environmental problems at all.', correct: false },
          { id: 'b', label: 'Science can explain what is happening, but deciding what is fair is a different kind of question.', correct: true },
          { id: 'c', label: 'Science and fairness are actually the same thing.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Who should do more to solve environmental problems: individuals, governments, or companies? What do you think? Give reasons for your opinion.',
      promptJapanese: '環境問題を解決するために、より多くのことをすべきなのは誰でしょうか——個人、政府、それとも企業でしょうか。あなたはどう思いますか。あなたの意見の理由を挙げてください。',
      minSentences: 4,
      recommendedWordRange: [80, 120],
      wordBank: [
        { vocabId: 'cp-s-07', examplePhrase: 'I think governments have more responsibility than individuals because...' },
        { vocabId: 'cp-s-08', examplePhrase: 'This should be a bigger priority for...' },
        { vocabId: 'cp-s-09', examplePhrase: 'This is also an ethical question, because...' },
      ],
      usefulExpressions: [
        { phrase: 'In my opinion,...', japanese: '私の意見では、...' },
        { phrase: 'One reason I think this is...', japanese: 'そう思う理由の一つは...です' },
        { phrase: 'This is important because...', japanese: 'これが重要なのは...だからです' },
      ],
    },

    takeaway: 'Science can explain what is happening to the planet, but it cannot decide what is fair.',
  },

  // ── Living with AI — Foundation ──────────────────────────────────────────────
  // Revised 2026-08-27: replaced with a plainer, less detailed approved
  // passage. Dropped the 1950s-research framing and the "generative AI"
  // technical label entirely — the chatbot is now described concretely
  // ("used what it had learned from a huge amount of data to respond...")
  // instead of being named with jargon. Vocabulary rebuilt to match; see
  // docs/THEME_08_MANUSCRIPT.md for the full rationale. Advanced (below)
  // is unchanged and still pairs with this Foundation.

  {
    id: 'la-f-reading-01',
    themeId: 'living-with-ai',
    level: 'foundation',
    title: 'Artificial Intelligence',
    titleJapanese: '人工知能',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will read about how AI moved from working quietly behind technology to something ordinary people could talk to directly.',
    mission: 'As you read, notice how the passage describes this change step by step — from AI working behind computers and online services, to ChatGPT, to AI being used everywhere today.',

    preReadingSurvey: {
      question: 'Before you read, which statement is closest to your own thinking?',
      options: [
        { id: 'new', label: 'AI is a completely new technology that only appeared in the last few years.' },
        { id: 'access', label: "AI has existed for a long time, but most people couldn't use it directly until recently." },
        { id: 'same', label: 'AI and ChatGPT are basically the same thing.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'la-f-reading-01-p1',
        english:
          'Artificial intelligence, or AI, did not begin with ChatGPT. AI had already been used for many years in computers, machines, and online services, usually working behind them without people communicating directly with it. Most people therefore used AI without thinking much about the AI itself.',
        japanese:
          '人工知能、つまりAIは、ChatGPTから始まったわけではありません。AIはすでに何年も前から、コンピュータや機械、オンラインサービスの中で使われてきましたが、たいていはその背後で働いており、人々がAIと直接やり取りすることはありませんでした。そのため、ほとんどの人は、AIそのものについてあまり深く考えることなくAIを使っていました。',
        plainEnglish:
          'Artificial intelligence, or AI, did not begin with ChatGPT. AI had already been used for many years. It worked inside computers, machines, and online services. Usually, people did not communicate with AI directly — it just worked quietly behind these things. Because of this, most people used AI without thinking much about it.',
        checkQuestion: 'According to this paragraph, how did most people typically use AI before ChatGPT?',
      },
      {
        id: 'la-f-reading-01-p2',
        english:
          "This began to change quickly when OpenAI released ChatGPT to the public in late 2022. It was a chatbot that could use what it had learned from a huge amount of data to respond to people's questions and produce new content. For the first time, millions of ordinary people began communicating directly with this kind of AI simply by typing what they wanted to know or do.",
        japanese:
          'これは、OpenAIが2022年後半にChatGPTを一般公開したことで急速に変わり始めました。それは、膨大な量のデータから学んだことを使って、人々の質問に答えたり、新しいコンテンツを作り出したりできるチャットボットでした。初めて、何百万人もの一般の人々が、知りたいことやしてほしいことをただ入力するだけで、この種のAIと直接やり取りをするようになったのです。',
        plainEnglish:
          "This began to change quickly when OpenAI released ChatGPT to the public in late 2022. ChatGPT was a chatbot. It could use what it had learned from a huge amount of data to answer people's questions and create new content. For the first time, millions of ordinary people began communicating directly with this kind of AI. They simply typed what they wanted to know or do.",
        checkQuestion: 'According to this paragraph, what could people do with ChatGPT for the first time?',
      },
      {
        id: 'la-f-reading-01-p3',
        english:
          'Since then, AI has become much more involved in everyday life. People can ask AI to explain something they do not understand, help them write or improve a text, translate languages, find and organize information, create images, or help solve problems. At work, AI can also help people analyze information, prepare documents, and develop ideas. The important change is that ordinary people can now ask AI for help directly and use it for many different purposes.',
        japanese:
          'それ以来、AIは日常生活にはるかに深く関わるようになりました。人々はAIに、理解できないことを説明してもらったり、文章を書いたり改善したりするのを手伝ってもらったり、言語を翻訳してもらったり、情報を見つけて整理してもらったり、画像を作ってもらったり、問題を解決する手助けをしてもらったりすることができます。職場でも、AIは人々が情報を分析したり、書類を準備したり、アイデアを練ったりするのを助けることができます。重要な変化は、一般の人々が今では直接AIに助けを求め、さまざまな目的のためにそれを使えるようになったということです。',
        plainEnglish:
          "Since then, AI has become much more involved in everyday life. People can ask AI to explain something they don't understand. AI can help them write or improve a text, translate languages, find and organize information, create images, or solve problems. At work, AI can also help people analyze information, prepare documents, and develop ideas. The important change is this: ordinary people can now ask AI for help directly, and use it for many different purposes.",
        checkQuestion: 'According to this paragraph, what kinds of things can people now ask AI to help with?',
      },
      {
        id: 'la-f-reading-01-p4',
        english:
          'The rapid spread of AI also changed how organizations used technology. Companies began adding AI to their products and services, and schools and workplaces began finding ways to use it. AI became something that more people could use in their daily activities, rather than something that mainly worked behind other technology. In only a few years, the relationship between people and AI changed greatly.',
        japanese:
          'AIの急速な広がりは、組織がテクノロジーをどう使うかも変えました。企業は自社の製品やサービスにAIを取り入れ始め、学校や職場もAIを活用する方法を見つけ始めました。AIは、それまでのように主に他のテクノロジーの背後で働くものではなく、より多くの人々が日常の活動の中で使えるものになりました。わずか数年のうちに、人々とAIの関係は大きく変わったのです。',
        plainEnglish:
          "The rapid spread of AI also changed how organizations used technology. Companies began adding AI to their products and services. Schools and workplaces began finding ways to use it too. AI became something more people could use in their daily activities. It was no longer just something that worked quietly behind other technology. In only a few years, the relationship between people and AI changed greatly.",
        checkQuestion: "According to this final paragraph, how did the spread of AI affect organizations like companies and schools?",
      },
    ],

    targetVocabIds: ['la-f-01', 'la-f-02', 'la-f-03', 'la-f-04', 'la-f-05', 'la-f-06', 'la-f-07', 'la-f-08', 'la-f-09', 'la-f-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['AI', 'chatbot', 'data', 'translate', 'organize', 'respond', 'analyze', 'involved', 'organization', 'spread'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['working behind them', 'for the first time'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's purpose.",
        note: 'Notice that the passage never uses a technical label like "generative AI" — instead, it explains concretely what the chatbot actually did ("used what it had learned from a huge amount of data to respond to people\'s questions and produce new content"). This keeps the historical idea clear without requiring jargon.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, how did most people typically use AI before ChatGPT?',
      explainer: 'In simple words: how did people usually experience AI before ChatGPT existed?',
      explainerJa: 'この質問は、「ChatGPTが登場する前、人々は普段どのようにAIを利用していたか」を聞いています。',
      hint: 'Look at paragraph 1.',
      hintJa: '第1段落を見てみましょう。',
      options: [
        { id: 'a', label: 'They talked to AI chatbots every day.', correct: false },
        { id: 'b', label: 'AI usually worked quietly behind computers, machines, and online services, without people communicating with it directly.', correct: true },
        { id: 'c', label: 'Most people had never heard of AI at all.', correct: false },
      ],
      answerParagraphId: 'la-f-reading-01-p1',
      evidencePrompt: 'Which sentence best shows what was new about how people could use ChatGPT?',
      evidenceOptions: [
        { id: 'e1', label: 'AI had already been used for many years in computers, machines, and online services.', paragraphId: 'la-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'For the first time, millions of ordinary people began communicating directly with this kind of AI simply by typing what they wanted to know or do.', paragraphId: 'la-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'Companies began adding AI to their products and services, and schools and workplaces began finding ways to use it.', paragraphId: 'la-f-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'Since then, AI has become much more involved in everyday life.',
        question: 'What does "involved" mean here?',
        options: [
          { id: 'a', label: 'Taking part in or connected to something.', correct: true },
          { id: 'b', label: 'Difficult to understand.', correct: false },
          { id: 'c', label: 'Kept completely separate from something.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Do you use AI tools in your own life, such as for schoolwork or daily tasks? What do you find helpful about using AI, and what makes you want to check its answers carefully?',
      promptJapanese: 'あなたは学校の課題や日常のタスクなど、自分自身の生活の中でAIツールを使っていますか。AIを使うことの何が役立つと感じますか。また、AIの答えを注意深く確認したくなるのはどんなときですか。',
      minSentences: 3,
      sentenceStarters: ['I use AI to...', 'I find it helpful when...', 'I try to check AI\'s answers by...'],
      wordBank: [
        { vocabId: 'la-f-01', examplePhrase: 'I use AI to...' },
        { vocabId: 'la-f-02', examplePhrase: 'I use a chatbot to...' },
        { vocabId: 'la-f-06', examplePhrase: 'AI can respond quickly, but...' },
        { vocabId: 'la-f-04', examplePhrase: 'I sometimes use AI to translate...' },
      ],
      usefulExpressions: [
        { phrase: 'I use AI to...', japanese: '私はAIを...するために使います' },
        { phrase: 'I find it helpful when...', japanese: '...なとき、役に立つと感じます' },
        { phrase: "I try to check AI's answers by...", japanese: '私はAIの答えを...することで確認するようにしています' },
      ],
    },

    takeaway: 'In only a few years, the relationship between people and AI changed greatly.',
  },

  // ── Living with AI — Advanced ─────────────────────────────────────────────────
  // Substantially revised 2026-08-21 — replaces the earlier 6-paragraph
  // draft (excitement/concern → work → human ability → responsibility →
  // control → enduring-question conclusion) with a tighter 4-paragraph
  // passage centered on the division of work between people and AI and the
  // moving boundary between human and machine work. Responsibility is
  // deliberately no longer a major organizing topic. See
  // docs/THEME_08_MANUSCRIPT.md for the full revision history.

  {
    id: 'la-s-reading-01',
    themeId: 'living-with-ai',
    level: 'advanced',
    title: 'Living with AI',
    titleJapanese: 'AIと生きる',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore a deeper question: as AI becomes capable of a wider range of work, how might the division of work between people and machines change — and why does this create both hope and fear?',
    mission: 'As you read, notice how the passage moves from a simple, common prediction to a more careful one — and how carefully it distinguishes a real concern from an established fact.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own thinking?',
      options: [
        { id: 'replace', label: 'AI will probably replace most jobs completely.' },
        { id: 'divide', label: 'AI will probably take over parts of many jobs, while people do other parts.' },
        { id: 'no-change', label: "AI won't really change how most jobs work." },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'la-s-reading-01-p1',
        english:
          'Since ChatGPT made direct interaction with AI widely available, AI has continued to develop quickly. It is becoming able to perform a wider range of tasks once thought to need human knowledge, judgment, or skill — moving beyond repetitive and systematic work toward analysis, planning, some management, and even intellectual or creative work. This does not mean AI can do these jobs alone, only that it is becoming part of work that used to depend entirely on people.',
        japanese:
          'ChatGPTがAIとの直接的なやり取りを広く可能にして以来、AIは急速に発展し続けています。AIは、これまで人間の知識や判断力、技能が必要だと考えられてきた、より幅広い作業をこなせるようになりつつあります——単純作業や定型的な作業にとどまらず、分析、計画、一部の管理業務、さらには知的・創造的な仕事にまで及んでいます。これは、AIがこうした仕事を単独で行えるという意味ではなく、これまで完全に人間に頼っていた仕事の一部に、AIが関わるようになってきているという意味です。',
        plainEnglish:
          "Since ChatGPT made it easy for people to talk directly with AI, AI has kept developing quickly. It is becoming able to do a wider range of tasks — tasks that used to need human knowledge, judgment, or skill. This includes not only repetitive and systematic work, but also analysis, planning, some management, and even intellectual or creative work. This doesn't mean AI can do these jobs completely by itself. It means AI is becoming part of work that used to depend entirely on people.",
        checkQuestion: 'According to this paragraph, what kinds of work is AI increasingly becoming part of?',
      },
      {
        id: 'la-s-reading-01-p2',
        english:
          'One common prediction is that AI will replace many jobs. A more important change, though, may be that the division of work between people and AI shifts. AI may take on more parts of a task while people focus on different parts — asking the right questions, judging results, or handling situations AI cannot manage. Some jobs may disappear, many may change, and new kinds of work may appear, including in professional and managerial roles.',
        japanese:
          'よくある予測の一つは、AIが多くの仕事を奪うというものです。しかし、それよりも重要な変化は、人とAIの間の仕事の分担が変わっていくことかもしれません。AIが一つの作業のより多くの部分を担うようになる一方で、人は別の部分に取り組むようになるかもしれません——適切な問いを立てること、結果を判断すること、あるいはAIには対応できない状況に対処することなどです。一部の仕事はなくなり、多くの仕事は変化し、専門職や管理職を含め、新しい種類の仕事が生まれるかもしれません。',
        plainEnglish:
          'One common prediction is that AI will replace many jobs. But a more important change may be this: the division of work between people and AI may shift. AI may do more parts of a task, while people focus on other parts — asking the right questions, judging the results, or handling situations AI cannot manage. Some jobs may disappear. Many jobs may change. And new kinds of work may appear, including in professional and managerial jobs.',
        checkQuestion: "According to this paragraph, what more important change may happen, instead of AI simply replacing jobs?",
      },
      {
        id: 'la-s-reading-01-p3',
        english:
          'AI may make work faster and help people process more information, freeing them to focus on harder problems. But if people regularly let AI perform certain tasks, they may practice those abilities less themselves. This raises a real question about which human abilities remain important as AI produces more answers on its own.',
        japanese:
          'AIは仕事を速くし、人々がより多くの情報を処理するのを助け、より難しい問題に集中する余裕を与えてくれるかもしれません。しかし、人々が特定の作業を日常的にAIに任せるようになると、自分自身ではそれらの能力をあまり使わなくなるかもしれません。これは、AIがますます自力で答えを出すようになる中で、どの人間の能力が重要であり続けるのかという、本当の問いを投げかけます。',
        plainEnglish:
          'AI may make work faster. It may help people process more information, so they can focus on harder problems. But if people regularly let AI do certain tasks, they may practice those same abilities less themselves. This raises a real question: which human abilities will still be important, as AI produces more answers by itself?',
        checkQuestion: 'According to this paragraph, what are the two possible sides of AI helping people with tasks?',
      },
      {
        id: 'la-s-reading-01-p4',
        english:
          'These changes also create fear. One is the more immediate fear of losing jobs, roles, or skills as AI takes on more of what people used to do. A more serious concern, raised by some experts, is that future AI could become capable enough that people find it difficult to understand or control — a real concern, not an established fact. Both point to the same underlying shift: the boundary between human work and machine work keeps moving, and as it does, work, education, and the value of human skill may change with it.',
        japanese:
          'こうした変化はまた、不安も生み出します。一つは、より差し迫った不安で、AIが人々のかつての仕事の多くを担うようになるにつれて、仕事や役割、技能を失うのではないかというものです。より深刻な懸念として、一部の専門家が指摘しているのは、将来のAIが十分に高性能になり、人々がそれを理解したり制御したりすることが難しくなるかもしれないというものです——これは本当の懸念ではありますが、確立された事実ではありません。この二つはどちらも、同じ根底にある変化を示しています。すなわち、人間の仕事と機械の仕事の境界は動き続けており、それとともに、仕事や教育、人間の技能の価値も変化していくかもしれないということです。',
        plainEnglish:
          'These changes also create fear. One fear is more immediate: people may lose jobs, roles, or skills as AI does more of what people used to do. A more serious concern, raised by some experts, is that future AI could become capable enough that people find it hard to understand or control. This is a real concern — but it is not an established fact. Both fears point to the same deeper change: the boundary between human work and machine work keeps moving. As it moves, work, education, and the value of human skill may change too.',
        checkQuestion: 'According to this final paragraph, what deeper change do both fears point to?',
      },
    ],

    targetVocabIds: ['la-s-01', 'la-s-02', 'la-s-03', 'la-s-04', 'la-s-05', 'la-s-06', 'la-s-07', 'la-s-08', 'la-s-09', 'la-s-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['concern', 'prediction', 'boundary', 'division', 'range', 'managerial', 'capable', 'process', 'established', 'underlying'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['moving beyond... toward...', 'not an established fact', 'the boundary... keeps moving'],
      },
      {
        type: 'tone-purpose',
        prompt: "Consider the author's tone.",
        note: 'Notice how the passage names a common, simple prediction ("AI will replace many jobs") only to move past it toward a more careful one — and how explicitly it distinguishes a real concern from an established fact ("a real concern, not an established fact") rather than letting the two blur together.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, instead of simply predicting that AI will replace many jobs, what does the passage say may actually happen?',
      explainer: 'In simple words: what does the passage think is a more important change than "AI will replace jobs"?',
      explainerJa: 'この質問は、「『AIが仕事を奪う』という予測よりも重要だと文章が考えている変化とは何か」を聞いています。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'AI will completely take over every part of most jobs.', correct: false },
        { id: 'b', label: 'The division of work between people and AI may shift, with people focusing on different parts of a task.', correct: true },
        { id: 'c', label: 'Very few jobs will change at all.', correct: false },
      ],
      answerParagraphId: 'la-s-reading-01-p2',
      evidencePrompt: 'Which sentence best shows that the passage treats the loss-of-control concern as a possibility, not a proven fact?',
      evidenceOptions: [
        { id: 'e1', label: 'This does not mean AI can do these jobs alone, only that it is becoming part of work that used to depend entirely on people.', paragraphId: 'la-s-reading-01-p1', correct: false },
        { id: 'e2', label: 'This raises a real question about which human abilities remain important as AI produces more answers on its own.', paragraphId: 'la-s-reading-01-p3', correct: false },
        { id: 'e3', label: 'A more serious concern, raised by some experts, is that future AI could become capable enough that people find it difficult to understand or control — a real concern, not an established fact.', paragraphId: 'la-s-reading-01-p4', correct: true },
      ],
      vocabInContext: {
        quote: 'Both point to the same underlying shift: the boundary between human work and machine work keeps moving, and as it does, work, education, and the value of human skill may change with it.',
        question: "What is this conclusion suggesting about how we should think about AI's future impact?",
        options: [
          { id: 'a', label: 'The most important change is simply that AI will eventually do more work than humans.', correct: false },
          { id: 'b', label: 'The deeper pattern is a continually shifting line between what people do and what machines do, which may reshape work, education, and how human skill is valued.', correct: true },
          { id: 'c', label: 'Human skill will become completely worthless once AI is capable enough.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'How do you think AI will change human life in the future? What changes do you think will be important? Explain your ideas.',
      promptJapanese: 'AIは将来、人間の生活をどのように変えると思いますか。どのような変化が重要だと思いますか。あなたの考えを説明してください。',
      minSentences: 4,
      recommendedWordRange: [80, 120],
      wordBank: [
        { vocabId: 'la-s-05', examplePhrase: 'My prediction is that...' },
        { vocabId: 'la-s-07', examplePhrase: 'As AI becomes more capable, I think...' },
        { vocabId: 'la-s-10', examplePhrase: 'I think the underlying reason this matters is...' },
      ],
      usefulExpressions: [
        { phrase: 'I think AI will change...', japanese: 'AIは...を変えると思います' },
        { phrase: 'This change is important because...', japanese: 'この変化が重要なのは...だからです' },
        { phrase: 'In the future, I think...', japanese: '将来、私は...と思います' },
      ],
    },

    takeaway: 'The boundary between human work and machine work keeps moving — and as it does, work, education, and the value of human skill may change with it.',
  },

  // ── Learning from History — Foundation ───────────────────────────────────────
  // Fully rebuilt 2026 — replaces the old anecdotal reading ("The
  // Photograph in the Drawer") with the approved "The Present Is Built on
  // the Past" passage. See docs/THEME_09_MANUSCRIPT.md.

  {
    id: 'lh-f-reading-01',
    themeId: 'learning-from-history',
    level: 'foundation',
    title: 'The Present Is Built on the Past',
    titleJapanese: '現在は過去の上に築かれている',
    estimatedMinutes: 15,
    experienceVersion: 2,
    welcome: 'Today, you will read about why no generation starts from zero — and how the world around you today was built by countless people who came before you.',
    mission: 'As you read, notice how the passage moves from one idea (no generation begins from zero) through one concrete example (a smartphone) and then broadens far beyond technology.',

    preReadingSurvey: {
      question: 'Before you read, which statement is closest to your own thinking?',
      options: [
        { id: 'from-scratch', label: 'Most things today were mainly invented from scratch by the people who use them now.' },
        { id: 'built-on-past', label: 'Almost everything today depends on knowledge and discoveries from long before now.' },
        { id: 'tech-only', label: 'This is mainly true for technology, not for things like schools or laws.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'lh-f-reading-01-p1',
        english:
          'No generation begins from zero. We are born into a world that people before us spent many years building and improving. We inherit their knowledge, ideas, and tools. We use what they created, improve it, and pass it to the next generation. In this way, human knowledge can continue to develop over a very long time.',
        japanese:
          'どの世代も、ゼロから始まるわけではありません。私たちは、私たちより前の人々が長い年月をかけて築き、改良してきた世界に生まれてきます。私たちは彼らの知識やアイデア、道具を受け継ぎます。彼らが作ったものを使い、それを改良し、次の世代へと引き継いでいくのです。こうして、人類の知識は非常に長い時間をかけて発展し続けることができるのです。',
        plainEnglish:
          'No generation begins from zero. We are born into a world that people before us spent many years building and improving. We inherit their knowledge, ideas, and tools. We use what they created. We improve it, and we pass it to the next generation. In this way, human knowledge can keep developing for a very long time.',
        checkQuestion: 'According to this paragraph, what happens to knowledge, ideas, and tools from one generation to the next?',
      },
      {
        id: 'lh-f-reading-01-p2',
        english:
          'Think about a smartphone. It may look like a completely modern invention, but it depends on many earlier discoveries. Electricity, mathematics, communication technology, and computers all had to develop before a smartphone could exist. Different kinds of knowledge were combined to create something new. Even the newest technology is built on developments that came before it.',
        japanese:
          'スマートフォンについて考えてみましょう。それは完全に現代的な発明のように見えるかもしれませんが、実は数多くの過去の発見に支えられています。電気、数学、通信技術、コンピューターは、スマートフォンが存在する前に、それぞれ発展していなければなりませんでした。異なる種類の知識が組み合わさって、新しいものが生み出されたのです。最新の技術でさえ、それ以前にあった発展の上に築かれています。',
        plainEnglish:
          'Think about a smartphone. It may look like a completely modern invention. But it depends on many earlier discoveries. Electricity, mathematics, communication technology, and computers all had to develop first. Only then could a smartphone exist. Different kinds of knowledge were combined to create something new. Even the newest technology is built on developments that came before it.',
        checkQuestion: 'According to this paragraph, what had to happen before a smartphone could exist?',
      },
      {
        id: 'lh-f-reading-01-p3',
        english:
          'The same is true beyond technology. Languages, schools, laws, governments, and ways of learning have also developed over generations. People keep some ideas, change others, and create new ones. The way we live today therefore reflects many choices and developments from the past.',
        japanese:
          '同じことは、技術の分野を超えても当てはまります。言語や学校、法律、政府、学び方なども、何世代にもわたって発展してきました。人々はあるアイデアを残し、あるものを変え、新しいものを作り出します。したがって、私たちが今日生きているあり方は、過去の多くの選択や発展を反映しているのです。',
        plainEnglish:
          'The same is true beyond technology. Languages, schools, laws, governments, and ways of learning have also developed over generations. People keep some ideas. They change other ideas. They create new ones, too. The way we live today reflects many choices and developments from the past.',
        checkQuestion: 'According to this paragraph, is this kind of development limited to technology?',
      },
      {
        id: 'lh-f-reading-01-p4',
        english:
          'History is not only a record of things that happened long ago. The world around us contains the work and knowledge of countless people who lived before us. We can create new things because we do not have to begin again from zero. The present is built on the past.',
        japanese:
          '歴史とは、単に遠い昔に起こったことの記録ではありません。私たちの周りの世界には、私たちより前に生きていた数え切れないほど多くの人々の仕事と知識が詰まっています。私たちが新しいものを生み出せるのは、ゼロからやり直す必要がないからです。現在は、過去の上に築かれているのです。',
        plainEnglish:
          'History is not only a record of things that happened long ago. The world around us contains the work and knowledge of countless people. These people lived before us. We can create new things because we do not have to begin again from zero. The present is built on the past.',
        checkQuestion: 'According to this final paragraph, why can we create new things without starting from zero?',
      },
    ],

    targetVocabIds: ['lh-f-01', 'lh-f-02', 'lh-f-03', 'lh-f-04', 'lh-f-05', 'lh-f-06', 'lh-f-07', 'lh-f-08', 'lh-f-09', 'lh-f-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['generation', 'inherit', 'knowledge', 'develop', 'improve', 'depend on', 'discovery', 'combine', 'reflect', 'countless'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['begins from zero', 'built on', 'the same is true beyond technology'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'Notice the structural move in paragraph 3: "The same is true beyond technology" explicitly signals a shift from the smartphone example to a much bigger claim. The example is only there to make the general idea concrete — it is not the passage\'s real subject.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, why can human knowledge continue to develop over a very long time?',
      explainer: 'In simple words: what allows knowledge to keep growing from generation to generation?',
      explainerJa: 'この質問は、「なぜ人類の知識は世代を超えて発展し続けることができるのか」を聞いています。',
      hint: 'Look at paragraph 1.',
      hintJa: '第1段落を見てみましょう。',
      options: [
        { id: 'a', label: 'Each generation starts completely from zero and creates everything itself.', correct: false },
        { id: 'b', label: 'Each generation inherits, uses, and improves what earlier generations created, then passes it on.', correct: true },
        { id: 'c', label: 'Only scientists and inventors contribute to human knowledge.', correct: false },
      ],
      answerParagraphId: 'lh-f-reading-01-p1',
      evidencePrompt: 'Which sentence best shows that a smartphone depends on much earlier development?',
      evidenceOptions: [
        { id: 'e1', label: 'We inherit their knowledge, ideas, and tools.', paragraphId: 'lh-f-reading-01-p1', correct: false },
        { id: 'e2', label: 'Electricity, mathematics, communication technology, and computers all had to develop before a smartphone could exist.', paragraphId: 'lh-f-reading-01-p2', correct: true },
        { id: 'e3', label: 'People keep some ideas, change others, and create new ones.', paragraphId: 'lh-f-reading-01-p3', correct: false },
      ],
      vocabInContext: {
        quote: 'The present is built on the past.',
        question: 'What is this conclusion suggesting about the world we live in today?',
        options: [
          { id: 'a', label: 'Modern life has almost nothing to do with history.', correct: false },
          { id: 'b', label: 'Today\'s world exists because of the accumulated work, knowledge, and choices of countless people before us.', correct: true },
          { id: 'c', label: 'Only technology depends on the past — things like laws and languages do not.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Think of something in your own life — a skill, a tool, a tradition, or even your school — that exists today because of work done by people before you. What is it, and what do you know about how it started or developed?',
      promptJapanese: 'あなたの生活の中にあるもの——技能、道具、伝統、あるいはあなたの学校でもかまいません——で、あなたより前の人々の努力があったからこそ今存在しているものを一つ考えてください。それは何ですか。また、それがどのように始まった、あるいは発展してきたか、知っていることはありますか。',
      minSentences: 3,
      sentenceStarters: ['Something in my life that comes from the past is...', 'It started when...', 'People before me...'],
      wordBank: [
        { vocabId: 'lh-f-01', examplePhrase: 'This has been passed down for generations...' },
        { vocabId: 'lh-f-02', examplePhrase: 'I inherited this from...' },
        { vocabId: 'lh-f-05', examplePhrase: 'People have improved it by...' },
      ],
      usefulExpressions: [
        { phrase: 'Something in my life that comes from the past is...', japanese: '私の生活の中で過去から続いているものは...' },
        { phrase: 'It started when...', japanese: 'それは...のときに始まりました' },
        { phrase: 'People before me...', japanese: '私より前の人々は...' },
      ],
    },

    takeaway: 'The present is built on the past — every generation inherits, uses, and improves what came before, and passes something further along.',
  },

  // ── Learning from History — Advanced ─────────────────────────────────────────
  // New — Theme 9 previously had no Advanced level. Built against the
  // approved "Why Do People Repeat the Same Mistakes?" passage. See
  // docs/THEME_09_MANUSCRIPT.md.

  {
    id: 'lh-s-reading-01',
    themeId: 'learning-from-history',
    level: 'advanced',
    title: 'Why Do People Repeat the Same Mistakes?',
    titleJapanese: 'なぜ人は同じ過ちを繰り返すのか',
    estimatedMinutes: 20,
    experienceVersion: 2,
    welcome: 'Today, you will explore a real contradiction: humans are remarkably good at passing knowledge from one generation to the next — so why do similar mistakes keep happening?',
    mission: 'As you read, notice how the passage separates knowing something from actually experiencing it, and how it connects historical mistakes to human motives that have not disappeared.',

    preReadingSurvey: {
      question: 'Which statement is closest to your own thinking?',
      options: [
        { id: 'not-enough-info', label: 'People repeat mistakes mainly because they do not know enough history.' },
        { id: 'knowledge-not-enough', label: 'People can know history well and still repeat mistakes, for other reasons.' },
        { id: 'no-repeat', label: 'People do not really repeat the same kinds of mistakes.' },
        { id: 'unsure', label: "I'm not sure." },
      ],
    },

    paragraphs: [
      {
        id: 'lh-s-reading-01-p1',
        english:
          'Human beings are very good at passing knowledge from one generation to another. We know about wars, conflicts, failed governments, and other mistakes from the past. We can study their causes and consequences. Yet similar mistakes continue to happen. If we know so much about the past, why is it so difficult to learn from it?',
        japanese:
          '人間は、知識をある世代から次の世代へと伝えることに非常に長けています。私たちは、過去の戦争や紛争、失敗した政府、その他の過ちについて知っています。それらの原因と結果を研究することもできます。それにもかかわらず、似たような過ちは今も起こり続けています。過去についてこれほど多くを知っているのに、なぜそこから学ぶことがこれほど難しいのでしょうか。',
        plainEnglish:
          'Human beings are very good at passing knowledge from one generation to another. We know about wars, conflicts, failed governments, and other mistakes from the past. We can study their causes and results. Yet similar mistakes keep happening. If we know so much about the past, why is it so hard to learn from it?',
        checkQuestion: 'According to this paragraph, what is the puzzle the passage is about to explore?',
      },
      {
        id: 'lh-s-reading-01-p2',
        english:
          'One reason may be that knowing something is not the same as experiencing it. People can read about suffering, fear, or loss, but they do not feel what people at that time actually felt. As generations pass, the experience disappears while the information remains. A lesson that seems clear when we look back at history may feel very different when we face a new situation ourselves.',
        japanese:
          'その理由の一つは、何かを知っていることと、それを実際に経験することは同じではない、という点にあるのかもしれません。人々は苦しみや恐怖、喪失について読むことはできますが、当時の人々が実際に感じたことそのものを感じることはできません。世代が移り変わるにつれて、経験そのものは失われていき、情報だけが残ります。歴史を振り返ったときには明白に思える教訓も、私たち自身が新しい状況に直面したときには、まったく違って感じられるかもしれません。',
        plainEnglish:
          'One reason may be this: knowing something is not the same as experiencing it. People can read about suffering, fear, or loss. But they do not feel what people at that time actually felt. As generations pass, the experience disappears. The information stays. A lesson may seem clear when we look back at history. But it may feel very different when we face a new situation ourselves.',
        checkQuestion: 'According to this paragraph, what is the difference between knowing about the past and experiencing it?',
      },
      {
        id: 'lh-s-reading-01-p3',
        english:
          'There is another problem. Many historical mistakes are connected to human motives and desires that have not disappeared. People still feel jealousy, fear, pride, hatred, and the desire for greater wealth or control. They may want revenge when they believe they have been harmed. Retaliation may then seem justified, even when people know that similar actions created more conflict in the past. The situation may be new, but some of the forces behind it are not.',
        japanese:
          'もう一つの問題があります。多くの歴史的な過ちは、消えることのなかった人間の動機や欲望と結びついています。人々は今でも、嫉妬、恐怖、プライド、憎しみ、そしてより大きな富や支配への欲望を感じます。人は自分が害を受けたと信じるとき、復讐を望むことがあります。そのとき、報復は正当なことのように思えるかもしれません——たとえ、似たような行動がかつてさらなる争いを生んだと知っていたとしても。状況は新しくても、その背後にある力の一部は新しくないのです。',
        plainEnglish:
          'There is another problem, too. Many historical mistakes are connected to human motives and desires. These motives and desires have not disappeared. People still feel jealousy, fear, pride, hatred, and the desire for greater wealth or control. They may want revenge when they believe they have been harmed. Then retaliation may seem justified. This happens even when people know that similar actions caused more conflict in the past. The situation may be new. But some of the forces behind it are not.',
        checkQuestion: 'According to this paragraph, what kind of human motives does the passage say have not disappeared?',
      },
      {
        id: 'lh-s-reading-01-p4',
        english:
          'Human knowledge has changed enormously, but human nature may have changed much less. History can preserve information about what happened, but it cannot remove the emotions and desires that influence human decisions. This does not mean that people never learn from history. Perhaps learning from history begins by recognizing that some of the forces that shaped the past still exist in ourselves today.',
        japanese:
          '人間の知識は非常に大きく変化してきましたが、人間の本性はそれほど変わっていないのかもしれません。歴史は何が起こったかという情報を残すことはできますが、人間の決定に影響を与える感情や欲望を取り除くことはできません。だからといって、人々が歴史から決して学ばないというわけではありません。歴史から学ぶということは、もしかすると、過去を形作った力の一部が今も私たちの中に存在していると気づくことから始まるのかもしれません。',
        plainEnglish:
          'Human knowledge has changed enormously. But human nature may have changed much less. History can preserve information about what happened. But it cannot remove the emotions and desires that influence human decisions. This does not mean that people never learn from history. Perhaps learning from history begins with recognizing something: some of the forces that shaped the past still exist in ourselves today.',
        checkQuestion: 'According to this final paragraph, what does learning from history perhaps begin with?',
      },
    ],

    targetVocabIds: ['lh-s-01', 'lh-s-02', 'lh-s-03', 'lh-s-04', 'lh-s-05', 'lh-s-06', 'lh-s-07', 'lh-s-08', 'lh-s-09', 'lh-s-10'],

    noticeLanguage: [
      {
        type: 'target-vocab',
        prompt: 'Find today’s target vocabulary as you read the passage.',
        items: ['motive', 'desire', 'revenge', 'retaliation', 'justified', 'nature', 'preserve', 'recognize', 'experience', 'force'],
      },
      {
        type: 'expressions',
        prompt: 'Notice these useful expressions.',
        items: ['not the same as', 'even when people know that...', 'begins by recognizing that...'],
      },
      {
        type: 'paragraph-organization',
        prompt: 'Consider how the passage is organized.',
        note: 'Notice that the passage opens with a puzzle in paragraph 1 ("why is it so difficult to learn from it?") and does not answer it immediately — each following paragraph adds one more layer to the answer (experience vs. knowledge, then motives, then human nature) before the conclusion.',
      },
    ],

    missionCheck: {
      question: 'According to the passage, what is one reason it may be difficult to learn from history, even though we know so much about the past?',
      explainer: 'In simple words: what does the passage say gets lost, even when historical information survives?',
      explainerJa: 'この質問は、「過去についての情報が残っていても、失われてしまうものは何か」を聞いています。',
      hint: 'Look at paragraph 2.',
      hintJa: '第2段落を見てみましょう。',
      options: [
        { id: 'a', label: 'People do not have access to enough historical information.', correct: false },
        { id: 'b', label: 'Knowing about something is not the same as experiencing it — the original experience disappears while the information remains.', correct: true },
        { id: 'c', label: 'Historical records are usually inaccurate.', correct: false },
      ],
      answerParagraphId: 'lh-s-reading-01-p2',
      evidencePrompt: 'Which sentence best shows that human motives connected to historical mistakes have not disappeared?',
      evidenceOptions: [
        { id: 'e1', label: 'We can study their causes and consequences.', paragraphId: 'lh-s-reading-01-p1', correct: false },
        { id: 'e2', label: 'People still feel jealousy, fear, pride, hatred, and the desire for greater wealth or control.', paragraphId: 'lh-s-reading-01-p3', correct: true },
        { id: 'e3', label: 'History can preserve information about what happened.', paragraphId: 'lh-s-reading-01-p4', correct: false },
      ],
      vocabInContext: {
        quote: 'Perhaps learning from history begins by recognizing that some of the forces that shaped the past still exist in ourselves today.',
        question: 'What is this conclusion suggesting about the relationship between historical knowledge and human nature?',
        options: [
          { id: 'a', label: 'Because human knowledge has grown so much, human nature has changed in the same way.', correct: false },
          { id: 'b', label: 'Knowledge can be passed on more easily than human nature changes, so recognizing these forces in ourselves may be part of truly learning from history.', correct: true },
          { id: 'c', label: 'People in the past were fundamentally different from people today.', correct: false },
        ],
      },
    },

    writing: {
      prompt: 'Is there something you think people should not repeat in the future? Or is there something you have done in the past that you would not want to repeat? Explain what happened and what you learned from it.',
      promptJapanese: '将来、人々が繰り返すべきではないと思うことはありますか。あるいは、あなた自身が過去に行ったことで、二度と繰り返したくないと思うことはありますか。何が起こったのか、そしてそこから何を学んだのかを説明してください。',
      minSentences: 4,
      recommendedWordRange: [80, 120],
      wordBank: [
        { vocabId: 'lh-s-01', examplePhrase: 'I think the main motive was...' },
        { vocabId: 'lh-s-05', examplePhrase: 'At the time, it might have felt justified because...' },
        { vocabId: 'lh-s-08', examplePhrase: 'Looking back, I can recognize that...' },
      ],
      usefulExpressions: [
        { phrase: 'Something I would not want to repeat is...', japanese: '私が繰り返したくないことは...' },
        { phrase: 'This happened because...', japanese: 'これが起こったのは...だからです' },
        { phrase: 'What I learned from this is...', japanese: 'これから学んだことは...' },
      ],
    },

    takeaway: 'Knowledge can be passed from one generation to the next far more easily than experience can — and because human motives like fear, pride, and the desire for revenge persist, knowing history does not automatically stop people from repeating it.',
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
