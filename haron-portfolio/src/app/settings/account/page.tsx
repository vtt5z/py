"use client";

import { Bell, Languages, Monitor, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SettingsTabs } from "@/components/auth/settings-tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { PageFrame } from "@/components/os/page-frame";
import { authCopy } from "@/lib/auth-copy";
import type { ThemePreference } from "@/types/auth";

export default function AccountSettingsPage() {
  return (
    <PageFrame>
      <ProtectedRoute>
        <AccountSettings />
      </ProtectedRoute>
    </PageFrame>
  );
}

function AccountSettings() {
  const { profile, updateProfile } = useAuth();
  const { lang, setLanguage } = useLanguage();
  const copy = authCopy[lang];
  const [theme, setTheme] = useState<ThemePreference>("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;
    setTheme(profile.preferences.theme);
    setEmailNotifications(profile.preferences.emailNotifications);
    setProductUpdates(profile.preferences.productUpdates);
    setSecurityAlerts(profile.preferences.securityAlerts);
  }, [profile]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile({
      language: lang,
      preferences: {
        theme,
        emailNotifications,
        productUpdates,
        securityAlerts,
      },
    });
    setMessage(copy.saved);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-100/65">Account System</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">{copy.accountTitle}</h1>
      </div>
      <SettingsTabs />
      <form onSubmit={save} className="grid gap-5 lg:grid-cols-3">
        <Panel icon={<Monitor className="size-5" />} title={lang === "ar" ? "المظهر" : "Appearance"}>
          <div className="grid grid-cols-3 gap-2">
            {(["dark", "light", "system"] as ThemePreference[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTheme(item)}
                className={`h-10 rounded-2xl border text-sm font-bold transition ${theme === item ? "border-cyan-200/50 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/[0.04] text-white/60"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </Panel>
        <Panel icon={<Languages className="size-5" />} title={lang === "ar" ? "اللغة" : "Language"}>
          <div className="grid grid-cols-2 gap-2">
            {(["en", "ar"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={`h-10 rounded-2xl border text-sm font-bold transition ${lang === item ? "border-cyan-200/50 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/[0.04] text-white/60"}`}
              >
                {item === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>
        </Panel>
        <Panel icon={<Bell className="size-5" />} title={lang === "ar" ? "الإشعارات" : "Notifications"}>
          <Toggle label={lang === "ar" ? "تنبيهات البريد" : "Email notifications"} checked={emailNotifications} onChange={setEmailNotifications} />
          <Toggle label={lang === "ar" ? "تحديثات المنتج" : "Product updates"} checked={productUpdates} onChange={setProductUpdates} />
          <Toggle label={lang === "ar" ? "تنبيهات الأمان" : "Security alerts"} checked={securityAlerts} onChange={setSecurityAlerts} />
        </Panel>
        <div className="lg:col-span-3">
          {message && <p className="mb-4 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</p>}
          <button className="inline-flex h-12 items-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white">
            <Save className="size-4" />
            {copy.save}
          </button>
        </div>
      </form>
    </section>
  );
}

function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl">
      <div className="mb-5 flex items-center gap-3 text-cyan-100">
        {icon}
        <h2 className="font-black text-white">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-white/65">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-cyan-300" />
    </label>
  );
}
