"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";
import { authCopy } from "@/lib/auth-copy";
import { cn } from "@/lib/utils";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { lang, dir, toggleLanguage } = useLanguage();
  const copy = authCopy[lang];

  return (
    <main
      dir={dir}
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#02030a] px-4 py-8 text-white sm:px-6",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,#02030a_0%,#07111f_48%,#02030a_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] futuristic-grid" />
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl border border-cyan-200/25 bg-cyan-300/10 text-cyan-100">
            <Sparkles className="size-5" />
          </span>
          <span className="text-sm font-black uppercase tracking-[0.22em]">
            {copy.brand}
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleLanguage}
          className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/70 transition hover:border-cyan-200/40 hover:text-cyan-100"
        >
          {lang === "en" ? "AR" : "EN"}
        </button>
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="hidden lg:block"
        >
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-cyan-100/70">
            Firebase Auth Core
          </p>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-white">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/62">
            {copy.subtitle}
          </p>
          <div className="mt-8 grid max-w-xl gap-3">
            {["Persistent sessions", "Realtime profile sync", "Protected SaaS routes"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-white/68 backdrop-blur-2xl"
              >
                <ShieldCheck className="size-4 text-emerald-200" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mx-auto w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-2xl sm:p-7"
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
