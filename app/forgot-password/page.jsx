'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthCard from '../../components/AuthCard';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');

  const sendCode = async () => {
    if (!email.trim()) return setMsg('Please enter your email.');
    setMsg(''); setSending(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMsg('Reset email sent. Check your inbox (and spam).');
    } catch (e) {
      setMsg('Could not send reset email. Verify the address and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <div className="pt-16 text-center">
        <h1 className="text-[64px] md:text-[110px] font-light text-white drop-shadow-lg leading-none">
          Sleeping<span className="text-[#A05C8F] font-semibold">AI</span>
        </h1>
      </div>

      <AuthCard title="Forgot Password?">
        <div className="flex justify-end">
          <Link
            href="/login"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
            aria-label="Back to login"
            title="Back"
          >
            ←
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Don&apos;t worry! Please enter the email associated with your account.
        </p>

        {msg && (
          <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-end">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email} placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <button
            onClick={sendCode}
            disabled={sending}
            className="h-[52px] rounded-xl bg-[#5F3B56] px-6 text-white font-medium hover:bg-[#53344C] disabled:bg-gray-400"
          >
            {sending ? 'Sending…' : 'Send Code'}
          </button>
        </div>
      </AuthCard>
    </main>
  );
}
