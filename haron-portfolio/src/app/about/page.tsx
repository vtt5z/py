 "use client";

import { UserRound } from "lucide-react";

import { AboutPlatformSection } from "@/components/os/about-platform-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { useLanguage } from "@/components/providers/language-provider";

export default function AboutPage() {
  const { lang } = useLanguage();
  const cards = lang === "ar"
    ? ["مهندس برمجيات", "محلل بيانات", "مطور أنظمة متكاملة", "هوية يمنية • مقيم في الهند"]
    : ["Software Engineer", "Data Analyst", "Full Stack Developer", "Yemeni identity • India"];

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Engineer Profile", ar: "ملف المهندس" }}
        title={{ en: "Haron Mohammed builds intelligent digital systems.", ar: "هارون محمد يبني أنظمة رقمية ذكية." }}
        text={{
          en: "Software Engineer, Data Analyst, and Full Stack Developer focused on AI-powered interfaces, analytics dashboards, Flutter systems, Firebase platforms, and polished product experiences.",
          ar: "مهندس برمجيات ومحلل بيانات ومطور أنظمة متكاملة يركز على واجهات الذكاء ولوحات التحليل وأنظمة Flutter ومنصات Firebase وتجارب المنتجات المصقولة.",
        }}
        icon={UserRound}
      >
        <div className="grid gap-3">
          {cards.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-lg font-black text-white">
              {item}
            </div>
          ))}
        </div>
      </PageHero>
      <AboutPlatformSection />
    </PageFrame>
  );
}
