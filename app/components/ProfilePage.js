'use client';

import { useState } from 'react';

export default function ProfilePage({ onNavigate }) {
  const [profileData, setProfileData] = useState({
    name: 'Emily',
    email: 'emily@gmail.com',
    mobile: '',
    location: 'UK'
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    mobile: false,
    location: false
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log('Saving profile changes:', profileData);
    // You can implement the actual save functionality here
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    // Handle logout logic
    onNavigate('landing');
  };

  return (
    // Pure content only - Header component handles the background and logo
    <div className="bg-white rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-95 p-6 max-w-2xl mx-auto relative">
      
      {/* Profile Header with icon - centered */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700 flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </h1>
        {/* Back button in top-right corner */}
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Profile Avatar and Basic Info */}
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-4 overflow-hidden">
          {/* Profile image placeholder - you can replace with actual image */}
          <img 
            src="/api/placeholder/64/64" 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {profileData.name.charAt(0)}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{profileData.name}</h2>
          <p className="text-gray-600">{profileData.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        
        {/* Name Field */}
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium w-32">Name</label>
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-transparent"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium w-32">Email account</label>
          <div className="flex-1 flex items-center">
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-transparent"
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>

        {/* Mobile Number Field */}
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium w-32">Mobile number</label>
          <div className="flex-1 flex items-center">
            <input
              type="tel"
              value={profileData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="Add number"
              className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Location Field */}
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium w-32">Location</label>
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}