 "use client";

import { Gauge } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardSection } from "@/components/os/dashboard-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { useLanguage } from "@/components/providers/language-provider";

export default function DashboardPage() {
  const { lang } = useLanguage();
  const stats = lang === "ar" ? ["الذكاء: 96%", "الأدوات: 72", "التخزين: جاهز", "الصحة: مباشر"] : ["AI: 96%", "Tools: 72", "Storage: Ready", "Health: Live"];

  return (
    <PageFrame>
      <ProtectedRoute>
        <PageHero
          eyebrow={{ en: "Live System Monitoring", ar: "مراقبة النظام المباشرة" }}
          title={{ en: "AI statistics and operating-system intelligence.", ar: "إحصائيات الذكاء الاصطناعي وتشغيل النظام الذكي." }}
          text={{
            en: "Monitor activity, tool runs, storage readiness, AI usage, performance signals, and live widgets in a premium dashboard.",
            ar: "راقب النشاط وتشغيل الأدوات وجاهزية التخزين واستخدام الذكاء ومؤشرات الأداء من لوحة تحكم فاخرة.",
          }}
          icon={Gauge}
        >
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat} className="rounded-2xl border border-white/10 bg-black/28 p-5 text-xl font-black text-white">
                {stat}
              </div>
            ))}
          </div>
        </PageHero>
        <DashboardSection />
      </ProtectedRoute>
    </PageFrame>
  );
}
