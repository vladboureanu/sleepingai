'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import GeneratePage from '../components/GeneratePage';
import LibraryPage from '../components/LibraryPage';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import PlayerControls from '../components/PlayerControlsPage';

export default function Dashboard() {
  const [userCredits, setUserCredits] = useState(12);
  const [activeTopic, setActiveTopic] = useState(1);
  const [rotation, setRotation] = useState(-72);
  const [activeView, setActiveView] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  const topicsList = [
    { id: 'philosophy', title: 'Philosophy and Dreams', image: 'philosophy.jpg', description: 'Adventures and Ideas: Simple Paths to Big Dreams' },
    { id: 'science', title: 'Science & Space', image: 'science.jpg', description: 'Journey through the cosmos and scientific discoveries' },
    { id: 'nature', title: 'Nature Escapes', image: 'nature.jpg', description: 'Explore the wonders of the natural world' },
    { id: 'fantasy', title: 'Fantasy Realms', image: 'fantasy.jpg', description: 'Enter magical realms and mystical adventures' },
    { id: 'history', title: 'Historical Echoes', image: 'history.jpg', description: 'Discover ancient civilizations and cultural treasures' }
  ];

  const goToPage = (page) => {
    if (page === 'landing') {
      router.push('/');
      return;
    }
    
    if (page === 'credits') {
      router.push('/store');
      return;
    }
    
    if (page === 'home' || page === 'generate' || page === 'library' || page === 'profile' || page === 'settings' || page === 'playercontrols') {
      setActiveView(page);
    } else {
      alert(`${page.charAt(0).toUpperCase() + page.slice(1)} page coming soon!`);
    }
  };

  const showCurrentView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomePage
            topics={topicsList}
            selectedTopic={activeTopic}
            setSelectedTopic={setActiveTopic}
            visualRotation={rotation}
            setVisualRotation={setRotation}
            credits={userCredits}
            onNavigate={goToPage}
            darkMode={isDark}
          />
        );
      case 'generate':
        return <GeneratePage onNavigate={goToPage} darkMode={isDark} />;
      case 'library':
        return <LibraryPage onNavigate={goToPage} darkMode={isDark} />;
      case 'profile':
        return <ProfilePage onNavigate={goToPage} darkMode={isDark} />;
      case 'settings':
        return <SettingsPage onNavigate={goToPage} darkMode={isDark} setDarkMode={setIsDark} />;
      case 'playercontrols':
        return <PlayerControls onNavigate={goToPage} darkMode={isDark} setDarkMode={setIsDark} />;
      default:
        return (
          <HomePage
            topics={topicsList}
            selectedTopic={activeTopic}
            setSelectedTopic={setActiveTopic}
            visualRotation={rotation}
            setVisualRotation={setRotation}
            credits={userCredits}
            onNavigate={goToPage}
            darkMode={isDark}
          />
        );
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-roboto" 
      style={{ 
        fontSize: '16px',
        backgroundImage: 'url("/images/sleepingai-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <nav className="relative z-20 px-6 py-4">
        <div className="flex justify-center items-center relative">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => goToPage('home')}
              className={`backdrop-blur-md rounded-xl px-4 py-2 font-medium shadow-lg border transition-all duration-300 ${
                activeView === 'home'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                  : isDark
                    ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                    : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => goToPage('generate')}
              className={`backdrop-blur-md rounded-xl px-4 py-2 font-medium shadow-lg border transition-all duration-300 ${
                activeView === 'generate'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                  : isDark
                    ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                    : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
              }`}
            >
              Generate
            </button>
            
            <button
              onClick={() => goToPage('library')}
              className={`backdrop-blur-md rounded-xl px-4 py-2 font-medium shadow-lg border transition-all duration-300 ${
                activeView === 'library'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                  : isDark
                    ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                    : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
              }`}
            >
              Library
            </button>
            
            <button
              onClick={() => goToPage('profile')}
              className={`backdrop-blur-md rounded-xl px-4 py-2 font-medium shadow-lg border transition-all duration-300 ${
                activeView === 'profile'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                  : isDark
                    ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                    : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
              }`}
            >
              Profile
            </button>
            
            <button
              onClick={() => goToPage('settings')}
              className={`backdrop-blur-md rounded-xl px-4 py-2 font-medium shadow-lg border transition-all duration-300 ${
                activeView === 'settings'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                  : isDark
                    ? 'bg-gray-800 bg-opacity-80 border-gray-700 text-gray-300 hover:bg-opacity-90'
                    : 'bg-white bg-opacity-80 border-white border-opacity-30 text-gray-700 hover:bg-opacity-90'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="absolute right-0 flex items-center space-x-4">
            <button 
              onClick={() => goToPage('credits')}
              className={`backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg border transition-all duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-gray-800 bg-opacity-90 border-gray-700 hover:bg-opacity-100' 
                  : 'bg-white bg-opacity-90 border-white border-opacity-30 hover:bg-opacity-100'
              }`}
            >
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">💰</span>
              </div>
              <span className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Credits : {userCredits}
              </span>
            </button>

            <button
              onClick={() => goToPage('landing')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDark 
                  ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-20 hover:text-red-300' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <Header
        credits={userCredits}
        onNavigate={goToPage}
        currentView={activeView}
        darkMode={isDark}
        showNavigation={false}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {showCurrentView()}
      </div>
    </div>
  );
}