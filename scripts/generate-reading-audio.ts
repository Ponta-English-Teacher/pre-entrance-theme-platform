/**
 * One-off content-authoring script — NOT part of the running app.
 *
 * Generates high-quality narration audio for Reading passage paragraphs using
 * OpenAI's TTS endpoint, once, and writes the result to public/audio/reading/.
 * Run this manually whenever a lesson's passage is authored or revised, then
 * commit both the passage text (in masterReadings.ts) and its audio together.
 *
 * Usage:
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/generate-reading-audio.ts
 *   (or: npm run generate:reading-audio)
 *
 * This script does not run at request time and is never called by a student
 * action — the app only ever plays back the static files it produces.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import { MASTER_READINGS } from '../src/data/reading/masterReadings';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'audio', 'reading');
const MODEL = process.env.OPENAI_TTS_MODEL || 'tts-1-hd';
const VOICE = (process.env.OPENAI_TTS_VOICE || 'alloy') as
  | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set. Run with: node --env-file=.env.local ...');
    process.exit(1);
  }

  const client = new OpenAI({ apiKey });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const paragraphs = MASTER_READINGS.flatMap(lesson => lesson.paragraphs);
  console.log(`Found ${paragraphs.length} paragraph(s) across ${MASTER_READINGS.length} lesson(s).`);

  for (const paragraph of paragraphs) {
    const outputPath = path.join(OUTPUT_DIR, `${paragraph.id}.mp3`);
    console.log(`Generating ${paragraph.id}.mp3 ...`);

    const response = await client.audio.speech.create({
      model: MODEL,
      voice: VOICE,
      input: paragraph.english,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(outputPath, buffer);
    console.log(`  -> wrote ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }

  console.log('\nDone. Remember to set each paragraph\'s `audioUrl` in masterReadings.ts to:');
  console.log('  /audio/reading/<paragraph-id>.mp3');
}

main().catch(err => {
  console.error('generate-reading-audio failed:', err);
  process.exit(1);
});
