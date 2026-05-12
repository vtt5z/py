"use client";

import {
  CreditCard,
  Gauge,
  LogOut,
  Settings,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { authCopy } from "@/lib/auth-copy";
import { cn } from "@/lib/utils";

const menuItems = [
  { key: "profile", href: "/profile", icon: UserCircle2 },
  { key: "dashboard", href: "/dashboard", icon: Gauge },
  { key: "settings", href: "/settings/account", icon: Settings },
  { key: "billing", href: "/settings/account#billing", icon: CreditCard },
  { key: "security", href: "/settings/security", icon: ShieldCheck },
] as const;

export function UserMenu({ compact = false }: { compact?: boolean }) {
  const { user, profile, loading, isAuthenticated, signOut } = useAuth();
  const { lang } = useLanguage();
  const copy = authCopy[lang];
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white/70 transition hover:border-cyan-200/40 hover:text-cyan-100"
        >
          {copy.login}
        </Link>
        {!compact && (
          <Link
            href="/auth/signup"
            className="inline-flex h-10 items-center rounded-full bg-cyan-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-white"
          >
            {copy.signup}
          </Link>
        )}
      </div>
    );
  }

  const name = profile?.name || user?.displayName || user?.email?.split("@")[0] || "HARON";
  const avatar = profile?.avatar || user?.photoURL;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 text-sm font-bold text-white transition hover:border-cyan-200/40"
        aria-expanded={open}
      >
        <span className="grid size-8 overflow-hidden rounded-full bg-cyan-300/15 text-xs text-cyan-100">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            <span className="grid size-full place-items-center">{initials}</span>
          )}
        </span>
        {!compact && <span className="hidden max-w-28 truncate sm:block">{name}</span>}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 mt-3 w-64 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#07101d]/95 p-2 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl rtl:left-0 rtl:right-auto",
          )}
        >
          <div className="px-3 py-3">
            <p className="truncate text-sm font-black text-white">{name}</p>
            <p className="truncate text-xs text-white/45">{user?.email}</p>
          </div>
          <div className="h-px bg-white/10" />
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white/68 transition hover:bg-cyan-300/10 hover:text-cyan-100"
              >
                <Icon className="size-4" />
                {copy[item.key]}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-red-100/75 transition hover:bg-red-400/10 hover:text-red-100"
          >
            <LogOut className="size-4" />
            {copy.logout}
          </button>
        </div>
      )}
    </div>
  );
}
