import { NextResponse } from 'next/server';
import { getSelectionExplanation } from '@/lib/ai/selectionAssistant/getExplanation';
import { SELECTION_ASSISTANT_MAX_TEXT_LENGTH, SELECTION_TEXT_TOO_LONG_MESSAGE } from '@/lib/ai/selectionAssistant/types';
import type { SelectionAssistantRequest } from '@/lib/ai/selectionAssistant/types';

function isValidRequest(body: unknown): body is SelectionAssistantRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.selectedText === 'string' &&
    b.selectedText.trim().length > 0 &&
    typeof b.surroundingSentence === 'string' &&
    typeof b.surroundingParagraph === 'string' &&
    typeof b.activityType === 'string' &&
    typeof b.themeId === 'string' &&
    typeof b.level === 'string' &&
    typeof b.action === 'string'
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

  // Same limit and message as the speech endpoint — checked separately from
  // shape validation so Translate/Easy English get the specific bilingual
  // message too, not just How to Read. Mirrors the pre-flight check every
  // client already runs, so this only fires if a client is bypassed entirely.
  if (body.selectedText.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
    return NextResponse.json({ ok: false, error: SELECTION_TEXT_TOO_LONG_MESSAGE }, { status: 400 });
  }

  const result = await getSelectionExplanation(body);
  return NextResponse.json(result);
}
