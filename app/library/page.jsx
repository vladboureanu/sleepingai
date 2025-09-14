
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  deleteDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '@/app/lib/firebase';
import Header from '@/components/Header';
import StoryCard from '@/components/StoryCard';

const PRICE_CREDITS = 5;

export default function LibraryPage() {
  const router = useRouter();
  const [tab, setTab] = useState('private');
  const [user, setUser] = useState(null);

  const [mine, setMine] = useState([]);
  const [publicStories, setPublicStories] = useState([]);
  const [myPurchases, setMyPurchases] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [liked, setLiked] = useState(new Set());
  const [openComments, setOpenComments] = useState(null);
  const [commentsById, setCommentsById] = useState({});
  const [newComment, setNewComment] = useState({});
  const commentSubsRef = useRef({});

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (!u) return;

      const qMine = query(
        collection(db, 'stories'),
        where('uid', '==', u.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubMine = onSnapshot(qMine, async (snap) => {
        const base = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const hydrated = await Promise.all(
          base.map(async (s) => {
            const isPublic =
              typeof s.public === 'boolean' ? s.public : s.private === false ? true : false;
            if (s.title && s.coverUrl && s.authorName) return { ...s, public: isPublic };
            try {
              const sub = await getDoc(doc(db, 'users', s.uid, 'stories', s.id));
              const sd = sub.exists() ? sub.data() : {};
              return {
                ...s,
                public: isPublic,
                title: s.title || sd.title || 'Untitled',
                authorName: s.authorName || sd.authorName || (u.displayName || 'You'),
                coverUrl: s.coverUrl || sd.coverUrl || null,
                audioUrl: s.audioUrl || sd.audioUrl || null,
                text: s.text || sd.text || '',
                stats: s.stats || sd.stats || {},
              };
            } catch {
              return { ...s, public: isPublic };
            }
          })
        );
        setMine(hydrated);
      });

      const qPub = query(
        collection(db, 'stories'),
        where('public', '==', true),
        orderBy('createdAt', 'desc')
      );
      const unsubPub = onSnapshot(qPub, (snap) => {
        setPublicStories(snap.docs.map((d) => ({ id: d.id, ...d.data(), public: true })));
      });

      const pSnap = await getDocs(collection(db, 'users', u.uid, 'purchases'));
      setMyPurchases(new Set(pSnap.docs.map((d) => d.id)));

      return () => {
        unsubMine?.();
        unsubPub?.();
      };
    });
    return () => unsubAuth();
  }, []);

  const list = useMemo(
    () => (tab === 'private' ? mine : publicStories),
    [tab, mine, publicStories]
  );

  useEffect(() => {
    if (!user) return;
    const current = tab === 'private' ? mine : publicStories;
    let cancelled = false;
    (async () => {
      const likedIds = [];
      for (const s of current) {
        try {
          const likeSnap = await getDoc(doc(db, 'stories', s.id, 'likes', user.uid));
          if (likeSnap.exists()) likedIds.push(s.id);
        } catch {}
      }
      if (!cancelled) setLiked(new Set(likedIds));
    })();
    return () => {
      cancelled = true;
    };
  }, [user, tab, mine, publicStories]);

  const openStory = (id) => router.push(`/story/${id}`);

  const buyStory = async (storyId, authorId) => {
    if (!user || authorId === user.uid) return;
    setBusy(true);
    setError('');
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch('/api/library/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ storyId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Purchase failed');
      setMyPurchases((prev) => new Set([...prev, storyId]));
    } catch (e) {
      setError(e.message || 'Purchase failed');
    } finally {
      setBusy(false);
    }
  };

  const toggleShare = async (story) => {
    if (!user || story.uid !== user.uid) return;
    const newVal = !story.public;
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'stories', story.id), { public: newVal, private: !newVal });
      batch.update(doc(db, 'users', story.uid, 'stories', story.id), {
        public: newVal,
        private: !newVal,
      });
      await batch.commit();
    } catch (e) {
      console.error(e);
      setError('Failed to update sharing state.');
    }
  };

  const deleteStory = async (story) => {
    if (!user || story.uid !== user.uid) return;
    const confirmed = window.confirm(
      `Delete "${story.title || 'this story'}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setBusy(true);
    setError('');
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'stories', story.id));
      batch.delete(doc(db, 'users', user.uid, 'stories', story.id));
      await batch.commit();

      const deletions = [];
      if (story.audioPath)
        deletions.push(deleteObject(storageRef(storage, story.audioPath)).catch(() => {}));
      if (story.coverPath)
        deletions.push(deleteObject(storageRef(storage, story.coverPath)).catch(() => {}));
      await Promise.all(deletions);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to delete story.');
    } finally {
      setBusy(false);
    }
  };

  const toggleLike = async (storyId) => {
    if (!user) return;
    setBusy(true);
    try {
      const likeRef = doc(db, 'stories', storyId, 'likes', user.uid);
      const storyRef = doc(db, 'stories', storyId);
      const batch = writeBatch(db);
      if (liked.has(storyId)) {
        batch.delete(likeRef);
        batch.update(storyRef, { 'stats.likesCount': increment(-1) });
        await batch.commit();
        setLiked((prev) => {
          const n = new Set(prev);
          n.delete(storyId);
          return n;
        });
      } else {
        batch.set(likeRef, { uid: user.uid, createdAt: serverTimestamp() });
        batch.update(storyRef, { 'stats.likesCount': increment(1) });
        await batch.commit();
        setLiked((prev) => new Set(prev).add(storyId));
      }
    } catch (e) {
      console.error(e);
      setError('Failed to update like.');
    } finally {
      setBusy(false);
    }
  };

  const toggleComments = (storyId) => {
    if (openComments === storyId) {
      commentSubsRef.current[storyId]?.();
      delete commentSubsRef.current[storyId];
      setOpenComments(null);
      return;
    }
    if (openComments && commentSubsRef.current[openComments]) {
      commentSubsRef.current[openComments]();
      delete commentSubsRef.current[openComments];
    }
    const qComments = query(
      collection(db, 'stories', storyId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(qComments, (snap) => {
      setCommentsById((prev) => ({
        ...prev,
        [storyId]: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
      }));
    });
    commentSubsRef.current[storyId] = unsub;
    setOpenComments(storyId);
  };

  const submitComment = async (storyId) => {
    if (!user) return;
    const text = (newComment[storyId] || '').trim();
    if (!text) return;
    setBusy(true);
    try {
      const cRef = doc(collection(db, 'stories', storyId, 'comments'));
      const sRef = doc(db, 'stories', storyId);
      const batch = writeBatch(db);
      batch.set(cRef, {
        uid: user.uid,
        text,
        authorName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      batch.update(sRef, { 'stats.commentsCount': increment(1) });
      await batch.commit();
      setNewComment((p) => ({ ...p, [storyId]: '' }));
    } catch (e) {
      console.error(e);
      setError('Failed to add comment.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(commentSubsRef.current).forEach((unsub) => unsub?.());
    };
  }, []);

  return (
    <main className="relative h-screen flex flex-col overflow-hidden">
      <Header current="library" />

      <div className="flex-1 min-h-0">
        <section className="mx-auto mt-8 max-w-5xl rounded-2xl bg-white/95 backdrop-blur p-5 md:p-6 shadow-2xl h-full overflow-y-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <button
              onClick={() => setTab('private')}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                tab === 'private'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Private
            </button>
            <button
              onClick={() => setTab('community')}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                tab === 'community'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Community
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {list.length === 0 ? (
            <div className="text-center text-neutral-500 text-sm">Nothing here yet.</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-4">
              {list.map((s) => {
                const mineStory = s.uid === user?.uid;
                const purchased = myPurchases.has(s.id);
                const title = s.title || 'Untitled';
                const authorName =
                  s.authorName || (mineStory ? user?.displayName || 'You' : 'Anonymous');

                const likesCount = s.stats?.likesCount || 0;
                const commentsCount = s.stats?.commentsCount || 0;
                const isLiked = liked.has(s.id);

                const actionCols = tab === 'private' && mineStory ? 'grid-cols-3' : 'grid-cols-2';

                return (
                  <li
                    key={s.id}
                    className="rounded-2xl bg-white border border-black/5 p-4 shadow-sm max-w-[340px] mx-auto"
                  >
                    <StoryCard
                      compact
                      story={{
                        id: s.id,
                        title,
                        authorName,
                        coverUrl: s.coverUrl,
                        audioUrl: s.audioUrl,
                      }}
                    />

                    <div className="mt-2 flex items-center justify-between text-sm">
                      <button
                        onClick={() => toggleLike(s.id)}
                        disabled={busy}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${
                          isLiked
                            ? 'border-pink-300 bg-pink-50 text-pink-700'
                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{isLiked ? '❤️' : '🤍'}</span>
                        <span>{likesCount}</span>
                      </button>

                      <button
                        onClick={() => toggleComments(s.id)}
                        className="text-neutral-600 hover:underline"
                      >
                        {commentsCount} comments
                      </button>
                    </div>

                    {openComments === s.id && (
                      <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-3">
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {(commentsById[s.id] || []).map((c) => (
                            <div key={c.id} className="text-sm">
                              <span className="font-medium text-neutral-800">{c.authorName}</span>{' '}
                              <span className="text-neutral-700">{c.text}</span>
                            </div>
                          ))}
                          {(commentsById[s.id] || []).length === 0 && (
                            <div className="text-xs text-neutral-500">No comments yet.</div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            value={newComment[s.id] || ''}
                            onChange={(e) =>
                              setNewComment((p) => ({ ...p, [s.id]: e.target.value }))
                            }
                            className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Write a comment…"
                          />
                          <button
                            onClick={() => submitComment(s.id)}
                            disabled={busy}
                            className="rounded-md bg-neutral-900 text-white px-3 py-1.5 text-sm hover:bg-neutral-800 disabled:opacity-60"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}

                    <div className={`mt-3 grid gap-2 ${actionCols}`}>
                      <button
                        onClick={() => openStory(s.id)}
                        className="rounded-lg border border-neutral-300 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50"
                      >
                        Play
                      </button>

                      {tab === 'private' && mineStory && (
                        <button
                          onClick={() => toggleShare(s)}
                          className={`rounded-lg py-1.5 text-sm ${
                            s.public
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-neutral-900 text-white hover:bg-neutral-800'
                          }`}
                          disabled={busy}
                        >
                          {s.public ? 'Shared' : 'Share'}
                        </button>
                      )}

                      {tab === 'private' && mineStory && (
                        <button
                          onClick={() => deleteStory(s)}
                          className="rounded-lg border border-red-300 text-red-700 hover:bg-red-50 py-1.5 text-sm"
                          disabled={busy}
                        >
                          Delete
                        </button>
                      )}

                      {tab === 'community' && !mineStory && (
                        purchased ? (
                          <span className="rounded-lg py-1.5 text-center bg-green-100 text-green-700 text-sm">
                            Purchased
                          </span>
                        ) : (
                          <button
                            onClick={() => buyStory(s.id, s.uid)}
                            disabled={busy}
                            className="rounded-lg bg-[#5F3B56] text-white py-1.5 text-sm hover:bg-[#53344C] disabled:opacity-60"
                          >
                            Buy {PRICE_CREDITS}
                          </button>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
