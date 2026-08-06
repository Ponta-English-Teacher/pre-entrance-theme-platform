import { NextResponse } from 'next/server';
import { getSelectionSpeech } from '@/lib/ai/selectionAssistant/getSpeech';
import { SELECTION_ASSISTANT_MAX_TEXT_LENGTH, SELECTION_TEXT_TOO_LONG_MESSAGE } from '@/lib/ai/selectionAssistant/types';

function hasValidText(body: unknown): body is { text: string } {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return typeof b.text === 'string' && b.text.trim().length > 0;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!hasValidText(body)) {
    return NextResponse.json({ ok: false, error: 'Missing or invalid required fields.' }, { status: 400 });
  }

  // Checked separately from shape validation so an over-limit selection gets
  // the specific bilingual message — this mirrors the pre-flight check every
  // client already runs, so it only fires if a client is bypassed entirely.
  if (body.text.length > SELECTION_ASSISTANT_MAX_TEXT_LENGTH) {
    return NextResponse.json({ ok: false, error: SELECTION_TEXT_TOO_LONG_MESSAGE }, { status: 400 });
  }

  const result = await getSelectionSpeech(body.text);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return new NextResponse(new Uint8Array(result.audio), {
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
