'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import GeneratePage from '../components/GeneratePage';
import LibraryPage from '../components/LibraryPage';
import ProfilePage from '../components/ProfilePage';
import SettingsPage from '../components/SettingsPage';
import CreditsPage from '../components/CreditsPage';
import PaymentPage from '../components/PaymentPage';
import PlayerControls from '../components/PlayerControlsPage';

export default function Dashboard() {
  const [credits, setCredits] = useState(12);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const [visualRotation, setVisualRotation] = useState(-72);
  const [showMenu, setShowMenu] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Fixed topics array with correct image assignments
  const topics = [
    { id: 'philosophy', title: 'Philosophy and Dreams', image: 'philosophy.jpg', description: 'Adventures and Ideas: Simple Paths to Big Dreams' },
    { id: 'science', title: 'Science & Space', image: 'science.jpg', description: 'Journey through the cosmos and scientific discoveries' },
    { id: 'nature', title: 'Nature Escapes', image: 'nature.jpg', description: 'Explore the wonders of the natural world' },
    { id: 'fantasy', title: 'Fantasy Realms', image: 'fantasy.jpg', description: 'Enter magical realms and mystical adventures' },
    { id: 'history', title: 'Historical Echoes', image: 'history.jpg', description: 'Discover ancient civilizations and cultural treasures' }
  ];

  const handleNavigate = (page) => {
    if (page === 'landing') {
      router.push('/');
      return;
    }
    
    // Handle home, generate, and library views
    if (page === 'home' || page === 'generate' || page === 'library' || page === 'profile' || page === 'settings' || page === 'credits' || page === 'payment' || page === 'playercontrols') {
      setCurrentView(page);
    } else {
      // For other pages, you can create separate components later
      alert(`${page.charAt(0).toUpperCase() + page.slice(1)} page coming soon!`);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            topics={topics}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            visualRotation={visualRotation}
            setVisualRotation={setVisualRotation}
            credits={credits}
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        );
      case 'generate':
        return <GeneratePage onNavigate={handleNavigate} darkMode={darkMode} />;
      case 'library':
        return <LibraryPage onNavigate={handleNavigate} darkMode={darkMode} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} darkMode={darkMode} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} darkMode={darkMode} setDarkMode={setDarkMode} />;
      case 'credits':
        return <CreditsPage onNavigate={handleNavigate} darkMode={darkMode} />;
      case 'payment':
        return <PaymentPage onNavigate={handleNavigate} darkMode={darkMode} />;
      case 'playercontrols':
        return <PlayerControls onNavigate={handleNavigate} darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return (
          <HomePage
            topics={topics}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            visualRotation={visualRotation}
            setVisualRotation={setVisualRotation}
            credits={credits}
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-300 to-teal-400 flex flex-col font-roboto" style={{ fontSize: '16px' }}>
      {/* Fixed Header */}
      <Header
        credits={credits}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onNavigate={handleNavigate}
        currentView={currentView}
        darkMode={darkMode}
      />

      {/* Dynamic Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {renderCurrentView()}
      </div>
    </div>
  );
}