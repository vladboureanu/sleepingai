'use client';

import { useState } from 'react';

export default function GeneratePage({ onNavigate, darkMode = false }) {
  const [pickedTopics, setPickedTopics] = useState([]);
  const [bgMusic, setBgMusic] = useState('soft-piano');
  const [narrator, setNarrator] = useState('female');
  const [storyTitle, setStoryTitle] = useState('');
  const [extraPrompt, setExtraPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const topics = [
    { id: 'nature', label: 'Nature' },
    { id: 'music', label: 'Music' },
    { id: 'science', label: 'Science' },
    { id: 'inventions', label: 'Inventions & Technology' },
    { id: 'space', label: 'Space & Astronomy' },
    { id: 'mythology', label: 'Mythology' },
    { id: 'mindfulness', label: 'Mindfulness & Emotions' },
    { id: 'history', label: 'History' }
  ];

  const audioOptions = [
    { id: 'ambient', label: 'Ambient' },
    { id: 'soft-piano', label: 'Soft Piano' },
    { id: 'nature-sounds', label: 'Nature Sounds' },
    { id: 'no-music', label: 'No Music' }
  ];

  const toggleTopic = (topicId) => {
    setPickedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const createStory = async () => {
    if (pickedTopics.length === 0) {
      alert('Please select at least one topic!');
      return;
    }

    setCreating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccessModal(true);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Sorry, there was an error generating your story. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      {darkMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-0 transition-opacity duration-300"></div>
      )}

      <div className={`rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-95 p-6 max-w-7xl mx-auto relative z-10 transition-all duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-xl font-semibold flex items-center transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Generate
          </h1>
          <button 
            onClick={() => onNavigate('home')}
            className={`p-2 rounded-full transition-all duration-300 ${
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          <div>
            <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>Topic</h2>
            <div className="grid grid-cols-1 gap-2">
              {topics.map((topic) => (
                <label key={topic.id} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={pickedTopics.includes(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-4 h-4 border-2 rounded mr-3 transition-all duration-200 ${
                    pickedTopics.includes(topic.id)
                      ? 'bg-purple-600 border-purple-600'
                      : (darkMode 
                        ? 'border-gray-500 group-hover:border-purple-400' 
                        : 'border-gray-400 group-hover:border-purple-400')
                  }`}>
                    {pickedTopics.includes(topic.id) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    pickedTopics.includes(topic.id) 
                      ? 'text-purple-700 font-medium' 
                      : (darkMode 
                        ? 'text-gray-300 group-hover:text-purple-400' 
                        : 'text-gray-700 group-hover:text-purple-600')
                  }`}>
                    {topic.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Background Music</h2>
              <div className="space-y-2">
                {audioOptions.map((music) => (
                  <label key={music.id} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="backgroundMusic"
                      value={music.id}
                      checked={bgMusic === music.id}
                      onChange={(e) => setBgMusic(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 transition-all duration-200 ${
                      bgMusic === music.id
                        ? 'bg-purple-600 border-purple-600'
                        : (darkMode 
                          ? 'border-gray-500 group-hover:border-purple-400' 
                          : 'border-gray-400 group-hover:border-purple-400')
                    }`}>
                      {bgMusic === music.id && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm transition-colors duration-200 ${
                      bgMusic === music.id 
                        ? 'text-purple-700 font-medium' 
                        : (darkMode 
                          ? 'text-gray-300 group-hover:text-purple-400' 
                          : 'text-gray-700 group-hover:text-purple-600')
                    }`}>
                      {music.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Voice</h2>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="voice"
                    value="female"
                    checked={narrator === 'female'}
                    onChange={(e) => setNarrator(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 transition-all duration-200 ${
                    narrator === 'female'
                      ? 'bg-purple-600 border-purple-600'
                      : (darkMode 
                        ? 'border-gray-500 group-hover:border-purple-400' 
                        : 'border-gray-400 group-hover:border-purple-400')
                  }`}>
                    {narrator === 'female' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    narrator === 'female' 
                      ? 'text-purple-700 font-medium' 
                      : (darkMode 
                        ? 'text-gray-300 group-hover:text-purple-400' 
                        : 'text-gray-700 group-hover:text-purple-600')
                  }`}>
                    Female
                  </span>
                </label>
                
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="voice"
                    value="male"
                    checked={narrator === 'male'}
                    onChange={(e) => setNarrator(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-4 h-4 border-2 rounded-full mr-3 transition-all duration-200 ${
                    narrator === 'male'
                      ? 'bg-purple-600 border-purple-600'
                      : (darkMode 
                        ? 'border-gray-500 group-hover:border-purple-400' 
                        : 'border-gray-400 group-hover:border-purple-400')
                  }`}>
                    {narrator === 'male' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    narrator === 'male' 
                      ? 'text-purple-700 font-medium' 
                      : (darkMode 
                        ? 'text-gray-300 group-hover:text-purple-400' 
                        : 'text-gray-700 group-hover:text-purple-600')
                  }`}>
                    Male
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Add title</h2>
              <input
                type="text"
                placeholder="e.g., 'New York 1970'"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-300 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-700 placeholder-gray-500'
                }`}
              />
            </div>

            <div>
              <div className={`flex items-center rounded-xl p-3 mb-4 transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <svg className={`w-5 h-5 mr-2 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <input
                  type="text"
                  placeholder="Anything else you'd like to add?..."
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  className={`flex-1 bg-transparent focus:outline-none text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setExtraPrompt(prev => prev ? `${prev} Add a peaceful twist at the end` : 'Add a peaceful twist at the end')}
                  className={`px-3 py-1.5 border-2 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    darkMode 
                      ? 'border-purple-400 hover:border-purple-300 text-purple-300 hover:text-purple-200 bg-gray-700 hover:bg-gray-600' 
                      : 'border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50'
                  }`}
                >
                  Add a peaceful twist at the end
                </button>
                <button
                  onClick={() => setExtraPrompt(prev => prev ? `${prev} Make it feel like a dream` : 'Make it feel like a dream')}
                  className={`px-3 py-1.5 border-2 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    darkMode 
                      ? 'border-purple-400 hover:border-purple-300 text-purple-300 hover:text-purple-200 bg-gray-700 hover:bg-gray-600' 
                      : 'border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50'
                  }`}
                >
                  Make it feel like a dream
                </button>
                <button
                  onClick={() => setExtraPrompt(prev => prev ? `${prev} Include a moment of wonder` : 'Include a moment of wonder')}
                  className={`px-3 py-1.5 border-2 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    darkMode 
                      ? 'border-purple-400 hover:border-purple-300 text-purple-300 hover:text-purple-200 bg-gray-700 hover:bg-gray-600' 
                      : 'border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50'
                  }`}
                >
                  Include a moment of wonder
                </button>
                <button
                  onClick={() => setExtraPrompt(prev => prev ? `${prev} End with a calming message` : 'End with a calming message')}
                  className={`px-3 py-1.5 border-2 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    darkMode 
                      ? 'border-purple-400 hover:border-purple-300 text-purple-300 hover:text-purple-200 bg-gray-700 hover:bg-gray-600' 
                      : 'border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50'
                  }`}
                >
                  End with a calming message
                </button>
                <button
                  onClick={() => setExtraPrompt(prev => prev ? `${prev} Let the story begin with a surprise` : 'Let the story begin with a surprise')}
                  className={`px-3 py-1.5 border-2 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    darkMode 
                      ? 'border-purple-400 hover:border-purple-300 text-purple-300 hover:text-purple-200 bg-gray-700 hover:bg-gray-600' 
                      : 'border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-800 bg-white hover:bg-purple-50'
                  }`}
                >
                  Let the story begin with a surprise
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={createStory}
            disabled={creating || pickedTopics.length === 0}
            className={`px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center ${
              creating || pickedTopics.length === 0
                ? (darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {creating ? (
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

      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-20">
          <div className={`rounded-3xl p-8 max-w-md w-full mx-4 relative transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button 
              onClick={() => setSuccessModal(false)}
              className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-300 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <svg className={`w-6 h-6 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex justify-center mb-8 mt-4">
              <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className={`text-lg transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Your story <span className="text-purple-600 font-medium">
                  {storyTitle ? `"${storyTitle}"` : '(title of the Story)'}
                </span> has been successfully created
              </p>
            </div>

            <button
              onClick={() => {
                setSuccessModal(false);
                onNavigate('playercontrols');
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-base rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Play Story
            </button>
          </div>
        </div>
      )}
    </>
  );
}