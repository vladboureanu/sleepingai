"use client";
import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../app/firebase";

export const AuthContext = createContext({
  user: null,
  loading: true,
  signUp: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  signInWithGoogle: async () => {},
});

export function AuthContextProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Always return the **credential object** (so you can use .user)
  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/signin"
    });

  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => 
    signInWithPopup(auth, provider)
      .then(result => result.user)
      .catch(error => {
        // Optional: handle error or return null
        return null;
      });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        login,
        logout,
        resetPassword,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
