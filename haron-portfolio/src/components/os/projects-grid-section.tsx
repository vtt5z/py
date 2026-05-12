"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { projectSystems } from "@/lib/haron-os-content";

export function ProjectsGridSection() {
  const { lang, dir } = useLanguage();
  const arProjects = [
    { title: "منصة هارون أو إس للذكاء", text: "نظام تشغيل رقمي سينمائي مع أدوات ذكاء ولوحة تحكم وطرفية ولوحة أوامر.", stack: ["Next.js", "Gemini", "Firebase", "Framer Motion"] },
    { title: "نظام ذكاء صحي", text: "تدفقات رعاية فورية ومؤشرات مرضى ولوحات تشغيل آمنة.", stack: ["Flutter", "Firebase", "Python", "Analytics"] },
    { title: "مركز تحليلات Power BI", text: "واجهة ذكاء أعمال للبيانات الخام والمؤشرات والرسوم والملخصات التنفيذية.", stack: ["Power BI", "SQL", "Python", "DAX"] },
    { title: "تجربة بيانات فوركس", text: "رفيق تداول بمؤشرات سوق ولوحات مخاطر وتصورات مالية.", stack: ["Flutter", "REST APIs", "Charts", "Firebase"] },
    { title: "منصة عمليات تجارة إلكترونية", text: "متجر فاخر وتدفقات إدارة ومنتجات وتجربة موجهة للتحويل.", stack: ["Next.js", "APIs", "UI/UX", "SQL"] },
    { title: "مختبر تصورات الذكاء", text: "أنظمة مرئية تفاعلية للتحليلات التنبؤية وشرح الذكاء وقصص البيانات.", stack: ["Three.js", "ML", "Data Viz", "TypeScript"] },
  ];
  const projects = lang === "ar" ? arProjects : projectSystems;

  return (
    <section className={`relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 ${dir === "rtl" ? "font-arabic text-right" : ""}`}>
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="group relative min-h-80 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition hover:border-cyan-200/45"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_10%,rgba(34,211,238,0.16),transparent_38%),radial-gradient(circle_at_80%_90%,rgba(139,92,246,0.17),transparent_38%)] opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 grid aspect-[2.4] place-items-center rounded-3xl border border-white/10 bg-black/35">
                  <div className="h-16 w-3/4 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.14)]" />
                </div>
                <h3 className="text-3xl font-black text-white">{project.title}</h3>
                <p className="mt-4 text-base leading-7 text-white/58">{project.text}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-cyan-100/70">
                      {item}
                    </span>
                  ))}
                </div>
                <a href="/contact" className="grid size-11 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-cyan-200/60 hover:text-cyan-100">
                  <ExternalLink className="size-5" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
