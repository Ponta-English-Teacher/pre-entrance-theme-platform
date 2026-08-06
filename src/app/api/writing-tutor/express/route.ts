import { NextResponse } from 'next/server';
import { getWritingExpressReply } from '@/lib/ai/writingTutor/getExpress';
import type { WritingExpressRequest } from '@/lib/ai/writingTutor/types';
import { isValidExpressChatTurn } from '@/lib/ai/expressCoach/types';

function isValidRequest(body: unknown): body is WritingExpressRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  return (
    typeof b.level === 'string' &&
    ['foundation', 'advanced'].includes(b.level) &&
    typeof b.themeId === 'string' &&
    typeof b.writingPrompt === 'string' &&
    typeof b.studentInput === 'string' &&
    b.studentInput.trim().length > 0 &&
    (b.currentDraft === undefined || typeof b.currentDraft === 'string') &&
    (b.expressHistory === undefined || (Array.isArray(b.expressHistory) && b.expressHistory.every(isValidExpressChatTurn)))
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

  const result = await getWritingExpressReply(body);
  return NextResponse.json(result);
}
