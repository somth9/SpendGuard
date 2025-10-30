"use client";

import React, { createContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.error('Firebase auth not properly initialized!');
      setLoading(false);
      return;
    }
    
    const failsafeTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    try {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          setUser(user);
          setLoading(false);
          clearTimeout(failsafeTimeout);
        },
        (error) => {
          console.error('Auth state change error:', error);
          setLoading(false);
          clearTimeout(failsafeTimeout);
        }
      );

      return () => {
        unsubscribe();
        clearTimeout(failsafeTimeout);
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
      clearTimeout(failsafeTimeout);
    }
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      alert(`Sign in failed: ${error.message}`);
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser, logout: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
