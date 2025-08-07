// app/api/generateStories/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// --- Firebase Admin (singleton) ---------------------------------------------
import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Expect FIREBASE_STORAGE_BUCKET like: sleepingai-5abd2.firebasestorage.app
const BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),   // uses GOOGLE_APPLICATION_CREDENTIALS
    storageBucket: BUCKET,
  });
}

const bucket = getStorage().bucket(BUCKET);

// --- OpenAI ------------------------------------------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create MP3 from text
async function synthesizeAudio(text) {
  const res = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'shimmer',
    input: text,
    response_format: 'mp3',
    speed: 1,
  });
  return Buffer.from(await res.arrayBuffer());
}

// Upload to Firebase Storage and return a *Firebase alt=media* URL
async function uploadAudio(buffer, filename) {
  const file = bucket.file(filename);

  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType: 'audio/mpeg',
      cacheControl: 'public, max-age=31536000',
    },
  });

  // Public read so browsers can fetch it directly
  await file.makePublic();

  const bucketName = bucket.name; // e.g. sleepingai-5abd2.firebasestorage.app
  // This URL is the most reliable with <audio> elements
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    filename
  )}?alt=media`;
}

// --- Route handler -----------------------------------------------------------
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 400,
    });

    const raw = completion.choices?.[0]?.message?.content ?? '';
    const match = raw.match(/\[.*\]/s);
    if (!match) {
      return NextResponse.json({ error: 'AI returned no JSON array' }, { status: 500 });
    }

    const stories = JSON.parse(match[0]);

    const storiesWithAudio = await Promise.all(
      stories.map(async (s) => {
        try {
          const text = `${s.title}. ${s.summary}`;
          const audioBuffer = await synthesizeAudio(text);

          const safeTitle = (s.title || 'story')
            .toString()
            .replace(/[^a-z0-9]+/gi, '_')
            .toLowerCase();

          const filename = `stories_audio/${Date.now()}_${safeTitle}_${
            Math.floor(Math.random() * 1e6)
          }.mp3`;

          const audioUrl = await uploadAudio(audioBuffer, filename);
          return { ...s, audioUrl };
        } catch (e) {
          console.error('Audio gen/upload failed:', e);
          return { ...s, audioUrl: null };
        }
      })
    );

    return NextResponse.json({ stories: storiesWithAudio });
  } catch (err) {
    console.error('Generation error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
