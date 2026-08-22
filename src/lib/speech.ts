/**
 * Shared client-side helper for the existing server-side TTS endpoint
 * (/api/selection-assistant/speech) — the same one VocabDictionaryModal's
 * own pronunciation button already calls. Extracted here so a second call
 * site (Portfolio's My Vocabulary) doesn't duplicate the fetch/blob/Audio
 * logic; VocabDictionaryModal itself is left untouched.
 */
export async function speakText(text: string): Promise<'ok' | 'error'> {
  try {
    const res = await fetch('/api/selection-assistant/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return 'error';
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    await audio.play();
    return 'ok';
  } catch {
    return 'error';
  }
}
