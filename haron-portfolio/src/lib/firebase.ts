import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

/**
 * Firebase configuration
 * 
 * Required environment variables:
 * - NEXT_PUBLIC_FIREBASE_API_KEY
 * - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 * - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 * - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - NEXT_PUBLIC_FIREBASE_APP_ID
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

let app: ReturnType<typeof initializeApp> | null = null;

export function initializeFirebase() {
  if (app) return app;
  
  if (!isFirebaseConfigured()) {
    console.warn("Firebase is not configured. Set environment variables to enable.");
    return null;
  }

  app = initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseApp() {
  return app || initializeFirebase();
}

// Auth
export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase not configured");
  
  const auth = getAuth(app);
  
  // Enable emulator in development if URL is set
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL &&
    !auth.emulatorConfig
  ) {
    try {
      connectAuthEmulator(
        auth,
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL,
        { disableWarnings: true }
      );
    } catch (error) {
      // Emulator already connected or not available
    }
  }
  
  return auth;
}

// Firestore
export function getFirebaseFirestore() {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase not configured");
  
  const firestore = getFirestore(app);
  
  // Enable emulator in development if URL is set
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL &&
    !firestore.emulatorConfig
  ) {
    try {
      const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL.split(":");
      connectFirestoreEmulator(firestore, host, parseInt(port));
    } catch (error) {
      // Emulator already connected or not available
    }
  }
  
  return firestore;
}

// Storage
export function getFirebaseStorage() {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase not configured");
  
  const storage = getStorage(app);
  
  // Enable emulator in development if URL is set
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL &&
    !storage.emulatorConfig
  ) {
    try {
      const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_URL.split(":");
      connectStorageEmulator(storage, host, parseInt(port));
    } catch (error) {
      // Emulator already connected or not available
    }
  }
  
  return storage;
}
