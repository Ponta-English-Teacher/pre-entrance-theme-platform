import type { Level } from '@/types';

export interface ReadingParagraph {
  id: string;
  english: string;
  japanese: string;
}

export interface ReadingPassage {
  id: string;
  themeId: string;
  level: Level;
  title: string;
  titleJapanese: string;
  estimatedMinutes: number;
  paragraphs: ReadingParagraph[];
}

export const MASTER_READINGS: ReadingPassage[] = [

  // ── Knowing Myself — Foundation ──────────────────────────────────────────

  {
    id: 'km-f-reading-01',
    themeId: 'knowing-myself',
    level: 'foundation',
    title: 'Who Am I?',
    titleJapanese: '私は誰？',
    estimatedMinutes: 6,
    paragraphs: [
      {
        id: 'km-f-reading-01-p1',
        english:
          "Have you ever asked yourself, ‘Who am I?’ Your identity is not just your name or where you come from. It is made of your experiences, your beliefs, and the people around you. As you finish high school and prepare for university, this is a good time to think carefully about your own identity.",
        japanese:
          '「自分は誰だろう？」と考えたことはありますか。アイデンティティとは、名前や出身地だけではありません。それはあなたの経験や信念、そして周りの人々によって形づくられるものです。高校を卒業し、大学へ進む準備をしている今こそ、自分自身のアイデンティティについてじっくり考える良い機会です。',
      },
      {
        id: 'km-f-reading-01-p2',
        english:
          'One part of your identity is your values — the ideas about what is important to you. For example, some people value honesty. Other people value creativity or kindness. Knowing your values can help you make good decisions and set meaningful goals for your future.',
        japanese:
          'アイデンティティの一部は「価値観」、つまり自分にとって何が大切かという考え方です。例えば、正直さを大切にする人もいれば、創造性や優しさを大切にする人もいます。自分の価値観を知ることは、良い決断をし、将来の意味のある目標を立てる助けになります。',
      },
      {
        id: 'km-f-reading-01-p3',
        english:
          'Everyone has different strengths. Maybe you are good at solving problems, or maybe you are a great listener. Recognizing your strengths builds confidence. When you believe in yourself, it becomes easier to try new things — like studying at a university, meeting new people, or joining a club.',
        japanese:
          '誰にでも異なる強みがあります。問題を解決するのが得意な人もいれば、人の話をよく聞くのが得意な人もいるでしょう。自分の強みを知ることは自信につながります。自分を信じられるようになると、大学で学んだり、新しい人と出会ったり、部活動に参加したりといった新しいことに挑戦しやすくなります。',
      },
      {
        id: 'km-f-reading-01-p4',
        english:
          'Your character also shapes who you are. Character includes qualities like honesty, patience, and kindness. Unlike strengths, character is something you can keep building throughout your life, through the choices you make every day.',
        japanese:
          '「人格」もまた、あなたがどんな人であるかを形づくります。人格には、正直さ、忍耐強さ、優しさといった資質が含まれます。強みとは異なり、人格は日々の選択を通して、人生を通じてずっと育て続けることができるものです。',
      },
      {
        id: 'km-f-reading-01-p5',
        english:
          'Take a moment to reflect on your own identity. What do you value? What are your strengths? What kind of character do you want to have? Sharing your thoughts with friends, teachers, or family can help you understand yourself even better.',
        japanese:
          '少し立ち止まって、自分自身のアイデンティティについて振り返ってみましょう。あなたは何を大切にしていますか。あなたの強みは何ですか。どんな人格を持ちたいですか。友人や先生、家族と自分の考えを共有することで、自分自身をより深く理解する助けになります。',
      },
      {
        id: 'km-f-reading-01-p6',
        english:
          'Starting university is a new chapter. It is a chance to explore new ideas, meet different people, and discover more about who you are. The more you understand your own identity, the more confidently you can walk into this next stage of your life.',
        japanese:
          '大学生活の始まりは、新しい章の始まりです。それは新しい考えに触れ、様々な人と出会い、自分自身についてさらに発見していくチャンスです。自分のアイデンティティを理解すればするほど、人生の次の段階に自信を持って踏み出すことができるでしょう。',
      },
    ],
  },

];

export function getReadingById(id: string): ReadingPassage | undefined {
  return MASTER_READINGS.find(r => r.id === id);
}

export function getReadingsByTheme(themeId: string, level: Level): ReadingPassage[] {
  return MASTER_READINGS.filter(r => r.themeId === themeId && r.level === level);
}
