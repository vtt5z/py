import { initializeApp, getApps, getApp } from "firebase/app";

import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";

import {
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";

import {
  getStorage,
  connectStorageEmulator,
} from "firebase/storage";

import {
  getAnalytics,
  isSupported,
} from "firebase/analytics";

/**
 * ============================================
 * HARON OS — Firebase Configuration
 * ============================================
 */

const firebaseConfig = {
  apiKey:
    process.env
      .NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env
      .NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env
      .NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env
      .NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env
      .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env
      .NEXT_PUBLIC_FIREBASE_APP_ID,

  measurementId:
    process.env
      .NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * ============================================
 * Validate Firebase Config
 * ============================================
 */

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

/**
 * ============================================
 * Firebase App
 * ============================================
 */

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

/**
 * ============================================
 * Firebase Services
 * ============================================
 */

export const auth = getAuth(app);

export const firestore =
  getFirestore(app);

export const storage =
  getStorage(app);

/**
 * ============================================
 * Analytics (Client Only)
 * Prevent SSR crashes on Vercel
 * ============================================
 */

export let analytics: ReturnType<
  typeof getAnalytics
> | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

/**
 * ============================================
 * Firebase Emulators (Development Only)
 * ============================================
 */

if (
  process.env.NODE_ENV ===
  "development"
) {
  /**
   * Auth Emulator
   */
  if (
    process.env
      .NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL
  ) {
    try {
      connectAuthEmulator(
        auth,
        process.env
          .NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL,
        {
          disableWarnings: true,
        },
      );
    } catch {}
  }

  /**
   * Firestore Emulator
   */
  if (
    process.env
      .NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL
  ) {
    try {
      const [host, port] =
        process.env
          .NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL.split(
            ":",
          );

      connectFirestoreEmulator(
        firestore,
        host,
        Number(port),
      );
    } catch {}
  }

  /**
   * Storage Emulator
   */
  if (
    process.env
      .NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL
  ) {
    try {
      const [host, port] =
        process.env
          .NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL.split(
            ":",
          );

      connectStorageEmulator(
        storage,
        host,
        Number(port),
      );
    } catch {}
  }
}

/**
 * ============================================
 * Safe Exports
 * ============================================
 */

export { app };

export default app;
export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseFirestore() {
  return firestore;
}

export function getFirebaseStorage() {
  return storage;
}