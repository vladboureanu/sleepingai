// app/generate/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import Header from '@/components/Header';

const TOPICS = [
  'Nature',
  'Music',
  'Science',
  'Inventions & Technology',
  'Space & Astronomy',
  'Mythology',
  'Mindfulness & Emotions',
  'History',
];

const LENGTHS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '20 min', value: 20 },
];

const MUSIC = ['Ambient', 'Rain & Thunder', 'Nature Sounds', 'No Music'];

const ENHANCERS = [
  'Add a peaceful twist at the end',
  'Make it feel like a dream',
  'Include a moment of wonder',
  'Let the story begin with a surprise',
  'End with a calming message',
];

export default function GeneratePage() {
  const router = useRouter();

  // compact defaults
  const [topic, setTopic] = useState('Nature');
  const [lengthMin, setLengthMin] = useState(5);
  const [music, setMusic] = useState('Ambient');
  const [voice, setVoice] = useState('Female');

  const [title, setTitle] = useState('');
  const [extra, setExtra] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showAllTopics, setShowAllTopics] = useState(false);

  const topicsToRender = showAllTopics ? TOPICS : TOPICS.slice(0, 4);

  const addEnhancer = (text) => {
    if (!extra.toLowerCase().includes(text.toLowerCase())) {
      setExtra((p) => (p ? `${p.trim()} ${text}.` : `${text}.`));
    }
  };

  const backToDashboard = () => router.push('/dashboard');

  const doGenerate = async () => {
    setError('');
    setBusy(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Please sign in to generate a story.');

      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          title,
          prompt: extra,
          options: { topic, lengthMin, music, voice },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Generation failed.');
      router.push(`/story/${data.storyId}`);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Header current="generate" />

      {/* Wider, compact card */}
      <section className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white/95 backdrop-blur p-4 md:p-5 shadow-2xl relative">
        {/* back chevron */}
        <button
          onClick={backToDashboard}
          className="absolute right-3 top-3 h-7 w-7 grid place-items-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          title="Back to Dashboard"
          aria-label="Back"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

       

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Topic */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Topic</h3>
              <div className="grid grid-cols-2 gap-y-1">
                {topicsToRender.map((t) => (
                  <label key={t} className="flex items-center gap-2 text-[13px] text-neutral-800">
                    <input
                      type="radio"
                      name="topic"
                      className="h-3.5 w-3.5 accent-purple-600"
                      checked={topic === t}
                      onChange={() => setTopic(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
              {TOPICS.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllTopics((v) => !v)}
                  className="mt-2 text-xs text-purple-700 hover:underline"
                >
                  {showAllTopics ? 'Show fewer topics' : 'Show more topics'}
                </button>
              )}
            </div>

            {/* Length */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Narration Length</h3>
              <div className="space-y-1">
                {LENGTHS.map((l) => (
                  <label key={l.value} className="flex items-center gap-2 text-[13px] text-neutral-800">
                    <input
                      type="radio"
                      name="length"
                      className="h-3.5 w-3.5 accent-purple-600"
                      checked={lengthMin === l.value}
                      onChange={() => setLengthMin(l.value)}
                    />
                    {l.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Background Music + Voice side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Background Music</h3>
                <div className="space-y-1">
                  {MUSIC.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-[13px] text-neutral-800">
                      <input
                        type="radio"
                        name="music"
                        className="h-3.5 w-3.5 accent-purple-600"
                        checked={music === m}
                        onChange={() => setMusic(m)}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Voice</h3>
                <div className="space-y-1">
                  {['Female', 'Male'].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-[13px] text-neutral-800">
                      <input
                        type="radio"
                        name="voice"
                        className="h-3.5 w-3.5 accent-purple-600"
                        checked={voice === v}
                        onChange={() => setVoice(v)}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Add Title</h3>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Magical Forest Adventure'"
                className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">Custom Prompt</h3>
              <textarea
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Further tweaks or story directions…"
                className="w-full min-h-[80px] rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <h4 className="text-xs font-medium text-neutral-700 mb-1.5">Enhance your story:</h4>
              <div className="flex flex-wrap gap-2">
                {ENHANCERS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => addEnhancer(chip)}
                    className="rounded-full border border-neutral-300 px-2.5 py-1 text-xs text-neutral-800 hover:bg-neutral-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <button
            onClick={doGenerate}
            disabled={busy}
            className="rounded-xl bg-[#5F3B56] px-5 py-2.5 text-sm text-white font-medium hover:bg-[#53344C] disabled:bg-neutral-400"
          >
            {busy ? 'Generating… (5 credits)' : 'Generate my Story (5 credits)'}
          </button>
        </div>
      </section>
    </main>
  );
}
