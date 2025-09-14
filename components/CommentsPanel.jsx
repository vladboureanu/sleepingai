
'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import {
  collection, doc, onSnapshot, orderBy, query, limit,
  serverTimestamp, writeBatch, increment
} from 'firebase/firestore';

export default function CommentsPanel({ storyId, count = 0 }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => auth.onAuthStateChanged(setUser), []);
  useEffect(() => {
    if (!open) return;
    const q = query(collection(db, 'stories', storyId, 'comments'),
                    orderBy('createdAt', 'asc'), limit(100));
    const unsub = onSnapshot(q, snap => setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [open, storyId]);

  const addComment = async () => {
    if (!user) return alert('Please sign in to comment.');
    const val = text.trim();
    if (!val) return;

    const storyRef = doc(db, 'stories', storyId);
    const newRef   = doc(collection(db, 'stories', storyId, 'comments')); // auto-id

    const b = writeBatch(db);
    b.set(newRef, {
      uid: user.uid,
      authorName: user.displayName || 'Anonymous',
      text: val,
      createdAt: serverTimestamp(),
    });
    b.update(storyRef, { 'stats.commentsCount': increment(1) });
    await b.commit();
    setText('');
  };

  const removeComment = async (comment) => {
    if (!user || user.uid !== comment.uid) return;
    const storyRef = doc(db, 'stories', storyId);
    const cRef     = doc(db, 'stories', storyId, 'comments', comment.id);
    const b = writeBatch(db);
    b.delete(cRef);
    b.update(storyRef, { 'stats.commentsCount': increment(-1) });
    await b.commit();
  };

  return (
    <div className="mt-2">
      <button onClick={() => setOpen(o => !o)} className="text-sm text-neutral-700 hover:underline">
        {open ? 'Hide comments' : `Comments (${count})`}
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-neutral-200 bg-white/70 p-3">
          <div className="max-h-56 overflow-y-auto space-y-2">
            {comments.length === 0 && <div className="text-xs text-neutral-500">Be the first to comment.</div>}
            {comments.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-medium text-neutral-800">{c.authorName || 'User'}:</span>{' '}
                <span className="text-neutral-700">{c.text}</span>
                {user?.uid === c.uid && (
                  <button onClick={() => removeComment(c)} className="ml-2 text-xs text-red-600 hover:underline">
                    delete
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="Add a comment…"
              className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
            <button onClick={addComment} className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
