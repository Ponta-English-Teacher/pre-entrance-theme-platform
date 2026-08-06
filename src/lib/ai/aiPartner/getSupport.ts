import { getOpenAIClient, OPENAI_MODEL } from '@/lib/ai/client';
import { buildExplainPrompt, buildExpressPrompt } from './supportPrompt';
import type { ConversationSupportRequest, ConversationSupportResponse } from './types';

export async function getConversationSupport(
  request: ConversationSupportRequest,
): Promise<ConversationSupportResponse> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "This isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  try {
    if (request.action === 'explain') {
      const { systemInstructions, input } = buildExplainPrompt(request);
      const response = await client.responses.create({
        model: OPENAI_MODEL,
        instructions: systemInstructions,
        input,
      });
      return { ok: true, explanation: response.output_text.trim() };
    }

    const { systemInstructions, input, schema } = buildExpressPrompt(request);
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: systemInstructions,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: 'express_coach_reply',
          schema,
          strict: true,
        },
      },
    });
    const parsed = JSON.parse(response.output_text) as { reply: string; suggestions: string[] };
    return { ok: true, reply: parsed.reply, suggestions: parsed.suggestions };
  } catch (error) {
    console.error('getConversationSupport failed', error);
    return {
      ok: false,
      error: "Couldn't reach your AI partner. Please check your connection and try again.",
    };
  }
}
