import { NextResponse } from 'next/server';
import { getSelectionExplanation } from '@/lib/ai/selectionAssistant/getExplanation';
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

  const result = await getSelectionExplanation(body);
  return NextResponse.json(result);
}
