 "use client";

import { Mail } from "lucide-react";

import { OSContactSection } from "@/components/os/os-contact-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";

export default function ContactPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Contact Signal", ar: "قناة التواصل" }}
        title={{ en: "Open a professional channel with Haron.", ar: "افتح قناة تواصل احترافية مع هارون." }}
        text={{
          en: "Reach out for software engineering, full-stack systems, data analytics, AI interfaces, dashboards, and future-focused digital products.",
          ar: "تواصل لأعمال هندسة البرمجيات والأنظمة المتكاملة وتحليل البيانات وواجهات الذكاء واللوحات والمنتجات الرقمية المستقبلية.",
        }}
        icon={Mail}
      >
        <div className="space-y-3">
          {["mhamad2129@gmail.com", "+91 8699164650", "LinkedIn / Instagram / GitHub"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/28 p-4 font-bold text-white/72">
              {item}
            </div>
          ))}
        </div>
      </PageHero>
      <OSContactSection />
    </PageFrame>
  );
}
