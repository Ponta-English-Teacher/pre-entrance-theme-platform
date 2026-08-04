import { NextResponse } from 'next/server';
import { getGeneratedVocabEntry } from '@/lib/ai/vocabLookup/getVocabEntry';
import type { VocabLookupRequest } from '@/lib/ai/vocabLookup/types';

function isValidRequest(body: unknown): body is VocabLookupRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.word === 'string' &&
    b.word.trim().length > 0 &&
    typeof b.baseWord === 'string' &&
    typeof b.themeId === 'string'
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

  const result = await getGeneratedVocabEntry(body);
  return NextResponse.json(result);
}
