'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReadingLesson } from '@/data/reading/masterReadings';
import {
  getReadingProgress,
  saveReadingPreReadingChoice,
  saveReadingMissionCheck,
  saveReadingVocabInContext,
  markReadingViewed,
  markReadingComplete,
  markActivityComplete,
} from '@/lib/store';
import NoticeLanguageSection from '@/components/reading/NoticeLanguageSection';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import LevelBadge from '@/components/LevelBadge';

/**
 * V2 of the Reading lesson view — used only by Theme 1 Foundation during this
 * prototype stage (see `ReadingLesson.experienceVersion` and
 * src/app/reading/page.tsx). The original ReadingLessonView.tsx is
 * deliberately left untouched and still serves every other theme.
 *
 * Differences from V1, per the approved Theme 1 improvement decisions:
 * - Ask AI (ContextualHelpButton) removed entirely — the Selection Assistant
 *   now covers text support (Translate / How to Read / Easy English).
 * - Original / Simplified reading toggle added.
 * - Writing, its Toolkit, Review, and the Continue screen are no longer on
 *   this page — Writing is now its own activity (see WritingActivity.tsx).
 *   Reading now finishes naturally right after Mission Check.
 * Vocabulary Check and narrowed/interactive Notice Language and bilingual
 * Mission Check are later, not-yet-started phases; this file matches V1 in
 * those areas for now.
 */

export default function ReadingLessonViewV2({
  lesson,
  themeId,
  backHref,
}: {
  lesson: ReadingLesson;
  themeId: string;
  backHref: string;
}) {
  const router = useRouter();
  const lastParagraphRef = useRef<HTMLDivElement>(null);

  const [preReadingChoice, setPreReadingChoice] = useState<string | null>(null);
  const [readingViewed, setReadingViewed] = useState(false);
  const [readingMode, setReadingMode] = useState<'original' | 'simplified'>('original');
  const [missionCheckAnswer, setMissionCheckAnswer] = useState<string | null>(null);
  const [evidenceChoice, setEvidenceChoice] = useState<string | null>(null);
  const [vocabInContextAnswer, setVocabInContextAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showIncompleteNote, setShowIncompleteNote] = useState(false);

  useEffect(() => {
    const progress = getReadingProgress(lesson.id);
    setPreReadingChoice(progress.preReadingChoice);
    setReadingViewed(progress.readingViewed);
    setMissionCheckAnswer(progress.missionCheckAnswer);
    setEvidenceChoice(progress.evidenceChoice);
    setVocabInContextAnswer(progress.vocabInContextAnswer);
    setCompleted(progress.completed);
    setHydrated(true);
  }, [lesson.id]);

  // Reading-completion signal: the last paragraph becoming visible, not a heavier
  // "read every word" measure — per READING_WRITING_EXPERIENCE_DESIGN.md §7.
  useEffect(() => {
    if (!hydrated || readingViewed) return;
    const el = lastParagraphRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setReadingViewed(true);
          markReadingViewed(lesson.id);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hydrated, readingViewed, lesson.id]);

  // Selected option lookups, for immediate correct/incorrect feedback — the
  // student can pick again, so these simply reflect whatever is chosen right now.
  const missionCheckSelected = lesson.missionCheck.options.find(o => o.id === missionCheckAnswer);
  const evidenceSelected = lesson.missionCheck.evidenceOptions.find(o => o.id === evidenceChoice);
  const vocabInContextSelected = lesson.missionCheck.vocabInContext.options.find(o => o.id === vocabInContextAnswer);

  function handlePreReadingChoice(optionId: string) {
    setPreReadingChoice(optionId);
    saveReadingPreReadingChoice(lesson.id, optionId);
  }

  function handleMissionCheckAnswer(optionId: string) {
    setMissionCheckAnswer(optionId);
    saveReadingMissionCheck(lesson.id, optionId, evidenceChoice);
  }

  function handleEvidenceChoice(optionId: string) {
    setEvidenceChoice(optionId);
    saveReadingMissionCheck(lesson.id, missionCheckAnswer, optionId);
  }

  function handleVocabInContextAnswer(optionId: string) {
    setVocabInContextAnswer(optionId);
    saveReadingVocabInContext(lesson.id, optionId);
  }

  // Completion depends only on things the student did — never on whether AI feedback
  // was requested, succeeded, or was read. Per READING_WRITING_EXPERIENCE_DESIGN.md §7.
  // Writing is no longer part of Reading's own completion — it's a separate
  // activity now (see WritingActivity.tsx), with its own completion signal.
  const thinkAnswered = missionCheckAnswer !== null && evidenceChoice !== null && vocabInContextAnswer !== null;
  const readyToComplete = readingViewed && thinkAnswered;

  function handleFinish() {
    if (completed) {
      router.push(`/themes/${themeId}/${lesson.level}`);
      return;
    }
    if (!readyToComplete) {
      setShowIncompleteNote(true);
      return;
    }
    markReadingComplete(lesson.id);
    markActivityComplete(themeId, 'reading');
    setCompleted(true);
    // No Continue screen for Reading anymore — it finishes naturally and
    // returns to the activity list, where Writing is the recommended next step.
    router.push(`/themes/${themeId}/${lesson.level}`);
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50/50 via-white to-white">
      {/* Header, Mission, Before You Read — comfortable reading measure */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <LevelBadge level={lesson.level} />
            <h1 className="text-2xl sm:text-[36px] font-bold text-slate-900 tracking-tight leading-tight mt-2">{lesson.title}</h1>
            <p className="text-base sm:text-[22px] font-medium text-indigo-500 mt-1">{lesson.titleJapanese}</p>
            <SelectableContent activityType="reading" themeId={themeId} level={lesson.level} label="Introduction">
              <p className="text-base sm:text-lg text-slate-600 mt-2 sm:mt-3 leading-relaxed max-w-2xl">{lesson.welcome}</p>
            </SelectableContent>
          </div>
          <Link
            href={backHref}
            className="text-base text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap mt-1 shrink-0"
          >
            ✕ Exit
          </Link>
        </div>

        {/* Compact pre-reading preparation panel — Mission and Before You Read
            share one light container (no gradient, minimal chrome) instead of
            two large independent cards, so the Reading itself remains the
            visually dominant element on the page. */}
        <div className="mb-6 sm:mb-8 rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-5 sm:px-6 sm:py-6">
          <div>
            <SectionLabel icon="🚩" tone="violet" title="Your Mission" />
            <SelectableContent activityType="reading" themeId={themeId} level={lesson.level} label="Your Mission">
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed mt-2">{lesson.mission}</p>
            </SelectableContent>
          </div>

          <div className="my-5 border-t border-slate-200" aria-hidden="true" />

          <div>
            <SectionLabel icon="🤔" tone="sky" title="Before You Read" />
            <SelectableContent activityType="reading" themeId={themeId} level={lesson.level} label="Before You Read">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed mt-2 mb-3">{lesson.preReadingSurvey.question}</p>
            </SelectableContent>
            <div className="flex flex-col gap-2">
              {lesson.preReadingSurvey.options.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handlePreReadingChoice(opt.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-base sm:text-lg leading-relaxed font-medium transition-colors ${
                    preReadingChoice === opt.id
                      ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reading — the widest band on the page, a magazine-style column */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        <StepBadge tone="amber" step="Step 1" icon="📖" title="Reading" />

        {/* Original / Simplified toggle */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-5">
          <div className="inline-flex rounded-full border border-amber-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setReadingMode('original')}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                readingMode === 'original' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setReadingMode('simplified')}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                readingMode === 'simplified' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Simplified
            </button>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-100 rounded-3xl p-1.5 sm:p-5 shadow-sm">
          <div className="bg-[#FFFCF4] rounded-2xl border border-amber-100/70 shadow-sm shadow-inner px-3 py-6 sm:px-10 sm:py-14">
            <div className="flex flex-col">
              {lesson.paragraphs.map((paragraph, i) => (
                <div
                  key={paragraph.id}
                  ref={i === lesson.paragraphs.length - 1 ? lastParagraphRef : undefined}
                  // Mobile: a plain stack — no reserved left column for the
                  // number badge, so the passage text gets the full card
                  // width. Desktop (sm:) restores the original two-column
                  // grid with the badge in its own column.
                  className={`flex flex-col sm:grid sm:grid-cols-[4rem_1fr] sm:gap-6 ${i > 0 ? 'mt-8 sm:mt-12' : ''}`}
                >
                  {/* Paragraph number — desktop only; its own column. */}
                  <div className="hidden sm:block pt-1" aria-hidden="true">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-200 text-amber-700 font-semibold text-lg">
                      {i + 1}
                    </span>
                  </div>

                  {/* Passage text — the visual centerpiece of the page */}
                  <div>
                    {/* Mobile: compact number + label on one row, no reserved
                        column. Desktop: number lives in its own column above,
                        so only the label appears here. */}
                    <div className="flex sm:hidden items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-amber-200 text-amber-700 font-semibold text-xs" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-700/70 uppercase tracking-wider">
                        Paragraph {i + 1}
                      </span>
                    </div>
                    <div className="hidden sm:block mb-3">
                      <span className="text-xs font-bold text-amber-700/70 uppercase tracking-wider">
                        Paragraph {i + 1}
                      </span>
                    </div>
                    <SelectableContent activityType="reading" themeId={themeId} level={lesson.level} label="Reading Passage">
                      {/* Justification is desktop-only: tested on real mobile
                          devices, the passage column is too narrow at any
                          reasonable phone width for justified text to look
                          good — it produces large, uneven word gaps. Left-
                          aligned (ragged right) on mobile, justified from the
                          sm: breakpoint up, where the column is wide enough. */}
                      <p className="font-serif text-xl sm:text-[27px] leading-relaxed sm:leading-[1.75] text-stone-800 text-left sm:text-justify">
                        {readingMode === 'original' ? paragraph.english : paragraph.plainEnglish}
                      </p>
                    </SelectableContent>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Language, Mission Check, Your Turn, Review — back to the comfortable measure */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        {/* Notice Language — non-gating, presentational, between Reading and Mission Check.
            Unchanged from V1 in this phase — narrowing its purpose is a later phase. */}
        <Card tone="yellow" className="mb-10">
          <CardHeading icon="🔍" tone="yellow" title="Notice Language" />
          <NoticeLanguageSection activities={lesson.noticeLanguage} themeId={themeId} level={lesson.level} />
        </Card>

        {/* Mission Check — three equal, independent task cards, one learning area.
            Bilingual text is a later phase; Ask AI removed, no replacement wired yet. */}
        <div className="mb-10">
          <StepBadge tone="emerald" step="Step 2" icon="🧠" title="Comprehension Check（理解チェック）" />
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-3xl p-3 sm:p-5 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* Understanding (formerly "Task 1") */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 1</span>
                  <span className="inline-block px-2.5 py-1 rounded-full text-[13px] font-bold bg-emerald-50 text-emerald-700">
                    Understanding（内容理解）
                  </span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">❓ Question</p>
                <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Choose the Answer">
                  <p className="text-[26px] font-bold text-slate-900 mb-2 leading-snug">{lesson.missionCheck.question}</p>
                </SelectableContent>
                <p className="text-[15px] font-semibold text-emerald-700 mb-5">Choose ONE answer.</p>
                <div className="flex flex-col gap-2">
                  {lesson.missionCheck.options.map(opt => {
                    const isSelected = missionCheckAnswer === opt.id;
                    return (
                      <div
                        key={opt.id}
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          // A drag-select or a multi-click (double/triple-click, used to
                          // select a word or line) — not a deliberate choice.
                          if (e.detail > 1 || window.getSelection()?.toString()) return;
                          handleMissionCheckAnswer(opt.id);
                        }}
                        onKeyDown={e => {
                          if (e.key !== 'Enter' && e.key !== ' ') return;
                          e.preventDefault();
                          handleMissionCheckAnswer(opt.id);
                        }}
                        className={`cursor-pointer text-left px-4 py-3 rounded-xl border text-[22px] leading-snug transition-colors ${
                          !isSelected
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                            : opt.correct
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-rose-50 border-rose-400 text-rose-700'
                        }`}
                      >
                        <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Answer Option">
                          {opt.label}
                        </SelectableContent>
                      </div>
                    );
                  })}
                </div>
                {missionCheckSelected && <MissionCheckFeedback correct={missionCheckSelected.correct} />}
              </div>

              {/* Supporting Evidence (formerly "Task 2") */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 2</span>
                  <span className="inline-block px-2.5 py-1 rounded-full text-[13px] font-bold bg-emerald-50 text-emerald-700">
                    Supporting Evidence（根拠を見つけよう）
                  </span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">❓ Question</p>
                <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Supporting Evidence">
                  <p className="text-[26px] font-bold text-slate-900 mb-2 leading-snug">{lesson.missionCheck.evidencePrompt}</p>
                </SelectableContent>
                <p className="text-[15px] font-semibold text-emerald-700 mb-5">Choose the BEST supporting evidence.</p>
                <div className="flex flex-col gap-2">
                  {lesson.missionCheck.evidenceOptions.map(opt => {
                    const paraNum = lesson.paragraphs.findIndex(p => p.id === opt.paragraphId) + 1;
                    const isSelected = evidenceChoice === opt.id;
                    return (
                      <div
                        key={opt.id}
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          // A drag-select or a multi-click (double/triple-click, used to
                          // select a word or line) — not a deliberate choice.
                          if (e.detail > 1 || window.getSelection()?.toString()) return;
                          handleEvidenceChoice(opt.id);
                        }}
                        onKeyDown={e => {
                          if (e.key !== 'Enter' && e.key !== ' ') return;
                          e.preventDefault();
                          handleEvidenceChoice(opt.id);
                        }}
                        className={`cursor-pointer text-left px-4 py-3 rounded-xl border text-[22px] leading-snug transition-colors ${
                          !isSelected
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                            : opt.correct
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-rose-50 border-rose-400 text-rose-700'
                        }`}
                      >
                        <span className="block text-sm font-medium text-slate-500 mb-1.5">Paragraph {paraNum}</span>
                        <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Evidence Option">
                          <span className="font-serif italic">{opt.label}</span>
                        </SelectableContent>
                      </div>
                    );
                  })}
                </div>
                {evidenceSelected && <MissionCheckFeedback correct={evidenceSelected.correct} />}
              </div>

              {/* Vocabulary in Context (formerly "Task 3") */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 3</span>
                  <span className="inline-block px-2.5 py-1 rounded-full text-[13px] font-bold bg-emerald-50 text-emerald-700">
                    Vocabulary in Context（文脈から語句の意味を考えよう）
                  </span>
                </div>
                <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Vocabulary in Context">
                  <p className="font-serif italic text-slate-600 border-l-2 border-emerald-200 pl-3 mb-3 text-[15px] leading-snug">
                    &ldquo;{lesson.missionCheck.vocabInContext.quote}&rdquo;
                  </p>
                </SelectableContent>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">❓ Question</p>
                <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Vocabulary in Context">
                  <p className="text-[26px] font-bold text-slate-900 mb-2 leading-snug">{lesson.missionCheck.vocabInContext.question}</p>
                </SelectableContent>
                <p className="text-[15px] font-semibold text-emerald-700 mb-5">Choose the correct meaning.</p>
                <div className="flex flex-col gap-2">
                  {lesson.missionCheck.vocabInContext.options.map(opt => {
                    const isSelected = vocabInContextAnswer === opt.id;
                    return (
                      <div
                        key={opt.id}
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          // A drag-select or a multi-click (double/triple-click, used to
                          // select a word or line) — not a deliberate choice.
                          if (e.detail > 1 || window.getSelection()?.toString()) return;
                          handleVocabInContextAnswer(opt.id);
                        }}
                        onKeyDown={e => {
                          if (e.key !== 'Enter' && e.key !== ' ') return;
                          e.preventDefault();
                          handleVocabInContextAnswer(opt.id);
                        }}
                        className={`cursor-pointer text-left px-4 py-3 rounded-xl border text-[22px] leading-snug transition-colors ${
                          !isSelected
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                            : opt.correct
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-rose-50 border-rose-400 text-rose-700'
                        }`}
                      >
                        <SelectableContent activityType="mission-check" themeId={themeId} level={lesson.level} label="Mission Check — Vocabulary Option">
                          {opt.label}
                        </SelectableContent>
                      </div>
                    );
                  })}
                </div>
                {vocabInContextSelected && <MissionCheckFeedback correct={vocabInContextSelected.correct} />}
              </div>
            </div>
          </div>
        </div>

        {/* Reading finishes naturally right after Mission Check — no Review,
            no Continue screen. Writing is the next activity, chosen by the
            student from the Activity List. */}
        <div className="mb-4">
          {showIncompleteNote && !readyToComplete && (
            <p className="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3 text-center">
              {!readingViewed && 'Finish reading the passage, '}
              {!thinkAnswered && 'answer the Think questions, '}
              and then complete the lesson.
            </p>
          )}
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            {completed ? 'Done — Back to Activities' : '🎉 Complete Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** A soft-tinted card wrapper for non-gating sections (Notice Language). Mission
 *  and Before You Read moved to the compact SectionLabel treatment below. */
const CARD_TONE: Record<string, string> = {
  yellow: 'bg-yellow-50/80 border-yellow-100',
};

function Card({ tone, className = '', children }: { tone: keyof typeof CARD_TONE; className?: string; children: React.ReactNode }) {
  return <div className={`${CARD_TONE[tone]} border rounded-3xl shadow-sm p-6 sm:p-8 ${className}`}>{children}</div>;
}

/** Immediate correct/incorrect feedback for a Mission Check task, shown right under its
 *  answer choices. Never reveals the correct answer on an incorrect pick — the student
 *  can simply choose again. */
function MissionCheckFeedback({ correct }: { correct: boolean }) {
  return (
    <p className={`mt-3 text-[15px] font-bold ${correct ? 'text-emerald-700' : 'text-rose-600'}`}>
      {correct ? '✅ Correct! Well done.' : '❌ Not quite. Try again.'}
    </p>
  );
}

const HEADING_TONE: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-800',
};

function CardHeading({ icon, tone, title }: { icon: string; tone: keyof typeof HEADING_TONE; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${HEADING_TONE[tone]}`} aria-hidden="true">
        {icon}
      </span>
      <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
    </div>
  );
}

/** Compact label for the pre-reading panel's two zones (Mission, Before You
 *  Read) — an icon + small-caps heading, matching the scale already used for
 *  the Mission Check task pills rather than a full page-level heading. */
const SECTION_LABEL_TONE: Record<string, string> = {
  violet: 'text-violet-700',
  sky: 'text-sky-700',
};

function SectionLabel({ icon, tone, title }: { icon: string; tone: keyof typeof SECTION_LABEL_TONE; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true">{icon}</span>
      <h2 className={`text-[13px] font-bold uppercase tracking-wider ${SECTION_LABEL_TONE[tone]}`}>{title}</h2>
    </div>
  );
}

/** The badge+heading treatment for the four numbered, gated steps (Reading, Mission
 *  Check, Your Turn, Review) — a centered pill above a bold heading, flanked by
 *  hairline rules, matching the approved chapter-style layout with a colored pill in
 *  place of the original plain caption. */
const STEP_BADGE_TONE: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800',
  emerald: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
};

function StepBadge({
  tone,
  step,
  icon,
  title,
}: {
  tone: keyof typeof STEP_BADGE_TONE;
  step: string;
  icon: string;
  title: string;
}) {
  return (
    <div className="mb-3 sm:mb-5 flex items-center justify-center gap-3 sm:gap-4">
      <span className="h-px flex-1 bg-slate-200" />
      {/* min-w-0 (not shrink-0) is required here: without it, a flex item
          refuses to shrink below its unwrapped content width, which forced
          long bilingual titles like "Comprehension Check（理解チェック）" to
          overflow the viewport on narrow phones instead of wrapping. */}
      <div className="text-center min-w-0 px-1">
        <span className={`inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-sm sm:text-[18px] font-bold uppercase tracking-[0.1em] mb-1.5 sm:mb-2 ${STEP_BADGE_TONE[tone]}`}>
          {step}
        </span>
        <h2 className="text-xl sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight text-balance">
          <span aria-hidden="true">{icon} </span>
          {title}
        </h2>
      </div>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
