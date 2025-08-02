'use client';

import { useState } from 'react';

export default function ProfilePage({ onNavigate }) {
  const [profileData, setProfileData] = useState({
    name: 'Emily',
    email: 'emily@gmail.com',
    mobile: '',
    location: 'UK'
  });

<<<<<<< HEAD
=======
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    mobile: false,
    location: false
  });

>>>>>>> cfaad4604f31552776673271cb7a67a5dc6b8f16
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
<<<<<<< HEAD
    console.log('Saving profile changes:', profileData);
=======
    // Handle save logic here
    console.log('Saving profile changes:', profileData);
    // You can implement the actual save functionality here
>>>>>>> cfaad4604f31552776673271cb7a67a5dc6b8f16
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
<<<<<<< HEAD
    onNavigate?.('landing');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-auto relative">
      
      {/* Profile Header with icon - centered */}
      <div className="flex items-center justify-center mb-4 relative">
        <h2 className="text-2xl font-medium text-gray-800 flex items-center">
=======
    // Handle logout logic
    onNavigate('landing');
  };

  return (
    // Pure content only - Header component handles the background and logo
    <div className="bg-white rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-95 p-6 max-w-2xl mx-auto relative">
      
      {/* Profile Header with icon - centered */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700 flex items-center">
>>>>>>> cfaad4604f31552776673271cb7a67a5dc6b8f16
          <svg className="w-6 h-6 mr-2 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
<<<<<<< HEAD
        </h2>
        {/* Back button */}
        <button 
          onClick={() => onNavigate?.('home')}
          className="absolute right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
=======
        </h1>
        {/* Back button in top-right corner */}
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
>>>>>>> cfaad4604f31552776673271cb7a67a5dc6b8f16
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

<<<<<<< HEAD
      {/* Profile Avatar and Basic Info - Separated from form */}
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-4 text-white text-xl font-bold">
          E
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Emily</h3>
          <p className="text-gray-600">emily@gmail.com</p>
        </div>
      </div>

      {/* Form Fields using simpler layout with better positioning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column - Form Fields (separated from profile info) */}
        <div className="space-y-6 ml-20 mt-4">
          {/* Name Field */}
          <div className="flex items-center border-b-2 border-gray-300 pb-2" style={{ width: '400px' }}>
            <label className="text-gray-700 font-medium" style={{ width: '140px' }}>Name</label>
            <div className="flex-1 text-right">
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-800 text-right font-medium w-full"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex items-center border-b-2 border-gray-300 pb-2" style={{ width: '400px' }}>
            <label className="text-gray-700 font-medium" style={{ width: '140px' }}>Email account</label>
            <div className="flex-1 text-right">
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-800 text-right font-medium w-full"
              />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div className="flex items-center border-b-2 border-gray-300 pb-2" style={{ width: '400px' }}>
            <label className="text-gray-700 font-medium" style={{ width: '140px' }}>Mobile number</label>
            <div className="flex-1 text-right">
              <input
                type="tel"
                value={profileData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Add number"
                className="px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-400 text-gray-400 text-right font-medium w-full"
              />
            </div>
          </div>

          {/* Location Field */}
          <div className="flex items-center border-b-2 border-gray-300 pb-2" style={{ width: '400px' }}>
            <label className="text-gray-700 font-medium" style={{ width: '140px' }}>Location</label>
            <div className="flex-1 text-right">
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="px-0 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent text-gray-800 text-right font-medium w-full"
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
=======
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
>>>>>>> cfaad4604f31552776673271cb7a67a5dc6b8f16
          >
            Save Changes
          </button>
        </div>
<<<<<<< HEAD
      </div>

      {/* Logout Button - Back to bottom-right corner */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-red-600 transition-colors duration-200"
        >
          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v6" />
          </svg>
          <span className="text-sm font-medium">Log out</span>
=======

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
>>>>>>> cfaad4604f31552776673271cb7a67a5dc6b8f16
        </button>
      </div>
    </div>
  );
}