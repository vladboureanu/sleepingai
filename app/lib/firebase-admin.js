
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function buildCredentialFromEnv() {
  
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    try {
      return cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS));
    } catch (e) {
      console.warn('[admin] Invalid FIREBASE_ADMIN_CREDENTIALS JSON:', e);
    }
  }
  
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (projectId && clientEmail && privateKey) {
    return cert({ projectId, clientEmail, privateKey });
  }
  
  return null;
}

const parsedCreds = (() => {
  try {
    return process.env.FIREBASE_ADMIN_CREDENTIALS
      ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
      : null;
  } catch {
    return null;
  }
})();

const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID ||
  parsedCreds?.project_id ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  undefined;


const storageBucketEnv = process.env.FIREBASE_STORAGE_BUCKET; 

const app =
  getApps()[0] ??
  initializeApp({
    credential: buildCredentialFromEnv() || undefined,
    projectId: projectId || undefined,
    storageBucket: storageBucketEnv || undefined,
  });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);


const resolvedBucketName =
  storageBucketEnv || (projectId ? `${projectId}.appspot.com` : undefined);

if (!resolvedBucketName) {
  console.warn('[admin] No bucket configured. Set FIREBASE_STORAGE_BUCKET or FIREBASE_ADMIN_PROJECT_ID.');
}

export const adminBucket = resolvedBucketName
  ? adminStorage.bucket(resolvedBucketName)
  : null;


console.log('[admin] projectId:', projectId || '(none)');
console.log('[admin] resolvedBucketName:', resolvedBucketName || '(none)');


