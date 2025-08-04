'use client';

import { useState, useEffect } from 'react';

export default function PlayerControls({ onNavigate, storyTitle = "Road to Slumber", narrator = "Emily", darkMode, setDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(22); // 0:22
  const [duration, setDuration] = useState(262); // 4:22
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Format time in mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (currentTime / duration) * 100;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    console.log('Previous track');
  };

  const handleNext = () => {
    console.log('Next track');
  };

  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = Math.floor((newProgress / 100) * duration);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    if (parseInt(e.target.value) === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Site-wide dark overlay when dark mode is active */}
      {darkMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-0 transition-opacity duration-300"></div>
      )}
      
      {/* Make background text more readable in dark mode */}
      <style jsx global>{`
        ${darkMode ? `
          .bg-gradient-to-br {
            filter: brightness(1.2) contrast(1.1) !important;
          }
          h1, h2, p {
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
          }
        ` : ''}
      `}</style>
      
      <div className={`rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-95 p-6 max-w-6xl mx-auto relative z-10 transition-all duration-300 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-center mb-6 relative">        
          <h1 className={`text-xl font-semibold flex items-center transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Audio Control
          </h1>
          
          <div className="absolute right-0 flex items-center gap-3">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 mb-1 ${
                  darkMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`h-6 w-6 transform rounded-full bg-gray-800 flex items-center justify-center transition-transform duration-200 ${
                    darkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {darkMode ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </button>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Dark mode</span>
            </div>
            
            <button 
              onClick={() => onNavigate('generate')}
              className={`p-2 rounded-full transition-all duration-200 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <svg className={`w-6 h-6 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Story Text Content - Full text visible */}
        <div className={`mb-6 p-4 rounded-2xl transition-colors duration-300 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`leading-relaxed text-base transition-colors duration-300 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            As the last ember of sunlight disappeared behind the mountains, Elara tightened her cloak and stepped into the forest. The trees whispered secrets in a language only the wind understood, but she wasn't afraid. Deep in her pocket, the silver compass she found in her grandmother's attic began to glow its needle pointing toward something that didn't exist on any map. As the last ember of sunlight disappeared behind the mountains, Elara tightened her cloak and stepped into the forest. The trees whispered secrets in a language only the wind understood, but she wasn't afraid. Deep in her pocket, the silver compass she found in her grandmother's attic began to glow its needle pointing towards.
          </p>
        </div>

        {/* Compact Audio Player - Horizontal Design */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-4">
            
            {/* Album Art - Smaller */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=64&h=64&fit=crop&crop=center" 
                  alt="Story artwork" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Track Info - Compact */}
            <div className="min-w-0">
              <h3 className="font-bold text-base text-white truncate">{storyTitle}</h3>
              <p className="text-purple-100 text-sm">{narrator}</p>
            </div>

            {/* Action Buttons - Left side */}
            <div className="flex items-center gap-2 ml-4">
              <button className="p-2 rounded-full bg-purple-500 hover:bg-purple-400 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
              </button>

              <button className="p-2 rounded-full bg-purple-500 hover:bg-purple-400 transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            {/* Main Playback Controls - Center */}
            <div className="flex items-center gap-1 mx-8">
              <button 
                onClick={handlePrevious}
                className="p-2 hover:bg-purple-500 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button 
                onClick={handlePlayPause}
                className="p-3 bg-white rounded-full text-purple-600 hover:bg-gray-100 transition-all duration-200 shadow-lg mx-2"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button 
                onClick={handleNext}
                className="p-2 hover:bg-purple-500 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>

            {/* Progress Bar Section - Takes remaining space */}
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-100 text-xs">{formatTime(currentTime)}</span>
                
                <div 
                  className="flex-1 h-1 bg-purple-400 rounded-full cursor-pointer relative"
                  onClick={handleProgressChange}
                >
                  <div 
                    className="h-full bg-white rounded-full relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
                
                <span className="text-purple-100 text-xs flex items-center gap-1">
                  {formatTime(duration)}
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Additional Controls */}
              <button className="p-2 hover:bg-purple-500 rounded-full transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </button>

              <button className="p-2 hover:bg-purple-500 rounded-full transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-1">
                <button onClick={toggleMute} className="p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {isMuted || volume === 0 ? (
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    ) : (
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    )}
                  </svg>
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-purple-300 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${isMuted ? 0 : volume}%, rgba(255,255,255,0.3) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.3) 100%)`
                  }}
                />
              </div>

              {/* Fullscreen */}
              <button className="p-2 hover:bg-purple-500 rounded-full transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}