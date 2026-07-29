import { NextResponse } from 'next/server';
import { getAIPartnerReply } from '@/lib/ai/aiPartner/getReply';
import type { AIPartnerTurnRequest, ConversationTurn } from '@/lib/ai/aiPartner/types';

function isValidTurn(value: unknown): value is ConversationTurn {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return (t.role === 'student' || t.role === 'partner') && typeof t.text === 'string' && t.text.trim().length > 0;
}

function isValidRequest(body: unknown): body is AIPartnerTurnRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  if (
    typeof b.themeId !== 'string' ||
    typeof b.level !== 'string' ||
    !['foundation', 'standard', 'challenge'].includes(b.level) ||
    typeof b.themeDescription !== 'string' ||
    typeof b.themeDescriptionJapanese !== 'string' ||
    typeof b.mission !== 'string' ||
    !Array.isArray(b.readingPassage) ||
    !b.readingPassage.every(p => typeof p === 'string') ||
    !Array.isArray(b.targetVocab) ||
    !b.targetVocab.every(
      v =>
        v &&
        typeof v === 'object' &&
        typeof (v as Record<string, unknown>).word === 'string' &&
        typeof (v as Record<string, unknown>).japanese === 'string' &&
        typeof (v as Record<string, unknown>).coreMeaning === 'string',
    ) ||
    !Array.isArray(b.history) ||
    b.history.length === 0 ||
    !b.history.every(isValidTurn)
  ) {
    return false;
  }

  const history = b.history as ConversationTurn[];
  return history[history.length - 1].role === 'student';
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { ok: false, error: 'Missing or invalid required fields, or history does not end with a student turn.' },
      { status: 400 },
    );
  }

  const result = await getAIPartnerReply(body);
  return NextResponse.json(result);
}
