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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const el = textareaRef.current;
    const start = el?.selectionStart ?? writingText.length;
    const end = el?.selectionEnd ?? writingText.length;
    const next = writingText.slice(0, start) + fragment + writingText.slice(end);
    setWritingText(next);
    requestAnimationFrame(() => {
      el?.focus();
      const cursor = start + fragment.length;
      el?.setSelectionRange(cursor, cursor);
    });
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
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

      <p className="text-slate-500 text-sm mb-8">{lesson.welcome}</p>

      {/* Mission banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 mb-8">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Your Mission</p>
        <p className="text-sm text-indigo-900 leading-relaxed">{lesson.mission}</p>
      </div>

      {/* Pre-reading survey */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Before You Read</h2>
        <p className="text-sm text-slate-500 mb-4">{lesson.preReadingSurvey.question}</p>
        <div className="flex flex-col gap-2">
          {lesson.preReadingSurvey.options.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handlePreReadingChoice(opt.id)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                preReadingChoice === opt.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Reading */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Reading</h2>
        <div className="flex flex-col gap-5">
          {lesson.paragraphs.map((paragraph, i) => (
            <div key={paragraph.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Paragraph {i + 1}</span>
                <ContextualHelpButton
                  helpId={`paragraph-${paragraph.id}`}
                  activeId={activeHelpId}
                  onToggle={setActiveHelpId}
                  options={PARAGRAPH_HELP_OPTIONS}
                  buildContext={buildParagraphContext(paragraph)}
                />
              </div>
              <p className="text-base text-slate-900 leading-relaxed">{paragraph.english}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Check */}
      <section className="mb-10">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-lg font-bold text-slate-900">Mission Check</h2>
          <ContextualHelpButton
            helpId="mission-check"
            activeId={activeHelpId}
            onToggle={setActiveHelpId}
            options={MISSION_CHECK_HELP_OPTIONS}
            buildContext={buildMissionCheckContext}
          />
        </div>
        <p className="text-sm text-slate-500 mb-4">{lesson.missionCheck.question}</p>
        <div className="flex flex-col gap-2 mb-6">
          {lesson.missionCheck.options.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleMissionCheckAnswer(opt.id)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                missionCheckAnswer === opt.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-500 mb-3">{lesson.missionCheck.evidencePrompt}</p>
        <div className="flex flex-col gap-2">
          {lesson.missionCheck.evidenceOptions.map(opt => {
            const paraNum = lesson.paragraphs.findIndex(p => p.id === opt.paragraphId) + 1;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleEvidenceChoice(opt.id)}
                className={`text-left px-4 py-3 rounded-xl border text-sm italic transition-colors ${
                  evidenceChoice === opt.id
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                <span className="not-italic font-bold text-slate-400 text-xs mr-2">¶{paraNum}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Your Turn — writing */}
      <section className="mb-10">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-lg font-bold text-slate-900">Your Turn</h2>
          <ContextualHelpButton
            helpId="writing"
            activeId={activeHelpId}
            onToggle={setActiveHelpId}
            options={WRITING_HELP_OPTIONS}
            buildContext={buildWritingContext}
          />
        </div>
        <p className="text-sm text-slate-500 mb-4">{lesson.writing.prompt}</p>

        <textarea
          ref={textareaRef}
          value={writingText}
          onChange={e => setWritingText(e.target.value)}
          rows={4}
          placeholder="Write your answer here..."
          className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-slate-900 leading-relaxed mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <WordBank
          wordBank={lesson.writing.wordBank}
          extraVocabIds={extraVocabIds}
          usefulExpressions={lesson.writing.usefulExpressions}
          onInsert={insertIntoWriting}
        />
      </section>

      {/* Vocabulary reinforcement */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Vocabulary Check</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Today&rsquo;s words in the reading</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {targetVocab.map(v => (
              <span key={v.id} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                {v.word}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Words you used in your answer</p>
            <span className="text-xs text-slate-400">{usedTargetWords.length} / {targetVocab.length}</span>
          </div>
          <div className="mb-3">
            <ProgressBar current={usedTargetWords.length} total={targetVocab.length} />
          </div>
          {usedTargetWords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {usedTargetWords.map(v => (
                <span key={v.id} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  ✓ {v.word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">None yet — try adding one from the Word Bank above.</p>
          )}
        </div>
      </section>

      {/* Takeaway */}
      <div className="text-center mb-10">
        <p className="text-base font-semibold text-slate-700 italic">&ldquo;{lesson.takeaway}&rdquo;</p>
      </div>

      {/* Completion */}
      <button
        type="button"
        onClick={handleFinish}
        className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
      >
        {completed ? 'Done — Back to Activities' : 'Complete Lesson'}
      </button>
    </div>
  );
}
