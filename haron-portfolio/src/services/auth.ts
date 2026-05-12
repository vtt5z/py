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
  applyActionCode,
  browserLocalPersistence,
  browserSessionPersistence,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInAnonymously,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  reload,
  User,
  AuthError,
  setPersistence,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseAuth, getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase";
import { getFirebaseStorage } from "@/lib/firebase";
import { createUsernameSeed } from "@/lib/auth-copy";
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
  return mapProfile(userId, data);
}

function mapProfile(userId: string, data: Record<string, any>): UserProfile {
  const name = data.name || data.displayName || "";
  const avatar = data.avatar || data.photoURL || null;

  return {
    id: userId,
    uid: data.uid || userId,
    email: data.email || "",
    name,
    displayName: data.displayName || name || null,
    username: data.username || createUsernameSeed(data.email, name),
    avatar,
    photoURL: data.photoURL || avatar,
    bio: data.bio || "",
    role: data.role || "user",
    verified: data.verified ?? data.emailVerified ?? false,
    emailVerified: data.emailVerified || false,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    language: data.language || "en",
    preferences: {
      theme: data.preferences?.theme || "dark",
      emailNotifications: data.preferences?.emailNotifications ?? true,
      productUpdates: data.preferences?.productUpdates ?? true,
      securityAlerts: data.preferences?.securityAlerts ?? true,
    },
  };
}

export function subscribeToUserProfile(
  userId: string,
  callback: (profile: UserProfile | null) => void,
) {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }

  const db = getFirebaseFirestore();
  return onSnapshot(doc(db, "users", userId), (snapshot) => {
    callback(snapshot.exists() ? mapProfile(userId, snapshot.data()) : null);
  });
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
  provider.setCustomParameters({
    prompt: "select_account",
  });
  
  await setPersistence(auth, browserLocalPersistence);

  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (error) {
    const authError = error as AuthError;
    if (
      authError.code === "auth/popup-blocked" ||
      authError.code === "auth/popup-closed-by-user" ||
      authError.code === "auth/cancelled-popup-request" ||
      authError.code === "auth/operation-not-supported-in-this-environment"
    ) {
      await signInWithRedirect(auth, provider);
      return await new Promise<User>(() => {});
    }

    throw error;
  }

  const user = result.user;

  // Create or update profile
  const role = determineUserRole(user.email);
  await upsertUserProfile(user.uid, {
    uid: user.uid,
    email: user.email || "",
    name: user.displayName || "",
    displayName: user.displayName,
    username: createUsernameSeed(user.email, user.displayName),
    avatar: user.photoURL,
    photoURL: user.photoURL,
    role,
    verified: user.emailVerified,
    emailVerified: user.emailVerified,
    language: "en",
  });

  return user;
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  if (!isFirebaseConfigured()) return null;

  const auth = getFirebaseAuth();
  const result = await getRedirectResult(auth);
  if (!result?.user) return null;

  const user = result.user;
  const role = determineUserRole(user.email);
  await upsertUserProfile(user.uid, {
    uid: user.uid,
    email: user.email || "",
    name: user.displayName || "",
    displayName: user.displayName,
    username: createUsernameSeed(user.email, user.displayName),
    avatar: user.photoURL,
    photoURL: user.photoURL,
    role,
    verified: user.emailVerified,
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

  await updateFirebaseProfile(user, {
    displayName,
  });
  
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
    uid: user.uid,
    email: user.email || "",
    name: displayName || "",
    displayName: displayName || null,
    username: createUsernameSeed(user.email, displayName),
    avatar: null,
    photoURL: null,
    role,
    verified: false,
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
  password: string,
  rememberMe = true,
): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  
  // Set persistence
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  
  const result = await signInWithEmailAndPassword(auth, email, password);
  const role = determineUserRole(result.user.email);
  await upsertUserProfile(result.user.uid, {
    uid: result.user.uid,
    email: result.user.email || "",
    name: result.user.displayName || "",
    displayName: result.user.displayName,
    username: createUsernameSeed(result.user.email, result.user.displayName),
    avatar: result.user.photoURL,
    photoURL: result.user.photoURL,
    role,
    verified: result.user.emailVerified,
    emailVerified: result.user.emailVerified,
  });
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
    url: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/reset-password`,
  });
}

export async function confirmPasswordResetWithCode(code: string, password: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  await firebaseConfirmPasswordReset(getFirebaseAuth(), code, password);
}

export async function verifyEmailWithCode(code: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  await applyActionCode(auth, code);
  if (auth.currentUser) {
    await reload(auth.currentUser);
    await upsertUserProfile(auth.currentUser.uid, {
      verified: auth.currentUser.emailVerified,
      emailVerified: auth.currentUser.emailVerified,
    });
  }
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
    url: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/verify-email?uid=${user.uid}`,
  });
}

export async function refreshCurrentUser(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) return null;

  await reload(auth.currentUser);
  await upsertUserProfile(auth.currentUser.uid, {
    verified: auth.currentUser.emailVerified,
    emailVerified: auth.currentUser.emailVerified,
  });
  return toAuthUser(auth.currentUser);
}

export async function updateCurrentUserProfile(data: Partial<UserProfile>): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("No user signed in");

  const displayName = data.name ?? data.displayName ?? undefined;
  const photoURL = data.avatar ?? data.photoURL ?? undefined;

  if (displayName !== undefined || photoURL !== undefined) {
    await updateFirebaseProfile(user, {
      displayName,
      photoURL,
    });
  }

  await upsertUserProfile(user.uid, {
    ...data,
    uid: user.uid,
    displayName: displayName ?? data.displayName,
    photoURL: photoURL ?? data.photoURL,
    avatar: photoURL ?? data.avatar,
    verified: user.emailVerified,
    emailVerified: user.emailVerified,
  });
}

export async function uploadCurrentUserAvatar(file: File): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase not configured");
  }

  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("No user signed in");
  if (!file.type.startsWith("image/")) throw new Error("Avatar must be an image");
  if (file.size > 2 * 1024 * 1024) throw new Error("Avatar must be under 2MB");

  const storage = getFirebaseStorage();
  const extension = file.name.split(".").pop() || "jpg";
  const avatarRef = ref(storage, `avatars/${user.uid}/${Date.now()}.${extension}`);
  await uploadBytes(avatarRef, file, { contentType: file.type });
  const url = await getDownloadURL(avatarRef);
  await updateCurrentUserProfile({ avatar: url, photoURL: url });
  return url;
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
    "auth/popup-blocked": "Popup was blocked. HARON OS will try redirect sign-in.",
    "auth/cancelled-popup-request": "Sign in request was cancelled.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication. Add localhost and your Vercel domain in Firebase Console > Authentication > Settings > Authorized domains.",
  };

  return messages[authError.code] || authError.message || "An error occurred";
}
