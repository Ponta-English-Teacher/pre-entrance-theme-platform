import { NextResponse } from 'next/server';
import { getSelectionSpeech } from '@/lib/ai/selectionAssistant/getSpeech';
import { SELECTION_SPEECH_MAX_TEXT_LENGTH } from '@/lib/ai/selectionAssistant/types';

function isValidRequest(body: unknown): body is { text: string } {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.text === 'string' &&
    b.text.trim().length > 0 &&
    b.text.length <= SELECTION_SPEECH_MAX_TEXT_LENGTH
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

  const result = await getSelectionSpeech(body.text);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return new NextResponse(new Uint8Array(result.audio), {
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
