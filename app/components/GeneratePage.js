'use client';

import { useState } from 'react';

export default function GeneratePage({ onNavigate }) {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState('soft-piano');
  const [voice, setVoice] = useState('female');
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Topic options matching your design
  const topicOptions = [
    { id: 'nature', label: 'Nature' },
    { id: 'music', label: 'Music' },
    { id: 'science', label: 'Science' },
    { id: 'inventions', label: 'Inventions & Technology' },
    { id: 'space', label: 'Space & Astronomy' },
    { id: 'mythology', label: 'Mythology' },
    { id: 'mindfulness', label: 'Mindfulness & Emotions' },
    { id: 'history', label: 'History' }
  ];

  // Background music options
  const musicOptions = [
    { id: 'ambient', label: 'Ambient' },
    { id: 'soft-piano', label: 'Soft Piano' },
    { id: 'nature-sounds', label: 'Nature Sounds' },
    { id: 'no-music', label: 'No Music' }
  ];

  // Story enhancement prompts
  const storyPrompts = [
    'Add a peaceful twist at the end',
    'Make it feel like a dream',
    'Include a moment of wonder',
    'Let the story begin with a surprise',
    'End with a calming message'
  ];

  const handleTopicToggle = (topicId) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleGenerateStory = async () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic!');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Here you would integrate with your backend/Firebase
      alert('Story generated! (This would navigate to playback screen)');
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Sorry, there was an error generating your story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    // Pure content only - no backgrounds, headers, or containers
    <div className="bg-white rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-95 p-6 max-w-7xl mx-auto relative">
      
      {/* Header inside white rectangle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Generate
        </h1>
        <button 
          onClick={() => onNavigate('home')}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Three Column Layout for better space utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Column - Topic */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Topic</h2>
          <div className="grid grid-cols-1 gap-2">
            {topicOptions.map((topic) => (
              <label key={topic.id} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => handleTopicToggle(topic.id)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-4 h-4 border-2 rounded mr-3 transition-all duration-200 ${
                  selectedTopics.includes(topic.id)
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-400 group-hover:border-purple-400'
                }`}>
                  {selectedTopics.includes(topic.id) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm text-gray-700 transition-colors duration-200 ${
                  selectedTopics.includes(topic.id) ? 'text-purple-700 font-medium' : 'group-hover:text-purple-600'
                }`}>
                  {topic.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Middle Column - Background Music & Voice */}
        <div className="space-y-6">
          {/* Background Music */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Background Music</h2>
            <div className="space-y-2">
              {musicOptions.map((music) => (
                <label key={music.id} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="backgroundMusic"
                    value={music.id}
                    checked={backgroundMusic === music.id}
                    onChange={(e) => setBackgroundMusic(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 transition-all duration-200 ${
                    backgroundMusic === music.id
                      ? 'bg-purple-600 border-purple-600'
                      : 'border-gray-400 group-hover:border-purple-400'
                  }`}>
                    {backgroundMusic === music.id && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-sm text-gray-700 transition-colors duration-200 ${
                    backgroundMusic === music.id ? 'text-purple-700 font-medium' : 'group-hover:text-purple-600'
                  }`}>
                    {music.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Voice</h2>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="voice"
                  value="female"
                  checked={voice === 'female'}
                  onChange={(e) => setVoice(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 transition-all duration-200 ${
                  voice === 'female'
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-400 group-hover:border-purple-400'
                }`}>
                  {voice === 'female' && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`text-sm text-gray-700 transition-colors duration-200 ${
                  voice === 'female' ? 'text-purple-700 font-medium' : 'group-hover:text-purple-600'
                }`}>
                  Female
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="voice"
                  value="male"
                  checked={voice === 'male'}
                  onChange={(e) => setVoice(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 transition-all duration-200 ${
                  voice === 'male'
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-400 group-hover:border-purple-400'
                }`}>
                  {voice === 'male' && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`text-sm text-gray-700 transition-colors duration-200 ${
                  voice === 'male' ? 'text-purple-700 font-medium' : 'group-hover:text-purple-600'
                }`}>
                  Male
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Add Title, Custom Input & Suggestion Tags */}
        <div className="space-y-6">
          {/* Add Title */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add title</h2>
            <input
              type="text"
              placeholder="e.g., 'New York 1970'"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-500 text-sm"
            />
          </div>

          {/* Custom Input */}
          <div>
            <div className="flex items-center bg-gray-100 rounded-xl p-3 mb-4">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <input
                type="text"
                placeholder="Anything else you'd like to add?..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Story Enhancement Tags - Right Column with specific layout */}
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCustomPrompt(prev => prev ? `${prev} Add a peaceful twist at the end` : 'Add a peaceful twist at the end')}
                className="px-3 py-1.5 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 bg-white hover:bg-purple-50"
              >
                Add a peaceful twist at the end
              </button>
              <button
                onClick={() => setCustomPrompt(prev => prev ? `${prev} Make it feel like a dream` : 'Make it feel like a dream')}
                className="px-3 py-1.5 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 bg-white hover:bg-purple-50"
              >
                Make it feel like a dream
              </button>
              <button
                onClick={() => setCustomPrompt(prev => prev ? `${prev} Include a moment of wonder` : 'Include a moment of wonder')}
                className="px-3 py-1.5 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 bg-white hover:bg-purple-50"
              >
                Include a moment of wonder
              </button>
              <button
                onClick={() => setCustomPrompt(prev => prev ? `${prev} End with a calming message` : 'End with a calming message')}
                className="px-3 py-1.5 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 bg-white hover:bg-purple-50"
              >
                End with a calming message
              </button>
              <button
                onClick={() => setCustomPrompt(prev => prev ? `${prev} Let the story begin with a surprise` : 'Let the story begin with a surprise')}
                className="px-3 py-1.5 border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 bg-white hover:bg-purple-50"
              >
                Let the story begin with a surprise
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button - Raised higher */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateStory}
          disabled={isGenerating || selectedTopics.length === 0}
          className={`px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center ${
            isGenerating || selectedTopics.length === 0
              ? 'bg-gray-300 text-gray-500'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Generate my Story
            </>
          )}
        </button>
      </div>
    </div>
  );
}