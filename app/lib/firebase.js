
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCkM-ZLjF36FI9WuoPmemhUqbMiAwjaiE0',
  authDomain: 'sleepingai-6e9e1.firebaseapp.com',
  projectId: 'sleepingai-6e9e1',
  storageBucket: 'sleepingai-6e9e1.firebasestorage.app',
  messagingSenderId: '7202715196',
  appId: '1:7202715196:web:de018263b855028597b539',
  measurementId: 'G-B35G91J7HS',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


const storage = getStorage(app);


if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, storage, googleProvider };
