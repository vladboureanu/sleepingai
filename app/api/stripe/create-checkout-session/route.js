
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export async function POST(req) {
  try {
    const { uid, items } = await req.json();
    if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 });
    }

    const origin = req.headers.get('origin');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: uid, 
      line_items: items.map(({ priceId, quantity }) => ({
        price: priceId,
        quantity: Math.max(1, Number(quantity) || 1),
      })),
      success_url: `${origin}/credits?status=success`,
      cancel_url: `${origin}/credits?status=cancelled`,
      
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('Checkout error', e);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
