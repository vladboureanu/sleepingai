'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '../../components/AuthCard';
import { EyeIcon, EyeOffIcon } from '../../components/EyeIcons';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const mapAuthError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use': return 'Email already in use.';
    case 'auth/invalid-email': return 'The email address is invalid.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    default: return 'Could not create account. Please try again.';
  }
};

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [accept, setAccept] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!accept) return setErr('Please accept the terms and privacy policy.');
    if (!form.email.trim() || !form.username.trim() || !form.password) {
      return setErr('Please fill all fields.');
    }
    setErr(''); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      if (form.username.trim()) {
        await updateProfile(cred.user, { displayName: form.username.trim() });
      }
      router.push('/login'); 
    } catch (e) {
      setErr(mapAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <div className="pt-16 text-center">
        <h1 className="text-[64px] md:text-[110px] font-light text-white drop-shadow-lg leading-none">
          Sleeping<span className="text-[#A05C8F] font-semibold">AI</span>
        </h1>
      </div>

      <AuthCard title="Create account">
        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Left inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={onChange}
                placeholder="Your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                name="username" value={form.username} onChange={onChange}
                placeholder="Your username"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={onChange}
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/80"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleCreate}
              disabled={loading || !accept}
              className="w-72 md:w-80 rounded-xl bg-[#5F3B56] px-6 py-4 text-white font-medium hover:bg-[#53344C] disabled:bg-gray-400"
            >
              {loading ? 'Creating…' : 'Log in'}
            </button>

            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4"
                     checked={accept} onChange={(e) => setAccept(e.target.checked)} />
              I accept the terms and privacy policy
            </label>

            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover:text-purple-700">Log in</Link>
            </p>
          </div>
        </div>
      </AuthCard>
    </main>
  );
}
