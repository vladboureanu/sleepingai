// app/components/PlaybackPage.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export default function PlaybackPage({ stories, onNavigate, settings = {} }) {
  const [voices, setVoices]         = useState([]);
  const [femaleList, setFemaleList] = useState([]);
  const [maleList, setMaleList]     = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress]     = useState(0);
  const [rate, setRate]             = useState(settings.rate ?? 1.0);
  const [bgVolume, setBgVolume]     = useState(0.3);

  const bgAudioRef = useRef(null);

  // 📀 Initialize / reload background audio when choice changes
  useEffect(() => {
    const bgId     = settings.backgroundMusic ?? 'no-music';
    const fileName = `${bgId}.mp3`;
    const url      = `/music/${encodeURIComponent(fileName)}`;

    console.log('🔊 Loading background track:', url);

    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = '';
    }

    const audio = new Audio(url);
    audio.loop   = true;
    audio.volume = bgVolume;
    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [settings.backgroundMusic]);

  // 🔉 Keep volume in sync
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume;
    }
  }, [bgVolume]);

  // 🗣️ Load and classify available TTS voices
  useEffect(() => {
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;

      console.log('Available voices:', all.map(v => v.name));

      // match common female names/keyphrases
      const females = all.filter(v =>
        /(female|zira|samantha|victoria|google uk english female|apple siri)/i.test(v.name)
      );

      // match common male names/keyphrases
      const males = all.filter(v =>
        /(male|david|alex|google uk english male|microsoft)/i.test(v.name)
      );

      console.log('Female voices:', females.map(v => v.name));
      console.log('Male voices:', males.map(v => v.name));

      setVoices(all);
      setFemaleList(females);
      setMaleList(males);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 🚫 Stop everything
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsLoading(false);
    setProgress(0);
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.currentTime = 0;
    }
  };

  // ▶️ Speak + play background
  const speak = (text) => {
    stop();
    setIsLoading(true);

    // rough duration estimate: 3 wps
    const words = text.trim().split(/\s+/).length;
    const durationSec = Math.max(words / 3, 1);

    const utter = new SpeechSynthesisUtterance(text);

    // choose female or male list, fallback to full
    const list = settings.voice === 'female'
      ? (femaleList.length ? femaleList : voices)
      : (maleList.length   ? maleList   : voices);

    utter.voice = list[0] || null;
    utter.rate  = rate;

    utter.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
      bgAudioRef.current?.play();

      let elapsed = 0;
      const id = setInterval(() => {
        elapsed += 0.5;
        setProgress(Math.min(elapsed / durationSec, 1));
        if (elapsed >= durationSec) clearInterval(id);
      }, 500);
    };

    utter.onend = stop;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* ← Back */}
      <button
        onClick={() => { stop(); onNavigate('generate'); }}
        className="mb-6 text-sm text-purple-600 hover:underline"
      >
        ← Back to Generate
      </button>

      {/* Volume slider */}
      <div className="mb-4 flex items-center space-x-2">
        <label className="text-sm font-medium">Music volume:</label>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={bgVolume}
          onChange={e => setBgVolume(parseFloat(e.target.value))}
        />
      </div>

      {/* Story swiper */}
      <Swiper slidesPerView={1} centeredSlides pagination={{ clickable: true }}>
        {stories.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-700 mb-4">{s.summary}</p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => speak(s.summary)}
                  disabled={isSpeaking || isLoading}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                    (isSpeaking || isLoading)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isLoading
                    ? <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                    : (isSpeaking ? 'Speaking…' : 'Play')}
                </button>

                <button
                  onClick={stop}
                  disabled={!isSpeaking && !isLoading}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                    (isSpeaking || isLoading)
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
