import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  10: process.env.STRIPE_PRICE_10_CREDITS,
  25: process.env.STRIPE_PRICE_25_CREDITS,
  50: process.env.STRIPE_PRICE_50_CREDITS,
};

export async function POST(req) {
  const { credits } = await req.json();
  const priceId = PRICE_MAP[credits];
  if (!priceId) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const origin = req.headers.get("origin");
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment",
    success_url: `${origin}/credits?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/credits?canceled=true`,
    metadata: {
      credits: String(credits),
    },
  });

  return NextResponse.json({ url: session.url });
}
