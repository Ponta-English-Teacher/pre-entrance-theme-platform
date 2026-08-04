import { getOpenAIClient } from '@/lib/ai/client';

const TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'tts-1-hd';
const TTS_VOICE = (process.env.OPENAI_TTS_VOICE || 'alloy') as
  | 'alloy'
  | 'echo'
  | 'fable'
  | 'onyx'
  | 'nova'
  | 'shimmer';

export type SelectionSpeechResult = { ok: true; audio: Buffer } | { ok: false; error: string };

/**
 * Generates speech for arbitrary student-selected text ("How to Read"), on
 * request — mirrors src/lib/ai/aiPartner/getSpeech.ts exactly. Distinct from
 * the pre-generated passage audio (READING_PASSAGE_AUDIO_DESIGN.md): that
 * system serves fixed, known-in-advance content; this one serves whatever
 * arbitrary text the student happens to select, so it can't be pre-rendered.
 * Nothing is written to disk — audio exists only as bytes returned to the caller.
 */
export async function getSelectionSpeech(text: string): Promise<SelectionSpeechResult> {
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
      input: text,
      response_format: 'mp3',
    });

    const audio = Buffer.from(await response.arrayBuffer());
    return { ok: true, audio };
  } catch (error) {
    console.error('getSelectionSpeech failed', error);
    return { ok: false, error: "Couldn't generate audio for this text." };
  }
}
