'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Level } from '@/types';
import type {
  FlaggedIssue,
  TargetVocabItem,
  WritingFeedbackResult,
  WritingTutorRequest,
  WritingTutorResponse,
} from '@/lib/ai/writingTutor/types';
import { diffWords } from '@/lib/textDiff';
import { countSentences, countWords } from '@/lib/textStats';
import { addNotebookItem, isInNotebook } from '@/lib/store';
import SelectableContent from '@/components/selection-assistant/SelectableContent';
import NotebookSaveButton from '@/components/notebook/NotebookSaveButton';

/**
 * Standalone, reusable Writing Tutor. Sends a student's draft to
 * /api/writing-tutor and displays every returned feedback section.
 *
 * Self-contained: owns its own draft/loading/error/revision state, so it
 * can be dropped into any lesson page just by passing in that lesson's
 * context. Intentionally simple/functional — no staged reveal, no "Why?"
 * drill-down, no revision-cycle UI. Those belong to a later milestone.
 *
 * initialDraft/onDraftChange/the imperative insertText handle exist only so
 * a host page can keep its own read-only view of the draft in sync (e.g. a
 * live word-usage counter) and let an external control (e.g. a Word Bank)
 * insert text into this component's own textarea — the component still owns
 * the draft itself.
 */

export interface WritingTutorProps {
  themeId: string;
  level: Level;
  lessonId: string;
  mission: string;
  readingPassage: string[];
  targetVocab: TargetVocabItem[];
  writingPrompt: string;
  writingPromptJapanese: string;
  minSentences: number;
  /** Advisory only — see WritingTask.recommendedWordRange. Never gates completion. */
  recommendedWordRange?: [number, number];
  initialDraft?: string;
  onDraftChange?: (text: string) => void;
}

export interface WritingTutorHandle {
  insertText: (fragment: string) => void;
}

const WritingTutor = forwardRef<WritingTutorHandle, WritingTutorProps>(function WritingTutor(
  {
    themeId,
    level,
    lessonId,
    mission,
    readingPassage,
    targetVocab,
    writingPrompt,
    writingPromptJapanese,
    minSentences,
    recommendedWordRange,
    initialDraft,
    onDraftChange,
  },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draftText, setDraftTextState] = useState(initialDraft ?? '');
  const [feedback, setFeedback] = useState<WritingFeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [revisionNumber, setRevisionNumber] = useState(1);
  const [previouslyFlaggedIssues, setPreviouslyFlaggedIssues] = useState<FlaggedIssue[]>([]);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  // A new feedback response (first request or "Get Feedback Again") replaces
  // `feedback` with a new object — reset save state then, so re-requesting
  // feedback doesn't leave stale "✓ Saved" badges on a since-changed draft.
  useEffect(() => {
    setSavedKeys(new Set());
  }, [feedback]);

  function handleSaveWritingItem(key: string, label: string, content: string, explanation: string) {
    if (savedKeys.has(key)) return;
    if (!isInNotebook('writing', content, themeId)) {
      addNotebookItem({
        category: 'writing',
        themeId,
        level,
        favorite: false,
        label,
        content,
        explanation,
        context: draftText,
      });
    }
    setSavedKeys(prev => new Set(prev).add(key));
  }

  function setDraftText(text: string) {
    setDraftTextState(text);
    onDraftChange?.(text);
  }

  // initialDraft often isn't known yet on first mount (e.g. it comes from
  // localStorage, read by the host page only after its own hydration effect
  // runs). Adopt it the one time it actually arrives, but never again after
  // that, so a student's own typing is never overwritten.
  const hasSyncedInitialDraft = useRef(false);
  useEffect(() => {
    if (!hasSyncedInitialDraft.current && initialDraft) {
      hasSyncedInitialDraft.current = true;
      setDraftTextState(initialDraft);
    }
  }, [initialDraft]);

  useImperativeHandle(ref, () => ({
    insertText(fragment: string) {
      const el = textareaRef.current;
      const start = el?.selectionStart ?? draftText.length;
      const end = el?.selectionEnd ?? draftText.length;
      const next = draftText.slice(0, start) + fragment + draftText.slice(end);
      setDraftText(next);
      requestAnimationFrame(() => {
        el?.focus();
        const cursor = start + fragment.length;
        el?.setSelectionRange(cursor, cursor);
      });
    },
  }));

  async function handleGetFeedback() {
    if (!draftText.trim() || loading) return;

    setLoading(true);
    setError(null);

    const request: WritingTutorRequest = {
      themeId,
      level,
      lessonId,
      mission,
      readingPassage,
      targetVocab,
      writingPrompt,
      writingPromptJapanese,
      minSentences,
      draftText: draftText.trim(),
      revisionNumber,
      previouslyFlaggedIssues: previouslyFlaggedIssues.length > 0 ? previouslyFlaggedIssues : undefined,
    };

    try {
      const res = await fetch('/api/writing-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const result = (await res.json()) as WritingTutorResponse;

      if (result.ok) {
        setFeedback(result.feedback);
        setPreviouslyFlaggedIssues(
          result.feedback.corrections.map(c => ({ wrong: c.wrong, correct: c.correct })),
        );
        setRevisionNumber(n => n + 1);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Couldn't reach the writing tutor. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Live, per-keystroke — draftText already re-renders on every change, so
  // no extra state/effect is needed. Sentence count uses the exact same
  // countSentences() the completion gate in WritingActivity.tsx checks, so
  // this number is never out of sync with what "Complete Writing" requires.
  const sentenceCount = countSentences(draftText);
  const wordCount = countWords(draftText);
  const sentencesMet = sentenceCount >= minSentences;

  return (
    <div className="max-w-2xl mx-auto">
      <textarea
        ref={textareaRef}
        value={draftText}
        onChange={e => setDraftText(e.target.value)}
        rows={8}
        placeholder="Write your answer here..."
        className="w-full bg-white rounded-md border border-slate-300 p-5 text-base text-slate-900 leading-relaxed mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
      />

      {/* Live progress — THEME_EXPERIENCE_TEMPLATE.md §9 permanent rule.
          Sentences is the only actual completion requirement (checkmark,
          pass/fail styling); words is advisory only, shown neutrally, and
          never blocks completion — this pairing is what disambiguates
          "which requirement isn't met yet" for the student. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-sm">
        <span className={sentencesMet ? 'font-semibold text-emerald-700' : 'font-medium text-slate-500'}>
          {sentencesMet ? '✓ ' : ''}Sentences: {sentenceCount}{!sentencesMet ? ` / ${minSentences} needed` : ''}
        </span>
        <span className="text-slate-500">
          Words: {wordCount}
          {recommendedWordRange ? ` (aim for ${recommendedWordRange[0]}–${recommendedWordRange[1]})` : ''}
        </span>
      </div>

      <button
        type="button"
        onClick={handleGetFeedback}
        disabled={!draftText.trim() || loading}
        className="w-full px-5 py-3 rounded-md font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Getting feedback...' : feedback ? 'Get Feedback Again' : 'Get Feedback'}
      </button>

      {error && (
        <div className="border-l-4 border-rose-400 pl-4 py-1 text-sm text-rose-800 mb-4">
          {error}
        </div>
      )}

      {feedback && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">📝 Teacher&rsquo;s Comments</p>
          <SelectableContent activityType="writing-feedback" themeId={themeId} level={level} label="Teacher's Comments" className="flex flex-col gap-5">
            <FeedbackSection title="Overall Feedback" variant="primary">
              <p>{feedback.overallFeedbackJa}</p>
            </FeedbackSection>

            <FeedbackSection title="Task Achievement">
              <p>{feedback.taskAchievementJa}</p>
            </FeedbackSection>

            {feedback.corrections.length > 0 && (
              <FeedbackSection title="Corrections" variant="primary">
                <ul className="flex flex-col gap-3">
                  {feedback.corrections.map((c, i) => (
                    <li key={i}>
                      <p className="font-serif text-lg">
                        {diffWords(c.wrong, c.correct).map((seg, segIndex) => {
                          if (seg.type === 'delete') {
                            return (
                              <span key={segIndex} className="line-through text-slate-400">
                                {seg.text}
                              </span>
                            );
                          }
                          if (seg.type === 'insert') {
                            return (
                              <span key={segIndex} className="font-semibold text-indigo-700">
                                {seg.text}
                              </span>
                            );
                          }
                          return <span key={segIndex}>{seg.text}</span>;
                        })}
                      </p>
                      <p className="text-sm text-slate-600 mt-0.5">{c.whyJa}</p>
                    </li>
                  ))}
                </ul>
              </FeedbackSection>
            )}

            {feedback.naturalAlternatives.length > 0 && (
              <FeedbackSection title="Natural English">
                <ul className="flex flex-col gap-3">
                  {feedback.naturalAlternatives.map((a, i) => {
                    const key = `alt-${i}`;
                    return (
                      <li key={i}>
                        <p className="font-serif italic text-slate-900">{a.phrase}</p>
                        <p className="text-slate-600">{a.whyJa}</p>
                        <NotebookSaveButton
                          saved={savedKeys.has(key)}
                          onSave={() => handleSaveWritingItem(key, 'Natural Alternative', a.phrase, a.whyJa)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </FeedbackSection>
            )}

            {feedback.improvedVersion && (
              <FeedbackSection title="Improved Version" variant="primary">
                <p className="font-serif text-lg text-slate-900">{feedback.improvedVersion}</p>
                <p className="text-sm text-slate-600 mt-2">{feedback.improvedVersionNoteJa}</p>
                <NotebookSaveButton
                  saved={savedKeys.has('improved')}
                  onSave={() => handleSaveWritingItem('improved', 'Improved Version', feedback.improvedVersion, feedback.improvedVersionNoteJa)}
                />
              </FeedbackSection>
            )}

            {(feedback.vocabularyUsedWords.length > 0 || feedback.vocabularySuggestedWords.length > 0) && (
              <FeedbackSection title="Vocabulary">
                {feedback.vocabularyUsedWords.length > 0 && (
                  <div className="mb-2">
                    <p className="font-semibold">{feedback.vocabularyUsedWords.join(', ')}</p>
                    <p className="text-slate-600">{feedback.vocabularyPraiseJa}</p>
                  </div>
                )}
                {feedback.vocabularySuggestedWords.length > 0 && (
                  <div>
                    <p className="font-semibold">{feedback.vocabularySuggestedWords.join(', ')}</p>
                    <p className="text-slate-600">{feedback.vocabularySuggestionJa}</p>
                  </div>
                )}
              </FeedbackSection>
            )}

            <FeedbackSection title="Today's Tip">
              <p>{feedback.todaysTipJa}</p>
            </FeedbackSection>

            {feedback.revisionDeltaJa && (
              <FeedbackSection title="Since Your Last Draft">
                <p>{feedback.revisionDeltaJa}</p>
              </FeedbackSection>
            )}
          </SelectableContent>
        </div>
      )}
    </div>
  );
});

WritingTutor.displayName = 'WritingTutor';

export default WritingTutor;

function FeedbackSection({
  title,
  children,
  variant = 'secondary',
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  if (variant === 'primary') {
    return (
      <div className="border-l-4 border-indigo-500 pl-4 py-1">
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1.5">{title}</p>
        <div className="text-base text-slate-900 leading-relaxed">{children}</div>
      </div>
    );
  }

  return (
    <div className="border-l-2 border-slate-300 pl-4 py-0.5">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">{title}</p>
      <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
    </div>
  );
}
