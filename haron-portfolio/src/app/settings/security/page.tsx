"use client";

import { KeyRound, LogOut, MailCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SettingsTabs } from "@/components/auth/settings-tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { PageFrame } from "@/components/os/page-frame";
import { authCopy } from "@/lib/auth-copy";

export default function SecuritySettingsPage() {
  return (
    <PageFrame>
      <ProtectedRoute>
        <SecuritySettings />
      </ProtectedRoute>
    </PageFrame>
  );
}

function SecuritySettings() {
  const { user, profile, sendVerificationEmail, resetPassword, signOut } = useAuth();
  const { lang } = useLanguage();
  const copy = authCopy[lang];
  const [message, setMessage] = useState("");

  async function resendVerification() {
    await sendVerificationEmail();
    setMessage(copy.verificationSent);
  }

  async function sendReset() {
    if (!user?.email) return;
    await resetPassword(user.email);
    setMessage(copy.resetSent);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-100/65">Security Center</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">{copy.securityTitle}</h1>
      </div>
      <SettingsTabs />
      {message && <p className="mb-5 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        <ActionCard
          icon={<MailCheck className="size-6" />}
          title={lang === "ar" ? "تأكيد البريد" : "Email verification"}
          text={profile?.verified || user?.emailVerified ? (lang === "ar" ? "بريدك مؤكد وجاهز للمزايا السحابية." : "Your email is verified and cloud features are unlocked.") : (lang === "ar" ? "أرسل رابط تحقق جديد لبريدك." : "Send a fresh verification link to your inbox.")}
          action={profile?.verified || user?.emailVerified ? undefined : resendVerification}
          label={copy.resend}
        />
        <ActionCard
          icon={<KeyRound className="size-6" />}
          title={lang === "ar" ? "كلمة المرور" : "Password"}
          text={lang === "ar" ? "أرسل رابط تغيير كلمة مرور آمن." : "Send a secure password reset link."}
          action={sendReset}
          label={copy.sendReset}
        />
        <ActionCard
          icon={<ShieldCheck className="size-6" />}
          title={lang === "ar" ? "الجلسات" : "Sessions"}
          text={lang === "ar" ? "Firebase يحافظ على الجلسة الحالية. الخروج ينهي جلسة هذا الجهاز." : "Firebase persists the current session. Sign out ends this device session."}
          action={signOut}
          label={copy.logout}
        />
        <ActionCard
          icon={<LogOut className="size-6" />}
          title={lang === "ar" ? "حذف الحساب" : "Delete account"}
          text={lang === "ar" ? "إجراء حساس يحتاج إعادة مصادقة حديثة قبل الحذف النهائي." : "Sensitive action. A recent reauthentication is required before permanent deletion."}
          label={lang === "ar" ? "محمي" : "Protected"}
        />
      </div>
    </section>
  );
}

function ActionCard({
  icon,
  title,
  text,
  label,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  label: string;
  action?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
      <div className="mb-5 text-cyan-100">{icon}</div>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mt-3 min-h-16 text-sm leading-7 text-white/58">{text}</p>
      <button
        type="button"
        disabled={!action}
        onClick={action}
        className="mt-5 h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white/68 transition hover:border-cyan-200/40 hover:text-cyan-100 disabled:opacity-45"
      >
        {label}
      </button>
    </section>
  );
}
