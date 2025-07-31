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

export const AuthContext = createContext({});

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
  
  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
  .then(cred => {
    // optionally send email verification:
    // cred.user.sendEmailVerification();
    return cred.user;
  });
  
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  
  const logout = () => signOut(auth);
  
  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/signin" // where user lands after reset
    });
    
    const provider = new GoogleAuthProvider()
  const signInWithGoogle = () => 
    signInWithPopup(auth, provider).then(result => result.user)

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, login, logout, resetPassword, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}