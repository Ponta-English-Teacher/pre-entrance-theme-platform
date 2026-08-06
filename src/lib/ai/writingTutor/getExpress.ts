import { getOpenAIClient, OPENAI_MODEL } from '@/lib/ai/client';
import { buildWritingExpressPrompt } from './expressPrompt';
import type { WritingExpressRequest, WritingExpressResponse } from './types';
import type { ExpressChatResult } from '@/lib/ai/expressCoach/types';

export async function getWritingExpressReply(
  request: WritingExpressRequest,
): Promise<WritingExpressResponse> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "This isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  try {
    const { systemInstructions, input, schema } = buildWritingExpressPrompt(request);
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: systemInstructions,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: 'writing_express_coach_reply',
          schema,
          strict: true,
        },
      },
    });
    const parsed = JSON.parse(response.output_text) as ExpressChatResult;
    return { ok: true, reply: parsed.reply, suggestions: parsed.suggestions };
  } catch (error) {
    console.error('getWritingExpressReply failed', error);
    return {
      ok: false,
      error: "Couldn't reach the writing tutor. Please check your connection and try again.",
    };
  }
}
