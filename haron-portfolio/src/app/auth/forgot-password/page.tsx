"use client";

import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { authCopy } from "@/lib/auth-copy";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { lang } = useLanguage();
  const copy = authCopy[lang];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) {
      setError(copy.completeFields);
      return;
    }
    try {
      setLoading(true);
      setError("");
      await resetPassword(email);
      setMessage(copy.resetSent);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.completeFields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={copy.forgotTitle}>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <h1 className="text-2xl font-black text-white">{copy.forgotTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-white/58">
            {lang === "ar" ? "اكتب بريدك ونرسل لك رابط آمن لتغيير كلمة المرور." : "Enter your email and we will send a secure password reset link."}
          </p>
        </div>
        {message && <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</div>}
        {error && <div className="rounded-2xl border border-red-200/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</div>}
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4">
          <Mail className="size-4 text-cyan-100/70" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.email}
            type="email"
            className="w-full bg-transparent py-3 text-white outline-none placeholder:text-white/35"
          />
        </label>
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 font-black text-slate-950 transition hover:bg-white">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {copy.sendReset}
        </button>
        <Link href="/auth/login" className="block text-center text-sm font-bold text-cyan-100 hover:text-white">
          {copy.login}
        </Link>
      </form>
    </AuthShell>
  );
}
