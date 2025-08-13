import { buffer } from "micro";
import Stripe from "stripe";
import { getFirestore, doc, updateDoc, increment, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSig = process.env.STRIPE_WEBHOOK_SECRET;

const firebaseConfig = { /* your config from .env.local */ };
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const firestore = getFirestore(firebaseApp);

export async function POST(req) {
  const reqBuffer = await buffer(req);
  const signature = req.headers["stripe-signature"];
  let webhookEvent;

  try {
    webhookEvent = stripeClient.webhooks.constructEvent(reqBuffer, signature, webhookSig);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (webhookEvent.type === "checkout.session.completed") {
    const checkoutSession = webhookEvent.data.object;
    const newCredits = Number(checkoutSession.metadata.credits);
    const userEmail = checkoutSession.customer_details.email;

    const userCollection = collection(firestore, "users");
    const userQuery = query(userCollection, where("email", "==", userEmail));
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      const foundUser = userSnapshot.docs[0];
      const userDocRef = doc(firestore, "users", foundUser.id);

      await updateDoc(userDocRef, {
        credits: increment(newCredits),
      });

      await addDoc(collection(userDocRef, "transactions"), {
        type: "purchase",
        credits: newCredits,
        amount: checkoutSession.amount_total / 100,
        timestamp: new Date(),
        sessionId: checkoutSession.id,
      });
    }
  }

  return new Response("OK");
}

export const config = {
  api: { bodyParser: false },
};