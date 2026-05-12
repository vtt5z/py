/**
 * Authentication types
 * 
 * Role architecture:
 * - OWNER: Site owner (backend-injected only)
 * - USER: Regular authenticated user
 * - GUEST: Temporary session (no persistence)
 */

export type UserRole = "owner" | "user" | "guest";
export type ThemePreference = "dark" | "light" | "system";

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  name: string;
  displayName: string | null;
  username: string;
  avatar: string | null;
  photoURL: string | null;
  bio: string;
  role: UserRole;
  verified: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  language: "en" | "ar";
  preferences: {
    theme: ThemePreference;
    emailNotifications: boolean;
    productUpdates: boolean;
    securityAlerts: boolean;
  };
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    createdAt?: Date;
    lastSignInTime?: Date;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, password: string) => Promise<void>;
  verifyEmailAction: (code: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}
