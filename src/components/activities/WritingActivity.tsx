'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getReadingsByTheme } from '@/data/reading/masterReadings';
import { getVocabById, type VocabEntry } from '@/data/vocabulary/masterVocabulary';
import {
  getReadingProgress,
  saveReadingDraft,
  markWritingComplete,
  markActivityComplete,
} from '@/lib/store';
import WritingToolbox from '@/components/activities/WritingToolbox';
import WritingExpressPanel from '@/components/activities/WritingExpressPanel';
import ProgressBar from '@/components/ProgressBar';
import WritingTutor, { type WritingTutorHandle } from '@/components/writing-tutor/WritingTutor';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import { countSentences } from '@/lib/textStats';
import type { Level } from '@/types';

/**
 * Standalone Writing activity — Theme 1 Foundation only, during this
 * prototype stage. Relocated intact from ReadingLessonViewV2: same Writing
 * Prompt, same WritingTutor, same Writing Toolkit, same Review content, same
 * Continue-to-AI-Talk screen. Nothing about the writing experience itself has
 * been redesigned in this phase — only moved.
 *
 * Reuses the same lesson object Reading uses (getReadingsByTheme) rather than
 * a new data source, per "do not redesign yet, simply relocate."
 */

// Whole-word match, not substring — otherwise short target words like "AI" or
// "war" would false-match inside unrelated words like "explain" or "toward".
function containsWord(text: string, word: string): boolean {
  const cleanWord = word.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

export default function WritingActivity({
  themeId,
  level,
}: {
  themeId: string;
  level: Level;
}) {
  const router = useRouter();
  const writingTutorRef = useRef<WritingTutorHandle>(null);

  const lesson = getReadingsByTheme(themeId, level)[0];

  const [writingText, setWritingText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showIncompleteNote, setShowIncompleteNote] = useState(false);
  const [showContinueScreen, setShowContinueScreen] = useState(false);
  const [showExpressPanel, setShowExpressPanel] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    const progress = getReadingProgress(lesson.id);
    setWritingText(progress.writingDraft);
    setCompleted(progress.writingCompleted);
    setHydrated(true);
  }, [lesson]);

  useEffect(() => {
    if (!hydrated || !lesson) return;
    saveReadingDraft(lesson.id, writingText);
  }, [hydrated, lesson, writingText]);

  // writingReady === false means a ReadingLesson exists (Reading is live)
  // but its `writing` content is a placeholder, not real — never render it.
  if (!lesson || lesson.writingReady === false) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">✏️</div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">Writing coming soon</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          The Writing activity for this theme and level will be added here.
        </p>
      </div>
    );
  }

  const targetVocab: VocabEntry[] = lesson.targetVocabIds
    .map(id => getVocabById(id))
    .filter((v): v is VocabEntry => v !== undefined);

  const targetVocabForHelp = targetVocab.map(v => ({ word: v.word, japanese: v.japanese, coreMeaning: v.coreMeaning }));
  const usedTargetWords = targetVocab.filter(v => containsWord(writingText, v.word));
  const extraVocabIds = lesson.targetVocabIds.filter(id => !lesson.writing.wordBank.some(w => w.vocabId === id));

  function insertIntoWriting(fragment: string) {
    writingTutorRef.current?.insertText(fragment);
  }

  const currentSentenceCount = countSentences(writingText);
  const writingSubmitted = currentSentenceCount >= lesson.writing.minSentences;
  const backHref = `/themes/${themeId}/${level}`;

  function handleFinish() {
    if (completed) {
      router.push(backHref);
      return;
    }
    if (!writingSubmitted) {
      setShowIncompleteNote(true);
      return;
    }
    markWritingComplete(lesson.id);
    markActivityComplete(themeId, 'writing');
    setCompleted(true);
    setShowContinueScreen(true);
  }

  if (showContinueScreen) {
    return <ContinueScreen themeId={themeId} level={level} backHref={backHref} />;
  }

  return (
    <div className="space-y-8">
      {/* 1–3: Topic, writing area, and Get Feedback all live inside the
          untouched WritingTutor component — kept together since they're one
          continuous task. Only the surrounding card/typography is new. */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-10">
        <div className="flex items-center gap-3 mb-3 sm:mb-5">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg sm:text-xl" aria-hidden="true">✏️</span>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Your Writing Topic</p>
        </div>
        <SelectableContent activityType="writing-prompt" themeId={themeId} level={level} label="Writing Prompt">
          <p className="font-serif text-[18px] sm:text-[28px] text-slate-900 mb-4 sm:mb-8 leading-relaxed sm:leading-snug">{lesson.writing.prompt}</p>
        </SelectableContent>

        <WritingTutor
          ref={writingTutorRef}
          themeId={themeId}
          level={level}
          lessonId={lesson.id}
          mission={lesson.mission}
          readingPassage={lesson.paragraphs.map(p => p.english)}
          targetVocab={targetVocabForHelp}
          writingPrompt={lesson.writing.prompt}
          writingPromptJapanese={lesson.writing.promptJapanese}
          minSentences={lesson.writing.minSentences}
          recommendedWordRange={lesson.writing.recommendedWordRange}
          initialDraft={writingText}
          onDraftChange={setWritingText}
        />

        {/* Expression support — "I don't know how to say it in English."
            Separate from the Writing Toolbox (pre-authored) and from Get
            Feedback (corrects what's already written): this helps the
            student put a new idea into English in the first place. */}
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowExpressPanel(v => !v)}
            className={`px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors ${
              showExpressPanel
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            💡 Help me say it
          </button>
        </div>

        {showExpressPanel && (
          <div className="mt-3">
            <WritingExpressPanel
              level={level}
              themeId={themeId}
              writingPrompt={lesson.writing.prompt}
              currentDraft={writingText}
              onClose={() => setShowExpressPanel(false)}
              onInsertSuggestion={insertIntoWriting}
            />
          </div>
        )}
      </div>

      {/* 4: Writing Toolbox — deliberately the most visually prominent
          section on the page after the writing area itself. */}
      <WritingToolbox
        themeId={themeId}
        level={level}
        sentenceStarters={lesson.writing.sentenceStarters}
        wordBank={lesson.writing.wordBank}
        extraVocabIds={extraVocabIds}
        usefulExpressions={lesson.writing.usefulExpressions}
        onInsert={insertIntoWriting}
      />

      {/* 5: Review / Progress — relocated intact from Reading, unchanged
          content, restyled to match the page's new visual language. */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-5 sm:p-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl" aria-hidden="true">🏆</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Review</h2>
        </div>

        <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-3">Today&rsquo;s words in the reading</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {targetVocab.map(v => (
            <span key={v.id} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
              {v.word}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">Words you used in your answer</p>
          <span className="text-sm font-semibold text-slate-600">{usedTargetWords.length} / {targetVocab.length}</span>
        </div>
        <div className="mb-4">
          <ProgressBar current={usedTargetWords.length} total={targetVocab.length} colorClassName="bg-purple-500" />
        </div>
        {usedTargetWords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {usedTargetWords.map(v => (
              <span key={v.id} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                ✓ {v.word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-base text-slate-500">None yet — try adding one from the Writing Toolbox above.</p>
        )}

        <div className="mt-8 pt-6 border-t border-purple-100 text-center">
          <SelectableContent activityType="review" themeId={themeId} level={level} label="Takeaway">
            <p className="font-serif text-lg sm:text-[22px] text-slate-800 italic leading-relaxed">&ldquo;{lesson.takeaway}&rdquo;</p>
          </SelectableContent>
        </div>
      </div>

      {/* Completion */}
      <div>
        {showIncompleteNote && !writingSubmitted && (
          <p className="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3 text-center">
            You&rsquo;ve written {currentSentenceCount} sentence{currentSentenceCount === 1 ? '' : 's'} so far — write at least {lesson.writing.minSentences} to complete this activity. (The word count above is just a guide — sentences are what count here.)
          </p>
        )}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
        >
          {completed ? 'Done — Back to Activities' : '🎉 Complete Writing'}
        </button>
      </div>
    </div>
  );
}

/** Relocated intact from ReadingLessonViewV2's ContinueScreen — same content,
 *  same behavior, just reached from Writing now instead of Reading. */
function ContinueScreen({ themeId, level, backHref }: { themeId: string; level: string; backHref: string }) {
  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 text-center px-4">
      <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-3xl shadow-sm px-5 py-8 sm:px-8 sm:py-16">
        <div
          className="mx-auto mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl sm:text-3xl text-emerald-600"
          aria-hidden="true"
        >
          ✓
        </div>
        <p className="font-serif text-xl sm:text-[32px] text-slate-900 leading-relaxed mb-1">You&rsquo;ve thought about this topic.</p>
        <p className="font-serif text-xl sm:text-[32px] text-slate-900 leading-relaxed mb-6 sm:mb-10">Now let&rsquo;s talk about it.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/themes/${themeId}/${level}/ai-talk`}
            className="px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-base sm:text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            Continue to AI Talk
          </Link>
          <Link
            href={backHref}
            className="px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-base sm:text-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 transition-colors"
          >
            Back to Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
