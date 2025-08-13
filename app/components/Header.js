'use client';

export default function Header({ currentView, darkMode = false, showNavigation = true }) {
  return (
    <div className="relative z-10">
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
    </div>
  );
}