
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Carousel from '../../components/Carousel';
import CreditsBadge from '../../components/CreditsBadge';

import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function DashboardPage() {
  const router = useRouter();

  
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace('/login');
      setCheckingAuth(false);
    });
    return () => unsub();
  }, [router]);

  
  const handleNavigate = (tab) => {
    if (tab === 'generate') router.push('/generate');
    
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      router.push('/login');
    }
  };

  const items = useMemo(
    () => [
      {
        id: 'science',
        title: 'Science & Space',
        subtitle: 'Journey through the cosmos and scientific discoveries',
        image: 'science.jpg',
      },
      {
        id: 'history',
        title: 'Historical Echoes',
        subtitle: 'Discover ancient civilizations and cultural treasures',
        image: 'history.jpg',
      },
      {
        id: 'nature',
        title: 'Nature Escapes',
        subtitle: 'Explore the wonders of the natural world',
        image: 'nature.jpg',
      },
      {
        id: 'fantasy',
        title: 'Fantasy Realms',
        subtitle: 'Enter magical realms and mystical adventures',
        image: 'fantasy.jpg',
      },
      {
        id: 'philosophy',
        title: 'Philosophy & Dreams',
        subtitle: 'Adventures and ideas: simple paths to big dreams',
        image: 'philosophy.jpg',
      },
    ],
    []
  );

  if (checkingAuth) {
    return (
      <div
        className="min-h-screen grid place-items-center"
        style={{
          backgroundImage: 'url("/images/sleepingai-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-center gap-3 text-white/90">
          <div className="h-5 w-5 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div
        
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url("/images/sleepingai-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
          
      
      <Header current="home" onNavigate={handleNavigate} onLogout={handleLogout} />

     

      
      <section className="mt-10 md:mt-7 px-4">
        <Carousel items={items} />
      </section>

      
      <div className="mt-8 mb-14 flex justify-center">
        <button
          onClick={() => router.push('/generate')}
          className="rounded-xl bg-white/90 hover:bg-white text-gray-800 px-6 py-2 shadow-md"
        >
          Generate Story
        </button>
      </div>
    
    </div>
  );
}


