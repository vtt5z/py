"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck } from "lucide-react";

import { OSCard } from "@/components/os/os-card";
import { useLanguage } from "@/components/providers/language-provider";
import { studentTools } from "@/lib/haron-os-content";

export function StudentHubSection() {
  const { lang, dir } = useLanguage();
  const heading = lang === "ar"
    ? {
        eyebrow: "مركز الطالب الذكي",
        title: "ادرس أسرع بملاحظات واختبارات وبطاقات وعروض ذكية.",
        pipeline: "مسار التعلّم",
        text: "ارفع المادة، حوّلها إلى ملاحظات، أنشئ اختبارات، ابنِ بطاقات، واسأل المساعد يشرح لك أي نقطة ببساطة.",
        steps: ["ارفع", "لخّص", "اختبر", "أتقن"],
      }
    : {
        eyebrow: "Student Intelligence Hub",
        title: "Study faster with notes, quizzes, flashcards, and presentation intelligence.",
        pipeline: "Learning pipeline",
        text: "Upload material, convert it into notes, generate quizzes, create flashcards, and ask the AI assistant to explain anything in simple language.",
        steps: ["Upload", "Summarize", "Quiz", "Master"],
      };
  const tools = lang === "ar"
    ? [
        ["ملاحظات PDF", "حوّل المواد الطويلة إلى ملاحظات مذاكرة منظمة."],
        ["مولد الاختبارات", "حوّل أي موضوع إلى أسئلة تدريبية مع الإجابات."],
        ["مساعد الدراسة", "أنشئ خطط تعلم وشروحات مبسطة."],
        ["مولد العروض", "جهّز مخطط الشرائح وملاحظات المتحدث."],
        ["بطاقات ذكية", "ابنِ بطاقات مراجعة من الملاحظات أو المواضيع."],
      ]
    : studentTools.map((tool) => [tool.title, tool.text]);

  return (
    <section id="student-hub" className={`relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10 ${dir === "rtl" ? "font-arabic text-right" : ""}`}>
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          {heading.eyebrow}
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          {heading.title}
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {studentTools.map((tool, index) => (
          <OSCard key={tool.title} title={tools[index][0]} text={tools[index][1]} icon={tool.icon} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
      >
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <BookOpenCheck className="mb-5 size-10 text-cyan-100" />
            <h3 className="text-3xl font-black text-white">{heading.pipeline}</h3>
            <p className="mt-3 text-white/58">
              {heading.text}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {heading.steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="font-mono text-xs text-cyan-100/50">0{index + 1}</p>
                <p className="mt-3 text-xl font-black text-white">{step}</p>
                {index < 3 && <ArrowRight className="mt-5 size-5 text-white/28" />}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
