 "use client";

import { UserRound } from "lucide-react";

import { AboutPlatformSection } from "@/components/os/about-platform-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";

export default function AboutPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Engineer Profile"
        title="Haron Mohammed builds intelligent digital systems."
        text="Software Engineer, Data Analyst, and Full Stack Developer focused on AI-powered interfaces, analytics dashboards, Flutter systems, Firebase platforms, and polished product experiences."
        icon={UserRound}
      >
        <div className="grid gap-3">
          {["Software Engineer", "Data Analyst", "Full Stack Developer", "Yemeni nationality • India"].map((item) => (
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
