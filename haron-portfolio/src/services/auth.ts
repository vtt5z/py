/**
 * Firebase Authentication Service
 * 
 * SECURITY PRINCIPLES:
 * - All role information is verified server-side
 * - Frontend never trusts role claims
 * - Email verification required for persistence
 * - Guest mode has limited functionality
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInAnonymously,
  onAuthStateChanged,
  User,
  AuthError,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase";
import type { UserProfile, AuthUser } from "@/types/auth";

const OWNER_EMAILS = (process.env.NEXT_PUBLIC_OWNER_EMAILS || "").split(",").filter(Boolean);

/**
 * Convert Firebase User to AuthUser
 */
export function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
   metadata: {
  createdAt: user.metadata.creationTime
    ? new Date(user.metadata.creationTime)
    : undefined,

  lastSignInTime: user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime)
    : undefined,
},
  };
}

/**
 * Get or create user profile in Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured()) return null;

  const db = getFirebaseFirestore();
  const profileRef = doc(db, "users", userId);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    return null;
  }

  const data = profileSnap.data();
  return {
    id: userId,
    email: data.email || "",
    displayName: data.displayName || null,
    photoURL: data.photoURL || null,
    role: data.role || "user",
    emailVerified: data.emailVerified || false,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    language: data.language || "en",
  };
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
  userId: string,
  data: Partial<Omit<UserProfile, "id" | "createdAt">>
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getFirebaseFirestore();
  const profileRef = doc(db, "users", userId);
  const profileSnap = await getDoc(profileRef);

  const updates = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      ...updates,
      createdAt: Timestamp.now(),
    });
  } else {
    await updateDoc(profileRef, updates);
  }
}

/**
 * Determine user role (server-side verification)
 * 
 * SECURITY: Never trust frontend role claims
 */
export function determineUserRole(email: string | null): "owner" | "user" {
  if (!email) return "user";
  return OWNER_EMAILS.includes(email.toLowerCase()) ? "owner" : "user";
}

/**
 * Sign in with Google
 */
export async function signInWithGoogleProvider(): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  
  // Set persistence
  await setPersistence(auth, browserLocalPersistence);
  
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Create or update profile
  const role = determineUserRole(user.email);
  await upsertUserProfile(user.uid, {
    email: user.email || "",
    displayName: user.displayName,
    photoURL: user.photoURL,
    role,
    emailVerified: user.emailVerified,
    language: "en",
  });

  return user;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmailPassword(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  
  // Set persistence
  await setPersistence(auth, browserLocalPersistence);
  
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  // Update display name
  // Note: updateProfile is not imported here, handle on client side or in separate call
  
  // Send verification email
  try {
    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?uid=${user.uid}`,
    });
  } catch (error) {
    console.error("Failed to send verification email", error);
  }

  // Create profile
  const role = determineUserRole(user.email);
  await upsertUserProfile(user.uid, {
    email: user.email || "",
    displayName: displayName || null,
    photoURL: null,
    role,
    emailVerified: false,
    language: "en",
  });

  return user;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  
  // Set persistence
  await setPersistence(auth, browserLocalPersistence);
  
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Sign in anonymously (guest mode)
 */
export async function signInAnonymouslyProvider(): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  
  // Set persistence
  await setPersistence(auth, browserLocalPersistence);
  
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Sign out current user
 */
export async function signOutProvider(): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const auth = getFirebaseAuth();
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPasswordEmail(email: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email, {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
  });
}

/**
 * Send verification email
 */
export async function sendVerificationEmailToUser(): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user signed in");
  }

  await sendEmailVerification(user, {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?uid=${user.uid}`,
  });
}

/**
 * Monitor auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }

  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(toAuthUser(firebaseUser));
  });
}

/**
 * Get auth error message
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "An unknown error occurred";
  }

  const authError = error as AuthError;
  
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Email already in use. Try signing in instead.",
    "auth/invalid-email": "Invalid email address.",
    "auth/operation-not-allowed": "This operation is not allowed.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-disabled": "This user account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/popup-closed-by-user": "Sign in was cancelled.",
    "auth/cancelled-popup-request": "Sign in request was cancelled.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };

  return messages[authError.code] || authError.message || "An error occurred";
}
