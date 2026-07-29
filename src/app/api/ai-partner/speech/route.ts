import { NextResponse } from 'next/server';
import { getAIPartnerSpeech } from '@/lib/ai/aiPartner/getSpeech';
import { AI_PARTNER_MAX_SPEECH_TEXT_LENGTH } from '@/lib/ai/aiPartner/types';
import type { AIPartnerSpeechRequest } from '@/lib/ai/aiPartner/types';

function isValidRequest(body: unknown): body is AIPartnerSpeechRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.text === 'string' &&
    b.text.trim().length > 0 &&
    b.text.length <= AI_PARTNER_MAX_SPEECH_TEXT_LENGTH &&
    typeof b.speechGenerationCountSoFar === 'number' &&
    Number.isInteger(b.speechGenerationCountSoFar) &&
    b.speechGenerationCountSoFar >= 0
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

  const result = await getAIPartnerSpeech(body);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return new NextResponse(new Uint8Array(result.audio), {
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
