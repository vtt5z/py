 "use client";

import { Code2 } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { useLanguage } from "@/components/providers/language-provider";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";

export default function DeveloperPage() {
  const { lang } = useLanguage();

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Developer Mode", ar: "وضع المطور" }}
        title={{ en: "A neon engineering console for fast problem solving.", ar: "وحدة هندسية مضيئة لحل المشاكل بسرعة." }}
        text={{
          en: "Format JSON, test regex, generate SQL, inspect APIs, explain code, and debug errors inside a futuristic terminal-style interface.",
          ar: "نسّق JSON، اختبر Regex، ولّد SQL، افحص API، اشرح الكود، وحلّل الأخطاء داخل واجهة طرفية مستقبلية.",
        }}
        icon={Code2}
      >
        <pre className="min-h-72 rounded-3xl border border-white/10 bg-black/45 p-5 font-mono text-sm leading-7 text-cyan-100/80">
          {lang === "ar"
            ? `> شخّص خطأ --stack=nextjs\n> ولّد sql --dialect=postgres\n> اشرح كود --level=senior\n\nالنظام: أدوات المطور جاهزة`
            : `> diagnose error --stack=nextjs\n> generate sql --dialect=postgres\n> explain code --level=senior\n\nSYSTEM: developer tools armed`}
        </pre>
      </PageHero>
      <DeveloperToolsSection />
    </PageFrame>
  );
}
