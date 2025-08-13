'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export default function PlaybackPage({ stories, onNavigate, settings = {} }) {
  const musicRef = useRef(null);
  const voiceRef = useRef(null);
  const timerRef = useRef(null);

  const [musicVol, setMusicVol] = useState(0.3);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const speed = settings.rate ?? 1.0;

  useEffect(() => {
    const musicId = settings.backgroundMusic ?? 'no-music';
    const musicUrl = `/music/${encodeURIComponent(musicId)}.mp3`;

    try {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.src = '';
      }
      const bgTrack = new Audio(musicUrl);
      bgTrack.loop = true;
      bgTrack.volume = musicVol;
      musicRef.current = bgTrack;
    } catch {}
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.src = '';
      }
    };
  }, [settings.backgroundMusic]);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = musicVol;
  }, [musicVol]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopEverything = () => {
    clearTimer();
    try { window.speechSynthesis.cancel(); } catch {}
    setPlaying(false);
    setLoading(false);
    setCurrentProgress(0);

    if (voiceRef.current) {
      try {
        voiceRef.current.pause();
        voiceRef.current.src = '';
        voiceRef.current.removeAttribute('src');
        voiceRef.current.load();
      } catch {}
      voiceRef.current = null;
    }
    if (musicRef.current) {
      try {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      } catch {}
    }
  };

  const speakText = (text) => {
    stopEverything();
    setLoading(true);

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = speed;

    speech.onstart = () => {
      setLoading(false);
      setPlaying(true);
      musicRef.current?.play().catch(() => {});
      const wordCount = text.trim().split(/\s+/).length;
      const totalTime = Math.max(wordCount / 3, 1) / speed;
      let time = 0;
      clearTimer();
      timerRef.current = setInterval(() => {
        time += 0.25;
        setCurrentProgress(Math.min(time / totalTime, 1));
        if (time >= totalTime) clearTimer();
      }, 250);
    };

    speech.onend = () => stopEverything();

    try {
      window.speechSynthesis.speak(speech);
    } catch (e) {
      console.error('TTS failed:', e);
      setLoading(false);
      alert('Your browser blocked TTS.');
    }
  };

  const playAudio = (story) => {
    stopEverything();

    if (story.audioUrl) {
      setLoading(true);

      const audioTrack = new Audio(story.audioUrl);
      audioTrack.preload = 'auto';

      audioTrack.addEventListener('canplay', () => {
        setLoading(false);
        setPlaying(true);

        audioTrack.addEventListener('timeupdate', () => {
          if (Number.isFinite(audioTrack.duration) && audioTrack.duration > 0) {
            setCurrentProgress(Math.min(audioTrack.currentTime / audioTrack.duration, 1));
          }
        });

        musicRef.current?.play().catch(() => {});
        audioTrack.play().catch((err) => {
          console.error('Narration play rejected:', err);
          alert('Autoplay was blocked — click Play again.');
        });
      });

      audioTrack.addEventListener('ended', stopEverything);
      audioTrack.addEventListener('error', (e) => {
        console.error('Audio element error:', e);
        setLoading(false);
        alert('Could not play narration audio.');
      });

      voiceRef.current = audioTrack;
      audioTrack.load();
      return;
    }

    const storyText = `${story.title}. ${story.summary}`;
    speakText(storyText);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <button
        onClick={() => { stopEverything(); onNavigate('generate'); }}
        className="mb-6 text-sm text-purple-600 hover:underline"
      >
        ← Back to Generate
      </button>

      <div className="mb-4 flex items-center space-x-2">
        <label className="text-sm font-medium">Music volume:</label>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={musicVol}
          onChange={(e) => setMusicVol(parseFloat(e.target.value))}
        />
      </div>

      <Swiper slidesPerView={1} centeredSlides pagination={{ clickable: true }}>
        {stories.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-700 mb-4">{s.summary}</p>

              {s.audioUrl && (
                <p className="text-xs text-gray-500 mb-2 break-all">
                  Audio:{" "}
                  <a className="underline" href={s.audioUrl} target="_blank" rel="noreferrer">
                    {s.audioUrl}
                  </a>
                </p>
              )}

              <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${currentProgress * 100}%` }}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => playAudio(s)}
                  disabled={playing || loading}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                    (playing || loading)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {loading ? 'Loading…' : (playing ? 'Playing…' : 'Play')}
                </button>

                <button
                  onClick={stopEverything}
                  disabled={!playing && !loading}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                    (playing || loading)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Stop
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}