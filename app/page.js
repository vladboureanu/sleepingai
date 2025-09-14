
'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center">
      
      <div className="text-center px-6 max-w-3xl">
        
        <h1 className="font-light text-white drop-shadow-lg leading-none">
          <span className="block text-[64px] md:text-[120px] lg:text-[160px] tracking-tight">
            Sleeping<span className="text-[#A05C8F] font-semibold">AI</span>
          </span>
        </h1>

        
        <p className="mt-4 text-xl md:text-2xl text-white/90">
          Your Bedtime, Reimagined.
        </p>

        
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="w-72 md:w-96 rounded-xl px-6 py-4 text-white text-base md:text-lg font-medium 
                       bg-[#5F3B56] hover:bg-[#53344C] transition-colors shadow-md"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="w-72 md:w-96 rounded-xl px-6 py-4 text-base md:text-lg font-medium 
                       bg-transparent text-white border border-white/60 hover:border-white transition-colors backdrop-transparent-sm"
          >
            Create account
          </Link>
        </div>
      </div>

      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-xs md:text-sm text-white/70">
          By creating an account or signing you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2 text-white/80 hover:text-white">
            Terms and Conditions
          </Link>
        </p>
      </div>
    </main>
  );
}
