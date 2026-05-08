"use client";

import { motion } from "framer-motion";

import { SectionShell } from "@/components/layout/section-shell";
import { useLanguage } from "@/components/providers/language-provider";
import { timeline } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const { t, lang, dir } = useLanguage();

  return (
    <SectionShell id="experience" eyebrow="Temporal Interface" title={t.sections.experience}>
      <div className="relative">
        <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/40 to-violet-200/0 md:block rtl:left-auto rtl:right-6" />
        <div className="grid gap-5">
          {timeline.map((item, index) => (
            <motion.article
              key={item.year}
              initial={{ opacity: 0, x: dir === "rtl" ? 44 : -44 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className={cn(
                "relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl md:ms-16",
                dir === "rtl" && "text-right",
              )}
            >
              <span className="absolute -start-[3.05rem] top-7 hidden size-5 rounded-full border border-cyan-100/70 bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.8)] md:block" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-sm tracking-[0.28em] text-cyan-200/70">
                    {item.year}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">{item.title[lang]}</h3>
                </div>
                <item.icon className="size-8 text-violet-200" />
              </div>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/58">
                {item.text[lang]}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
