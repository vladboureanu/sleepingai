'use client';

import { useState } from 'react';

export default function LibraryPage({ onNavigate, darkMode = false }) {
  const [currentTab, setCurrentTab] = useState('private');

  const myStories = [
    {
      id: 1,
      title: 'Echoes in the Void',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Mysterious and deep.',
      image: 'echoes-void.jpg'
    },
    {
      id: 2,
      title: 'Road to Slumber',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Soft and soothing.',
      image: 'road-slumber.jpg'
    },
    {
      id: 3,
      title: 'Tropical Drift',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Warm island breeze.',
      image: 'tropical-drift.jpg'
    },
    {
      id: 4,
      title: 'Neon Nightfall',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Calm and dreamy.',
      image: 'neon-nightfall.jpg'
    }
  ];

  const sharedStories = [
    {
      id: 5,
      title: 'Ocean Dreams',
      duration: '12 min',
      voice: 'Soft Female',
      date: 'Apr 23, 2025',
      comment: 'Peaceful waves and serenity.',
      image: 'ocean-dreams.jpg',
      author: 'Sarah M.'
    },
    {
      id: 6,
      title: 'Forest Whispers',
      duration: '8 min',
      voice: 'Soft Male',
      date: 'Apr 22, 2025',
      comment: 'Nature sounds and tranquility.',
      image: 'forest-whispers.jpg',
      author: 'Alex K.'
    }
  ];

  const stories = currentTab === 'private' ? myStories : sharedStories;

  const doAction = (action, storyId) => {
    console.log(`${action} story with ID: ${storyId}`);
  };

  return (
    <>
      {darkMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-0 transition-opacity duration-300"></div>
      )}

      <div className={`backdrop-blur-md rounded-3xl shadow-2xl border transition-all duration-300 p-4 w-[950px] mx-auto relative z-10 min-h-[450px] ${
        darkMode 
          ? 'bg-gray-800 bg-opacity-90 border-gray-700' 
          : 'bg-white bg-opacity-90 border-white border-opacity-30'
      }`}>
        
        <div className="flex items-center justify-center mb-4">
          <h1 className={`text-xl font-light text-center tracking-tight transition-colors duration-300 flex items-center ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Library
          </h1>
          <button 
            onClick={() => onNavigate('home')}
            className={`absolute top-4 right-4 backdrop-blur-sm rounded-xl p-2 transition-all duration-300 shadow-lg border ${
              darkMode
                ? 'bg-gray-800 bg-opacity-80 border-gray-700 hover:bg-opacity-90 text-gray-300'
                : 'bg-white bg-opacity-80 border-white border-opacity-30 hover:bg-opacity-90 text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-center mb-6 gap-2">
          <button
            onClick={() => setCurrentTab('private')}
            className={`px-6 py-2 rounded-xl font-medium text-base transition-all duration-300 shadow-lg border ${
              currentTab === 'private'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600'
                : darkMode
                  ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                  : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
            }`}
          >
            Private
          </button>
          <button
            onClick={() => setCurrentTab('community')}
            className={`px-6 py-2 rounded-xl font-medium text-base transition-all duration-300 shadow-lg border ${
              currentTab === 'community'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600'
                : darkMode
                  ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                  : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
            }`}
          >
            Community
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 min-w-[800px]">
          {stories.map((story) => (
            <div key={story.id} className={`backdrop-blur-md rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              darkMode 
                ? 'bg-gray-800 bg-opacity-90 border-gray-700' 
                : 'bg-white bg-opacity-90 border-white border-opacity-30'
            }`}>
              <div className="w-full h-32 relative overflow-hidden">
                <img 
                  src={`/images/${story.image}`} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3">
                <h3 className={`font-medium text-base mb-1 tracking-tight transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  {story.title}
                </h3>
                
                <div className={`text-sm mb-1 font-normal opacity-90 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  <span>{story.duration}</span> • <span>{story.voice}</span>
                </div>
                
                <div className={`text-sm mb-2 font-normal opacity-90 transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-600'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  {story.date}
                </div>
                
                <div className="text-sm text-purple-500 mb-2 font-medium">
                  by {currentTab === 'community' ? story.author : 'You'}
                </div>
                
                <div className={`text-sm mb-3 font-normal opacity-90 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                  <span className="font-medium">Comment:</span> {story.comment}
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => doAction('play', story.id)}
                    className="flex items-center text-purple-600 hover:text-purple-500 font-medium text-sm transition-colors duration-300"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play
                  </button>
                  
                  {currentTab === 'private' && (
                    <button
                      onClick={() => doAction('rename', story.id)}
                      className={`flex items-center font-medium text-sm transition-colors duration-300 ${
                        darkMode 
                          ? 'text-gray-400 hover:text-gray-200' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Rename
                    </button>
                  )}
                  
                  <button
                    onClick={() => doAction('download', story.id)}
                    className={`flex items-center font-medium text-sm transition-colors duration-300 ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-8">
            <div className={`${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            } text-5xl mb-3`}>📚</div>
            <h3 className={`text-xl font-light mb-2 tracking-tight transition-colors duration-300 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
              No {currentTab} stories yet
            </h3>
            <p className={`text-base font-normal opacity-90 transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
              {currentTab === 'private' 
                ? 'Create your first story to see it here!'
                : 'Check back later for community stories.'
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}