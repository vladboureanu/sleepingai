
'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { doc, onSnapshot, runTransaction, serverTimestamp, increment } from 'firebase/firestore';

export default function LikeButton({ storyId, count = 0, className = '' }) {
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [optimistic, setOptimistic] = useState(count);

  useEffect(() => auth.onAuthStateChanged(setUser), []);
  useEffect(() => setOptimistic(count), [count]);

  useEffect(() => {
    if (!user) { setLiked(false); return; }
    const likeRef = doc(db, 'stories', storyId, 'likes', user.uid);
    const unsub = onSnapshot(likeRef, s => setLiked(s.exists()));
    return () => unsub();
  }, [user, storyId]);

  const toggle = async () => {
    if (!user) return alert('Please sign in to like.');
    const storyRef = doc(db, 'stories', storyId);
    const likeRef  = doc(db, 'stories', storyId, 'likes', user.uid);

    await runTransaction(db, async (tx) => {
      const current = await tx.get(likeRef);
      if (current.exists()) {
        tx.delete(likeRef);
        tx.update(storyRef, { 'stats.likesCount': increment(-1) });
        setOptimistic(c => Math.max(0, c - 1));
        setLiked(false);
      } else {
        tx.set(likeRef, { uid: user.uid, createdAt: serverTimestamp() });
        tx.update(storyRef, { 'stats.likesCount': increment(1) });
        setOptimistic(c => c + 1);
        setLiked(true);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm
        ${liked ? 'border-pink-300 bg-pink-50 text-pink-700' : 'border-neutral-300 hover:bg-neutral-50 text-neutral-700'}
        ${className}`}
      aria-pressed={liked}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#ec4899' : 'none'} stroke="#ec4899" strokeWidth="2">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.9 0 3.4 1 4.5 2.5C12.1 5 13.6 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"/>
      </svg>
      <span>{optimistic}</span>
    </button>
  );
}
