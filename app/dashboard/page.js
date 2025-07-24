'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

function HomePage() {
  const [credits, setCredits] = useState(12);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const [visualRotation, setVisualRotation] = useState(-72);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
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
  }, [showMenu]);

  const topics = [
    { id: 'philosophy', title: 'Philosophy and Dreams', image: 'philosophy.jpg', description: 'Adventures and Ideas: Simple Paths to Big Dreams' },
    { id: 'science', title: 'Science & Space', image: 'science.jpg', description: 'Journey through the cosmos and scientific discoveries' },
    { id: 'nature', title: 'Nature Escapes', image: 'nature.jpg', description: 'Explore the wonders of the natural world' },
    { id: 'fantasy', title: 'Fantasy Realms', image: 'history.jpg', description: 'Enter magical realms and mystical adventures' },
    { id: 'history', title: 'Historical Echoes', image: 'fantasy.jpg', description: 'Discover ancient civilizations and cultural treasures' }
  ];

  const handleTopicSelect = (index) => {
    setSelectedTopic(index);
    setVisualRotation(-index * 72);
  };

  const handleGenerateStory = () => {
    if (credits > 0) {
      router.push(`/summary?topic=${topics[selectedTopic].id}`);
    } else {
      alert('Not enough credits! Please purchase more credits.');
    }
  };

  const handlePrevTopic = () => {
    const newTopic = selectedTopic === 0 ? topics.length - 1 : selectedTopic - 1;
    setSelectedTopic(newTopic);
    setVisualRotation(prev => prev - 72);
  };

  const handleNextTopic = () => {
    const newTopic = selectedTopic === topics.length - 1 ? 0 : selectedTopic + 1;
    setSelectedTopic(newTopic);
    setVisualRotation(prev => prev + 72);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-purple-200 to-purple-500 flex flex-col font-roboto" style={{ fontSize: '16px' }}>
      {/* Header */}
      <div className="flex justify-end items-center p-6">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl px-5 py-2 flex items-center gap-3 shadow-lg border border-white border-opacity-30">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">💰</span>
            </div>
            <span className="text-gray-800 font-medium text-lg">Credits : {credits}</span>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-3 hover:bg-opacity-90 transition-all duration-200 shadow-lg border border-white border-opacity-30">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-6 mt-4">
          <h1 className="text-6xl md:text-7xl font-light text-white text-center tracking-tight mb-2 drop-shadow-lg">
            Sleeping<span className="text-purple-600 font-medium">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 text-center font-normal opacity-90">Your Bedtime, Reimagined.</p>
        </div>

        {/* 3D Carousel */}
        <div className="w-full max-w-6xl mb-3 relative">
          <button onClick={handlePrevTopic} className="absolute left-16 top-1/2 transform -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-2 shadow-lg transition-all duration-200 backdrop-blur-sm">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="overflow-visible" style={{ perspective: '1200px' }}>
            <div className="flex items-center justify-center h-72 relative" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${visualRotation}deg)`, transition: 'transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}>
              {topics.map((topic, index) => {
                const angle = index * 72;
                const currentRotation = visualRotation % 360;
                const normalizedRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation;
                const cardRotation = (angle + normalizedRotation) % 360;
                const isInCenter = Math.abs(cardRotation) < 36 || Math.abs(cardRotation - 360) < 36;
                
                return (
                  <div key={topic.id} className="cursor-pointer transition-all duration-600 ease-out absolute" 
                       style={{ transform: `rotateY(${angle}deg) translateZ(250px) scale(${isInCenter ? 1 : 0.85})`, opacity: isInCenter ? 1 : 0.4, zIndex: isInCenter ? 30 : 20, transformStyle: 'preserve-3d' }}
                       onClick={() => handleTopicSelect(index)}>
                    <div className={`relative rounded-3xl overflow-hidden w-80 h-48 ${isInCenter ? 'shadow-2xl' : 'shadow-lg'}`}>
                      <img src={`/images/${topic.image}`} alt={topic.title} className="w-full h-full object-cover" style={{ display: 'block' }} />
                      <div className={`absolute inset-0 transition-all duration-600 ${isInCenter ? 'bg-black bg-opacity-5' : 'bg-black bg-opacity-40'}`}></div>
                      {isInCenter && <div className="absolute inset-0 border-2 border-white border-opacity-20 rounded-3xl pointer-events-none"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleNextTopic} className="absolute right-16 top-1/2 transform -translate-y-1/2 z-40 bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-2 shadow-lg transition-all duration-200 backdrop-blur-sm">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-2 px-4">
          <h3 className="text-xl md:text-2xl font-medium text-gray-700 mb-1">{topics[selectedTopic].title}</h3>
          <p className="text-lg text-gray-700 max-w-xl mx-auto leading-relaxed font-normal opacity-90">{topics[selectedTopic].description}</p>
        </div>

        <div className="flex justify-center mb-3 gap-2">
          {topics.map((_, index) => (
            <button key={index} onClick={() => handleTopicSelect(index)} 
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === selectedTopic ? 'bg-purple-600 scale-125' : 'bg-gray-600 hover:bg-gray-500 opacity-80'}`} />
          ))}
        </div>

        <button onClick={handleGenerateStory} disabled={credits === 0}
                className={`py-4 px-8 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 ease-out disabled:transform-none disabled:cursor-not-allowed ${
                  credits > 0 ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' : 'bg-gray-300 text-gray-600'}`}>
          {credits > 0 ? 'Generate Story' : 'No Credits Available'}
        </button>
      </div>

      {/* Menu */}
      {showMenu && (
        <div ref={menuRef} className="fixed top-20 right-6 w-80 z-50" style={{ perspective: '1000px' }}>
          <div className="w-full transition-transform duration-700 ease-in-out" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(180deg)' }}>
            <div className="w-full bg-white rounded-3xl shadow-2xl border border-gray-100" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Menu</h3>
                  <button onClick={() => setShowMenu(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  {['Generate', 'Library', 'Profile', 'Settings'].map(item => (
                    <button key={item} onClick={() => router.push(`/${item.toLowerCase()}`)} 
                            className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium transition-all duration-200">
                      {item}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 my-4"></div>
                  <button onClick={() => router.push('/')} className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl text-base font-medium transition-all duration-200">
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

export default HomePage;