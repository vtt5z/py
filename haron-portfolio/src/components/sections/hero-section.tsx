"use client";

import { motion } from "framer-motion";
import { ArrowDown, Cpu, Sparkles } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { t, dir, lang } = useLanguage();

  return (
    <section
      id="hero"
      className={cn(
        "relative z-10 flex min-h-screen snap-start items-center px-5 pb-16 pt-32 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic",
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          key={lang}
          initial={{ opacity: 0, x: dir === "rtl" ? 60 : -60, filter: "blur(16px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cn("max-w-4xl", dir === "rtl" && "text-right lg:order-2")}
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-200/20 bg-white/[0.04] px-4 py-2 text-sm text-cyan-100/80 backdrop-blur-xl">
            <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
            {t.hero.status}
          </div>
          <h1 className="max-w-5xl text-6xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
            {t.hero.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-cyan-100/80 sm:text-3xl">
            {t.hero.arabicName}
          </p>
          <p className="mt-8 max-w-3xl text-xl font-semibold text-violet-100 sm:text-2xl">
            {t.hero.title}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
            {t.hero.subtitle}
          </p>
          <div className={cn("mt-10 flex flex-wrap gap-4", dir === "rtl" && "justify-end")}>
            <MagneticButton href="#about" className="bg-cyan-300 text-slate-950">
              {t.hero.primary}
            </MagneticButton>
            <MagneticButton href="#projects">{t.hero.secondary}</MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn("relative min-h-[28rem]", dir === "rtl" && "lg:order-1")}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.24),transparent_38%),radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.22),transparent_36%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_0_90px_rgba(34,211,238,0.16)] backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="size-3 rounded-full bg-red-300/80" />
                <span className="size-3 rounded-full bg-yellow-200/80" />
                <span className="size-3 rounded-full bg-emerald-300/80" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                AI CORE
              </span>
            </div>
            <div className="grid gap-4">
              <div className="relative grid aspect-[1.2] place-items-center overflow-hidden rounded-3xl border border-cyan-200/20 bg-[#06111e]/80">
                <div className="absolute inset-0 hologram-grid opacity-60" />
                <div className="absolute size-72 rounded-full border border-cyan-200/20" />
                <div className="absolute size-52 animate-spin-slow rounded-full border border-violet-200/25 border-t-cyan-200/80" />
                <div className="grid size-32 place-items-center rounded-[2rem] border border-cyan-200/30 bg-cyan-200/10 text-4xl font-black tracking-[0.16em] text-cyan-100 shadow-[0_0_55px_rgba(34,211,238,0.35)]">
                  HM
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["98%", "UI Signal", Sparkles],
                  ["42ms", "Data Pulse", Cpu],
                ].map(([value, label, Icon]) => (
                  <div
                    key={label as string}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <Icon className="mb-3 size-5 text-cyan-200" />
                    <div className="text-3xl font-black text-white">{value as string}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">
                      {label as string}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <a
        href="#about"
        aria-label="Scroll"
        className="absolute bottom-8 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-cyan-100 backdrop-blur-xl"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
