 "use client";

import { Rocket } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { ProjectsGridSection } from "@/components/os/projects-grid-section";
import { useLanguage } from "@/components/providers/language-provider";

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const tiles = lang === "ar" ? ["ذكاء", "بيانات", "تطبيقات", "تجربة", "سحابة", "تصور"] : ["AI", "Data", "Apps", "UX", "Cloud", "Viz"];

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Project Systems", ar: "أنظمة المشاريع" }}
        title={{ en: "Cinematic builds across AI, analytics, apps, and dashboards.", ar: "مشاريع سينمائية في الذكاء والتحليلات والتطبيقات واللوحات." }}
        text={{
          en: "A premium project archive presented like a technology company product lab, with each system designed for clarity, scale, and visual impact.",
          ar: "أرشيف مشاريع فاخر بأسلوب مختبر منتجات تقني، كل نظام فيه مصمم للوضوح والتوسع والأثر البصري.",
        }}
        icon={Rocket}
      >
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((item) => (
            <div key={item} className="grid aspect-square place-items-center rounded-2xl border border-white/10 bg-black/28 text-xl font-black text-cyan-100">
              {item}
            </div>
          ))}
        </div>
      </PageHero>
      <ProjectsGridSection />
    </PageFrame>
  );
}
