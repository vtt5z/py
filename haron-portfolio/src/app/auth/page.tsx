"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Globe, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const ui = {
  en: {
    title: "Welcome to HARON OS",
    subtitle: "A modern AI workspace for productivity and learning",
    email: "Email & Password",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter password",
    namePlaceholder: "Your name",
    google: "Continue with Google",
    guest: "Continue as Guest",
    signIn: "Sign In",
    signUp: "Sign Up",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    signingIn: "Signing in...",
    signingUp: "Creating account...",
    continueingGuest: "Setting up guest session...",
    error: "Error",
    tryAgain: "Please try again",
    verifyEmail: "Please verify your email to unlock cloud features",
    guestNote: "As a guest, your chats won't be saved. Sign in to enable persistence.",
    allFeatures: "Sign in to unlock:",
    feature1: "Chat history & memory",
    feature2: "File uploads",
    feature3: "Workspace sync",
    feature4: "Conversation sharing",
  },
  ar: {
    title: "أهلا بك في هارون أو إس",
    subtitle: "مساحة عمل ذكية حديثة للإنتاجية والتعليم",
    email: "البريد الإلكتروني وكلمة المرور",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    namePlaceholder: "اسمك",
    google: "متابعة عبر جوجل",
    guest: "تابع كضيف",
    signIn: "دخول",
    signUp: "إنشاء حساب",
    haveAccount: "عندك حساب بالفعل؟",
    noAccount: "ما عندك حساب؟",
    signingIn: "جاري الدخول...",
    signingUp: "إنشاء الحساب...",
    continueingGuest: "تحضير جلسة الضيف...",
    error: "خطأ",
    tryAgain: "حاول مرة أخرى",
    verifyEmail: "تحقق من بريدك الإلكتروني لتفعيل المزايا السحابية",
    guestNote: "كضيف، لن يتم حفظ محادثاتك. سجل الدخول لتفعيل الحفظ الدائم.",
    allFeatures: "سجل الدخول لتفعيل:",
    feature1: "سجل المحادثات والذاكرة",
    feature2: "رفع الملفات",
    feature3: "مزامنة مساحة العمل",
    feature4: "مشاركة المحادثات",
  },
} as const;

type Mode = "signin" | "signup" | "guest";

export default function AuthPage() {
  const router = useRouter();
  const { lang, dir } = useLanguage();
  const { isAuthenticated, isGuest, signInWithGoogle, signInWithEmail, signUpWithEmail, continueAsGuest } = useAuth();
  const copy = ui[lang];

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      router.replace("/ai");
    }
  }, [isAuthenticated, isGuest, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      router.replace("/ai");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signInWithEmail(email, password);
      router.replace("/ai");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signUpWithEmail(email, password, displayName);
      // Show verification message instead of redirecting
      setMode("signin");
      setError(""); // Clear error
      setPassword(""); // Clear password
      alert(copy.verifyEmail); // TODO: Replace with toast
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      setError("");
      setLoading(true);
      await continueAsGuest();
      router.replace("/ai");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.tryAgain);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4", dir === "rtl" && "rtl")} dir={dir}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{copy.title}</h1>
          <p className="text-slate-400">{copy.subtitle}</p>
        </div>

        {/* Main card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Google sign in */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Globe className="w-5 h-5" />
            )}
            {loading ? copy.signingIn : copy.google}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-600" />
            <span className="text-xs text-slate-400 uppercase">OR</span>
            <div className="flex-1 h-px bg-slate-600" />
          </div>

          {/* Email form */}
          <form onSubmit={mode === "signin" ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder={copy.namePlaceholder}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                disabled={loading}
              />
            )}

            <input
              type="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />

            <input
              type="password"
              placeholder={copy.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              disabled={loading}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {mode === "signin" ? (loading ? copy.signingIn : copy.signIn) : (loading ? copy.signingUp : copy.signUp)}
            </motion.button>
          </form>

          {/* Toggle between sign in and sign up */}
          <div className="text-center text-sm text-slate-400">
            {mode === "signin" ? copy.noAccount : copy.haveAccount}{" "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setEmail("");
                setPassword("");
                setDisplayName("");
              }}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              {mode === "signin" ? copy.signUp : copy.signIn}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-600" />
            <span className="text-xs text-slate-400 uppercase">OR</span>
            <div className="flex-1 h-px bg-slate-600" />
          </div>

          {/* Guest mode */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueAsGuest}
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:border-slate-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? copy.continueingGuest : copy.guest}
          </motion.button>

          {/* Guest mode benefits */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-slate-300">{copy.allFeatures}</p>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>✓ {copy.feature1}</li>
              <li>✓ {copy.feature2}</li>
              <li>✓ {copy.feature3}</li>
              <li>✓ {copy.feature4}</li>
            </ul>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-500 mt-6">{copy.guestNote}</p>
      </motion.div>
    </div>
  );
}
