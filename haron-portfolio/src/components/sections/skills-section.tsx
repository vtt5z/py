"use client";

import { motion } from "framer-motion";

import { SectionShell } from "@/components/layout/section-shell";
import { useLanguage } from "@/components/providers/language-provider";
import { skills } from "@/lib/content";

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <SectionShell id="skills" eyebrow="Capability Matrix" title={t.sections.skills}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.label}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.035 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-200/50 hover:shadow-[0_0_46px_rgba(34,211,238,0.18)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,0%),rgba(34,211,238,0.18),transparent_32%)] opacity-0 transition group-hover:opacity-100" />
            <skill.icon className="relative z-10 mb-8 size-8 text-cyan-200" />
            <div className="relative z-10 flex items-end justify-between gap-4">
              <h3 className="text-xl font-bold text-white">{skill.label}</h3>
              <span className="font-mono text-sm text-cyan-100">{skill.value}%</span>
            </div>
            <div className="relative z-10 mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
