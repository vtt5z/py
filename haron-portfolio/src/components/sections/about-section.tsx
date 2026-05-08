"use client";

import { motion } from "framer-motion";
import { Binary, CircleDotDashed, Orbit } from "lucide-react";

import { SectionShell } from "@/components/layout/section-shell";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function AboutSection() {
  const { t, dir } = useLanguage();

  return (
    <SectionShell id="about" eyebrow={t.about.eyebrow} title={t.about.title}>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 text-lg leading-9 text-white/68 shadow-[0_0_70px_rgba(124,58,237,0.1)] backdrop-blur-2xl sm:p-8",
            dir === "rtl" && "text-right",
          )}
        >
          {t.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </motion.div>

        <div className="grid gap-4">
          {[
            ["Engineering", "Precision systems, APIs, scalable architecture", Binary],
            ["Analytics", "Power BI intelligence, Python insight pipelines", CircleDotDashed],
            ["Experience", "Immersive interfaces with human-centered flow", Orbit],
          ].map(([title, text, Icon], index) => (
            <motion.div
              key={title as string}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-5 backdrop-blur-xl transition hover:border-cyan-200/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.13)]"
            >
              <Icon className="mb-5 size-7 text-cyan-200" />
              <h3 className="text-2xl font-bold text-white">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-white/52">{text as string}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
