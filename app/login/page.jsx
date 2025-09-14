
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCard from '../../components/AuthCard';
import { EyeIcon, EyeOffIcon } from '../../components/EyeIcons'; 
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';

const mapAuthError = (code) => {
  switch (code) {
    case 'auth/invalid-email': return 'The email address is invalid.';
    case 'auth/missing-password': return 'Please enter your password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password': return 'Incorrect email or password.';
    case 'auth/user-disabled': return 'This account has been disabled.';
    case 'auth/user-not-found': return 'No account found with that email.';
    case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
    case 'auth/popup-closed-by-user': return 'Google popup was closed.';
    case 'auth/operation-not-allowed': return 'Sign-in method is not enabled.';
    case 'auth/unauthorized-domain': return 'This domain is not authorized in Firebase.';
    default: return 'Sign-in failed. Please try again.';
  }
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.replace('/dashboard');
    });
    return () => unsub();
  }, [router]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submitOnEnter = (e) => { if (e.key === 'Enter') handleLogin(); };

  const handleLogin = async () => {
    if (!accept) return setErr('Please accept the terms and privacy policy.');
    if (!form.email.trim() || !form.password) return setErr('Please enter email and password.');

    setErr('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      router.push('/dashboard'); 
    } catch (e) {
      setErr(mapAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setErr('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard'); 
    } catch (e) {
      setErr(mapAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <div className="pt-16 text-center">
        <h1 className="text-[64px] md:text-[120px] font-light text-white drop-shadow-lg leading-none">
          Sleeping<span className="text-[#A05C8F] font-semibold">AI</span>
        </h1>
      </div>

      <AuthCard title="Log In">
        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                onKeyDown={submitOnEnter}
                placeholder="Your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  onKeyDown={submitOnEnter}
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/80"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="h-px w-1/3 bg-gray-200" />
              <span className="text-xs text-gray-500">Or Login with</span>
              <div className="h-px w-1/3 bg-gray-200" />
            </div>

            <button
              onClick={googleLogin}
              disabled={loading}
              className="mx-auto flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
            >
              <span className="text-lg">G</span>
              <span className="text-sm">Continue with Google</span>
            </button>
          </div>

          
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleLogin}
              disabled={loading || !accept}
              className="w-80 rounded-xl bg-[#5F3B56] px-6 py-4 text-white font-medium hover:bg-[#53344C] disabled:bg-gray-400"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>

            <label className="text-xs text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
              />
              I accept the terms and privacy policy
            </label>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/forgot-password" className="text-gray-700 hover:text-purple-600">
                Forgot password?
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium hover:text-purple-700">
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>
      </AuthCard>
    </main>
  );
}



