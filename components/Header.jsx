
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import CreditsBadge from '@/components/CreditsBadge';

export default function Header({ current = 'home', onLogout }) {
  const router = useRouter();
  const tabs = ['home', 'generate', 'library', 'profile', 'settings'];
  const [open, setOpen] = useState(false);

  const routes = {
    home: '/dashboard',
    generate: '/generate',
    library: '/library',
    profile: '/profile',
    settings: '/settings',
    credits: '/credits',
  };

  const go = (key) => router.push(routes[key] || '/dashboard');

  const linkClass = (key) =>
    `px-1 text-sm md:text-base tracking-tight transition-colors rounded
     ${current === key ? 'text-neutral-700 font-medium' : 'text-neutral-500 hover:text-neutral-900'}`;

  
  const doLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      router.push('/'); 
    }
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [open]);

  return (
    <header className="w-full">
      
      <div className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100">
        <div className="relative w-full px-4 sm:px-6 py-4">
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-800 hover:bg-neutral-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Open navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {tabs.map((key) => (
              <button
                key={key}
                onClick={() => go(key)}
                className={linkClass(key)}
                aria-current={current === key ? 'page' : undefined}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </button>
            ))}
          </nav>

          
          <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2">
            <button
              onClick={doLogout}
              className="text-sm text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
              aria-label="Log out"
              type="button"
            >
              <span className="text-xs">⏻</span> Log Out
            </button>

            <div className="absolute right-0 top-full z-[70] mt-[2%]">
              <button
                type="button"
                onClick={() => go('credits')}
                className="inline-block cursor-pointer"
                aria-label="Open credits"
              >
                <CreditsBadge className="cursor-pointer select-none" />
              </button>
            </div>
          </div>
        </div>

        
        <div
          className={`md:hidden fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!open}
        >
          <div
            onClick={() => setOpen(false)}
            className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          />
          <aside
            className={`absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-end px-2 py-2 border-b border-neutral-200">
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-md text-neutral-700 hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="px-4 py-3 flex flex-col gap-1">
              {tabs.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    go(key);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-2 py-3 rounded-md ${
                    current === key ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  {key[0].toUpperCase() + key.slice(1)}
                </button>
              ))}
              <button
                onClick={() => {
                  go('credits');
                  setOpen(false);
                }}
                className={`w-full text-left px-2 py-3 rounded-md ${
                  current === 'credits' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                Credits
              </button>
            </nav>

            <div className="mt-2 px-4 py-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setOpen(false);
                  doLogout();
                }}
                className="w-full justify-center inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white py-2.5 hover:bg-neutral-800"
                type="button"
              >
                <span className="text-xs">⏻</span> Log Out
              </button>
            </div>
          </aside>
        </div>
      </div>

      
      <div className="pt-10 text-center">
        <h1 className="font-light text-white drop-shadow-lg leading-none">
          <span className="block text-[64px] md:text-[120px] lg:text-[110px] tracking-tight">
            Sleeping<span className="text-[#A05C8F] font-semibold">AI</span>
          </span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-white/90">Your Bedtime, Reimagined.</p>
      </div>
    </header>
  );
}
