"use client";

import { Bell, Languages, Palette, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/providers/language-provider";

const tabs = [
  { href: "/settings/account", key: "account", icon: UserRound },
  { href: "/profile", key: "profile", icon: UserRound },
  { href: "/settings/language", key: "language", icon: Languages },
  { href: "/settings/appearance", key: "appearance", icon: Palette },
  { href: "/settings/security", key: "security", icon: ShieldCheck },
  { href: "/settings/notifications", key: "notifications", icon: Bell },
] as const;

const labels = {
  en: {
    account: "Account",
    profile: "Profile",
    language: "Language",
    appearance: "Appearance",
    security: "Security",
    notifications: "Notifications",
  },
  ar: {
    account: "الحساب",
    profile: "الملف",
    language: "اللغة",
    appearance: "المظهر",
    security: "الأمان",
    notifications: "الإشعارات",
  },
} as const;

export function SettingsTabs() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-2 backdrop-blur-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-bold transition ${active ? "bg-cyan-300 text-slate-950" : "text-white/60 hover:bg-white/[0.06] hover:text-white"}`}
          >
            <Icon className="size-4" />
            {labels[lang][tab.key]}
          </Link>
        );
      })}
    </div>
  );
}
