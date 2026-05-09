 "use client";

import { GraduationCap } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { StudentHubSection } from "@/components/os/student-hub-section";

export default function StudentPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Student AI Hub"
        title="Turn study material into mastery systems."
        text="Generate notes, quizzes, flashcards, study plans, presentations, and simplified explanations from one immersive student workspace."
        icon={GraduationCap}
      >
        <div className="space-y-3">
          {["Upload notes", "Generate quiz", "Build flashcards", "Create presentation"].map((step, index) => (
            <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
              <span className="grid size-9 place-items-center rounded-full bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</span>
              <span className="font-bold text-white/72">{step}</span>
            </div>
          ))}
        </div>
      </PageHero>
      <StudentHubSection />
    </PageFrame>
  );
}
