
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { auth, db, storage } from '@/app/lib/firebase';
import { onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return router.replace('/login');
      setUser(u);
      setEmail(u.email || '');

      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        const data = snap.exists() ? snap.data() : {};
        setDisplayName(data.displayName || u.displayName || '');
        setMobile(data.mobile || '');
        setLocation(data.location || '');
        setPhotoURL(data.photoURL || u.photoURL || '');
      } finally {
        setInitialLoaded(true);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const avatarSrc = useMemo(() => {
    if (preview) return preview;
    if (photoURL) return photoURL;
    return '/images/avatar-placeholder.png';
  }, [preview, photoURL]);

  const pickFile = () => fileInputRef.current?.click();

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      let newPhotoURL = photoURL || '';
      if (file) {
        const path = `ProfilePictures/${user.uid}.jpg`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file, { contentType: file.type });
        newPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: displayName || null,
        photoURL: newPhotoURL || null,
      });

      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName: displayName || null,
          email: user.email || null,
          mobile: mobile || null,
          location: location || null,
          photoURL: newPhotoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setPhotoURL(newPhotoURL);
      setFile(null);
      setPreview('');
      setMessage('Profile updated!');
    } catch (e) {
      console.error(e);
      setMessage('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 2200);
    }
  };

  const goBack = () => router.push('/dashboard');
  const logout = async () => { try { await signOut(auth); } finally { router.replace('/login'); } };

  if (!initialLoaded) {
    return (
      <main className="min-h-screen grid place-items-center p-8">
        <div className="rounded-xl bg-white/80 px-4 py-3 text-sm shadow">Loading profile…</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-4 md:px-0">
      <Header current="profile" onLogout={logout} />

     

      
      <section className="mx-auto mt-6 max-w-3xl">
        <div className="relative rounded-2xl bg-white/95 backdrop-blur p-5 md:p-6 shadow-2xl">
          
          <button
            onClick={goBack}
            className="absolute right-4 top-4 h-8 w-8 grid place-items-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            aria-label="Back"
            title="Back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          
          <div className="flex items-center gap-4">
            <div
              className="relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-black/5 cursor-pointer"
              title="Change photo"
              onClick={pickFile}
            >
              
              <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
            </div>

            <div className="min-w-0">
              <div className="text-base font-medium text-neutral-900 truncate">
                {displayName || 'Unnamed'}
              </div>
              <div className="text-sm text-neutral-500 truncate">{email}</div>
            </div>
          </div>

          
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledInput
              label="Name"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Your name"
            />
            <LabeledInput label="Email account" value={email} disabled />
            <LabeledInput
              label="Mobile number"
              value={mobile}
              onChange={setMobile}
              placeholder="Add number"
            />
            <LabeledInput
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Country / City"
            />
          </div>

          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-neutral-500">{message}</div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#5F3B56] px-5 py-2 text-white font-medium shadow hover:bg-[#53344C] disabled:bg-neutral-400"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>

              <button
                onClick={logout}
                className="grid h-9 w-9 place-items-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                aria-label="Log out"
                title="Log out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 17l5-5-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12H9" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      
      <div className="pb-6" />
    </main>
  );
}

function LabeledInput({ label, value, onChange, placeholder, disabled }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-neutral-600">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-neutral-100"
      />
    </label>
  );
}
