 "use client";

import { GraduationCap } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { StudentHubSection } from "@/components/os/student-hub-section";
import { useLanguage } from "@/components/providers/language-provider";

export default function StudentPage() {
  const { lang } = useLanguage();
  const steps = lang === "ar"
    ? ["ارفع الملاحظات", "أنشئ اختبار", "ابنِ بطاقات", "جهّز عرضًا"]
    : ["Upload notes", "Generate quiz", "Build flashcards", "Create presentation"];

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Student AI Hub", ar: "مركز الطالب الذكي" }}
        title={{ en: "Turn study material into mastery systems.", ar: "حوّل موادك الدراسية إلى نظام إتقان." }}
        text={{
          en: "Generate notes, quizzes, flashcards, study plans, presentations, and simplified explanations from one immersive student workspace.",
          ar: "أنشئ ملاحظات واختبارات وبطاقات وخطط دراسة وعروض وشرح مبسط من مساحة طالب غامرة.",
        }}
        icon={GraduationCap}
      >
        <div className="space-y-3">
          {steps.map((step, index) => (
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
