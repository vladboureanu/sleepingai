'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function HomePage() {
  const [credits, setCredits] = useState(12);
  const [selectedTopic, setSelectedTopic] = useState(1); // Start with Science & Space (center)
  const [visualRotation, setVisualRotation] = useState(-72); // Track visual rotation separately
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const topics = [
    {
      id: 'nature',
      title: 'Nature & Wildlife',
      image: 'nature.jpg',
      description: 'Explore the wonders of the natural world'
    },
    {
      id: 'science',
      title: 'Science & Space',
      image: 'science.jpg',
      description: 'Journey through the cosmos and scientific discoveries'
    },
    {
      id: 'adventure',
      title: 'Adventure & Travel',
      image: 'adventure.jpg',
      description: 'Embark on exciting adventures around the world'
    },
    {
      id: 'history',
      title: 'History & Culture',
      image: 'history.jpg',
      description: 'Discover ancient civilizations and cultural treasures'
    },
    {
      id: 'fantasy',
      title: 'Fantasy & Magic',
      image: 'fantasy.jpg',
      description: 'Enter magical realms and mystical adventures'
    }
  ];

  const handleTopicSelect = (index) => {
    setSelectedTopic(index);
  };

  const handleGenerateStory = () => {
    if (credits > 0) {
      router.push(`/summary?topic=${topics[selectedTopic].id}`);
    } else {
      alert('Not enough credits! Please purchase more credits.');
    }
  };

  const handlePrevTopic = () => {
    setSelectedTopic(prev => prev === 0 ? topics.length - 1 : prev - 1);
    setVisualRotation(prev => prev + 72); // Always rotate in one direction
  };

  const handleNextTopic = () => {
    setSelectedTopic(prev => prev === topics.length - 1 ? 0 : prev + 1);
    setVisualRotation(prev => prev - 72); // Always rotate in the other direction
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-purple-300 to-indigo-900 flex flex-col font-roboto" style={{ fontSize: '16px' }}>
      {/* Header */}
      <div className="flex justify-end items-center p-6">
        <div className="flex items-center gap-4">
          {/* Credits Display */}
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl px-5 py-2 flex items-center gap-3 shadow-lg border border-white border-opacity-30">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">💰</span>
            </div>
            <span className="text-gray-800 font-medium">Credits : {credits}</span>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-3 hover:bg-opacity-90 transition-all duration-200 shadow-lg border border-white border-opacity-30"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo - Consistent with other pages */}
        <div className="mb-6 mt-4">
          <h1 className="text-6xl md:text-7xl font-light text-white text-center tracking-tight mb-2 drop-shadow-lg">
            Sleeping<span className="text-purple-600 font-medium">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 text-center font-normal opacity-90">Your Bedtime, Reimagined.</p>
        </div>

        {/* Bigger 3D Circular Carousel */}
        <div className="w-full max-w-6xl mb-3 relative">
          {/* Previous Button - Closer */}
          <button
            onClick={handlePrevTopic}
            className="absolute left-16 top-1/2 transform -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-2 shadow-lg transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 3D Horizontal Circle Container - Bigger */}
          <div className="overflow-visible" style={{ perspective: '1200px' }}>
            <div 
              className="flex items-center justify-center h-72 relative"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: `rotateY(${visualRotation}deg)`,
                transition: 'transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              {topics.map((topic, index) => {
                const angle = (index * 72); // 72 degrees between each card
                const isActive = index === selectedTopic;
                
                // Bigger horizontal circle positioning
                const rotateY = angle;
                const translateZ = 250; // Bigger radius
                const scale = isActive ? 1 : 0.85;
                const opacity = isActive ? 1 : 0.7;
                
                return (
                  <div
                    key={topic.id}
                    className="cursor-pointer transition-all duration-600 ease-out absolute"
                    style={{
                      transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
                      opacity: opacity,
                      zIndex: isActive ? 30 : 20,
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={() => handleTopicSelect(index)}
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl w-80 h-48">
                      <img
                        src={`/images/${topic.image}`}
                        alt={topic.title}
                        className="w-full h-full object-cover"
                        style={{ display: 'block' }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                      
                      {/* Enhanced glow effect for active card */}
                      {isActive && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-purple-400 rounded-3xl opacity-30 blur-sm -z-10"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Button - Closer */}
          <button
            onClick={handleNextTopic}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-2 shadow-lg transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Topic Title and Description - Tighter spacing */}
        <div className="text-center mb-2 px-4">
          <h3 className="text-heading-sm font-medium text-gray-700 mb-1">{topics[selectedTopic].title}</h3>
          <p className="text-body text-gray-700 max-w-xl mx-auto leading-relaxed font-normal opacity-90">
            {topics[selectedTopic].description}
          </p>
        </div>

        {/* Carousel Dots - Tighter spacing */}
        <div className="flex justify-center mb-3 gap-2">
          {topics.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTopicSelect(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedTopic
                  ? 'bg-teal-500 scale-125'
                  : 'bg-gray-500 hover:bg-gray-400 opacity-80'
              }`}
            />
          ))}
        </div>

        {/* Generate Story Button - Compact */}
        <button
          onClick={handleGenerateStory}
          disabled={credits === 0}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 disabled:bg-gray-300 text-gray-800 py-2.5 px-5 rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-sm"
        >
          {credits > 0 ? 'Generate Story' : 'No Credits Available'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-80 h-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-medium text-gray-800">Menu</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                Generate
              </button>
              <button className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                Library
              </button>
              <button className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                Profile
              </button>
              <button className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                Settings
              </button>
              <hr className="my-4 border-gray-200" />
              <button 
                onClick={() => router.push('/')}
                className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;