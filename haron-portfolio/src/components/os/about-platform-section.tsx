"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Code2, LineChart, ShieldCheck } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";

const pillars = [
  { title: "Software Engineering", text: "Full-stack systems, Flutter apps, APIs, Firebase workflows, and production architecture.", icon: Code2 },
  { title: "Data Analytics", text: "Power BI dashboards, Python analysis, SQL insights, and decision-ready visual systems.", icon: LineChart },
  { title: "AI Product Thinking", text: "Command palettes, assistant flows, prompt systems, tool orchestration, and intelligent UX.", icon: BrainCircuit },
  { title: "Yemeni Identity", text: "Nationality appears as an elegant personal signal, not as the main hero positioning.", icon: ShieldCheck },
];

export function AboutPlatformSection() {
  const { lang, dir } = useLanguage();
  const localized = lang === "ar"
    ? [
        { title: "هندسة البرمجيات", text: "أنظمة متكاملة وتطبيقات Flutter وواجهات API وتدفقات Firebase ومعمارية إنتاجية." },
        { title: "تحليل البيانات", text: "لوحات Power BI وتحليل Python ورؤى SQL وأنظمة بصرية جاهزة للقرار." },
        { title: "تفكير منتجات الذكاء", text: "لوحات أوامر وتدفقات مساعد وأنظمة مطالبات وتنسيق أدوات وتجربة ذكية." },
        { title: "الهوية اليمنية", text: "هوية شخصية أنيقة تظهر بإتزان بدون أن تطغى على موقع المنتج." },
      ]
    : pillars;

  return (
    <section className={`relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 ${dir === "rtl" ? "font-arabic text-right" : ""}`}>
      <div className="grid gap-5 lg:grid-cols-4">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
          >
            <pillar.icon className="mb-8 size-8 text-cyan-100" />
            <h3 className="text-2xl font-black text-white">{localized[index].title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/58">{localized[index].text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
