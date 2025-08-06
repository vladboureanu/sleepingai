// app/api/webhook/route.js
import { buffer }      from "micro";
import Stripe          from "stripe";
import { getFirestore, doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const stripe     = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Init Firebase (reuse your lib/firebase if you can import, or inline here)
const firebaseConfig = { /* your config from .env.local */ };
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getFirestore(app);

export async function POST(req) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const creditsPurchased = Number(session.metadata.credits);
    const customerEmail = session.customer_details.email;

    // 1) Look up your user in Firestore by email (or use your own userId passed in metadata)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", customerEmail));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);

      // 2) Increment their credit balance
      await updateDoc(userRef, {
        credits: increment(creditsPurchased),
      });

      // 3) Record a transaction
      await addDoc(collection(userRef, "transactions"), {
        type: "purchase",
        credits: creditsPurchased,
        amount: session.amount_total / 100,
        timestamp: new Date(),
        sessionId: session.id,
      });
    }
  }

  return new Response("OK");
}

// Next.js needs to disable the default body parser on webhooks
export const config = {
  api: { bodyParser: false },
};
