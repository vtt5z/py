 "use client";

import { WandSparkles } from "lucide-react";

import { AIToolsSection } from "@/components/os/ai-tools-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { useLanguage } from "@/components/providers/language-provider";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";

export default function ToolsPage() {
  const { lang } = useLanguage();
  const tiles = lang === "ar" ? ["PDF", "الصور", "الكتابة", "السيرة", "JSON", "SQL"] : ["PDF", "Screenshot", "Writing", "Resume", "JSON", "SQL"];

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Tool Center", ar: "مركز الأدوات" }}
        title={{ en: "AI tools organized by real work.", ar: "أدوات ذكاء منظمة حسب العمل الحقيقي." }}
        text={{
          en: "Upload PDFs, analyze screenshots, rewrite text, generate resumes, format JSON, generate SQL, and test API workflows from one clear product surface.",
          ar: "ارفع PDF، حلّل الصور، أعد صياغة النصوص، أنشئ السير الذاتية، نسّق JSON، ولّد SQL، واختبر API من واجهة واحدة واضحة.",
        }}
        icon={WandSparkles}
      >
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((tool) => (
            <div key={tool} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center font-black text-white">
              {tool}
            </div>
          ))}
        </div>
      </PageHero>
      <AIToolsSection />
      <DeveloperToolsSection />
    </PageFrame>
  );
}
