const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const TARGET_USER = 'mRtqjHzonpfvKNgD94Ej4Teidyl2';

async function makeAdmin() {
  const db = admin.firestore();
  const userDoc = db.collection('users').doc(TARGET_USER);

  await userDoc.set(
    { role: 'admin' },
    { merge: true }
  );

  console.log(`✅ Set 'admin' role for user ${TARGET_USER}`);
  process.exit(0);
}

makeAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});