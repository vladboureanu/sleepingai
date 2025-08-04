'use client';

import { useState } from 'react';

export default function ProfilePage({ onNavigate, darkMode = false }) {
  const [profileData, setProfileData] = useState({
    name: 'Emily',
    email: 'emily@gmail.com',
    mobile: '',
    location: 'UK'
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving profile changes:', profileData);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    onNavigate?.('landing');
  };

  return (
    <>
      {/* Site-wide dark overlay when dark mode is active - matching HomePage */}
      {darkMode && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-0 transition-opacity duration-300"></div>
      )}

      {/* Main Content Container */}
      <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-auto relative z-10 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 bg-opacity-90 backdrop-blur-md border border-gray-700' 
          : 'bg-white'
      }`}>
        
        {/* Profile Header with icon - centered */}
        <div className="flex items-center justify-center mb-4 relative">
          <h2 className={`text-2xl font-medium flex items-center transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`} style={{ textShadow: darkMode ? '2px 2px 6px rgba(0,0,0,0.9)' : '' }}>
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </h2>
          {/* Back button */}
          <button 
            onClick={() => onNavigate?.('home')}
            className={`absolute right-0 p-2 rounded-full transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Profile Avatar and Basic Info - Separated from form */}
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-4 text-white text-xl font-bold">
            E
          </div>
          <div>
            <h3 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
              Emily
            </h3>
            <p className={`transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`} style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
              emily@gmail.com
            </p>
          </div>
        </div>

        {/* Form Fields using simpler layout with better positioning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Form Fields (separated from profile info) */}
          <div className="space-y-6 ml-20 mt-4">
            {/* Name Field */}
            <div className={`flex items-center border-b-2 pb-2 transition-colors duration-300 ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`} style={{ width: '400px' }}>
              <label className={`font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`} style={{ width: '140px', textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Name
              </label>
              <div className="flex-1 text-right">
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-right font-medium w-full transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className={`flex items-center border-b-2 pb-2 transition-colors duration-300 ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`} style={{ width: '400px' }}>
              <label className={`font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`} style={{ width: '140px', textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Email account
              </label>
              <div className="flex-1 text-right">
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-right font-medium w-full transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}
                />
              </div>
            </div>

            {/* Mobile Number Field */}
            <div className={`flex items-center border-b-2 pb-2 transition-colors duration-300 ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`} style={{ width: '400px' }}>
              <label className={`font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`} style={{ width: '140px', textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Mobile number
              </label>
              <div className="flex-1 text-right">
                <input
                  type="tel"
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Add number"
                  className={`px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-right font-medium w-full transition-colors duration-300 ${
                    darkMode 
                      ? 'placeholder-gray-500 text-gray-400' 
                      : 'placeholder-gray-400 text-gray-400'
                  }`}
                  style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}
                />
              </div>
            </div>

            {/* Location Field */}
            <div className={`flex items-center border-b-2 pb-2 transition-colors duration-300 ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`} style={{ width: '400px' }}>
              <label className={`font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`} style={{ width: '140px', textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}>
                Location
              </label>
              <div className="flex-1 text-right">
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-right font-medium w-full transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  style={{ textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.8)' : '' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Save Button positioned to align with email/mobile gap */}
          <div className="flex flex-col justify-start pt-12 space-y-6 ml-20">
            {/* Save Changes Button - Made smaller */}
            <button
              onClick={handleSaveChanges}
              className="w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Logout Button - Back to bottom-right corner */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleLogout}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${
              darkMode 
                ? 'text-gray-400 hover:text-red-400' 
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v6" />
            </svg>
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
}