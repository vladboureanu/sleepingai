'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

const PACKS = [
  { id: 'CREDITS_10', label: '10 credits',  priceLabel: '£2.99', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_10 },
  { id: 'CREDITS_25', label: '25 credits',  priceLabel: '£5.99', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_25 },
  { id: 'CREDITS_50', label: '50 credits',  priceLabel: '£9.99', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_50 },
];

export default function CreditsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [txns, setTxns] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace('/login');
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);

    const unsubUser = onSnapshot(userRef, (snap) => {
      setCredits(snap.data()?.credits ?? 0);
    });

    const txnQ = query(
      collection(db, 'users', user.uid, 'transactions'),
      orderBy('createdAt', 'desc')
    );
    const unsubTxns = onSnapshot(txnQ, (snap) => {
      setTxns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUser();
      unsubTxns();
    };
  }, [user]);

  const addToCart = (priceId) => {
    if (!priceId) return;
    setCart((c) => ({ ...c, [priceId]: (c[priceId] ?? 0) + 1 }));
  };

  const removeFromCart = (priceId) => {
    setCart((c) => {
      const qty = (c[priceId] ?? 0) - 1;
      const next = { ...c };
      if (qty <= 0) delete next[priceId];
      else next[priceId] = qty;
      return next;
    });
  };

  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([priceId, quantity]) => ({
        priceId,
        quantity,
        pack: PACKS.find((p) => p.priceId === priceId),
      })),
    [cart]
  );

  const startCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          items: cartItems.map(({ priceId, quantity }) => ({ priceId, quantity })),
        }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (e) {
      alert(e.message || 'Could not start checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (key) => {
    switch (key) {
      case 'home':     router.push('/dashboard'); break;
      case 'generate': router.push('/generate');  break;
      case 'library':  router.push('/library');   break;
      case 'profile':  router.push('/profile');   break;
      case 'settings': router.push('/settings');  break;
      case 'credits':  router.push('/credits');   break;
      default: break;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const cartCount = cartItems.reduce((a, c) => a + c.quantity, 0);

  return (
    <main className="relative min-h-screen">
      <Header current="credits" onNavigate={handleNavigate} onLogout={handleLogout} />

      <section className="mx-auto mt-6 max-w-5xl rounded-2xl bg-white/95 backdrop-blur p-4 md:p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">Credits</h2>
          <span className="text-sm text-neutral-500">Cart ({cartCount})</span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <div>
              <span className="inline-block rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-xs">
                You have {credits} Credits Remaining
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-800 mb-2">Top Up Credits</h3>
              <ul className="space-y-2">
                {PACKS.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2"
                  >
                    <div className="text-sm text-neutral-800">
                      <span className="mr-3">• {p.label}</span>
                      <span className="text-neutral-500">{p.priceLabel}</span>
                      {!p.priceId && (
                        <span className="ml-2 text-[11px] text-red-600">(priceId missing)</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(p.priceId)}
                      disabled={!p.priceId}
                      className="text-xs rounded-md border border-neutral-300 px-2 py-1 hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Buy
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            
            <div className="rounded-xl border border-neutral-200 bg-white h-[140px] overflow-hidden flex flex-col">
              <div className="px-3 pt-3">
                <h3 className="text-sm font-medium text-neutral-800">Transaction History</h3>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                <ul className="mt-2 space-y-2 text-sm text-neutral-700">
                  {txns.length === 0 && (
                    <li className="text-neutral-500">No transactions yet.</li>
                  )}
                  {txns.map((t) => (
                    <li key={t.id} className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
                      <div className="flex justify-between">
                        <span>{t.title ?? 'Credits purchase'}</span>
                        <span className="text-neutral-500">{t.amount ?? ''}</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {t.credits ?? 0} credits • {t.status ?? 'completed'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          
          <div className="space-y-2">
            <div className="rounded-xl border border-neutral-200 bg-white h-[220px] overflow-hidden flex flex-col">
              <div className="px-4 pt-4">
                <h3 className="text-sm font-medium text-neutral-800">Your cart</h3>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-2">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-neutral-500">No items in cart.</p>
                ) : (
                  <ul className="mt-2 space-y-3">
                    {cartItems.map(({ pack, priceId, quantity }) => (
                      <li key={priceId} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-neutral-800">{pack?.label ?? 'Credits'}</div>
                          <div className="text-xs text-neutral-500">{pack?.priceLabel ?? ''}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(priceId)}
                            className="h-7 w-7 rounded-md border border-neutral-300 grid place-items-center hover:bg-neutral-50"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <button
                            onClick={() => addToCart(priceId)}
                            className="h-7 w-7 rounded-md border border-neutral-300 grid place-items-center hover:bg-neutral-50"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="px-4 pb-4">
                <button
                  onClick={startCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full rounded-lg bg-[#5F3B56] py-2.5 text-white font-medium disabled:bg-neutral-400"
                >
                  {loading ? 'Starting checkout…' : 'Complete Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
