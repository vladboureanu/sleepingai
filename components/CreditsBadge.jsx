'use client';

import { useEffect, useRef, useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';

export default function CreditsBadge({ className = '' }) {
  const [credits, setCredits] = useState(null);
  const unsubDocRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (unsubDocRef.current) {
        unsubDocRef.current();
        unsubDocRef.current = null;
      }
      if (!u) {
        setCredits(null);
        return;
      }

      const userRef = doc(db, 'users', u.uid);

      
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists()) {
          tx.set(userRef, {
            email: u.email ?? null,
            displayName: u.displayName ?? null,
            photoURL: u.photoURL ?? null,
            credits: 50,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        } else {
          tx.update(userRef, { lastLoginAt: serverTimestamp() });
        }
      });

      unsubDocRef.current = onSnapshot(userRef, (snap) => {
        setCredits(snap.data()?.credits ?? 0);
      });
    });

    return () => {
      if (unsubDocRef.current) unsubDocRef.current();
      unsubAuth();
    };
  }, []);

    return (
    <div 
        className={`mt-[12%] inline-flex items-center gap-2 rounded-full border border-black bg-transparent
              whitespace-nowrap leading-none px-3 py-2 text-sm text-black ${className}`}
        title="Your available credits"
    >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#5F3B56]" />
        <span className="font-normal">Credits : {credits ?? '—'}</span>
    </div>
    );
}