"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";

import { SectionShell } from "@/components/layout/section-shell";
import { useLanguage } from "@/components/providers/language-provider";
import { TiltCard } from "@/components/ui/tilt-card";
import { projects } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ProjectsSection() {
  const { t, lang, dir } = useLanguage();

  return (
    <SectionShell id="projects" eyebrow="Launch Archive" title={t.sections.projects}>
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <TiltCard key={project.title.en}>
            <motion.article
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, delay: index * 0.05 }}
              className={cn(
                "group relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl",
                dir === "rtl" && "text-right",
              )}
            >
              <div
                className="absolute inset-0 opacity-25 blur-3xl transition group-hover:opacity-45"
                style={{
                  background: `radial-gradient(circle at 50% 20%, ${project.accent}, transparent 42%)`,
                }}
              />
              <div className="relative grid h-64 place-items-center overflow-hidden rounded-3xl border border-white/10 bg-[#050a17]">
                <div className="absolute inset-0 hologram-grid opacity-50" />
                <div
                  className="absolute size-56 rounded-full border opacity-45"
                  style={{ borderColor: project.accent }}
                />
                <div className="absolute size-36 animate-spin-slow rounded-full border border-dashed border-white/20" />
                <div className="relative w-[78%] rounded-2xl border border-white/15 bg-black/45 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-300" />
                    <span className="size-2 rounded-full bg-yellow-200" />
                    <span className="size-2 rounded-full bg-green-300" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-2/3 rounded-full bg-white/20" />
                    <div
                      className="h-16 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${project.accent}55, rgba(255,255,255,0.08))`,
                      }}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded-xl bg-white/10" />
                      <div className="h-10 rounded-xl bg-white/10" />
                      <div className="h-10 rounded-xl bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6">
                <h3 className="text-3xl font-black text-white">{project.title[lang]}</h3>
                <p className="mt-3 min-h-16 text-base leading-7 text-white/58">
                  {project.description[lang]}
                </p>
                <div className={cn("mt-5 flex flex-wrap gap-2", dir === "rtl" && "justify-end")}>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-cyan-100/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={cn("mt-6 flex gap-3", dir === "rtl" && "justify-end")}>
                  <a className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-cyan-200/60 hover:text-cyan-100" href="https://github.com/" target="_blank">
                    <GitBranch className="size-5" />
                  </a>
                  <a className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-cyan-200/60 hover:text-cyan-100" href="#contact">
                    <ExternalLink className="size-5" />
                  </a>
                </div>
              </div>
            </motion.article>
          </TiltCard>
        ))}
      </div>
    </SectionShell>
  );
}
