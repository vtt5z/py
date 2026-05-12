"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";

export function TerminalSection() {
  const { lang, dir } = useLanguage();
  const terminalCommands = useMemo(
    () =>
      lang === "ar"
        ? [
            { command: "لخّص pdf", output: "ينشئ ملخصًا قصيرًا ونقاطًا مهمة وشرحًا مبسطًا وأسئلة تدريبية." },
            { command: "حل خطأ firebase auth", output: "يشرح الأسباب المحتملة والإصلاحات العملية وطريقة التحقق." },
            { command: "أعد صياغة رسالة احترافية", output: "يحوّل النص الخام إلى رسالة واضحة ومصقولة بالنبرة المناسبة." },
            { command: "اشرح sql joins", output: "يشرح أنواع الربط بأمثلة سهلة ومتى تستخدم كل نوع." },
          ]
        : [
            { command: "summarize pdf", output: "Creates a short summary, key points, simple explanation, and quiz questions." },
            { command: "fix firebase auth error", output: "Explains likely causes, practical fixes, and how to verify the solution." },
            { command: "rewrite professional message", output: "Turns rough text into a clear, polished message with the right tone." },
            { command: "explain sql joins", output: "Explains joins with simple examples and when to use each one." },
          ],
    [lang],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % terminalCommands.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [terminalCommands.length]);

  const active = terminalCommands[index];

  return (
    <section id="terminal" className={`relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10 ${dir === "rtl" ? "font-arabic text-right" : ""}`}>
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          {lang === "ar" ? "وضع الطرفية الذكية" : "AI Terminal Mode"}
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          {lang === "ar" ? "طبقة أوامر سينمائية لإجراءات الذكاء السريعة." : "A cinematic command layer for fast AI actions."}
        </h2>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-black/50 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <TerminalSquare className="size-5 text-cyan-100" />
            <span className="font-mono text-sm uppercase tracking-[0.28em] text-white/55">
              haron-os://terminal
            </span>
          </div>
          <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
        </div>
        <div className="min-h-[30rem] p-6 font-mono">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.command}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-lg text-cyan-100">
                <span className="text-violet-200">&gt;</span> {active.command}
                <span className="ml-2 inline-block h-5 w-2 animate-pulse bg-cyan-200 align-middle" />
              </p>
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/35">
                  {lang === "ar" ? "النتيجة" : "Output"}
                </p>
                <p className="text-lg leading-8 text-white/72">{active.output}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {terminalCommands.map((item) => (
              <div key={item.command} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/48">
                &gt; {item.command}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
