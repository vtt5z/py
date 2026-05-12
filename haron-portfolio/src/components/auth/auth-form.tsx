"use client";

import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { AuthShell } from "@/components/auth/auth-shell";
import { authCopy } from "@/lib/auth-copy";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, dir } = useLanguage();
  const copy = authCopy[lang];
  const {
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    continueAsGuest,
  } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"email" | "google" | "guest" | null>(null);
  const [error, setError] = useState("");

  const next = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) router.replace(next);
  }, [isAuthenticated, next, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      setError(copy.completeFields);
      return;
    }

    try {
      setError("");
      setLoading("email");
      if (mode === "signup") {
        await signUpWithEmail(email, password, name);
        router.replace(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      await signInWithEmail(email, password, remember);
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.completeFields);
    } finally {
      setLoading(null);
    }
  }

  async function handleGoogle() {
    try {
      setError("");
      setLoading("google");
      await signInWithGoogle();
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.completeFields);
    } finally {
      setLoading(null);
    }
  }

  async function handleGuest() {
    try {
      setError("");
      setLoading("guest");
      await continueAsGuest();
      router.replace("/ai");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.completeFields);
    } finally {
      setLoading(null);
    }
  }

  return (
    <AuthShell title={mode === "signup" ? copy.signupTitle : copy.loginTitle}>
      <div className={cn("space-y-5", dir === "rtl" && "font-arabic")}>
        <div>
          <h2 className="text-2xl font-black text-white">
            {mode === "signup" ? copy.signupTitle : copy.loginTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/55">{copy.subtitle}</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading !== null}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white text-sm font-black text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60"
        >
          {loading === "google" ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
          {copy.google}
        </button>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/35">
          <span className="h-px flex-1 bg-white/10" />
          <span>OR</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <Field icon={<UserRound className="size-4" />}>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={copy.name}
                className="w-full bg-transparent py-3 text-white outline-none placeholder:text-white/35"
                autoComplete="name"
              />
            </Field>
          )}
          <Field icon={<Mail className="size-4" />}>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.email}
              className="w-full bg-transparent py-3 text-white outline-none placeholder:text-white/35"
              type="email"
              autoComplete="email"
            />
          </Field>
          <Field icon={<LockKeyhole className="size-4" />}>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.password}
              className="w-full bg-transparent py-3 text-white outline-none placeholder:text-white/35"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-white/42 transition hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Field>

          {mode === "login" && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-white/58">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 accent-cyan-300"
                />
                {copy.remember}
              </label>
              <Link href="/auth/forgot-password" className="font-bold text-cyan-100 hover:text-white">
                {copy.forgot}
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading !== null}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 text-sm font-black text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.24)] transition hover:bg-white disabled:opacity-60"
          >
            {loading === "email" && <Loader2 className="size-4 animate-spin" />}
            {mode === "signup" ? copy.signup : copy.login}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGuest}
          disabled={loading !== null}
          className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white/62 transition hover:border-cyan-200/40 hover:text-cyan-100 disabled:opacity-60"
        >
          {loading === "guest" ? <Loader2 className="size-4 animate-spin" /> : copy.guest}
        </button>

        <p className="text-center text-sm text-white/50">
          {mode === "signup" ? copy.hasAccount : copy.noAccount}{" "}
          <Link
            href={mode === "signup" ? "/auth/login" : "/auth/signup"}
            className="font-black text-cyan-100 transition hover:text-white"
          >
            {mode === "signup" ? copy.login : copy.signup}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 transition focus-within:border-cyan-200/45">
      <span className="text-cyan-100/70">{icon}</span>
      {children}
    </label>
  );
}
