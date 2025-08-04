'use client';

import { useEffect, useRef } from 'react';

export default function Header({ credits, showMenu, setShowMenu, onNavigate, currentView, darkMode = false }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu, setShowMenu]);

  return (
    <div className="relative z-20">
      {/* Header Controls */}
      <div className="flex justify-end items-center p-6">
        <div className="flex items-center gap-4">
          {/* Clickable Credits Display - Dark Mode Responsive */}
          <button 
            onClick={() => onNavigate('credits')}
            className={`backdrop-blur-md rounded-2xl px-5 py-2 flex items-center gap-3 shadow-lg border transition-all duration-300 cursor-pointer ${
              darkMode 
                ? 'bg-gray-800 bg-opacity-90 border-gray-700 hover:bg-opacity-100' 
                : 'bg-white bg-opacity-90 border-white border-opacity-30 hover:bg-opacity-100'
            }`}
          >
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">💰</span>
            </div>
            <span className={`font-medium text-lg transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Credits : {credits}
            </span>
          </button>
          
          {/* Menu Button - Dark Mode Responsive */}
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className={`backdrop-blur-sm rounded-xl p-3 transition-all duration-300 shadow-lg border ${
              darkMode
                ? 'bg-gray-800 bg-opacity-80 border-gray-700 hover:bg-opacity-90'
                : 'bg-white bg-opacity-80 border-white border-opacity-30 hover:bg-opacity-90'
            }`}
          >
            <svg className={`w-6 h-6 transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conditional Logo/Header based on current page - Enhanced Dark Mode Text Shadows */}
      {currentView === 'generate' ? (
        <div>
          {/* Normal size logo for generate page */}
          <div className="text-center px-4 pb-6">
            <h1 className={`text-6xl md:text-7xl font-light text-white text-center tracking-tight mb-2 transition-all duration-300 ${
              darkMode ? 'drop-shadow-2xl' : 'drop-shadow-lg'
            }`} style={{ textShadow: darkMode ? '0 0 20px rgba(0,0,0,0.9), 2px 2px 8px rgba(0,0,0,1)' : '' }}>
              Sleeping<span className="text-purple-600 font-medium">AI</span>
            </h1>
            <p className={`text-xl md:text-2xl text-center font-normal opacity-90 transition-all duration-300 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
              Your Bedtime, Reimagined.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center px-4 pb-8">
          <h1 className={`text-6xl md:text-7xl font-light text-white text-center tracking-tight mb-2 transition-all duration-300 ${
            darkMode ? 'drop-shadow-2xl' : 'drop-shadow-lg'
          }`} style={{ textShadow: darkMode ? '0 0 20px rgba(0,0,0,0.9), 2px 2px 8px rgba(0,0,0,1)' : '' }}>
            Sleeping<span className="text-purple-600 font-medium">AI</span>
          </h1>
          <p className={`text-xl md:text-2xl text-center font-normal opacity-90 transition-all duration-300 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
            Your Bedtime, Reimagined.
          </p>
        </div>
      )}

      {/* Menu - Dark Mode Responsive */}
      {showMenu && (
        <div ref={menuRef} className="fixed top-20 right-6 w-80 z-50" style={{ perspective: '1000px' }}>
          <div className="w-full transition-transform duration-700 ease-in-out" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(180deg)' }}>
            <div className={`w-full rounded-3xl shadow-2xl border transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Menu</h3>
                  <button 
                    onClick={() => setShowMenu(false)} 
                    className={`p-2 rounded-full transition-all duration-300 ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => { setShowMenu(false); onNavigate('generate'); }} 
                    className={`w-full text-left py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Generate
                  </button>
                  <button 
                    onClick={() => { setShowMenu(false); onNavigate('library'); }} 
                    className={`w-full text-left py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Library
                  </button>
                  <button 
                    onClick={() => { setShowMenu(false); onNavigate('profile'); }} 
                    className={`w-full text-left py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => { setShowMenu(false); onNavigate('settings'); }} 
                    className={`w-full text-left py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Settings
                  </button>
                  <div className={`border-t my-4 transition-colors duration-300 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}></div>
                  <button 
                    onClick={() => onNavigate('landing')} 
                    className={`w-full text-left py-3 px-4 rounded-xl text-base font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-20 hover:text-red-300' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}