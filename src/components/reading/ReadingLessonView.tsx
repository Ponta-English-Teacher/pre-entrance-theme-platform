'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReadingLesson } from '@/data/reading/masterReadings';
import { getVocabById, type VocabEntry } from '@/data/vocabulary/masterVocabulary';
import {
  getReadingProgress,
  saveReadingPreReadingChoice,
  saveReadingMissionCheck,
  saveReadingDraft,
  markReadingComplete,
  markActivityComplete,
} from '@/lib/store';
import {
  PARAGRAPH_HELP_OPTIONS,
  MISSION_CHECK_HELP_OPTIONS,
  WRITING_HELP_OPTIONS,
  type HelpContext,
} from '@/lib/aiAssistant';
import ContextualHelpButton from '@/components/reading/ContextualHelpButton';
import WordBank from '@/components/reading/WordBank';
import ProgressBar from '@/components/ProgressBar';
import WritingTutor, { type WritingTutorHandle } from '@/components/writing-tutor/WritingTutor';

const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

export default function ReadingLessonView({
  lesson,
  themeId,
  backHref,
}: {
  lesson: ReadingLesson;
  themeId: string;
  backHref: string;
}) {
  const router = useRouter();
  const writingTutorRef = useRef<WritingTutorHandle>(null);

  const [activeHelpId, setActiveHelpId] = useState<string | null>(null);
  const [preReadingChoice, setPreReadingChoice] = useState<string | null>(null);
  const [missionCheckAnswer, setMissionCheckAnswer] = useState<string | null>(null);
  const [evidenceChoice, setEvidenceChoice] = useState<string | null>(null);
  const [writingText, setWritingText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const progress = getReadingProgress(lesson.id);
    setPreReadingChoice(progress.preReadingChoice);
    setMissionCheckAnswer(progress.missionCheckAnswer);
    setEvidenceChoice(progress.evidenceChoice);
    setWritingText(progress.writingDraft);
    setCompleted(progress.completed);
    setHydrated(true);
  }, [lesson.id]);

  useEffect(() => {
    if (!hydrated) return;
    saveReadingDraft(lesson.id, writingText);
  }, [hydrated, lesson.id, writingText]);

  const targetVocab: VocabEntry[] = lesson.targetVocabIds
    .map(id => getVocabById(id))
    .filter((v): v is VocabEntry => v !== undefined);

  const targetVocabForHelp = targetVocab.map(v => ({ word: v.word, japanese: v.japanese, coreMeaning: v.coreMeaning }));
  const usedTargetWords = targetVocab.filter(v => writingText.toLowerCase().includes(v.word.toLowerCase()));

  const answerParagraphNumber = lesson.paragraphs.findIndex(p => p.id === lesson.missionCheck.answerParagraphId) + 1;
  const extraVocabIds = lesson.targetVocabIds.filter(id => !lesson.writing.wordBank.some(w => w.vocabId === id));

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

  function insertIntoWriting(fragment: string) {
    writingTutorRef.current?.insertText(fragment);
  }

  function handleFinish() {
    markReadingComplete(lesson.id);
    markActivityComplete(themeId, 'reading');
    router.push(`/themes/${themeId}/${lesson.level}`);
  }

  function buildParagraphContext(paragraph: ReadingLesson['paragraphs'][number]) {
    return (helpType: string): HelpContext => ({
      themeId,
      level: lesson.level,
      lessonId: lesson.id,
      mission: lesson.mission,
      targetVocab: targetVocabForHelp,
      location: 'paragraph',
      helpType,
      paragraph: {
        english: paragraph.english,
        japanese: paragraph.japanese,
        plainEnglish: paragraph.plainEnglish,
        checkQuestion: paragraph.checkQuestion,
      },
    });
  }

  function buildMissionCheckContext(helpType: string): HelpContext {
    return {
      themeId,
      level: lesson.level,
      lessonId: lesson.id,
      mission: lesson.mission,
      targetVocab: targetVocabForHelp,
      location: 'missionCheck',
      helpType,
      missionCheckQuestion: lesson.missionCheck.question,
      missionCheckExplainerJa: lesson.missionCheck.explainerJa,
      missionCheckHintJa: lesson.missionCheck.hintJa,
      answerParagraphNumber,
    };
  }

  function buildWritingContext(helpType: string): HelpContext {
    return {
      themeId,
      level: lesson.level,
      lessonId: lesson.id,
      mission: lesson.mission,
      targetVocab: targetVocabForHelp,
      location: 'writing',
      helpType,
      writingPrompt: lesson.writing.prompt,
      studentText: writingText,
      minSentences: lesson.writing.minSentences,
      usefulExpressions: lesson.writing.usefulExpressions,
      wordBank: targetVocab.map(v => ({ word: v.word, japanese: v.japanese })),
    };
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
          <p className="text-sm font-medium text-indigo-600">{lesson.titleJapanese}</p>
        </div>
        <Link href={backHref} className="text-sm text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap mt-1">
          ✕ Exit
        </Link>
      </div>

      <p className="text-slate-600 text-sm mb-8">{lesson.welcome}</p>

      {/* Mission — styled as a margin note, matching the feedback comment language used later */}
      <div className="border-l-4 border-indigo-500 pl-4 py-1 mb-8">
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Your Mission</p>
        <p className="text-sm text-slate-800 leading-relaxed">{lesson.mission}</p>
      </div>

      {/* Pre-reading survey */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Before You Read</h2>
        <p className="text-sm text-slate-600 mb-4">{lesson.preReadingSurvey.question}</p>
        <div className="flex flex-col gap-2">
          {lesson.preReadingSurvey.options.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handlePreReadingChoice(opt.id)}
              className={`text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                preReadingChoice === opt.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Reading — one continuous printed-page passage, not stacked cards */}
      <section className="mb-12">
        <SectionTitle eyebrow="Step 1" title="Reading" />
        <div className="border border-slate-300 rounded-sm bg-white px-6 py-10 sm:px-16 sm:py-14">
          <div className="flex flex-col">
            {lesson.paragraphs.map((paragraph, i) => (
              <div
                key={paragraph.id}
                className={`grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3.5rem_1fr] gap-4 sm:gap-8 ${i > 0 ? 'mt-10 sm:mt-12' : ''}`}
              >
                {/* Margin annotation — a quiet textbook reference mark, not a UI badge */}
                <div className="pt-1 text-center sm:text-left" aria-hidden="true">
                  <span className="block font-serif italic text-lg sm:text-xl text-slate-400 leading-none">
                    {CIRCLED_NUMBERS[i] ?? `${i + 1}.`}
                  </span>
                </div>

                {/* Passage text — the main character on the page */}
                <div>
                  <p className="font-serif text-[1.15rem] sm:text-[1.3rem] leading-[1.9] text-slate-900">
                    <span className="sr-only">Paragraph {i + 1}. </span>
                    {paragraph.english}
                  </p>
                  <div className="mt-4 flex justify-end opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <ContextualHelpButton
                      helpId={`paragraph-${paragraph.id}`}
                      activeId={activeHelpId}
                      onToggle={setActiveHelpId}
                      options={PARAGRAPH_HELP_OPTIONS}
                      buildContext={buildParagraphContext(paragraph)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Check — a worksheet, two tasks side by side on wider screens */}
      <section className="mb-12">
        <SectionTitle eyebrow="Step 2" title="Mission Check" />
        <div className="border border-slate-300 rounded-lg shadow-sm bg-white px-5 py-8 sm:px-10 sm:py-10">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
            {/* Task 1 */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Task 1 — Choose the Answer</p>
                <ContextualHelpButton
                  helpId="mission-check"
                  activeId={activeHelpId}
                  onToggle={setActiveHelpId}
                  options={MISSION_CHECK_HELP_OPTIONS}
                  buildContext={buildMissionCheckContext}
                />
              </div>
              <p className="text-base font-medium text-slate-900 mb-4">{lesson.missionCheck.question}</p>
              <div className="flex flex-col gap-2">
                {lesson.missionCheck.options.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleMissionCheckAnswer(opt.id)}
                    className={`text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                      missionCheckAnswer === opt.id
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Task 2 */}
            <div className="sm:border-l sm:border-slate-200 sm:pl-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Task 2 — Supporting Evidence</p>
              <p className="text-base font-medium text-slate-900 mb-3">{lesson.missionCheck.evidencePrompt}</p>
              <div className="flex flex-col gap-2">
                {lesson.missionCheck.evidenceOptions.map(opt => {
                  const paraNum = lesson.paragraphs.findIndex(p => p.id === opt.paragraphId) + 1;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleEvidenceChoice(opt.id)}
                      className={`text-left px-4 py-3 rounded-md border text-sm transition-colors ${
                        evidenceChoice === opt.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                          : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      <span className="font-bold text-slate-400 text-xs mr-2">¶{paraNum}</span>
                      <span className="font-serif italic">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Turn — a notebook; the writing box is the hero, support materials sit quietly below */}
      <section className="mb-12">
        <SectionTitle eyebrow="Step 3" title="Your Turn" />
        <div className="border border-slate-300 rounded-lg shadow-sm bg-white px-5 py-8 sm:px-10 sm:py-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Writing Prompt</p>
            <ContextualHelpButton
              helpId="writing"
              activeId={activeHelpId}
              onToggle={setActiveHelpId}
              options={WRITING_HELP_OPTIONS}
              buildContext={buildWritingContext}
            />
          </div>
          <p className="font-serif text-lg text-slate-900 mb-6">{lesson.writing.prompt}</p>

          <WritingTutor
            ref={writingTutorRef}
            themeId={themeId}
            level={lesson.level}
            lessonId={lesson.id}
            mission={lesson.mission}
            readingPassage={lesson.paragraphs.map(p => p.english)}
            targetVocab={targetVocabForHelp}
            writingPrompt={lesson.writing.prompt}
            writingPromptJapanese={lesson.writing.promptJapanese}
            minSentences={lesson.writing.minSentences}
            initialDraft={writingText}
            onDraftChange={setWritingText}
          />

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Word Bank &amp; Useful Expressions</p>
            <WordBank
              wordBank={lesson.writing.wordBank}
              extraVocabIds={extraVocabIds}
              usefulExpressions={lesson.writing.usefulExpressions}
              onInsert={insertIntoWriting}
            />
          </div>
        </div>
      </section>

      {/* Review */}
      <section className="mb-10">
        <SectionTitle eyebrow="Step 4" title="Review" />
        <div className="border border-slate-300 rounded-lg shadow-sm bg-white px-5 py-8 sm:px-10 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Today&rsquo;s words in the reading</p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {targetVocab.map(v => (
              <span key={v.id} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {v.word}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Words you used in your answer</p>
            <span className="text-xs font-semibold text-slate-600">{usedTargetWords.length} / {targetVocab.length}</span>
          </div>
          <div className="mb-3">
            <ProgressBar current={usedTargetWords.length} total={targetVocab.length} />
          </div>
          {usedTargetWords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {usedTargetWords.map(v => (
                <span key={v.id} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  ✓ {v.word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">None yet — try adding one from the Word Bank above.</p>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="font-serif text-lg text-slate-800 italic">&ldquo;{lesson.takeaway}&rdquo;</p>
          </div>
        </div>
      </section>

      {/* Completion */}
      <button
        type="button"
        onClick={handleFinish}
        className="w-full py-3 rounded-lg font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
      >
        {completed ? 'Done — Back to Activities' : 'Complete Lesson'}
      </button>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-4">
      <span className="h-px flex-1 bg-slate-300" />
      <div className="text-center shrink-0 px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-0.5">{eyebrow}</p>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>
      <span className="h-px flex-1 bg-slate-300" />
    </div>
  );
}
