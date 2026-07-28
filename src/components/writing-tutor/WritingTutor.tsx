'use client';

import { useState } from 'react';
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
}

export default function WritingTutor({
  themeId,
  level,
  lessonId,
  mission,
  readingPassage,
  targetVocab,
  writingPrompt,
  writingPromptJapanese,
  minSentences,
}: WritingTutorProps) {
  const [draftText, setDraftText] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [revisionNumber, setRevisionNumber] = useState(1);
  const [previouslyFlaggedIssues, setPreviouslyFlaggedIssues] = useState<FlaggedIssue[]>([]);

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
        value={draftText}
        onChange={e => setDraftText(e.target.value)}
        rows={5}
        placeholder="Write your answer here..."
        className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-sm text-slate-900 leading-relaxed mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <button
        type="button"
        onClick={handleGetFeedback}
        disabled={!draftText.trim() || loading}
        className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Getting feedback...' : feedback ? 'Get Feedback Again' : 'Get Feedback'}
      </button>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700 mb-4">
          {error}
        </div>
      )}

      {feedback && (
        <div className="flex flex-col gap-4">
          <FeedbackSection title="Overall Feedback">
            <p>{feedback.overallFeedbackJa}</p>
          </FeedbackSection>

          <FeedbackSection title="Task Achievement">
            <p>{feedback.taskAchievementJa}</p>
          </FeedbackSection>

          {feedback.corrections.length > 0 && (
            <FeedbackSection title="Corrections">
              <ul className="flex flex-col gap-3">
                {feedback.corrections.map((c, i) => (
                  <li key={i}>
                    <p>
                      <span className="line-through text-slate-400">{c.wrong}</span>
                      {' → '}
                      <span className="font-semibold">{c.correct}</span>
                    </p>
                    <p className="text-slate-500">{c.whyJa}</p>
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
                    <p className="font-semibold">{a.phrase}</p>
                    <p className="text-slate-500">{a.whyJa}</p>
                  </li>
                ))}
              </ul>
            </FeedbackSection>
          )}

          {feedback.improvedVersion && (
            <FeedbackSection title="Improved Version">
              <p className="font-semibold">{feedback.improvedVersion}</p>
              <p className="text-slate-500 mt-1">{feedback.improvedVersionNoteJa}</p>
            </FeedbackSection>
          )}

          {(feedback.vocabularyUsedWords.length > 0 || feedback.vocabularySuggestedWords.length > 0) && (
            <FeedbackSection title="Vocabulary">
              {feedback.vocabularyUsedWords.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold">{feedback.vocabularyUsedWords.join(', ')}</p>
                  <p className="text-slate-500">{feedback.vocabularyPraiseJa}</p>
                </div>
              )}
              {feedback.vocabularySuggestedWords.length > 0 && (
                <div>
                  <p className="font-semibold">{feedback.vocabularySuggestedWords.join(', ')}</p>
                  <p className="text-slate-500">{feedback.vocabularySuggestionJa}</p>
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
      )}
    </div>
  );
}

function FeedbackSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="text-sm text-slate-900 leading-relaxed">{children}</div>
    </div>
  );
}
