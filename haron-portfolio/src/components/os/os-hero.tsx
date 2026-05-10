"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Command, TerminalSquare } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { useRotatingText } from "@/hooks/use-rotating-text";
import { osMetrics, rotatingCommands } from "@/lib/haron-os-content";
import { cn } from "@/lib/utils";

export function OSHero() {
  const { lang, dir } = useLanguage();
  const suggestion = useRotatingText(rotatingCommands, 1500);
  const brand = lang === "ar" ? "هارون" : "HARON";
  const os = lang === "ar" ? "أو إس" : "OS";

  return (
    <section id="hero" className={cn("relative z-10 flex min-h-screen items-center px-5 pb-16 pt-32 sm:px-8 lg:px-10", dir === "rtl" && "font-arabic text-right")}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, x: -46, filter: "blur(16px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-200/20 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-cyan-100/80 backdrop-blur-xl">
            <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
            {lang === "ar" ? "مساحة العمل جاهزة • Gemini متصل • Supabase جاهز" : "AI Workspace online • Gemini routes ready • Supabase connected layer"}
          </div>
          <h1 className="max-w-5xl text-6xl font-black leading-[0.86] tracking-tight text-white sm:text-8xl lg:text-9xl">
            {brand}
            <span className="block bg-gradient-to-r from-cyan-100 via-white to-violet-200 bg-clip-text text-transparent">
              {os}
            </span>
          </h1>
          <p className="mt-7 max-w-3xl text-xl font-semibold leading-8 text-white/70 sm:text-2xl">
            {lang === "ar"
              ? "نظام تشغيل ذكي وفاخر للإنتاجية، البرمجة، التحليل، الدراسة، والكتابة باحتراف."
              : "A premium AI-powered digital operating system for engineering, analytics, learning, writing, and intelligent creation."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(lang === "ar" ? ["مساحة العمل", "شغّل المساعد", "افتح الأدوات"] : ["Enter Workspace", "Launch AI", "Open Tools"]).map((label, index) => (
              <a
                key={label}
                href={index === 0 ? "/workspace" : index === 1 ? "/ai" : "/tools"}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white backdrop-blur-xl transition hover:border-cyan-200/60 hover:bg-cyan-300 hover:text-slate-950"
              >
                {label}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </a>
            ))}
          </div>

          <div className="mt-8 max-w-2xl rounded-[1.5rem] border border-cyan-200/20 bg-black/35 p-4 shadow-[0_0_70px_rgba(34,211,238,0.11)] backdrop-blur-2xl">
            <div className="flex items-center gap-3 text-white/45">
              <Command className="size-4 text-cyan-100" />
              <span className="font-mono text-sm">{lang === "ar" ? "اسأل هارون أو إس..." : "Ask HARON OS..."}</span>
            </div>
            <div className="mt-3 flex min-h-12 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={suggestion}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.35 }}
                  className="text-lg font-bold text-cyan-50"
                >
                  {suggestion}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 42, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative min-h-[34rem]"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(139,92,246,0.2),transparent_36%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <span className="size-3 rounded-full bg-red-300/80" />
                <span className="size-3 rounded-full bg-yellow-200/80" />
                <span className="size-3 rounded-full bg-emerald-300/80" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-100/60">
                {lang === "ar" ? "لوحة الأوامر الذكية" : "AI Command Deck"}
              </span>
            </div>
            <div className="relative mt-5 grid aspect-[1.16] place-items-center overflow-hidden rounded-3xl border border-cyan-200/15 bg-[#030712]">
              <div className="absolute inset-0 hologram-grid opacity-40" />
              <div className="absolute size-72 rounded-full border border-cyan-200/20" />
              <div className="absolute size-52 animate-spin-slow rounded-full border border-violet-200/30 border-t-cyan-200/80" />
              <div className="absolute left-6 top-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                <Bot className="mb-3 size-6 text-cyan-100" />
                <p className="font-mono text-xs text-white/45">assistant.stream</p>
                <p className="text-2xl font-black text-white">live</p>
              </div>
              <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                <TerminalSquare className="mb-3 size-6 text-violet-100" />
                <p className="font-mono text-xs text-white/45">terminal.mode</p>
                <p className="text-2xl font-black text-white">armed</p>
              </div>
              <div className="grid size-36 place-items-center rounded-[2rem] border border-cyan-200/30 bg-cyan-200/10 text-4xl font-black tracking-[0.16em] text-cyan-100 shadow-[0_0_60px_rgba(34,211,238,0.35)]">
                {lang === "ar" ? "هـ" : "HM"}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {osMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-2xl font-black text-white">{metric.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/60">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
