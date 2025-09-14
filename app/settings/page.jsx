
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { auth, db } from '@/app/lib/firebase';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const router = useRouter();

  
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u || null);
      if (!u) return;

      setEmail(u.email || '');
      setDisplayName(u.displayName || '');

      const ref = doc(db, 'users', u.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};
      const settings = data.settings || {};

      
      const dm =
        typeof settings.darkMode === 'boolean'
          ? settings.darkMode
          : (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark');

      setEmailNotifications(!!settings.emailNotifications);
      setDarkMode(!!dm);

      
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', !!dm);
        localStorage.setItem('theme', dm ? 'dark' : 'light');
      }
    });
    return () => unsub();
  }, []);

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  
  const saveSettings = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(
        ref,
        { settings: { emailNotifications, darkMode } },
        { merge: true }
      );
      showMessage('ok', 'Settings saved.');
    } catch (e) {
      showMessage('err', e.message || 'Failed to save settings.');
    } finally {
      setBusy(false);
    }
  };

  
  const toggleDark = async () => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
    }
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          'settings.darkMode': next,
        });
      } catch {
        
      }
    }
  };

  
  const sendReset = async () => {
    if (!user?.email) {
      showMessage('err', 'No email on this account.');
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      showMessage('ok', `Reset link sent to ${user.email}.`);
    } catch (e) {
      showMessage('err', e.message || 'Failed to send reset email.');
    } finally {
      setBusy(false);
    }
  };

  
  const changePassword = async () => {
    if (!user) return;

    
    if (newPw.length < 6) {
      showMessage('err', 'New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      showMessage('err', 'New passwords do not match.');
      return;
    }

    
    const usesPassword = (user.providerData || []).some((p) => p.providerId === 'password');
    if (!usesPassword) {
      showMessage('err', 'This account uses a social login. Use the reset link instead.');
      return;
    }

    setBusy(true);
    try {
      
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);

      await updatePassword(user, newPw);

      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      showMessage('ok', 'Password updated.');
    } catch (e) {
      const text =
        e.code === 'auth/wrong-password'
          ? 'Current password is incorrect.'
          : e.message || 'Failed to change password.';
      showMessage('err', text);
    } finally {
      setBusy(false);
    }
  };

  const backToDashboard = () => router.push('/dashboard');

  return (
    <main className="relative min-h-screen">
      <Header current="settings" />

      
      <section className="mx-auto mt-6 max-w-4xl rounded-2xl bg-white/95 backdrop-blur p-5 md:p-6 shadow-2xl relative">
        
        <button
          onClick={backToDashboard}
          className="absolute right-4 top-4 h-8 w-8 grid place-items-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          title="Back to Dashboard"
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="mb-5 text-center">
          
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-6">
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Change password</h3>
              <div className="space-y-2">
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Current password"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="New password"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={changePassword}
                    disabled={busy}
                    className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-60"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={sendReset}
                    disabled={busy}
                    className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    Send Reset Link
                  </button>
                </div>
                <p className="text-xs text-neutral-500">
                  Tip: If you signed in with Google/Apple, use the reset link.
                </p>
              </div>
            </div>

            
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Email notifications</h3>
              <label className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-sm text-neutral-800">Story updates & tips</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-purple-600"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </label>
            </div>
          </div>

          
          <div className="space-y-6">
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Appearance</h3>
              <label className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-sm text-neutral-800">Dark mode</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-purple-600"
                  checked={darkMode}
                  onChange={toggleDark}
                />
              </label>
              <p className="mt-1 text-xs text-neutral-500">
                Saved to your account and device.
              </p>
            </div>

            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Account</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="rounded-lg border border-neutral-200 px-3 py-2">
                  <div className="text-[11px] text-neutral-500">Name</div>
                  <div className="text-sm text-neutral-900">{displayName || '—'}</div>
                </div>
                <div className="rounded-lg border border-neutral-200 px-3 py-2">
                  <div className="text-[11px] text-neutral-500">Email</div>
                  <div className="text-sm text-neutral-900">{email || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {msg.text && (
          <div
            className={`mt-5 rounded-md px-4 py-3 text-sm ${
              msg.type === 'ok'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={saveSettings}
            disabled={busy}
            className="rounded-xl bg-[#5F3B56] px-6 py-3 text-white font-medium hover:bg-[#53344C] disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </section>
    </main>
  );
}
