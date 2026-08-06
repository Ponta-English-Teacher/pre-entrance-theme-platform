import { NextResponse } from 'next/server';
import { getConversationSupport } from '@/lib/ai/aiPartner/getSupport';
import type { ConversationSupportRequest, ConversationTurn } from '@/lib/ai/aiPartner/types';
import { isValidExpressChatTurn } from '@/lib/ai/expressCoach/types';

function isValidTurn(value: unknown): value is ConversationTurn {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return (t.role === 'student' || t.role === 'partner') && typeof t.text === 'string';
}

function isValidRequest(body: unknown): body is ConversationSupportRequest {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  if (typeof b.level !== 'string' || !['foundation', 'advanced'].includes(b.level)) {
    return false;
  }
  if (b.recentHistory !== undefined && (!Array.isArray(b.recentHistory) || !b.recentHistory.every(isValidTurn))) {
    return false;
  }

  if (b.action === 'explain') {
    return typeof b.selectedText === 'string' && b.selectedText.trim().length > 0;
  }
  if (b.action === 'express') {
    if (b.expressHistory !== undefined && (!Array.isArray(b.expressHistory) || !b.expressHistory.every(isValidExpressChatTurn))) {
      return false;
    }
    return typeof b.studentInput === 'string' && b.studentInput.trim().length > 0;
  }
  return false;
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

  const result = await getConversationSupport(body);
  return NextResponse.json(result);
}
