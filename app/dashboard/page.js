'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import HomePage from '../components/HomePage';
import GeneratePage from '../components/GeneratePage';
import LibraryPage from '../components/LibraryPage';
import ProfilePage from '../components/ProfilePage';

export default function Dashboard() {
  const [credits, setCredits] = useState(12);
  const [selectedTopic, setSelectedTopic] = useState(1);
  const [visualRotation, setVisualRotation] = useState(-72);
  const [showMenu, setShowMenu] = useState(false);
  const [currentView, setCurrentView] = useState('home');
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
    if (page === 'home' || page === 'generate' || page === 'library' || page === 'profile') {
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
          />
        );
      case 'generate':
        return <GeneratePage onNavigate={handleNavigate} />;
      case 'library':
        return <LibraryPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
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
      />

      {/* Dynamic Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {renderCurrentView()}
      </div>
    </div>
  );
}