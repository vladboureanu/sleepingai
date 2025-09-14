
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { adminAuth, adminDb, adminBucket } from '@/app/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import textToSpeech from '@google-cloud/text-to-speech';

const COST = 5;


function parseAuth(req) {
  const a = req.headers.get('authorization') || '';
  return a.startsWith('Bearer ') ? a.slice(7) : null;
}
async function readJson(req) {
  try { return await req.json(); } catch { return {}; }
}

function buildPrompt({ title, prompt, options }) {
  const { topic, lengthMin, music, voice } = options || {};
  const len = Number(lengthMin) || 5;
  return `
You are a bedtime-story author. Write a calming, imaginative, G-rated story.

Title: ${title || 'Untitled Bedtime Story'}
Topic: ${topic || 'Nature'}
Desired length: ~${len} minutes of narration.
Tone: Soothing, gentle, and cozy for bedtime.
Optional background music: ${music || 'Ambient'} (do NOT describe the music)
Voice: ${voice || 'Female'} (used for TTS; do not mention voice in the story)

Additional direction from user (optional):
${(prompt || '').trim()}

Output:
- A single continuous narrative (no chapters)
- ~${len} minutes when read calmly
- No violence, no distressing themes
`.trim();
}

function ttsClient() {
  if (process.env.GCP_TTS_CREDENTIALS) {
    try { return new textToSpeech.TextToSpeechClient({ credentials: JSON.parse(process.env.GCP_TTS_CREDENTIALS) }); } catch {}
  }
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    try {
      const sa = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
      return new textToSpeech.TextToSpeechClient({
        credentials: { client_email: sa.client_email, private_key: sa.private_key },
        projectId: sa.project_id,
      });
    } catch {}
  }
  if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return new textToSpeech.TextToSpeechClient({
      credentials: {
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    });
  }
  return new textToSpeech.TextToSpeechClient();
}

async function synthesizeMp3(text, voiceChoice = 'Female') {
  const client = ttsClient();

  const isMale = String(voiceChoice).toLowerCase().startsWith('m');

  
  const primary = isMale
    ? { languageCode: 'en-GB', name: 'en-GB-Neural2-D', ssmlGender: 'MALE' }
    : { languageCode: 'en-GB', name: 'en-GB-Neural2-C', ssmlGender: 'FEMALE' };

  
  const fallback = isMale
    ? { languageCode: 'en-US', name: 'en-US-Neural2-D', ssmlGender: 'MALE' }
    : { languageCode: 'en-US', name: 'en-US-Neural2-F', ssmlGender: 'FEMALE' };

  const synth = async (voiceParams) => {
    const [res] = await client.synthesizeSpeech({
      input: { text },
      voice: voiceParams,
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        
      },
    });
    if (res.audioContent instanceof Uint8Array) return Buffer.from(res.audioContent);
    if (typeof res.audioContent === 'string') return Buffer.from(res.audioContent, 'base64');
    throw new Error('TTS returned no audio content');
  };

  try {
    return await synth(primary);
  } catch (e) {
    
    return await synth(fallback);
  }
}

async function generateStoryText(title, prompt, options) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const res = await model.generateContent(buildPrompt({ title, prompt, options }));
  const txt = typeof res?.response?.text === 'function' ? res.response.text() : res?.response?.text;
  const text = (txt || '').toString().trim();
  if (!text) throw new Error('Gemini returned empty text');
  return text;
}


async function fetchWithTimeout(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { redirect: 'follow', cache: 'no-store', signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}
function coverKeywordsForTopic(topic = 'Nature') {
  const t = (topic || '').toLowerCase();
  if (t.includes('space')) return 'night sky, stars, moon, dreamy';
  if (t.includes('music')) return 'music, lullaby, soft lights';
  if (t.includes('science')) return 'soft laboratory, glowing jars';
  if (t.includes('invention') || t.includes('technology')) return 'cozy workshop, gears';
  if (t.includes('myth')) return 'mythical forest, fireflies';
  if (t.includes('mind')) return 'calm ocean, pastel gradient';
  if (t.includes('history')) return 'old library, warm light';
  return 'forest, fireflies, dreamy, moonlight';
}
function svgFallback(topic = 'Bedtime') {
  const safe = String(topic).slice(0, 40);
  return Buffer.from(
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#E9D5FF"/><stop offset="100%" stop-color="#BFDBFE"/>
  </linearGradient></defs>
  <rect width="1024" height="768" fill="url(#g)"/>
  <text x="50%" y="55%" font-family="Poppins, Arial" font-size="48" text-anchor="middle" fill="#1f2937" opacity=".8">${safe}</text>
</svg>`,
    'utf-8'
  );
}

async function makeCoverBuffer(topic) {
  const kw = encodeURIComponent(coverKeywordsForTopic(topic));
  try {
    const r = await fetchWithTimeout(`https://source.unsplash.com/1024x768/?${kw}`);
    if (r.ok) {
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length) return { buffer: b, contentType: 'image/jpeg', extension: 'jpg' };
    }
  } catch {}
  try {
    const r = await fetchWithTimeout(`https://picsum.photos/seed/${encodeURIComponent(topic || 'sleeping-ai')}/1024/768.jpg`);
    if (r.ok) {
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length) return { buffer: b, contentType: 'image/jpeg', extension: 'jpg' };
    }
  } catch {}
  return { buffer: svgFallback(topic), contentType: 'image/svg+xml', extension: 'svg' };
}


export async function GET() {
  try {
    const bucketName = adminBucket?.name || '(none)';
    const [exists] = adminBucket ? await adminBucket.exists() : [false];
    return NextResponse.json({ ok: true, bucket: bucketName, bucketExists: exists });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const idToken = parseAuth(req);
    if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const { title = '', prompt = '', options = {} } = await readJson(req);

    
    const userRef = adminDb.collection('users').doc(uid);
    const storiesRef = adminDb.collection('stories');
    const userStoriesRef = userRef.collection('stories');

    
    let authorName =
      decoded.name ||
      (decoded.email ? decoded.email.replace(/@.*/, '') : null);
    try {
      const doc = await userRef.get();
      if (doc.exists) {
        const d = doc.data() || {};
        authorName = d.displayName || d.name || authorName || 'Anonymous';
      }
    } catch {}

    const storyId = uuid();
    let remainingCredits = null;
    const now = FieldValue.serverTimestamp();

    
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error('User not found');
      const credits = snap.data().credits ?? 0;
      if (credits < COST) {
        const err = new Error('Not enough credits');
        err.status = 402;
        throw err;
      }
      tx.update(userRef, { credits: credits - COST });

      
      tx.set(userStoriesRef.doc(storyId), {
        uid,
        title: title || 'Untitled',
        authorName,
        topic: options.topic || null,
        lengthMin: Number(options.lengthMin) || 5,
        music: options.music || null,
        voice: options.voice || 'Female',
        cost: COST,
        createdAt: now,
        updatedAt: now,
        public: false,
        private: true,
        text: null,
        audioPath: null,
        audioUrl: null,
        coverPath: null,
        coverUrl: null,
      });

      
      tx.set(storiesRef.doc(storyId), {
        uid,
        title: title || 'Untitled',
        authorName,
        topic: options.topic || null,
        createdAt: now,
        updatedAt: now,
        public: false,
        private: true,
        text: null,
        audioPath: null,
        audioUrl: null,
        coverPath: null,
        coverUrl: null,
      });

      remainingCredits = credits - COST;
    });

    
    const text = await generateStoryText(title, prompt, options);

    
    const mp3 = await synthesizeMp3(text, options.voice);
    const audioPath = `stories/${uid}/${storyId}.mp3`;
    const audioToken = uuid();
    await adminBucket.file(audioPath).save(mp3, {
      contentType: 'audio/mpeg',
      resumable: false,
      metadata: {
        cacheControl: 'public,max-age=3600',
        metadata: { firebaseStorageDownloadTokens: audioToken },
      },
    });

    const bucketName = process.env.GCS_BUCKET || adminBucket.name;
    const audioUrl =
      `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/` +
      `${encodeURIComponent(audioPath)}?alt=media&token=${audioToken}`;

    
    const { buffer: coverBuf, contentType: coverType, extension: ext } = await makeCoverBuffer(options.topic);
    const coverPath = `stories/${uid}/${storyId}.${ext}`;
    const coverToken = uuid();
    await adminBucket.file(coverPath).save(coverBuf, {
      contentType: coverType,
      resumable: false,
      metadata: {
        cacheControl: 'public,max-age=86400',
        metadata: { firebaseStorageDownloadTokens: coverToken },
      },
    });
    const coverUrl =
      `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/` +
      `${encodeURIComponent(coverPath)}?alt=media&token=${coverToken}`;

    
    const patch = {
      text,
      audioPath,
      audioUrl,
      coverPath,
      coverUrl,
      updatedAt: FieldValue.serverTimestamp(),
    };
    await Promise.all([
      userRef.collection('stories').doc(storyId).set(patch, { merge: true }),
      storiesRef.doc(storyId).set(patch, { merge: true }),
      userRef.collection('transactions').add({
        type: 'debit',
        amount: COST,
        title: 'Story generation',
        createdAt: FieldValue.serverTimestamp(),
        ref: storyId,
      }),
    ]);

    return NextResponse.json({ storyId, remainingCredits });
  } catch (err) {
    const status = err.status || 500;
    console.error('Generate error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status });
  }
}
