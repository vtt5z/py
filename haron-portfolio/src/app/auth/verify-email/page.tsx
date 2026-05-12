"use client";

import { CheckCircle2, Loader2, MailCheck, RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { authCopy } from "@/lib/auth-copy";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const copy = authCopy[lang];
  const { user, sendVerificationEmail, verifyEmailAction, refreshUser } = useAuth();
  const [status, setStatus] = useState<"idle" | "checking" | "sent" | "verified" | "error">("idle");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) return;

    let cancelled = false;
    setStatus("checking");
    verifyEmailAction(code)
      .then(async () => {
        if (cancelled) return;
        await refreshUser();
        setStatus("verified");
        setMessage(copy.verified);
        window.setTimeout(() => router.replace("/dashboard"), 1600);
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : copy.completeFields);
      });

    return () => {
      cancelled = true;
    };
  }, [copy.completeFields, copy.verified, refreshUser, router, searchParams, verifyEmailAction]);

  useEffect(() => {
    if (!user?.emailVerified) return;
    setStatus("verified");
    window.setTimeout(() => router.replace("/dashboard"), 1200);
  }, [router, user?.emailVerified]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function resend() {
    try {
      setStatus("checking");
      await sendVerificationEmail();
      setCooldown(45);
      setStatus("sent");
      setMessage(copy.verificationSent);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : copy.completeFields);
    }
  }

  async function checkNow() {
    try {
      setStatus("checking");
      await refreshUser();
      if (!user?.emailVerified) {
        setStatus("idle");
        setMessage(lang === "ar" ? "لسه ما وصلنا التأكيد. افتح الرابط من بريدك ثم جرّب مرة ثانية." : "Not verified yet. Open the email link, then check again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : copy.completeFields);
    }
  }

  return (
    <AuthShell title={copy.verifyTitle}>
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-[1.35rem] border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
          {status === "verified" ? <CheckCircle2 className="size-8" /> : <MailCheck className="size-8" />}
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{copy.verifyTitle}</h1>
          <p className="mt-3 text-sm leading-7 text-white/60">
            {lang === "ar"
              ? "أرسلنا لك رابط تأكيد. بعد فتح الرابط بنحدّث حسابك تلقائيًا وننقلك للوحة التحكم."
              : "We sent a verification link. Open it from your inbox and HARON OS will refresh your account automatically."}
          </p>
        </div>
        {message && (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm font-semibold text-white/70">
            {message}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0 || status === "checking" || !user}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 text-sm font-black text-slate-950 transition hover:bg-white disabled:opacity-50"
          >
            {status === "checking" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
            {cooldown > 0 ? `${cooldown}s` : copy.resend}
          </button>
          <button
            type="button"
            onClick={checkNow}
            className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-white/68 transition hover:border-cyan-200/40 hover:text-cyan-100"
          >
            {copy.checking}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
