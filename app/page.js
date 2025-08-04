'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSignIn = () => {
    // Navigate to sign-in page (you'll create this later)
    router.push('/signin');
  };

  const handleCreateAccount = () => {
    // Navigate to registration page (you'll create this later)
    router.push('/register');
  };

  const handleTerms = () => {
    // Navigate to terms page or show modal
    router.push('/terms');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-300 to-teal-400 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl animate-float-slow" 
             style={{top: '20%', left: '20%'}}></div>
        <div className="absolute w-48 h-48 bg-white bg-opacity-10 rounded-full blur-xl animate-float-slower" 
             style={{top: '60%', right: '20%'}}></div>
      </div>

      <div className={`text-center max-w-lg px-8 relative z-10 transition-all duration-1000 flex-1 flex flex-col justify-center ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        {/* Logo */}
        <div className="mb-4">
          <h1 className="text-6xl md:text-7xl font-light text-white tracking-tight mb-2 drop-shadow-lg">
            Sleeping<span className="text-purple-600 font-medium">AI</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-700 font-normal mb-12 opacity-90">
          Your Bedtime, Reimagined.
        </p>

        {/* Buttons */}
        <div className="space-y-4 flex flex-col items-center">
          <button
            onClick={handleSignIn}
            className="w-80 py-4 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 ease-out"
          >
            Sign In
          </button>
          
          <button
            onClick={handleCreateAccount}
            className="w-80 py-4 px-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-700 border-2 border-white border-opacity-30 hover:border-opacity-50 rounded-full text-lg font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 ease-out"
          >
            Create account
          </button>
        </div>
      </div>

      {/* Footer text - Fixed to bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-sm text-gray-600 opacity-80 text-center px-8">
          By creating an account or signing you agree to our{' '}
          <button
            onClick={handleTerms}
            className="text-purple-600 font-medium hover:underline focus:outline-none focus:underline"
          >
            Terms and Conditions
          </button>
        </p>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}