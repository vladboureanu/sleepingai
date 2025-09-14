
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { auth, db } from '@/app/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

const PRICE_CREDITS = 5;

export default function StoryPage() {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [ownerUid, setOwnerUid] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setLoading(true);
      setErr('');
      try {
        
        if (u) {
          const myRef = doc(db, 'users', u.uid, 'stories', id);
          const mySnap = await getDoc(myRef);
          if (mySnap.exists()) {
            const data = { id: mySnap.id, ...mySnap.data() };
            setStory(data);
            
            setOwnerUid(data.originalUid || data.uid || u.uid);
            setAllowed(true); 
            setLoading(false);
            return;
          }
        }

        
        const topRef = doc(db, 'stories', id);
        const topSnap = await getDoc(topRef);
        if (!topSnap.exists()) {
          setErr('Story not found.');
          setLoading(false);
          return;
        }

        const data = { id: topSnap.id, ...topSnap.data() };
        setStory(data);
        setOwnerUid(data.uid || null);

        
        if (u && data.uid === u.uid) {
          setAllowed(true);
        } else if (u) {
          const pSnap = await getDoc(doc(db, 'users', u.uid, 'purchases', id));
          setAllowed(pSnap.exists());
        } else {
          setAllowed(false);
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        setErr('Failed to load story.');
        setLoading(false);
      }
    });

    return () => unsub();
  }, [id]);

  const isOwner = !!(auth.currentUser && ownerUid && auth.currentUser.uid === ownerUid);
  const authorName =
    story?.authorName ||
    (isOwner ? auth.currentUser?.displayName || 'You' : 'Anonymous');

  
  const saveToLibrary = async () => {
    if (!isOwner || !story) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'stories', story.id), { private: true });
      alert('Story saved to your private library!');
    } catch {
      alert('Failed to save.');
    }
  };

  const buyNow = async () => {
    if (!auth.currentUser) return;
    setBuying(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch('/api/library/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ storyId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Purchase failed');
      setAllowed(true);
    } catch (e) {
      alert(e.message || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Loading story…</p>
      </main>
    );
  }

  if (err || !story) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">{err || 'Error loading story.'}</p>
      </main>
    );
  }

  
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const fallbackUrl =
    story.audioPath && bucket
      ? `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
          story.audioPath
        )}?alt=media`
      : '';
  const audioUrl = story.audioUrl || fallbackUrl || '';

  return (
    <main className="relative min-h-screen">
      <Header current="library" />

      
      <section className="mx-auto mt-8 max-w-5xl rounded-2xl bg-white/90 backdrop-blur shadow-2xl p-6 md:p-8 h-[450px] flex flex-col">
        <div className="mb-3">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-900">
            {story.title || 'Untitled story'}
          </h2>
          <p className="text-neutral-500">by {authorName}</p>
        </div>

        {!allowed ? (
          <div className="rounded-xl border border-neutral-200 bg-white/70 p-6 text-center">
            <p className="text-neutral-700 mb-4">Purchase this story to listen and read.</p>
            <button
              onClick={buyNow}
              disabled={buying}
              className="rounded-full bg-[#5F3B56] px-6 py-3 text-white font-medium hover:bg-[#53344C] disabled:opacity-60"
            >
              {buying ? 'Processing…' : `Buy & Play (${PRICE_CREDITS} credits)`}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <AudioPlayer
                src={audioUrl}
                title={story.title || 'Untitled story'}
                artist={authorName}
                downloadName={`${story.title || 'story'}.mp3`}
                saved={!!story.private}
                onSave={isOwner ? saveToLibrary : undefined}
                bgKey={story.music} 
              />
            </div>

            
            <div className="relative flex-1">
              <div className="absolute inset-0 overflow-y-auto pr-2 rounded-xl bg-white/70 text-neutral-800 text-[15px] leading-relaxed whitespace-pre-wrap p-4">
                {story.text || 'No story text available.'}
              </div>
            </div>

            {isOwner && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={saveToLibrary}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5F3B56] px-6 py-3 text-white font-medium hover:bg-[#53344C]"
                >
                  Save to Private Library
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
