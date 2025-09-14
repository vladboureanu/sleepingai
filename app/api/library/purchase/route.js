// app/api/library/purchase/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore'; 

const PRICE_CREDITS = 5;

export async function POST(req) {
  try {
    const { storyId } = await req.json();
    const authHeader = req.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) return NextResponse.json({ error: 'NO_TOKEN' }, { status: 401 });

    const { uid: buyerUid } = await adminAuth.verifyIdToken(idToken);

    const storyRef = adminDb.collection('stories').doc(storyId);
    const buyerRef = adminDb.collection('users').doc(buyerUid);

    let remainingCredits = null;

    await adminDb.runTransaction(async (tx) => {
      const storySnap = await tx.get(storyRef);
      if (!storySnap.exists) throw new Error('NOT_FOUND');
      const story = storySnap.data();

      if (!story.public) throw new Error('NOT_PUBLIC');
      const authorUid = story.uid;
      if (!authorUid) throw new Error('NO_AUTHOR');
      if (authorUid === buyerUid) throw new Error('CANT_BUY_OWN');

      
      const purchaseRef = buyerRef.collection('purchases').doc(storyId);
      const purchaseSnap = await tx.get(purchaseRef);
      if (purchaseSnap.exists) throw new Error('ALREADY_PURCHASED');

      
      const buyerSnap = await tx.get(buyerRef);
      const buyerCredits = buyerSnap.data()?.credits ?? 0;
      if (buyerCredits < PRICE_CREDITS) throw new Error('INSUFFICIENT_CREDITS');

      const authorRef = adminDb.collection('users').doc(authorUid);
      const authorSnap = await tx.get(authorRef);

      
      const authorStoryRef = authorRef.collection('stories').doc(storyId);
      const authorStorySnap = await tx.get(authorStoryRef);
      const authorStory = authorStorySnap.exists ? authorStorySnap.data() : null;

      const merged = {
        uid: buyerUid,
        originalUid: authorUid,
        source: 'purchase',
        purchasedFrom: authorUid,

        title: story.title ?? authorStory?.title ?? 'Untitled',
        authorName: story.authorName ?? authorStory?.authorName ?? null,
        topic: story.topic ?? authorStory?.topic ?? null,
        music: story.music ?? authorStory?.music ?? null,
        voice: story.voice ?? authorStory?.voice ?? null,
        lengthMin: story.lengthMin ?? authorStory?.lengthMin ?? null,

        text: story.text ?? authorStory?.text ?? null,
        coverUrl: story.coverUrl ?? authorStory?.coverUrl ?? null,
        audioUrl: story.audioUrl ?? authorStory?.audioUrl ?? null,
        audioPath: story.audioPath ?? authorStory?.audioPath ?? null,

        public: false,
        private: true,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      
      tx.update(buyerRef, { credits: buyerCredits - PRICE_CREDITS });
      tx.update(authorRef, { credits: (authorSnap.data()?.credits ?? 0) + PRICE_CREDITS });
      remainingCredits = buyerCredits - PRICE_CREDITS;

      const when = FieldValue.serverTimestamp();

      
      tx.set(purchaseRef, {
        storyId,
        authorUid,
        price: PRICE_CREDITS,
        createdAt: when,
        title: merged.title,
      });

      
      const buyerStoryRef = buyerRef.collection('stories').doc(storyId);
      tx.set(buyerStoryRef, merged, { merge: true });

      
      const saleRef = authorRef.collection('sales').doc();
      tx.set(saleRef, {
        storyId,
        buyerUid,
        price: PRICE_CREDITS,
        createdAt: when,
        title: merged.title,
      });

      
      tx.update(storyRef, {
        'stats.salesCount': FieldValue.increment(1),
        updatedAt: when,
      });
    });

    return NextResponse.json({ ok: true, remainingCredits });
  } catch (e) {
    const map = {
      NOT_FOUND: 404,
      NOT_PUBLIC: 400,
      NO_AUTHOR: 400,
      CANT_BUY_OWN: 400,
      ALREADY_PURCHASED: 409,
      INSUFFICIENT_CREDITS: 403,
    };
    const code = map[e.message] ?? 500;
    return NextResponse.json({ error: e.message || 'FAILED' }, { status: code });
  }
}
