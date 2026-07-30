import { getOpenAIClient } from '@/lib/ai/client';
import { AI_PARTNER_MAX_SPEECH_GENERATIONS } from './types';
import type { AIPartnerSpeechRequest } from './types';

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'tts-1-hd';
const TTS_VOICE = (process.env.OPENAI_TTS_VOICE || 'alloy') as
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';

export type AIPartnerSpeechResult = { ok: true; audio: Buffer } | { ok: false; error: string };

/**
 * Generates speech for a single AI Partner reply, on request. Nothing is
 * written to disk — the audio exists only as bytes returned to the caller,
 * per AI_TALK_ACTIVITY_DESIGN.md §4a ("not permanently stored").
 */
export async function getAIPartnerSpeech(request: AIPartnerSpeechRequest): Promise<AIPartnerSpeechResult> {
  if (request.speechGenerationCountSoFar >= AI_PARTNER_MAX_SPEECH_GENERATIONS) {
    return { ok: false, error: 'Speech generation limit reached for this session.' };
  }

  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      error: "Speech isn't configured yet. Add an OPENAI_API_KEY to .env.local and restart the server.",
    };
  }

  try {
    const response = await client.audio.speech.create({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: request.text,
      response_format: 'mp3',
    });

    const audio = Buffer.from(await response.arrayBuffer());
    return { ok: true, audio };
  } catch (error) {
    console.error('getAIPartnerSpeech failed', error);
    return { ok: false, error: "Couldn't generate speech for this reply." };
  }
}
