"use client";

import { motion } from "framer-motion";
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

import { SectionShell } from "@/components/layout/section-shell";
import { useLanguage } from "@/components/providers/language-provider";
import { analyticsSeries, metrics } from "@/lib/content";

export function AnalyticsSection() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SectionShell id="analytics" eyebrow="Power BI / Python Surface" title={t.sections.analytics}>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.22em] text-white/44">
                  {metric.label}
                </span>
                <span className="font-mono text-2xl font-black text-cyan-100">
                  {metric.value}
                </span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-5">
          <div className="h-[24rem] rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsSeries}>
                  <defs>
                    <linearGradient id="insight" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="growth" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.9)",
                      border: "1px solid rgba(34,211,238,0.25)",
                      borderRadius: 18,
                      color: "white",
                    }}
                  />
                  <Area type="monotone" dataKey="insight" stroke="#22d3ee" fill="url(#insight)" strokeWidth={3} />
                  <Area type="monotone" dataKey="growth" stroke="#a78bfa" fill="url(#growth)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="h-72 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsSeries}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.35)" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.9)",
                      border: "1px solid rgba(167,139,250,0.25)",
                      borderRadius: 18,
                      color: "white",
                    }}
                  />
                  <Bar dataKey="systems" radius={[10, 10, 0, 0]} fill="#22d3ee" />
                  <Bar dataKey="growth" radius={[10, 10, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
