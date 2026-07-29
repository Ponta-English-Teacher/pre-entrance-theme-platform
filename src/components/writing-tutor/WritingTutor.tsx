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
          <div className="flex flex-col gap-5">
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
                        <span className="line-through text-slate-400">{c.wrong}</span>
                        {' → '}
                        <span className="font-semibold text-slate-900">{c.correct}</span>
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
                  {feedback.naturalAlternatives.map((a, i) => (
                    <li key={i}>
                      <p className="font-serif italic text-slate-900">{a.phrase}</p>
                      <p className="text-slate-600">{a.whyJa}</p>
                    </li>
                  ))}
                </ul>
              </FeedbackSection>
            )}

            {feedback.improvedVersion && (
              <FeedbackSection title="Improved Version" variant="primary">
                <p className="font-serif text-lg text-slate-900">{feedback.improvedVersion}</p>
                <p className="text-sm text-slate-600 mt-2">{feedback.improvedVersionNoteJa}</p>
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
          </div>
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
