"use client";

import { DatabaseZap } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";
import { useLanguage } from "@/components/providers/language-provider";

export default function SqlToolPage() {
  const { lang } = useLanguage();

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Developer Tool", ar: "أداة المطور" }}
        title={{ en: "SQL generation for practical data work.", ar: "توليد SQL لعمل البيانات الحقيقي." }}
        text={{
          en: "Describe the table, goal, or report you need. HARON OS generates query logic with useful assumptions.",
          ar: "اكتب الجدول أو الهدف أو التقرير المطلوب، وهارون أو إس يولّد منطق الاستعلام بافتراضات واضحة.",
        }}
        icon={DatabaseZap}
        compact
      >
        <div className="rounded-3xl border border-cyan-200/15 bg-black/40 p-5 font-mono text-sm leading-7 text-cyan-100/80">
          {lang === "ar"
            ? "SELECT الشهر, SUM(الإيرادات)\nFROM المبيعات\nGROUP BY الشهر\nORDER BY الشهر;"
            : "SELECT month, SUM(revenue)\nFROM sales\nGROUP BY month\nORDER BY month;"}
        </div>
      </PageHero>
      <DeveloperToolsSection initialMode="sql" />
    </PageFrame>
  );
}
