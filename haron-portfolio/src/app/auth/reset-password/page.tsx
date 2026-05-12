"use client";

import { KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { authCopy } from "@/lib/auth-copy";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("oobCode") || "";
  const { confirmPasswordReset } = useAuth();
  const { lang } = useLanguage();
  const copy = authCopy[lang];
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code) {
      setError(lang === "ar" ? "رابط الاستعادة غير مكتمل." : "Reset link is missing its verification code.");
      return;
    }
    if (password.length < 6) {
      setError(copy.weakPassword);
      return;
    }
    if (password !== confirm) {
      setError(copy.passwordsMismatch);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await confirmPasswordReset(code, password);
      setMessage(lang === "ar" ? "تم تحديث كلمة المرور. تقدر تسجل دخولك الآن." : "Password updated. You can now log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.completeFields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={copy.resetTitle}>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-white">{copy.resetTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-white/58">
            {lang === "ar" ? "اختر كلمة مرور قوية لحسابك." : "Choose a strong new password for your account."}
          </p>
        </div>
        {message && <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</div>}
        {error && <div className="rounded-2xl border border-red-200/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</div>}
        {[copy.password, copy.confirmPassword].map((label, index) => (
          <label key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4">
            <KeyRound className="size-4 text-cyan-100/70" />
            <input
              value={index === 0 ? password : confirm}
              onChange={(event) => (index === 0 ? setPassword(event.target.value) : setConfirm(event.target.value))}
              placeholder={label}
              type="password"
              className="w-full bg-transparent py-3 text-white outline-none placeholder:text-white/35"
            />
          </label>
        ))}
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 font-black text-slate-950 transition hover:bg-white">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {copy.updatePassword}
        </button>
        <Link href="/auth/login" className="block text-center text-sm font-bold text-cyan-100 hover:text-white">
          {copy.login}
        </Link>
      </form>
    </AuthShell>
  );
}
