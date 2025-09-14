'use client';
import { useEffect, useRef, useState } from 'react';


function fmtTime(s) {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
}

const DEFAULT_COVER = '/images/LogoAudioPlayer.png';


const BG_TRACKS = {
  Ambient: '/music/ambient.mp3',
  'Rain & Thunder': '/music/rain-thunder.mp3',
  'Nature Sounds': '/music/nature.mp3',
};

export default function AudioPlayer({
  src,
  title = '',
  artist = '',
  cover,
  downloadName = 'story.mp3',
  onSave,
  saved = false,
  bgKey,           
  bgSrc,           
  initialBgVol = 0.25, 
}) {
  const audioRef = useRef(null);
  const bgRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(NaN);
  const [current, setCurrent] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);

  const [bgEnabled, setBgEnabled] = useState(true);
  const [bgVolume, setBgVolume] = useState(initialBgVol);

  const effectiveCover = cover || DEFAULT_COVER;
  const effectiveBgUrl =
    typeof bgSrc === 'string' && bgSrc
      ? bgSrc
      : (bgKey && BG_TRACKS[bgKey]) || null; 

  
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const markReady = () => {
      setDuration(a.duration || a.seekable?.end(0) || 0);
      setReady(true);
      setBufferedEnd(a.buffered.length ? a.buffered.end(a.buffered.length - 1) : 0);
      a.volume = volume;
      a.muted = muted;
    };

    const onTime = () => setCurrent(a.currentTime || 0);
    const onPlay = async () => {
      setPlaying(true);
      
      const bg = bgRef.current;
      if (bgEnabled && bg && effectiveBgUrl) {
        try {
          
          if (Math.abs((bg.currentTime || 0) - (a.currentTime || 0)) > 0.3) {
            bg.currentTime = a.currentTime || 0;
          }
          bg.volume = bgVolume;
          bg.loop = true;
          await bg.play();
        } catch {}
      }
    };
    const onPause = () => {
      setPlaying(false);
      const bg = bgRef.current;
      bg?.pause();
    };
    const onProg = () =>
      setBufferedEnd(a.buffered.length ? a.buffered.end(a.buffered.length - 1) : 0);
    const onEnded = () => {
      setPlaying(false);
      const bg = bgRef.current;
      bg?.pause();
    };
    const onSeeked = () => {
      const bg = bgRef.current;
      if (bg) bg.currentTime = a.currentTime || 0;
    };

    a.addEventListener('loadedmetadata', markReady);
    a.addEventListener('loadeddata', markReady);
    a.addEventListener('canplay', markReady);
    a.addEventListener('canplaythrough', markReady);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('progress', onProg);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    a.addEventListener('seeked', onSeeked);

    return () => {
      a.removeEventListener('loadedmetadata', markReady);
      a.removeEventListener('loadeddata', markReady);
      a.removeEventListener('canplay', markReady);
      a.removeEventListener('canplaythrough', markReady);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('progress', onProg);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('seeked', onSeeked);
    };
  }, [src, volume, muted, bgEnabled, bgVolume, effectiveBgUrl]);

  
  useEffect(() => {
    const bg = bgRef.current;
    if (bg) bg.volume = bgVolume;
  }, [bgVolume]);

  
  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) await a.play();
      else a.pause();
    } catch (err) {
      console.error('play/pause failed:', err);
    }
  };

  const seekRel = (delta) => {
    const a = audioRef.current;
    if (!a) return;
    const target = Math.max(0, Math.min((a.currentTime || 0) + delta, a.duration || 0));
    a.currentTime = target;
    const bg = bgRef.current;
    if (bg) bg.currentTime = target;
  };

  const onScrub = (e) => {
    const pct = parseFloat(e.target.value);
    const a = audioRef.current;
    if (!a || !Number.isFinite(duration) || duration <= 0) return;
    const t = (pct / 100) * duration;
    a.currentTime = t;
    const bg = bgRef.current;
    if (bg) bg.currentTime = t;
  };

  const pctPlayed = duration ? (current / duration) * 100 : 0;
  const pctBuffered = duration ? (bufferedEnd / duration) * 100 : 0;

  const setVol = (v) => {
    const a = audioRef.current;
    setVolume(v);
    if (a) a.volume = v;
    if (v > 0 && muted) setMuted(false);
    if (v === 0 && !muted) setMuted(true);
  };

  const toggleMute = () => {
    const a = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (a) a.muted = next;
  };

  return (
    <div className="w-full rounded-2xl bg-[#5F3B56] text-white shadow-xl" role="region" aria-label="Audio Player">
      
      <audio ref={audioRef} src={src} preload="auto" />
      
      {effectiveBgUrl && (
        <audio ref={bgRef} src={effectiveBgUrl} preload="auto" loop />
      )}

      <div className="flex flex-wrap items-center gap-4 px-4 py-3 md:px-5 md:py-4">
        
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="h-16 w-16 rounded-xl overflow-hidden bg-white/10 shrink-0">
            <img
              src={effectiveCover}
              alt=""
              className="h-full w-full object-cover"
              draggable="false"
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + DEFAULT_COVER) {
                  e.currentTarget.src = DEFAULT_COVER;
                }
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm md:text-base font-medium truncate">{title || 'Untitled story'}</div>
            <div className="text-xs md:text-sm text-white/80 truncate">{artist || 'Unknown user'}</div>
          </div>
        </div>

        
        <div className="flex-1 min-w-[260px] flex flex-col items-center">
          <div className="flex items-center gap-5 md:gap-6">
            <button onClick={() => seekRel(-15)} className="grid place-items-center h-8 w-8 rounded-full border border-white/60 hover:bg-white/10" aria-label="Back 15 seconds">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button onClick={togglePlay} className="grid place-items-center h-12 w-12 rounded-full border-2 border-white hover:bg-white/10" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5l12 7-12 7V5z" />
                </svg>
              )}
            </button>
            <button onClick={() => seekRel(15)} className="grid place-items-center h-8 w-8 rounded-full border border-white/60 hover:bg-white/10" aria-label="Forward 15 seconds">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-2 flex items-center w-full gap-2">
            <span className="text-xs tabular-nums text-white/80">{fmtTime(current)}</span>
            <div className="relative flex-1 h-2">
              <div className="absolute inset-0 rounded-full bg-white/20" />
              <div className="absolute inset-y-0 left-0 rounded-full bg-white/40" style={{ width: `${pctBuffered}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full bg-[#9EDBE1]" style={{ width: `${pctPlayed}%` }} />
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={pctPlayed}
                onChange={onScrub}
                className="absolute inset-0 w-full h-2 appearance-none bg-transparent cursor-pointer"
                aria-label="Seek"
              />
              <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  height: 12px;
                  width: 12px;
                  border-radius: 9999px;
                  background: #9edbe1;
                  border: 2px solid white;
                  margin-top: -5px;
                }
                input[type='range']::-moz-range-thumb {
                  height: 12px;
                  width: 12px;
                  border-radius: 9999px;
                  background: #9edbe1;
                  border: 2px solid white;
                }
              `}</style>
            </div>
            <span className="text-xs tabular-nums text-white/80">{fmtTime(duration)}</span>
          </div>
        </div>

        
        <div className="flex items-center gap-3">
          
          <button
            type="button"
            onClick={() => onSave && onSave()}
            className="grid place-items-center h-9 w-9 rounded-full bg-white border border-white/60 hover:bg-white/90"
            title={saved ? 'Saved to Private Library' : 'Save to Private Library'}
            aria-pressed={saved}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#FF5FA2' : 'none'} stroke="#FF5FA2" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.9 0 3.4 1 4.5 2.5C12.1 5 13.6 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
            </svg>
          </button>

          
          <button onClick={toggleMute} className="grid place-items-center h-8 w-8 rounded-full border border-white/60 hover:bg-white/10" aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 9L5 12h-3v0h3l4 3V9z" strokeWidth="2" />
                <path d="M23 1L1 23" strokeWidth="2" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 9L5 12H2v0h3l4 3V9z" strokeWidth="2" />
                <path d="M15 9c1.657 1.333 1.657 4.667 0 6" strokeWidth="2" />
                <path d="M18 7c3.5 3 3.5 8 0 11" strokeWidth="2" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            className="w-24 accent-[#9EDBE1]"
            aria-label="Voice volume"
          />

          
          {effectiveBgUrl && (
            <>
              <button
                onClick={() => {
                  const next = !bgEnabled;
                  setBgEnabled(next);
                  const bg = bgRef.current;
                  const a = audioRef.current;
                  if (!bg) return;
                  if (next && a && !a.paused) {
                    try {
                      bg.currentTime = a.currentTime || 0;
                      bg.volume = bgVolume;
                      bg.loop = true;
                      bg.play();
                    } catch {}
                  } else {
                    bg.pause();
                  }
                }}
                className={`grid place-items-center h-8 w-8 rounded-full border ${
                  bgEnabled ? 'border-white/60 hover:bg-white/10' : 'border-white/30 hover:bg-white/10 opacity-70'
                }`}
                aria-label={bgEnabled ? 'Disable background music' : 'Enable background music'}
                title={bgEnabled ? 'BG on' : 'BG off'}
              >
                ♪
              </button>
              <input
                type="range"
                min="0"
                max="0.6"
                step="0.01"
                value={bgEnabled ? bgVolume : 0}
                onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                className="w-20 accent-[#9EDBE1]"
                aria-label="Background volume"
                disabled={!bgEnabled}
              />
            </>
          )}

          
          {src && (
            <a
              href={src}
              download={downloadName}
              className="grid place-items-center h-8 w-8 rounded-full border border-white/60 hover:bg-white/10"
              title="Download"
            >
              ⤓
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
