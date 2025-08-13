'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

export default function SignUpPage() {
  const { signUp } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [passVisible, setPassVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const router = useRouter();

  const updateInput = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createAccount = async () => {
    if (!termsOk) {
      alert('Please accept the terms and privacy policy');
      return;
    }
    
    if (!userInfo.email || !userInfo.username || !userInfo.password) {
      alert('Please fill in all fields');
      return;
    }

    setProcessing(true);
    try {
      await signUp(userInfo.email, userInfo.password);
      window.alert("Account created successfully!");
      router.push('/dashboard');
    } catch (err) {
      window.alert("Registration failed. Please check your email & password and try again.");
    } finally {
      setProcessing(false);
    }
  };

  const goToLogin = () => {
    router.push('/signin');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: 'url("/images/sleepingai-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="mb-8">
        <h1 className="text-6xl md:text-7xl font-light text-white tracking-tight drop-shadow-lg text-center">
          Sleeping<span className="text-purple-600 font-medium">AI</span>
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-medium text-gray-800 mb-8">Create account</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={updateInput}
                placeholder="Your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={userInfo.username}
                onChange={updateInput}
                placeholder="Your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={passVisible ? "text" : "password"}
                  name="password"
                  value={userInfo.password}
                  onChange={updateInput}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setPassVisible(!passVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <button
              onClick={createAccount}
              disabled={processing || !termsOk}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                'Sign up'
              )}
            </button>

            <div className="text-center">
              <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer flex items-center justify-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={termsOk}
                  onChange={(e) => setTermsOk(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-2"
                />
                I accept the terms and privacy policy
              </label>
            </div>

            <div className="text-center mt-20">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={goToLogin}
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
                >
                  Log in
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}