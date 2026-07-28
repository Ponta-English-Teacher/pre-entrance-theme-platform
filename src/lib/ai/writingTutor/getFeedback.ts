import { getOpenAIClient, OPENAI_MODEL } from '@/lib/ai/client';
import { buildWritingTutorPrompt } from './prompt';
import type { WritingFeedbackResult, WritingTutorRequest, WritingTutorResponse } from './types';

export async function getWritingFeedback(request: WritingTutorRequest): Promise<WritingTutorResponse> {
  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "The AI writing tutor isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  const { systemInstructions, input, schema } = buildWritingTutorPrompt(request);

  try {
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      instructions: systemInstructions,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: 'writing_tutor_feedback',
          schema,
          strict: true,
        },
      },
    });

    const feedback = JSON.parse(response.output_text) as WritingFeedbackResult;
    return { ok: true, feedback };
  } catch (error) {
    console.error('getWritingFeedback failed', error);
    return {
      ok: false,
      error: "Couldn't reach the AI writing tutor. Please check your connection and try again.",
    };
  }
}
