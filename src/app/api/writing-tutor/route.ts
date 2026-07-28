import { NextResponse } from 'next/server';
import { getWritingFeedback } from '@/lib/ai/writingTutor/getFeedback';
import type { WritingTutorRequest } from '@/lib/ai/writingTutor/types';

function isValidRequest(body: unknown): body is WritingTutorRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.themeId === 'string' &&
    typeof b.level === 'string' &&
    typeof b.lessonId === 'string' &&
    typeof b.mission === 'string' &&
    Array.isArray(b.readingPassage) &&
    Array.isArray(b.targetVocab) &&
    typeof b.writingPrompt === 'string' &&
    typeof b.writingPromptJapanese === 'string' &&
    typeof b.minSentences === 'number' &&
    typeof b.draftText === 'string' &&
    b.draftText.trim().length > 0 &&
    typeof b.revisionNumber === 'number'
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isValidRequest(body)) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid required fields.' }, { status: 400 });
  }

  const result = await getWritingFeedback(body);
  return NextResponse.json(result);
}
