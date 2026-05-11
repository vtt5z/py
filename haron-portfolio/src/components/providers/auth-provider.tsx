"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthContextType, AuthUser, UserProfile } from "@/types/auth";
import {
  signInWithGoogleProvider,
  signUpWithEmailPassword,
  signInWithEmailPassword,
  signOutProvider,
  resetPasswordEmail,
  sendVerificationEmailToUser,
  signInAnonymouslyProvider,
  onAuthStateChange,
  getUserProfile,
  getAuthErrorMessage,
} from "@/services/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      try {
        setUser(authUser);

        // Load profile if authenticated
        if (authUser?.uid) {
          const userProfile = await getUserProfile(authUser.uid);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithGoogleProvider();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailPassword(email, password);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      await signUpWithEmailPassword(email, password, displayName);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOutProvider();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Failed to sign out", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const continueAsGuest = useCallback(async () => {
    try {
      setLoading(true);
      await signInAnonymouslyProvider();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    try {
      await sendVerificationEmailToUser();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await resetPasswordEmail(email);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      throw new Error(message);
    }
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !user?.isAnonymous && !!user,
    isGuest: user?.isAnonymous || false,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    continueAsGuest,
    sendVerificationEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
