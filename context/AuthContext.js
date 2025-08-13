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
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setCurrentUser(fbUser);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/signin"
    });

  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = () => 
    signInWithPopup(auth, googleProvider)
      .then(result => result.user)
      .catch(error => {
        return null;
      });

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        loading: isLoading,
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