// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3ILdM4vXdE-X1FMNGDSDKa77rDphnDUk",
  authDomain: "sleepingai-5abd2.firebaseapp.com",
  projectId: "sleepingai-5abd2",
  storageBucket: "sleepingai-5abd2.firebasestorage.app",
  messagingSenderId: "536125938870",
  appId: "1:536125938870:web:e33dbd39a75b71dbde9a17",
  measurementId: "G-9EZTDZDF4P"
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// import { initializeApp, getApps } from "firebase/app";

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);