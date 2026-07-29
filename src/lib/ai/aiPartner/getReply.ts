import { getOpenAIClient, OPENAI_MODEL } from '@/lib/ai/client';
import { buildAIPartnerPrompt } from './prompt';
import { AI_PARTNER_HARD_MAX_STUDENT_TURNS } from './types';
import type { AIPartnerTurnRequest, AIPartnerTurnResponse } from './types';

export async function getAIPartnerReply(request: AIPartnerTurnRequest): Promise<AIPartnerTurnResponse> {
  const studentTurnCount = request.history.filter(turn => turn.role === 'student').length;

  if (studentTurnCount > AI_PARTNER_HARD_MAX_STUDENT_TURNS) {
    return { ok: false, error: 'This conversation has already reached its turn limit.' };
  }

  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "The AI partner isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  const { systemInstructions, input } = buildAIPartnerPrompt(request);

  try {
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: systemInstructions,
      input,
    });

    const reply = response.output_text.trim();
    return { ok: true, reply, studentTurnCount };
  } catch (error) {
    console.error('getAIPartnerReply failed', error);
    return {
      ok: false,
      error: "Couldn't reach your AI partner. Please check your connection and try again.",
    };
  }
}
