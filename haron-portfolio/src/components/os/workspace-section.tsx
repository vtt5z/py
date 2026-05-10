"use client";

import { motion } from "framer-motion";
import { Clock3, MessageSquare, NotebookPen, Sparkles } from "lucide-react";

import { OSCard } from "@/components/os/os-card";
import { useLanguage } from "@/components/providers/language-provider";
import { systemSignals, workspaceModules } from "@/lib/haron-os-content";
import { cn } from "@/lib/utils";

export function WorkspaceSection() {
  const { lang, dir } = useLanguage();
  const quickActions =
    lang === "ar"
      ? [
          ["اسأل المساعد", "ابدأ محادثة لحل مشكلة أو كتابة نص.", MessageSquare],
          ["ملاحظات", "احفظ فكرة أو خطة عمل سريعة.", NotebookPen],
          ["سجل المطالبات", "ارجع لأفكارك واستخدمها مرة ثانية.", Clock3],
          ["إجراء سريع", "لخّص، ترجم، أو حلّل في خطوة واحدة.", Sparkles],
        ]
      : [
          ["AI Chat", "Start a conversation to solve, write, or plan.", MessageSquare],
          ["Notes", "Capture an idea, plan, or study point.", NotebookPen],
          ["Prompt History", "Reuse useful prompts and workflows.", Clock3],
          ["Quick Actions", "Summarize, translate, or analyze in one step.", Sparkles],
        ];

  return (
    <section
      id="workspace"
      className={cn(
        "relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          {lang === "ar" ? "مساحة العمل" : "Workspace"}
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          {lang === "ar" ? "كل ما تحتاجه في مساحة إنتاجية واحدة." : "One workspace for chat, tools, notes, and quick actions."}
        </h2>
        <p className="mt-4 text-white/56">
          {lang === "ar"
            ? "واجهة مرتبة تساعدك تنتقل بين المساعد والأدوات والملاحظات بدون تشتيت."
            : "A cleaner workflow layer that helps you move between assistant, tools, notes, and history without hunting through sections."}
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-4">
        {workspaceModules.map((module) => (
          <OSCard key={module.title} title={module.title} text={module.text} icon={module.icon}>
            <span className="mt-6 inline-flex rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/70">
              {module.status}
            </span>
          </OSCard>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map(([title, text, Icon]) => (
          <div key={title as string} className="rounded-2xl border border-white/10 bg-black/24 p-4 backdrop-blur-xl">
            <Icon className="mb-4 size-5 text-cyan-100" />
            <p className="font-black text-white">{title as string}</p>
            <p className="mt-2 text-sm leading-6 text-white/48">{text as string}</p>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-2xl sm:grid-cols-2 lg:grid-cols-4"
      >
        {systemSignals.map((signal) => (
          <div key={signal.label} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
            <signal.icon className="size-5 text-cyan-100" />
            <span className="text-sm font-semibold text-white/70">{signal.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
