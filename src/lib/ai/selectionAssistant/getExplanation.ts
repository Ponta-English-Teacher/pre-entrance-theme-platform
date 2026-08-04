import { getOpenAIClient, OPENAI_MODEL } from '@/lib/ai/client';
import { buildSelectionAssistantPrompt } from './prompt';
import type { SelectionAssistantRequest, SelectionAssistantResponse } from './types';

export async function getSelectionExplanation(request: SelectionAssistantRequest): Promise<SelectionAssistantResponse> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "The AI selection assistant isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  const { systemInstructions, input } = buildSelectionAssistantPrompt(request);

  try {
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: systemInstructions,
      input,
    });

    const explanation = response.output_text.trim();
    return { ok: true, explanation };
  } catch (error) {
    console.error('getSelectionExplanation failed', error);
    return {
      ok: false,
      error: "Couldn't reach the AI assistant. Please check your connection and try again.",
    };
  }
}
