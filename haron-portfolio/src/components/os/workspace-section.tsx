"use client";

import { motion } from "framer-motion";

import { OSCard } from "@/components/os/os-card";
import { systemSignals, workspaceModules } from "@/lib/haron-os-content";

export function WorkspaceSection() {
  return (
    <section id="workspace" className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          Digital Operating System
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          One workspace for AI creation, engineering, and study.
        </h2>
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
