import { getOpenAIClient, OPENAI_MODEL } from '@/lib/ai/client';
import { buildVocabLookupPrompt } from './prompt';
import type { GeneratedVocabEntry, VocabLookupRequest, VocabLookupResponse } from './types';

export async function getGeneratedVocabEntry(request: VocabLookupRequest): Promise<VocabLookupResponse> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "Vocabulary lookup isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  const { systemInstructions, input, schema } = buildVocabLookupPrompt(request);

  try {
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: systemInstructions,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: 'vocab_lookup_entry',
          schema,
          strict: true,
        },
      },
    });

    const entry = JSON.parse(response.output_text) as GeneratedVocabEntry;
    return { ok: true, entry };
  } catch (error) {
    console.error('getGeneratedVocabEntry failed', error);
    return {
      ok: false,
      error: "Couldn't generate a vocabulary card for this word.",
    };
  }
}
