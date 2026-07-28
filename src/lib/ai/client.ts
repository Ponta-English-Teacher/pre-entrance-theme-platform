import OpenAI from 'openai';

/**
 * Shared OpenAI client — generic infrastructure, not specific to any one
 * feature. Returns null (rather than throwing) when no API key is
 * configured, so callers can degrade gracefully instead of crashing.
 */

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.5';
