export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const BUCKET_NAME = process.env.FIREBASE_STORAGE_BUCKET;

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: BUCKET_NAME,
  });
}

const storageBucket = getStorage().bucket(BUCKET_NAME);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createAudio(text) {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'shimmer',
    input: text,
    response_format: 'mp3',
    speed: 1,
  });
  return Buffer.from(await response.arrayBuffer());
}

async function saveAudio(buffer, filename) {
  const file = storageBucket.file(filename);

  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType: 'audio/mpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });

  await file.makePublic();

  const bucketName = storageBucket.name;
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filename
  )}?alt=media`;
}

export async function POST(req) {
  try {
    const { topic, numSummaries = 1, lengthMinutes = 10 } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
    }

    const prompt = `
You are an adult bedtime storyteller.
Generate ${numSummaries} story summaries about "${topic}", each suitable for a ${lengthMinutes}-minute narrated sleep story.
OUTPUT ONLY a JSON array like:
[
  { "title": "…", "summary": "…" }
]
`.trim();

    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 400,
    });

    const rawText = result.choices?.[0]?.message?.content ?? '';
    const jsonMatch = rawText.match(/\[.*\]/s);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI returned no JSON array' }, { status: 500 });
    }

    const storyList = JSON.parse(jsonMatch[0]);

    const finalStories = await Promise.all(
      storyList.map(async (story) => {
        try {
          const fullText = `${story.title}. ${story.summary}`;
          const audioData = await createAudio(fullText);

          const cleanTitle = (story.title || 'story')
            .toString()
            .replace(/[^a-z0-9]+/gi, '_')
            .toLowerCase();

          const audioFile = `stories_audio/${Date.now()}_${cleanTitle}_${
            Math.floor(Math.random() * 1e6)
          }.mp3`;

          const audioUrl = await saveAudio(audioData, audioFile);
          return { ...story, audioUrl };
        } catch (e) {
          console.error('Audio gen/upload failed:', e);
          return { ...story, audioUrl: null };
        }
      })
    );

    return NextResponse.json({ stories: finalStories });
  } catch (err) {
    console.error('Generation error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}