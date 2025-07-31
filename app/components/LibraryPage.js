'use client';

import { useState } from 'react';

export default function LibraryPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('private');

  // Sample private stories data
  const privateStories = [
    {
      id: 1,
      title: 'Echoes in the Void',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Mysterious and deep.',
      image: '/images/echoes-void.jpg'
    },
    {
      id: 2,
      title: 'Road to Slumber',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Soft and soothing.',
      image: '/images/road-slumber.jpg'
    },
    {
      id: 3,
      title: 'Tropical Drift',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Warm island breeze.',
      image: '/images/tropical-drift.jpg'
    },
    {
      id: 4,
      title: 'Neon Nightfall',
      duration: '10 min',
      voice: 'Soft Male',
      date: 'Apr 24, 2025',
      comment: 'Calm and dreamy.',
      image: '/images/neon-nightfall.jpg'
    }
  ];

  // Sample community stories data (you can customize this)
  const communityStories = [
    {
      id: 5,
      title: 'Ocean Dreams',
      duration: '12 min',
      voice: 'Soft Female',
      date: 'Apr 23, 2025',
      comment: 'Peaceful waves and serenity.',
      image: '/images/ocean-dreams.jpg',
      author: 'Sarah M.'
    },
    {
      id: 6,
      title: 'Forest Whispers',
      duration: '8 min',
      voice: 'Soft Male',
      date: 'Apr 22, 2025',
      comment: 'Nature sounds and tranquility.',
      image: '/images/forest-whispers.jpg',
      author: 'Alex K.'
    }
  ];

  const currentStories = activeTab === 'private' ? privateStories : communityStories;

  const handleStoryAction = (action, storyId) => {
    // Handle play, rename, download actions
    console.log(`${action} story with ID: ${storyId}`);
    // You can implement the actual functionality here
  };

  return (
    // Pure content only - Header component handles the background and logo
    <div className="bg-white rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-95 p-4 max-w-6xl mx-auto relative">
      
      {/* Library Header with icon - centered */}
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Library
        </h1>
        {/* Back button in top-right corner */}
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Tab Navigation - Two separate buttons */}
      <div className="flex justify-center mb-6 gap-2">
        <button
          onClick={() => setActiveTab('private')}
          className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
            activeTab === 'private'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Private
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-8 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
            activeTab === 'community'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Community
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {currentStories.map((story) => (
          <div key={story.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Story Image */}
            <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
              {/* Placeholder for story image - you can replace with actual images */}
              <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                <div className="text-gray-500 text-6xl opacity-50">🎧</div>
              </div>
            </div>
            
            {/* Story Details */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2 text-lg">{story.title}</h3>
              
              {/* Duration and Voice */}
              <div className="text-sm text-gray-600 mb-1">
                <span>{story.duration}</span> • <span>{story.voice}</span>
              </div>
              
              {/* Date */}
              <div className="text-sm text-gray-500 mb-2">{story.date}</div>
              
              {/* Community author (if applicable) */}
              {activeTab === 'community' && story.author && (
                <div className="text-sm text-purple-600 mb-2">by {story.author}</div>
              )}
              
              {/* Comment */}
              <div className="text-sm text-gray-700 mb-4">
                <span className="font-medium">Comment:</span> {story.comment}
              </div>
              
              {/* Action Buttons with equal spacing */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleStoryAction('play', story.id)}
                  className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>
                
                {activeTab === 'private' && (
                  <button
                    onClick={() => handleStoryAction('rename', story.id)}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Rename
                  </button>
                )}
                
                <button
                  onClick={() => handleStoryAction('download', story.id)}
                  className="flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (when no stories) */}
      {currentStories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No {activeTab} stories yet
          </h3>
          <p className="text-gray-500">
            {activeTab === 'private' 
              ? 'Create your first story to see it here!'
              : 'Check back later for community stories.'
            }
          </p>
        </div>
      )}
    </div>
  );
}