"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Gauge, HardDrive, Radio, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLanguage } from "@/components/providers/language-provider";
import { dashboardSeries } from "@/lib/haron-os-content";

export function DashboardSection() {
  const [mounted, setMounted] = useState(false);
  const { lang, dir } = useLanguage();
  const stats = [
    { label: lang === "ar" ? "طلبات الذكاء" : "AI requests", value: "1.8k", icon: Zap, tone: "text-cyan-100" },
    { label: lang === "ar" ? "تشغيل الأدوات" : "Tool runs", value: "742", icon: Cpu, tone: "text-violet-100" },
    { label: lang === "ar" ? "التخزين جاهز" : "Storage ready", value: "99%", icon: HardDrive, tone: "text-emerald-100" },
    { label: lang === "ar" ? "صحة النظام" : "System health", value: lang === "ar" ? "مباشر" : "Live", icon: Activity, tone: "text-fuchsia-100" },
  ];

  useEffect(() => setMounted(true), []);

  return (
    <section className={`relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 ${dir === "rtl" ? "font-arabic text-right" : ""}`}>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
          >
            <stat.icon className={`mb-6 size-7 ${stat.tone}`} />
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/42">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[28rem] rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-100/60">
              {lang === "ar" ? "رسم نشاط الذكاء" : "AI Activity Graph"}
            </p>
            <Gauge className="size-5 text-cyan-100" />
          </div>
          {mounted && (
            <ResponsiveContainer width="100%" height="88%">
              <AreaChart data={dashboardSeries}>
                <defs>
                  <linearGradient id="dash-ai" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.58} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(34,211,238,0.25)", borderRadius: 18, color: "white" }} />
                <Area type="monotone" dataKey="ai" stroke="#22d3ee" fill="url(#dash-ai)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="h-[28rem] rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet-100/60">
              {lang === "ar" ? "استخدام الوحدات" : "Module Usage"}
            </p>
            <Radio className="size-5 text-violet-100" />
          </div>
          {mounted && (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={dashboardSeries}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 18, color: "white" }} />
                <Bar dataKey="tools" radius={[10, 10, 0, 0]} fill="#22d3ee" />
                <Bar dataKey="study" radius={[10, 10, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {(lang === "ar"
          ? ["تم تلخيص PDF إلى 8 بطاقات اختبار", "تحليل الصورة اكتشف مشكلة تباين", "مولد SQL حسّن استعلام التحليلات"]
          : ["PDF summarized into 8 quiz cards", "Screenshot analysis detected contrast issue", "SQL generator optimized analytics query"]).map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-black/28 p-4 text-sm font-semibold text-white/62 backdrop-blur-xl">
            <span className="mr-3 inline-block size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
