"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck } from "lucide-react";

import { OSCard } from "@/components/os/os-card";
import { studentTools } from "@/lib/haron-os-content";

export function StudentHubSection() {
  return (
    <section id="student-hub" className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          Student Intelligence Hub
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          Study faster with notes, quizzes, flashcards, and presentation intelligence.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {studentTools.map((tool) => (
          <OSCard key={tool.title} title={tool.title} text={tool.text} icon={tool.icon} />
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
            <h3 className="text-3xl font-black text-white">Learning pipeline</h3>
            <p className="mt-3 text-white/58">
              Upload material, convert it into notes, generate quizzes, create flashcards, and ask the AI assistant to explain anything in simple language.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {["Upload", "Summarize", "Quiz", "Master"].map((step, index) => (
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
